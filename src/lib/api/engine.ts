import {
  contentEndpoints,
  ENGINE_URL,
  v1Endpoints,
} from "@/lib/api/endpoints";
import type {
  GenerateSpec,
  IngestMeta,
  IngestResult,
  LessonSummary,
} from "@/lib/api/engine-types";
import type { LessonModule } from "@/lib/types";

/**
 * The one seam between this app and the Cuepilot Lesson Engine.
 *
 * The engine now emits the UI's own contract: every `/v1/*` endpoint returns a
 * `LessonModule` (see `CONTRACT`/`ui_adapter.js` on the backend), so nothing
 * here re-shapes lesson data — the app renders blocks with its own components.
 * Reads (`fetchLessonModule`, `listLessons`) run server-side in a Server
 * Component (no CORS). Writes (`ingest`, `runLesson`, `editBlock*`,
 * `editLesson*`, `reorderModule`) run in the browser, which is why the backend
 * enables CORS.
 *
 * No fixture fallback here: a run either happened or it didn't. Callers that
 * want a graceful degrade (the flow page) catch and fall back themselves.
 */

/** A demo teacher — the app has no auth yet, so every request shares one id. */
export const TEACHER_ID = "demo-teacher";

export const isEngineConfigured = ENGINE_URL.length > 0;

export class EngineError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
  ) {
    super(message);
    this.name = "EngineError";
  }
}

async function toError(response: Response, path: string): Promise<EngineError> {
  let code: string | undefined;
  let message = `${path} failed with ${response.status}`;
  try {
    const body = (await response.json()) as { error?: string; code?: string };
    if (body.error) message = body.error;
    code = body.code;
  } catch {
    /* non-JSON error body — keep the default message */
  }
  return new EngineError(message, response.status, code);
}

async function json<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${ENGINE_URL}${path}`, {
    ...init,
    // Lessons mutate on every edit; never serve a stale cached copy.
    cache: "no-store",
  });
  if (!response.ok) throw await toError(response, path);
  return (await response.json()) as T;
}

function postJson<T>(path: string, body: unknown): Promise<T> {
  return json<T>(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

/* ------------------------------------------------------------------ *
   Materials — upload first, always. No material, no lesson.
 * ------------------------------------------------------------------ */

/** `POST /ingest` (multipart). Returns the `materialId` a lesson is grounded in. */
export async function ingestMaterial(
  file: File,
  meta: IngestMeta,
): Promise<IngestResult> {
  const form = new FormData();
  form.append("file", file);
  form.append("teacherId", meta.teacherId);
  form.append("subject", meta.subject);
  form.append("board", meta.board);
  form.append("grade", meta.grade);
  if (meta.attribution) form.append("attribution", meta.attribution);

  const response = await fetch(`${ENGINE_URL}${contentEndpoints.ingest}`, {
    method: "POST",
    body: form, // the browser sets the multipart boundary
  });
  if (!response.ok) throw await toError(response, contentEndpoints.ingest);
  return (await response.json()) as IngestResult;
}

/* ------------------------------------------------------------------ *
   Generation & reads — all return the UI's LessonModule
 * ------------------------------------------------------------------ */

export interface RunResult {
  module: LessonModule;
  lessonId: string;
}

/** `POST /v1/runs`. Generate a lesson, optionally grounded in materials. */
export function runLesson(
  materialIds: string[],
  spec: GenerateSpec,
  teacherId: string = TEACHER_ID,
): Promise<RunResult> {
  const [materialId] = materialIds;
  return postJson<RunResult>(v1Endpoints.runs, {
    materialId,
    materialIds,
    teacherId,
    spec,
  });
}

/** `GET /v1/lessons/:id`. Returns null on 404 so callers can fall back. */
export async function fetchLessonModule(
  id: string,
): Promise<LessonModule | null> {
  try {
    const { module } = await json<{ module: LessonModule }>(
      v1Endpoints.lesson(id),
    );
    return module;
  } catch (error) {
    if (error instanceof EngineError && error.status === 404) return null;
    throw error;
  }
}

/** `GET /v1/lessons`. The dashboard/list read. */
export async function listLessons(): Promise<LessonSummary[]> {
  const { lessons } = await json<{ lessons: LessonSummary[] }>(
    v1Endpoints.lessons,
  );
  return lessons;
}

/* ------------------------------------------------------------------ *
   Edits & reorder — the paths the product is built around
 * ------------------------------------------------------------------ */

export interface EditResult {
  module: LessonModule;
  changedBlockIds?: string[];
  note?: string;
}

export interface EditBlockInput {
  /** At least one of these must be present. */
  instruction?: string;
  complexity?: number;
  visualDemand?: number;
}

/** `POST /v1/edit-block` — Path A. Only the named block regenerates. */
export function editBlock(
  lessonId: string,
  blockId: string,
  input: EditBlockInput,
): Promise<EditResult> {
  return postJson<EditResult>(v1Endpoints.editBlock, {
    lessonId,
    blockId,
    ...input,
  });
}

/** `POST /v1/edit-lesson` — Path B. Conversational, op-based, surgical. */
export function editLesson(
  lessonId: string,
  instruction: string,
): Promise<EditResult> {
  return postJson<EditResult>(v1Endpoints.editLesson, {
    lessonId,
    instruction,
  });
}

/** `POST /v1/lessons/:id/reorder` — persist a drag-drop reorder. No LLM. */
export function reorderModule(
  lessonId: string,
  blockIds: string[],
): Promise<{ module: LessonModule }> {
  return postJson<{ module: LessonModule }>(v1Endpoints.reorder(lessonId), {
    blockIds,
  });
}
