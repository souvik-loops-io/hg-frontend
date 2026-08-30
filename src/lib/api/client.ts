import { aiEndpoints, contentEndpoints } from "@/lib/api/endpoints";
import {
  artifacts,
  blockFamilies,
  discoveryTip,
  foundationDefaults,
  foundationOptions,
  recentTopics,
  templates,
  weeklyFocus,
} from "@/lib/data/fixtures";
import { lessonModule } from "@/lib/data/lesson";
import type {
  Artifact,
  BlockFamily,
  DiscoveryTip,
  FoundationDetails,
  FoundationOptions,
  LessonBlock,
  LessonModule,
  Template,
  WeeklyFocus,
} from "@/lib/types";

/**
 * The one seam between this app and anything remote.
 *
 * The backend and the AI service are external — they arrive purely as URLs in
 * the environment. Neither is required to run the app: with the variables
 * unset, every reader below resolves to the fixtures in `src/lib/data/`.
 */

function normalise(url: string | undefined): string {
  return url?.trim().replace(/\/+$/, "") ?? "";
}

/** Content service: artifacts, modules, library, templates. */
export const API_URL = normalise(process.env.NEXT_PUBLIC_API_URL);
/** Generation service: pipeline runs and their event streams. */
export const AI_URL = normalise(process.env.NEXT_PUBLIC_AI_URL);

export const isApiConfigured = API_URL.length > 0;
export const isAiConfigured = AI_URL.length > 0;

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly url: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Seconds to cache the response for. `0` opts out. */
  revalidate?: number;
}

async function request<T>(
  baseUrl: string,
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, revalidate = 30, headers, ...init } = options;
  const url = `${baseUrl}${path}`;

  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      ...headers,
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    next: revalidate > 0 ? { revalidate } : undefined,
    cache: revalidate > 0 ? undefined : "no-store",
  });

  if (!response.ok) {
    throw new ApiError(
      `${init.method ?? "GET"} ${path} failed with ${response.status}`,
      response.status,
      url,
    );
  }

  return (await response.json()) as T;
}

/**
 * Reads through the content service when it is configured, otherwise resolves
 * the fixture. A configured-but-failing service also falls back rather than
 * blanking the page — a cold API should never cost you the screen.
 */
async function readContent<T>(path: string, fixture: T): Promise<T> {
  if (!isApiConfigured) return fixture;
  try {
    return await request<T>(API_URL, path);
  } catch (error) {
    console.error("[lumina] content request failed, using fixtures.", error);
    return fixture;
  }
}

/* -------------------------------------------------------------------------
   Dashboard
   ------------------------------------------------------------------------- */

export function listArtifacts(): Promise<Artifact[]> {
  return readContent(contentEndpoints.artifacts.list, artifacts);
}

export function getArtifact(id: string): Promise<Artifact | null> {
  return readContent(
    contentEndpoints.artifacts.byId(id),
    artifacts.find((artifact) => artifact.id === id) ?? null,
  );
}

export function getWeeklyFocus(): Promise<WeeklyFocus> {
  return readContent(contentEndpoints.dashboard.weeklyFocus, weeklyFocus);
}

/* -------------------------------------------------------------------------
   Setup & Planning
   ------------------------------------------------------------------------- */

export interface SetupContext {
  defaults: FoundationDetails;
  options: FoundationOptions;
  tip: DiscoveryTip;
  recentTopics: string[];
}

export function getSetupData(): Promise<SetupContext> {
  return readContent(contentEndpoints.setup.context, {
    defaults: foundationDefaults,
    options: foundationOptions,
    tip: discoveryTip,
    recentTopics,
  });
}

/* -------------------------------------------------------------------------
   Lesson flow
   ------------------------------------------------------------------------- */

export function getLessonModule(): Promise<LessonModule> {
  return readContent(contentEndpoints.modules.current, lessonModule);
}

/* -------------------------------------------------------------------------
   Library
   ------------------------------------------------------------------------- */

export function listBlockFamilies(): Promise<BlockFamily[]> {
  return readContent(contentEndpoints.library.families, blockFamilies);
}

export function listTemplates(): Promise<Template[]> {
  return readContent(contentEndpoints.templates.list, templates);
}

/* -------------------------------------------------------------------------
   Generation
   ------------------------------------------------------------------------- */

export interface RunRequest {
  /** What the run is for. Drives which pipeline stages execute. */
  intent?: "generate-module" | "add-block" | "revise-block";
  /** A brief starts a new module. */
  brief?: string;
  /** An instruction scoped to one module, or one block within it. */
  moduleId?: string;
  blockId?: string;
  instruction?: string;
}

export type RunStatus = "queued" | "running" | "done" | "failed";

export interface RunHandle {
  runId: string;
  status: RunStatus;
}

export interface RunResult extends RunHandle {
  /** Present once `status` is "done" on an add-block or revise-block run. */
  block?: LessonBlock;
  /** Teacher-facing progress line from the current stage. */
  label?: string;
}

/** Starts a pipeline run. Rejects when no AI service is configured. */
export function startRun(input: RunRequest): Promise<RunHandle> {
  if (!isAiConfigured) {
    return Promise.reject(
      new Error("NEXT_PUBLIC_AI_URL is not set — no generation service."),
    );
  }
  return request<RunHandle>(AI_URL, aiEndpoints.runs, {
    method: "POST",
    body: input,
    revalidate: 0,
  });
}

/** Polls one run. Never falls back — a run either happened or it did not. */
export function getRun(runId: string): Promise<RunResult> {
  if (!isAiConfigured) {
    return Promise.reject(
      new Error("NEXT_PUBLIC_AI_URL is not set — no generation service."),
    );
  }
  return request<RunResult>(AI_URL, aiEndpoints.run(runId), { revalidate: 0 });
}

/** Absolute URL of a run's SSE stage stream, for `new EventSource(...)`. */
export function runStreamUrl(runId: string): string | null {
  return isAiConfigured ? `${AI_URL}${aiEndpoints.stream(runId)}` : null;
}
