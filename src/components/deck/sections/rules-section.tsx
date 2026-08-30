"use client";

import { useState } from "react";
import { Accent } from "@/components/deck/accent";
import { Illustration } from "@/components/deck/illustrations";
import { Section } from "@/components/deck/section";
import { cn } from "@/lib/cn";
import type { RulesSection } from "@/lib/deck-types";

/**
 * The "break the rule" interactive.
 *
 * Each card flips between the correct procedure and what breaking it looks
 * like. The point of the slide is the count: break all four and every reading
 * is wrong, which is exactly the starter.
 */
export function RulesSlide({ section }: { section: RulesSection }) {
  const [broken, setBroken] = useState<Set<number>>(new Set());

  const allBroken = broken.size === section.rules.length;

  function toggle(n: number) {
    setBroken((current) => {
      const next = new Set(current);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });
  }

  function toggleAll() {
    setBroken(allBroken ? new Set() : new Set(section.rules.map((r) => r.n)));
  }

  return (
    <Section id={section.id} tone="shell">
      <h2 className="max-w-3xl text-4xl font-bold leading-[1.02] tracking-[-0.035em] text-deck-ink text-balance sm:text-5xl">
        <Accent phrase={section.title} />
      </h2>

      <div className="mt-8 flex flex-wrap items-end justify-between gap-6 border-b border-deck-line pb-6">
        <div>
          <p className="text-lg text-deck-ink">{section.intro}</p>
          <p className="deck-label-sm mt-3 text-deck-muted">{section.hint}</p>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="deck-label-sm text-deck-muted">Rules broken</p>
            <p
              aria-live="polite"
              className={cn(
                "mt-1.5 text-3xl font-bold tabular-nums transition-colors",
                broken.size > 0 ? "text-deck-accent" : "text-deck-ink",
              )}
            >
              {broken.size} / {section.rules.length}
            </p>
          </div>
          <button
            type="button"
            onClick={toggleAll}
            className="deck-label-sm rounded-full border border-deck-accent px-5 py-3 text-deck-accent transition-colors hover:bg-deck-accent hover:text-deck-paper"
          >
            {allBroken ? "Reset all" : `Break all ${section.rules.length}`}
          </button>
        </div>
      </div>

      <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-deck-line">
        {section.rules.map((rule, index) => {
          const isBroken = broken.has(rule.n);

          return (
            <li key={rule.n} className={cn("lg:px-6", index === 0 && "lg:pl-0")}>
              <div
                className={cn(
                  "transition-all duration-200",
                  isBroken && "-rotate-2 opacity-90",
                )}
              >
                <Illustration
                  name={rule.illustration}
                  className="mx-auto h-40 w-full"
                />
              </div>

              <div className="mt-6 flex items-center gap-3">
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full border text-[0.8125rem] font-semibold transition-colors",
                    isBroken
                      ? "border-deck-accent bg-deck-accent text-deck-paper"
                      : "border-deck-accent text-deck-accent",
                  )}
                >
                  {rule.n}
                </span>
                <span
                  className={cn(
                    "deck-label-sm rounded-full px-3 py-1.5 transition-colors",
                    isBroken
                      ? "bg-deck-accent-soft text-deck-accent"
                      : "bg-deck-paper text-deck-soft",
                  )}
                >
                  {isBroken ? "Broken" : "Correct"}
                </span>
              </div>

              <p className="mt-4 text-[0.9375rem] leading-relaxed text-deck-ink">
                {isBroken ? rule.broken : rule.text}
              </p>

              <button
                type="button"
                onClick={() => toggle(rule.n)}
                aria-pressed={isBroken}
                className="deck-label-sm mt-5 text-deck-muted underline decoration-deck-line underline-offset-4 transition-colors hover:text-deck-accent hover:decoration-deck-accent"
              >
                {isBroken ? "Fix this rule" : "Break this rule"}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-l-4 border-deck-accent bg-deck-paper py-5 pl-6 pr-5">
        <p className="text-xl font-semibold text-deck-soft text-balance">
          {section.callout}
        </p>
        <a
          href="#starter"
          className="deck-label-sm shrink-0 text-deck-muted transition-colors hover:text-deck-accent"
        >
          {section.calloutAction}
        </a>
      </div>
    </Section>
  );
}
