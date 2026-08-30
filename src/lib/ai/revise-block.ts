import type { LessonBlock } from "@/lib/types";

/**
 * Applies a typed instruction to one block — "only show halves and quarters" —
 * entirely on-device.
 *
 * The *fixture-mode* fallback: when a real engine lesson is loaded, revising a
 * block goes through the Lesson Engine's `/edit-block` path (see
 * `LiveWorkspace`), which regenerates the block for real. This local pass only
 * reflects the request so the demo module still feels alive with no backend.
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
  /** Always "local" here — kept so the UI can stay honest about the source. */
  source: "local";
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
      ? `Noted — I've put "${instruction.trim()}" on the canvas. Open a real engine lesson and I'll rebuild the representation for real.`
      : `I've set the instruction text to your wording. Open a real engine lesson and I'll rewrite the whole block instead.`,
    patch,
    source: "local",
  };
}

export async function reviseBlock(input: ReviseBlockInput): Promise<ReviseResult> {
  // A visible beat, so the typing indicator reads as work rather than a glitch.
  await sleep(900);
  return reviseLocally(input);
}
