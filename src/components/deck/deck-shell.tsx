"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CloseIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import type { DeckSection } from "@/lib/deck-types";

interface DeckShellProps {
  sections: DeckSection[];
  /** Where the close control returns to. */
  exitHref: string;
  exitLabel: string;
  children: React.ReactNode;
}

/**
 * Wraps a deck with its progress rail.
 *
 * The rail is one dot per section, tracked with an IntersectionObserver rather
 * than a scroll listener — the browser does the work and it stays accurate when
 * sections are different heights.
 */
export function DeckShell({
  sections,
  exitHref,
  exitLabel,
  children,
}: DeckShellProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const nodes = sections
      .map((section) => document.getElementById(section.id))
      .filter((node): node is HTMLElement => node !== null);

    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // The section closest to the middle of the viewport wins.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const top = visible[0]?.target.id;
        if (top) setActiveId(top);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <div className="relative min-h-dvh bg-deck-paper">
      {children}

      {/* Progress rail — decorative on phones, navigable from sm up. */}
      <nav
        aria-label="Lesson progress"
        className="pointer-events-none fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 sm:block"
      >
        <ol className="pointer-events-auto flex flex-col items-center gap-3">
          {sections.map((section) => {
            const isActive = section.id === activeId;

            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  aria-label={section.navLabel}
                  aria-current={isActive ? "true" : undefined}
                  title={section.navLabel}
                  className="group flex size-4 items-center justify-center"
                >
                  <span
                    className={cn(
                      "block rounded-full transition-all duration-200",
                      isActive
                        ? "size-2.5 bg-deck-accent"
                        : "size-1.5 bg-deck-muted/50 group-hover:bg-deck-muted",
                    )}
                  />
                </a>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Leaving the deck — the only planner control on the whole surface. */}
      <Link
        href={exitHref}
        className="deck-label-sm fixed left-4 top-4 z-40 inline-flex items-center gap-2 rounded-full border border-deck-line bg-deck-card/90 px-4 py-2.5 text-deck-soft backdrop-blur transition-colors hover:border-deck-accent hover:text-deck-accent sm:left-6 sm:top-6"
      >
        <CloseIcon className="size-3.5" />
        {exitLabel}
      </Link>
    </div>
  );
}
