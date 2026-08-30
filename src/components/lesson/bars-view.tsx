"use client";

import { cn } from "@/lib/cn";
import type { BarsFigure } from "@/lib/types";

/**
 * Part–whole bars. Each item is a rounded bar split into `denominator` equal
 * cells with `numerator` of them filled (sky), so two fractions can be compared
 * at a glance. Pure layout — nothing to tap.
 */
export function BarsView({ figure }: { figure: BarsFigure }) {
  return (
    <figure className="m-0">
      <ul className="space-y-5">
        {figure.items.map((item, itemIndex) => {
          const denominator = Math.max(1, Math.floor(item.denominator));
          const cells = Array.from({ length: denominator }, (_, cellIndex) => ({
            key: cellIndex,
            filled: cellIndex < item.numerator,
          }));

          return (
            <li key={`${item.label}-${itemIndex}`}>
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <span className="text-base font-bold text-ink">
                  {item.label}
                </span>
                <span className="rounded-field bg-sky-100 px-2.5 py-1 text-sm font-bold tabular-nums text-brand-600">
                  {item.numerator}/{denominator}
                </span>
              </div>

              <div
                className="grid gap-[3px] rounded-field bg-line p-[3px]"
                style={{
                  gridTemplateColumns: `repeat(${denominator}, minmax(0, 1fr))`,
                }}
              >
                {cells.map((cell) => (
                  <span
                    key={cell.key}
                    className={cn(
                      "h-10 first:rounded-l-field last:rounded-r-field",
                      cell.filled ? "bg-sky-400" : "bg-paper",
                    )}
                  />
                ))}
              </div>
            </li>
          );
        })}
      </ul>

      {figure.caption ? (
        <figcaption className="mt-4 text-center text-sm leading-relaxed text-ink-soft">
          {figure.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
