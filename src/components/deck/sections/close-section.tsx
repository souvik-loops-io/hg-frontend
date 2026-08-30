import { Accent, Eyebrow } from "@/components/deck/accent";
import { Section } from "@/components/deck/section";
import type { CloseSection } from "@/lib/deck-types";

export function CloseSlide({ section }: { section: CloseSection }) {
  return (
    <Section id={section.id} tone="shell">
      <div className="max-w-3xl">
        <Eyebrow>{section.eyebrow}</Eyebrow>
        <h2 className="mt-6 text-4xl font-bold leading-[1.02] tracking-[-0.035em] text-deck-ink text-balance sm:text-5xl">
          <Accent phrase={section.title} />
        </h2>
        <p className="mt-7 text-lg leading-relaxed text-deck-soft">{section.body}</p>
      </div>
    </Section>
  );
}
