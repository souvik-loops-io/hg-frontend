/**
 * Domain types for Lumina Learning.
 *
 * These are the response contract for the external content service. When
 * `NEXT_PUBLIC_API_URL` is set, its payloads must match these shapes — the
 * component layer should not need to change.
 */

export type Subject = "Math" | "Science" | "Literacy" | "Geography";

/* -------------------------------------------------------------------------
   Dashboard
   ------------------------------------------------------------------------- */

/** Which coloured mark an artifact card wears. */
export type ArtifactIcon = "calculator" | "leaf" | "sigma" | "book";

export interface Artifact {
  id: string;
  title: string;
  subject: Subject;
  /** Grade band, rendered as "Gr 6". */
  grade: number;
  icon: ArtifactIcon;
  /** `progress` drives the bar; `complete` and `draft` render as status text. */
  state: "progress" | "complete" | "draft";
  /** 0–100. Ignored when `state` is "complete". */
  progress: number;
  /** ISO 8601 timestamp of the last edit. */
  updatedAt: string;
}

/** The hero card at the top of the dashboard. */
export interface WeeklyFocus {
  eyebrow: string;
  title: string;
  body: string;
}

/* -------------------------------------------------------------------------
   Setup & Planning
   ------------------------------------------------------------------------- */

export interface SelectOption {
  value: string;
  label: string;
}

export interface FoundationDetails {
  gradeLevel: string;
  subject: string;
  topicFocus: string;
  framework: string;
  /** 1 (gentle) to 5 (challenging). */
  difficulty: number;
  /** Whole minutes. Three is the floor — anything shorter is not a lesson. */
  durationMinutes: number;
}

/** Minimum a module can run for, enforced in the form and stated in the UI. */
export const MIN_DURATION_MINUTES = 3;
export const MAX_DURATION_MINUTES = 240;

export interface FoundationOptions {
  gradeLevels: SelectOption[];
  subjects: SelectOption[];
  frameworks: SelectOption[];
}

/** The amber panel in the right rail of Setup & Planning. */
export interface DiscoveryTip {
  title: string;
  body: string;
}

/* -------------------------------------------------------------------------
   Lesson flow
   ------------------------------------------------------------------------- */

/** The pedagogical role of a block — drives its badge colour. */
export type BlockKind = "hook" | "concept" | "interactive" | "assessment";

export interface LessonBlock {
  id: string;
  kind: BlockKind;
  title: string;
  /** One line under the title in the block list. */
  summary: string;
  /** Shown to students in the live preview. */
  instruction: string;
  /** Only meaningful when `kind` is "interactive". */
  settings?: BlockSettings;
  /** Present when the block renders a manipulable representation. */
  representation?: Representation;
}

export interface BlockSettings {
  showFractions: boolean;
  autoSnapToGrid: boolean;
}

export type RepresentationStatus = "ready" | "updating";

export interface Representation {
  id: string;
  name: string;
  caption: string;
  status: RepresentationStatus;
  /** Shown while `status` is "updating", e.g. "Simplifying to halves…". */
  statusLabel?: string;
}

export interface LessonModule {
  id: string;
  title: string;
  /** Student-facing deck title, e.g. "Let's Learn Fractions!". */
  headline: string;
  subheadline: string;
  grade: string;
  subject: string;
  blocks: LessonBlock[];
}

/* -------------------------------------------------------------------------
   Library
   ------------------------------------------------------------------------- */

export interface BlockFamily {
  id: string;
  name: string;
  category: "presentation" | "representation";
  specimenCount: number;
  summary: string;
}

export interface Template {
  id: string;
  name: string;
  summary: string;
  segments: number;
  subject: Subject | "Any";
}

/* -------------------------------------------------------------------------
   AI assistant
   ------------------------------------------------------------------------- */

export type ChatAuthor = "assistant" | "educator";

export interface ChatMessage {
  id: string;
  author: ChatAuthor;
  text: string;
  /** Renders as a typing indicator rather than a finished bubble. */
  pending?: boolean;
}

/** One-tap follow-ups under the composer. */
export interface QuickAction {
  id: string;
  label: string;
}
