"use client";

import { RulerIcon, SparkleIcon } from "@/components/icons";
import { blockTypeLabel } from "@/components/planner/block-badges";
import { cn } from "@/lib/cn";
import type { LessonBlock } from "@/lib/types";

/** The number line students drag onto. Decorative in this preview. */
function NumberLine() {
  return (
    <svg
      viewBox="0 0 320 44"
      className="w-full max-w-md text-surface-strong"
      role="img"
      aria-label="A number line from 0 to 1 with tick marks at the quarters"
    >
      <line
        x1="10"
        y1="22"
        x2="310"
        y2="22"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <circle cx="10" cy="22" r="7" className="fill-sky-200" />
      <circle cx="310" cy="22" r="7" className="fill-sky-200" />
      <rect x="82" y="10" width="7" height="24" rx="3.5" fill="currentColor" />
      <rect x="156" y="4" width="9" height="36" rx="4.5" className="fill-sky-200" />
      <rect x="231" y="10" width="7" height="24" rx="3.5" fill="currentColor" />
    </svg>
  );
}

interface BlockCanvasProps {
  block: LessonBlock;
  /** True while the assistant is working on this block. */
  busy: boolean;
}

/**
 * The editor canvas: one block, at size, with whatever the assistant is
 * currently doing to it. Works for every block — a representation gets its
 * manipulable, everything else gets the text students will read.
 */
export function BlockCanvas({ block, busy }: BlockCanvasProps) {
  const representation = block.representation;
  const isWorking = busy || representation?.status === "updating";

  return (
    <div className="scroll-slim h-full overflow-y-auto p-4 sm:p-6">
      <div className="mx-auto flex h-full min-h-[24rem] max-w-2xl flex-col rounded-panel border-2 border-sky-200 bg-paper">
        <header className="flex items-center gap-3 border-b border-line px-4 py-4 sm:px-5">
          <span
            aria-hidden="true"
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-sky-300 text-brand-700"
          >
            <RulerIcon className="size-5" />
          </span>
          <div className="min-w-0">
            <h3 className="truncate font-bold tracking-[-0.015em]">
              {representation?.name ?? block.title}
            </h3>
            <p className="mt-0.5 truncate text-[0.8125rem] text-ink-soft">
              {blockTypeLabel[block.kind]}
            </p>
          </div>
        </header>

        <div className="flex flex-1 flex-col items-center justify-center rounded-b-panel border-2 border-dashed border-transparent p-4 sm:p-6">
          <div
            className={cn(
              "flex w-full flex-1 flex-col items-center justify-center rounded-card",
              "border-2 border-dashed border-line-strong bg-canvas px-6 py-10 text-center",
            )}
          >
            {isWorking ? (
              <>
                <span
                  aria-hidden="true"
                  className="flex size-20 items-center justify-center rounded-full border-[3px] border-sky-300 text-brand-600 animate-breathe"
                >
                  <SparkleIcon className="size-8" />
                </span>
                <p
                  role="status"
                  className="mt-6 text-xl font-bold tracking-[-0.025em] text-brand-600 sm:text-2xl"
                >
                  {representation?.statusLabel ?? "Working on it..."}
                </p>
                <p className="mt-2 text-[0.9375rem] text-ink-soft">
                  {representation
                    ? "AI is adjusting the number line ticks and labels."
                    : "AI is rewriting this block."}
                </p>
              </>
            ) : (
              <>
                <h4 className="text-2xl font-bold tracking-[-0.025em] text-balance">
                  {block.title}
                </h4>
                <p className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-ink-soft">
                  {block.instruction}
                </p>
              </>
            )}

            {representation ? (
              <div className="mt-8 w-full">
                <NumberLine />
              </div>
            ) : null}
          </div>

          {representation ? (
            <p className="mt-4 text-center text-[0.875rem] leading-relaxed text-ink-soft">
              {representation.caption}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
