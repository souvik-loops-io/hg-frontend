import { Accent } from "@/components/deck/accent";
import { Illustration } from "@/components/deck/illustrations";
import type { CoverSection } from "@/lib/deck-types";

export function CoverSlide({ section }: { section: CoverSection }) {
  return (
    <section
      id={section.id}
      data-deck-section={section.id}
      className="relative overflow-hidden bg-deck-paper px-6 pb-16 pt-14 sm:px-10 lg:px-16 lg:pb-24 lg:pt-20"
    >
      {/* A soft warm wash behind the artwork, as in the sample. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 size-[34rem] rounded-full bg-deck-accent-soft/50 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div>
          <h1 className="text-5xl font-bold leading-[0.95] tracking-[-0.04em] text-deck-ink text-balance sm:text-6xl lg:text-7xl">
            {section.unitTitle}
          </h1>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <span className="deck-label text-deck-accent">
              {section.lessonLabel}
            </span>
            <span aria-hidden="true" className="h-px w-12 bg-deck-line" />
            <p className="text-xl font-semibold text-deck-ink sm:text-2xl">
              <Accent phrase={section.lessonTitle} />
            </p>
          </div>

          <div className="mt-14 flex items-center gap-3">
            <span className="deck-label text-deck-muted">Scroll</span>
            <span
              aria-hidden="true"
              className="animate-scroll-hint h-8 w-px bg-deck-ink/40"
            />
          </div>
        </div>

        <div className="order-first lg:order-last">
          <Illustration
            name={section.illustration}
            className="mx-auto w-full max-w-md"
          />
        </div>
      </div>
    </section>
  );
}
