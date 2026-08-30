"use client";

import { useState } from "react";

import { cn } from "@/lib/cn";
import type { ChecklistFigure } from "@/lib/types";

/**
 * A tickable checklist. Each row toggles on tap; ticked rows settle to leaf and
 * strike through, and a running count reports progress.
 */
export function ChecklistView({ figure }: { figure: ChecklistFigure }) {
  const [done, setDone] = useState<ReadonlySet<number>>(new Set<number>());

  const toggle = (index: number) =>
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });

  return (
    <div className="m-0">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        {figure.title ? (
          <h4 className="text-base font-bold text-ink">{figure.title}</h4>
        ) : (
          <span />
        )}
        <span className="shrink-0 text-sm font-semibold tabular-nums text-ink-soft">
          {done.size} of {figure.items.length} done
        </span>
      </div>

      <ul className="space-y-2.5">
        {figure.items.map((item, index) => {
          const isDone = done.has(index);
          return (
            <li key={`${item}-${index}`}>
              <button
                type="button"
                onClick={() => toggle(index)}
                aria-pressed={isDone}
                className={cn(
                  "flex w-full items-center gap-3 rounded-block border-2 p-3.5 text-left transition-colors",
                  isDone
                    ? "border-leaf-200 bg-leaf-50"
                    : "border-line bg-paper hover:border-sky-300",
                )}
              >
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
                    isDone
                      ? "border-leaf-500 bg-leaf-500 text-paper"
                      : "border-line-strong bg-paper text-transparent",
                  )}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="size-4"
                  >
                    <path d="m5 12.5 4.5 4.5L19 7" />
                  </svg>
                </span>
                <span
                  className={cn(
                    "text-base font-medium",
                    isDone ? "text-ink-soft line-through" : "text-ink",
                  )}
                >
                  {item}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
