import { getRun, isAiConfigured, startRun } from "@/lib/api/client";
import type { BlockKind, LessonBlock } from "@/lib/types";

/**
 * Turns a typed request ("a quick exit ticket on comparing fractions") into a
 * lesson block.
 *
 * Goes through the AI service when `NEXT_PUBLIC_AI_URL` is set. With no service
 * — or if the run fails — it drafts locally so the flow still works end to end.
 * The result says which path produced it, and the UI tells the teacher.
 */

export interface DraftBlockInput {
  moduleId: string;
  prompt: string;
}

export interface DraftResult {
  block: LessonBlock;
  source: "ai" | "local";
}

/* -------------------------------------------------------------------------
   Local drafting
   ------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------
   Pipeline path
   ------------------------------------------------------------------------- */

const POLL_INTERVAL_MS = 800;
const POLL_TIMEOUT_MS = 45_000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Polls a run to completion and returns the block it produced. */
async function awaitRunBlock(runId: string): Promise<LessonBlock | null> {
  const deadline = Date.now() + POLL_TIMEOUT_MS;

  while (Date.now() < deadline) {
    const run = await getRun(runId);
    if (run.status === "done") return run.block ?? null;
    if (run.status === "failed") return null;
    await sleep(POLL_INTERVAL_MS);
  }

  return null;
}

export async function draftBlock(input: DraftBlockInput): Promise<DraftResult> {
  if (isAiConfigured) {
    try {
      const handle = await startRun({
        intent: "add-block",
        moduleId: input.moduleId,
        instruction: input.prompt,
      });
      const block = await awaitRunBlock(handle.runId);
      if (block) return { block, source: "ai" };
      console.error("[lumina] run produced no block, drafting locally.");
    } catch (error) {
      console.error("[lumina] add-block run failed, drafting locally.", error);
    }
  }

  // A visible beat, so the drafting state reads as work rather than a glitch.
  await sleep(650);
  return { block: draftLocally(input), source: "local" };
}
