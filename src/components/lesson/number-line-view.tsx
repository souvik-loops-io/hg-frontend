"use client";

import { useState } from "react";

import { cn } from "@/lib/cn";
import type { NumberLineFigure } from "@/lib/types";

/** Where a value sits along the line, as a 0–1 fraction of min → max. */
function fractionFor(value: number, min: number, max: number): number {
  const span = max - min;
  if (span === 0) return 0;
  const frac = (value - min) / span;
  return Math.min(1, Math.max(0, frac));
}

/** Minor tick values from min to max, stepping by `step` (capped for safety). */
function stepTicks(min: number, max: number, step: number): number[] {
  const span = max - min;
  if (step <= 0 || span <= 0 || span / step > 200) return [];
  const ticks: number[] = [];
  for (let v = min; v <= max + step * 1e-6; v += step) ticks.push(v);
  return ticks;
}

/**
 * An interactive number line: a rounded baseline with minor step ticks, and a
 * tappable pin at every labelled mark. Tapping a pin "places" it (leaf) and the
 * readout below reports what was placed.
 */
export function NumberLineView({ figure }: { figure: NumberLineFigure }) {
  const [selected, setSelected] = useState<number | null>(null);

  const { min, max, step, marks, question } = figure;
  const ticks = stepTicks(min, max, step);
  const selectedMark = selected === null ? null : (marks[selected] ?? null);

  return (
    <figure className="m-0">
      {question ? (
        <p className="mb-4 text-center text-lg font-semibold text-ink text-balance">
          {question}
        </p>
      ) : null}

      <div className="relative px-8 pb-9 pt-3">
        <div className="relative h-16 overflow-visible">
          {/* Baseline + minor ticks. Non-uniform scale so x maps 0..100 to the
              track width exactly like the pins' left percentage. */}
          <svg
            className="absolute inset-x-0 top-0 h-16 w-full text-line-strong"
            viewBox="0 0 100 64"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <line
              x1="0"
              y1="24"
              x2="100"
              y2="24"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            {ticks.map((value) => {
              const x = fractionFor(value, min, max) * 100;
              return (
                <line
                  key={value}
                  x1={x}
                  y1="16"
                  x2={x}
                  y2="32"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </svg>

          {marks.map((mark) => {
            const isPlaced = selectedMark?.value === mark.value;
            const left = `${fractionFor(mark.value, min, max) * 100}%`;
            return (
              <button
                key={`${mark.value}-${mark.label}`}
                type="button"
                onClick={() =>
                  setSelected((prev) =>
                    prev !== null && marks[prev]?.value === mark.value
                      ? null
                      : marks.indexOf(mark),
                  )
                }
                aria-pressed={isPlaced}
                aria-label={`Place ${mark.label} at ${mark.value}`}
                className="absolute top-0 flex -translate-x-1/2 flex-col items-center pt-[8px] outline-offset-4"
                style={{ left }}
              >
                <span
                  className={cn(
                    "w-2.5 rounded-full transition-all duration-150",
                    isPlaced
                      ? "h-10 bg-leaf-500"
                      : "h-8 bg-sky-300 hover:bg-sky-400",
                  )}
                />
                <span
                  className={cn(
                    "mt-1.5 whitespace-nowrap text-sm font-bold",
                    isPlaced ? "text-leaf-600" : "text-ink-soft",
                  )}
                >
                  {mark.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <p
        aria-live="polite"
        className="mt-1 flex items-center justify-center gap-2 text-center"
      >
        {selectedMark ? (
          <span className="inline-flex items-center gap-1.5 rounded-field bg-leaf-100 px-3 py-1.5 text-sm font-bold text-leaf-600">
            Placed {selectedMark.label}
          </span>
        ) : (
          <span className="text-sm text-ink-soft">Tap a mark to place it.</span>
        )}
      </p>
    </figure>
  );
}
