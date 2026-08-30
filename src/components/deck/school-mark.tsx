import { school } from "@/lib/data/decks";

/**
 * School lockup for the gallery header.
 *
 * Typographic, not an uploaded logo — the real mark is the school's asset and
 * should be dropped in here once it exists.
 */
export function SchoolMark() {
  return (
    <div className="flex items-start gap-3">
      <div>
        <p className="text-[0.6875rem] font-bold text-deck-ink">
          {school.tagline}
        </p>
        <p className="mt-1 text-3xl font-bold uppercase leading-none tracking-[-0.02em] text-deck-accent">
          {school.markTop}
        </p>
        <p className="deck-label mt-1.5 text-deck-soft">{school.markBottom}</p>
      </div>
      <span
        aria-hidden="true"
        className="mt-3 block size-0 border-y-[18px] border-l-[26px] border-y-transparent border-l-deck-accent"
      />
    </div>
  );
}
