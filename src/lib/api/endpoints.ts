/**
 * The Cuepilot Lesson Engine base URL + every path the app calls, in one place.
 *
 * The engine is a *single* service (it does both content and generation), so
 * there is one base URL, not two. Defaults to the local dev port so the demo is
 * zero-config; override with `NEXT_PUBLIC_ENGINE_URL` to point at a deployed
 * engine.
 *
 * Full contract: `cuepilot-lesson-engine/CONTRACT.md`.
 */

function normalise(url: string | undefined): string {
  const trimmed = url?.trim().replace(/\/+$/, "");
  return trimmed && trimmed.length > 0 ? trimmed : "http://localhost:3001";
}

export const ENGINE_URL = normalise(process.env.NEXT_PUBLIC_ENGINE_URL);

/** Reads + uploads. `getLesson`/`listLessons` run server-side (no CORS). */
export const contentEndpoints = {
  /** POST (multipart) — upload teacher material, returns a materialId. */
  ingest: "/ingest",
  /** GET — a teacher's uploaded materials. */
  materials: "/materials",
  /** GET — all lessons (dashboard list). */
  lessons: "/lessons",
  /** GET — one lesson: `{lesson, html, timeFit}`. */
  lesson: (id: string) => `/lessons/${encodeURIComponent(id)}`,
  /** POST — persist a drag-drop reorder (no LLM). */
  reorder: (id: string) => `/lessons/${encodeURIComponent(id)}/reorder`,
  health: "/health",
} as const;

/** Generation + the two edit paths. All run in the browser (CORS-enabled). */
export const aiEndpoints = {
  /** POST — generate a lesson from a grounded material. */
  generate: "/generate",
  /** POST — Path A: regenerate exactly one block. */
  editBlock: "/edit-block",
  /** POST — Path B: conversational, surgical lesson edits. */
  editLesson: "/edit-lesson",
} as const;


/**
 * The UI-contract layer. These return the frontend's own `LessonModule` JSON
 * (the backend adapts its lesson shape server-side), so the app renders blocks
 * with its own components instead of embedding pre-rendered HTML.
 */
export const v1Endpoints = {
  /** POST — generate a lesson, returns `{ module, lessonId }`. */
  runs: "/v1/runs",
  /** GET — list lessons. */
  lessons: "/v1/lessons",
  /** GET — one lesson as `{ module }`. */
  lesson: (id: string) => `/v1/lessons/${encodeURIComponent(id)}`,
  /** POST — persist a drag-drop reorder, returns `{ module }`. */
  reorder: (id: string) => `/v1/lessons/${encodeURIComponent(id)}/reorder`,
  /** POST — Path A: regenerate one block, returns `{ module, changedBlockIds }`. */
  editBlock: "/v1/edit-block",
  /** POST — Path B: conversational lesson edit, returns `{ module, changedBlockIds }`. */
  editLesson: "/v1/edit-lesson",
} as const;
