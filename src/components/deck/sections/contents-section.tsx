import { Accent, Eyebrow } from "@/components/deck/accent";
import { Section } from "@/components/deck/section";
import type { ContentsSection } from "@/lib/deck-types";

export function ContentsSlide({ section }: { section: ContentsSection }) {
  return (
    <Section id={section.id} tone="shell">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-20">
        <div>
          <Eyebrow>{section.eyebrow}</Eyebrow>
          <h2 className="mt-6 text-5xl font-bold leading-[0.95] tracking-[-0.04em] text-deck-ink sm:text-6xl">
            <Accent phrase={section.title} />
          </h2>
        </div>

        {/* Numbered contents with dotted leaders. */}
        <ol className="space-y-6">
          {section.items.map((item) => (
            <li key={item.n} className="flex items-baseline gap-4">
              <span
                aria-hidden="true"
                className="size-2.5 shrink-0 self-center rounded-full border-2 border-deck-accent"
              />
              <span className="deck-label-sm w-7 shrink-0 text-deck-muted">
                {item.n}
              </span>
              <span className="text-lg text-deck-ink">{item.label}</span>
              <span aria-hidden="true" className="deck-leader" />
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
