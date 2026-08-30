"use client";

import { useState } from "react";
import { Accent, Eyebrow } from "@/components/deck/accent";
import { Section } from "@/components/deck/section";
import { cn } from "@/lib/cn";
import type { CheckpointSection } from "@/lib/deck-types";

/** A single multiple-choice check. Answers reveal on selection. */
export function CheckpointSlide({ section }: { section: CheckpointSection }) {
  const [picked, setPicked] = useState<string | null>(null);

  const chosen = section.options.find((option) => option.id === picked);

  return (
    <Section id={section.id}>
      <div className="max-w-3xl">
        <Eyebrow>{section.eyebrow}</Eyebrow>
        <h2 className="mt-6 text-4xl font-bold leading-[1.02] tracking-[-0.035em] text-deck-ink text-balance sm:text-5xl">
          <Accent phrase={section.title} />
        </h2>
        <p className="mt-7 text-lg leading-relaxed text-deck-soft">
          {section.prompt}
        </p>
      </div>

      <ul className="mt-10 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2">
        {section.options.map((option) => {
          const isPicked = picked === option.id;
          const reveal = picked !== null;

          return (
            <li key={option.id}>
              <button
                type="button"
                onClick={() => setPicked(option.id)}
                aria-pressed={isPicked}
                className={cn(
                  "w-full rounded-lg border-2 px-5 py-4 text-left text-[0.9375rem] transition-colors",
                  reveal && option.correct
                    ? "border-deck-accent bg-deck-accent-soft text-deck-ink"
                    : isPicked
                      ? "border-deck-ink bg-deck-paper text-deck-ink"
                      : "border-deck-line bg-deck-card text-deck-soft hover:border-deck-muted",
                )}
              >
                <span className="deck-label-sm mr-3 text-deck-muted">
                  {option.id}
                </span>
                {option.label}
              </button>
            </li>
          );
        })}
      </ul>

      {chosen ? (
        <p
          role="status"
          className="mt-7 max-w-3xl text-lg font-semibold text-deck-accent"
        >
          {chosen.correct
            ? "Correct — tilting it breaks rule 2, and lifting it out breaks rule 3."
            : "Not quite. Look again at what they did, then at rules 2 and 3."}
        </p>
      ) : null}
    </Section>
  );
}
