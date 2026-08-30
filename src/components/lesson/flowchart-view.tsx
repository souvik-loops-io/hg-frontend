"use client";

import { useState } from "react";

import { ChevronDownIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import type { FlowFigure } from "@/lib/types";

/**
 * A vertical flowchart. Each step is a numbered node joined to the next by a
 * connector rail with a downward arrow, so the sequence reads as a directed
 * flow rather than a list. Tapping a step makes it the active node.
 */
export function FlowchartView({ figure }: { figure: FlowFigure }) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <ol className="m-0 list-none space-y-0 p-0">
      {figure.steps.map((step, index) => {
        const isActive = index === active;
        const isLast = index === figure.steps.length - 1;

        return (
          <li key={`${step.title}-${index}`} className="flex gap-4 pb-6 last:pb-0">
            {/* Left rail: the numbered node with the connector running down from
                it to the next node. */}
            <div className="relative flex w-11 shrink-0 flex-col items-center">
              <span
                className={cn(
                  "z-10 flex size-11 items-center justify-center rounded-full text-lg font-bold transition-colors",
                  isActive
                    ? "bg-brand-600 text-paper"
                    : "bg-sky-100 text-brand-600",
                )}
              >
                {index + 1}
              </span>

              {!isLast ? (
                <>
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-11 bottom-0 mx-auto w-0.5 rounded-full bg-line-strong"
                  />
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="absolute -bottom-1 left-1/2 size-4 -translate-x-1/2 text-line-strong"
                  />
                </>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => setActive((prev) => (prev === index ? null : index))}
              aria-pressed={isActive}
              className={cn(
                "flex-1 rounded-block border-2 bg-paper p-4 text-left transition-colors",
                isActive
                  ? "border-brand-600 shadow-card"
                  : "border-line hover:border-sky-200",
              )}
            >
              <h4
                className={cn(
                  "text-base font-bold tracking-[-0.01em]",
                  isActive ? "text-brand-600" : "text-ink",
                )}
              >
                {step.title}
              </h4>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                {step.text}
              </p>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
