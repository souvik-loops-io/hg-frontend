import type { BlockKind, LessonBlock } from "@/lib/types";

/**
 * Drafts a lesson block from a typed request ("a quick exit ticket on comparing
 * fractions"), entirely on-device.
 *
 * This is the *fixture-mode* fallback used when the flow screen is opened
 * without a real engine lesson. When a real lesson is loaded, adding a block
 * goes through the Lesson Engine's `/edit-lesson` path instead (see
 * `LiveWorkspace`), so this never runs.
 */

export interface DraftBlockInput {
  moduleId: string;
  prompt: string;
}

export interface DraftResult {
  block: LessonBlock;
  /** Always "local" here — kept so the UI can stay honest about the source. */
  source: "local";
}

/** Longest-match-wins keyword hints, most specific kind first. */
const KIND_HINTS: [BlockKind, string[]][] = [
  [
    "assessment",
    ["exit ticket", "quiz", "quick check", "assess", "test", "mcq", "multiple choice", "question"],
  ],
  [
    "interactive",
    ["drag", "interactive", "manipulat", "hands-on", "activity", "sort", "match", "explore", "game", "number line"],
  ],
  ["hook", ["hook", "warm-up", "warm up", "starter", "intro", "story", "real-world", "engage", "opener"]],
  ["concept", ["explain", "vocabulary", "definition", "concept", "teach", "introduce", "model"]],
];

function inferKind(prompt: string): BlockKind {
  const text = prompt.toLowerCase();
  for (const [kind, hints] of KIND_HINTS) {
    if (hints.some((hint) => text.includes(hint))) return kind;
  }
  return "concept";
}

/** Strips the request framing so "add a quiz on X" titles as "Quiz on X". */
const LEADING_REQUEST =
  /^(please\s+)?(can you\s+)?(add|create|make|build|write|generate|insert|include)\s+(me\s+)?(a|an|the|some)?\s*/i;

function toTitle(prompt: string): string {
  const cleaned = prompt.replace(LEADING_REQUEST, "").replace(/[.!?]+$/, "").trim();
  const words = (cleaned || prompt).split(/\s+/).slice(0, 7).join(" ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

const KIND_SUMMARY: Record<BlockKind, string> = {
  hook: "Opening hook — drafted from your request.",
  concept: "Concept explainer — drafted from your request.",
  interactive: "Hands-on activity — drafted from your request.",
  assessment: "Quick assessment — drafted from your request.",
};

function draftLocally({ prompt }: DraftBlockInput): LessonBlock {
  const kind = inferKind(prompt);
  const instruction = prompt.trim().replace(LEADING_REQUEST, "").trim() || prompt.trim();

  const block: LessonBlock = {
    id: newBlockId(),
    kind,
    title: toTitle(prompt),
    summary: KIND_SUMMARY[kind],
    instruction: instruction.charAt(0).toUpperCase() + instruction.slice(1),
  };

  if (kind === "interactive") {
    block.settings = { showFractions: true, autoSnapToGrid: true };
  }

  return block;
}

function newBlockId(): string {
  return `block-${
    globalThis.crypto?.randomUUID?.().slice(0, 8) ??
    Math.random().toString(36).slice(2, 10)
  }`;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function draftBlock(input: DraftBlockInput): Promise<DraftResult> {
  // A visible beat, so the drafting state reads as work rather than a glitch.
  await sleep(650);
  return { block: draftLocally(input), source: "local" };
}
