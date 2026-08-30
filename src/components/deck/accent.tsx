import { cn } from "@/lib/cn";
import type { AccentPhrase } from "@/lib/deck-types";

/**
 * A phrase with one word lifted into the handwritten accent — the deck's single
 * strongest signal, so it marks the idea the slide is actually about.
 */
export function Accent({
  phrase,
  className,
}: {
  phrase: AccentPhrase;
  className?: string;
}) {
  return (
    <span className={className}>
      {phrase.lead}
      <span className="relative inline-block whitespace-nowrap px-1.5">
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-[0.12em] top-[0.18em] -rotate-[0.6deg] rounded-[0.2em] bg-deck-accent-soft"
        />
        <span className="relative font-[family-name:var(--font-deck-script)] text-deck-accent">
          {phrase.accent}
        </span>
      </span>
      {phrase.tail}
    </span>
  );
}

/** The section eyebrow — wide-tracked mono, always uppercase. */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("deck-label text-deck-muted", className)}>{children}</p>
  );
}
