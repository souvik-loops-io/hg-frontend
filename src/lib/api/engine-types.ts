/**
 * The Cuepilot Lesson Engine's wire shapes — the *real* backend contract.
 *
 * Mirrors `CONTRACT.md` in the `cuepilot-lesson-engine` repo. These are the
 * shapes that cross the wire. The backend now adapts these onto the UI's own
 * `LessonModule` / `LessonBlock` vocabulary server-side (see `ui_adapter.js` in
 * the engine repo), so the frontend consumes `LessonModule` directly.
 */

/** The nine concrete block types the engine renders. */
export type EngineBlockType =
  | "hook"
  | "explain"
  | "number_line"
  | "bar_compare"
  | "sequence"
  | "mcq"
  | "activity"
  | "exit_ticket"
  | "teacher_notes";

/** Where a block's content was grounded — one row per source chunk. */
export interface SourceRef {
  sourceId: string;
  sourceName: string;
  attribution: string;
}

/**
 * A rendered lesson block. `data` is type-specific (see CONTRACT.md); we keep
 * it loose here because the UI never reads it directly — the engine's own
 * `html` / `blockHtml` renders it, and the adapter only needs `type`.
 */
export interface EngineBlock {
  id: string;
  type: EngineBlockType;
  data: Record<string, unknown>;
  /** 1–5 language depth. */
  complexity: number;
  estMinutes: number;
  sourceRefs: SourceRef[];
  narration?: string;
}

/** Time-budget verdict. `ok:false` carries `overBy` + a `suggestion`. */
export interface TimeFit {
  plannedMins: number;
  ok: boolean;
  overBy?: number;
  suggestion?: string;
  notice?: string;
}

export interface EngineLesson {
  id: string;
  title: string;
  board: string;
  grade: string;
  subject: string;
  topic: string;
  nLessons: number;
  lessonIndex: number;
  durationMins: number;
  defaultComplexity: number;
  /** 1–5 representation density, lesson-wide. */
  visualDemand?: number;
  instructions?: string;
  teacherId: string;
  materialId: string;
  materialIds?: string[];
  timeFit: TimeFit;
  blocks: EngineBlock[];
}

/* ------------------------------------------------------------------ *
   Request / response envelopes
 * ------------------------------------------------------------------ */

/** Metadata that must accompany every `/ingest` upload. */
export interface IngestMeta {
  teacherId: string;
  subject: string;
  board: string;
  grade: string;
  attribution?: string;
}

export interface IngestResult {
  materialId: string;
  name: string;
  chars: number;
  chunks: number;
}

/** The `spec` object for `POST /generate`. */
export interface GenerateSpec {
  board: string;
  grade: string;
  subject: string;
  topic: string;
  durationMins: number;
  defaultComplexity: number;
  visualDemand?: number;
  nLessons?: number;
  lessonIndex?: number;
  instructions?: string;
  requestedBlocks?: EngineBlockType[];
}

/** `POST /generate`, `GET /lessons/:id`, `POST /lessons/:id/reorder`. */
export interface LessonResult {
  lesson: EngineLesson;
  html: string;
  timeFit: TimeFit;
}

/** `POST /edit-block` — only the one block regenerates. */
export interface EditBlockResult {
  block: EngineBlock;
  blockHtml: string;
  timeFit: TimeFit;
}

/** `POST /edit-lesson` — surgical ops; untouched blocks stay byte-identical. */
export interface EditLessonResult {
  lesson: EngineLesson;
  html: string;
  changedBlockIds: string[];
  timeFit: TimeFit;
  ops: unknown[];
  note?: string;
}

/** A row from `GET /lessons`. */
export interface LessonSummary {
  id: string;
  title: string;
  grade: string;
  subject: string;
  topic: string;
  blocks: number;
  durationMins: number;
}
