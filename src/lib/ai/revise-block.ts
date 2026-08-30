import { getRun, isAiConfigured, startRun } from "@/lib/api/client";
import type { LessonBlock } from "@/lib/types";

/**
 * Applies a typed instruction to one block — "only show halves and quarters".
 *
 * Same seam as `draftBlock`: the AI service when `NEXT_PUBLIC_AI_URL` is set,
 * a local pass otherwise. The result says which path ran so the UI can be
 * honest about it.
 */

export interface ReviseBlockInput {
  moduleId: string;
  block: LessonBlock;
  instruction: string;
}

export interface ReviseResult {
  /** What the assistant says back, for the chat. */
  reply: string;
  /** What actually changes on the block. */
  patch: Partial<LessonBlock>;
  source: "ai" | "local";
}

const POLL_INTERVAL_MS = 800;
const POLL_TIMEOUT_MS = 45_000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

/** Turns "only show halves and quarters" into "Applying halves and quarters…". */
function statusLabelFor(instruction: string): string {
  const trimmed = instruction
    .trim()
    .replace(/^(can you|could you|please)\s+/i, "")
    .replace(/[.!?]+$/, "");
  const short = trimmed.split(/\s+/).slice(0, 8).join(" ");
  return `Applying: ${short}...`;
}

function reviseLocally({ block, instruction }: ReviseBlockInput): ReviseResult {
  const patch: Partial<LessonBlock> = {};

  // The one honest visible change: reflect the request on the canvas.
  if (block.representation) {
    patch.representation = {
      ...block.representation,
      status: "updating",
      statusLabel: statusLabelFor(instruction),
    };
  } else {
    patch.instruction = instruction.trim();
  }

  return {
    reply: block.representation
      ? `Noted — I've put "${instruction.trim()}" on the canvas. Connect NEXT_PUBLIC_AI_URL and I'll rebuild the representation for real.`
      : `I've set the instruction text to your wording. Connect NEXT_PUBLIC_AI_URL and I'll rewrite the whole block instead.`,
    patch,
    source: "local",
  };
}

export async function reviseBlock(input: ReviseBlockInput): Promise<ReviseResult> {
  if (isAiConfigured) {
    try {
      const handle = await startRun({
        intent: "revise-block",
        moduleId: input.moduleId,
        blockId: input.block.id,
        instruction: input.instruction,
      });
      const revised = await awaitRunBlock(handle.runId);
      if (revised) {
        return {
          reply: "Done — I've updated the block. Have a look and tell me what to change next.",
          patch: revised,
          source: "ai",
        };
      }
      console.error("[lumina] revise run produced no block, revising locally.");
    } catch (error) {
      console.error("[lumina] revise-block run failed, revising locally.", error);
    }
  }

  // A visible beat, so the typing indicator reads as work rather than a glitch.
  await sleep(900);
  return reviseLocally(input);
}
