import { Accent, Eyebrow } from "@/components/deck/accent";
import { Illustration } from "@/components/deck/illustrations";
import { Section } from "@/components/deck/section";
import type { ConceptSection } from "@/lib/deck-types";

export function ConceptSlide({
  section,
  tone,
}: {
  section: ConceptSection;
  tone: "paper" | "shell";
}) {
  const hasArt = Boolean(section.illustration);

  return (
    <Section id={section.id} tone={tone}>
      <div
        className={
          hasArt
            ? "grid items-center gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16"
            : ""
        }
      >
        <div>
          <Eyebrow>{section.eyebrow}</Eyebrow>
          <h2 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.02] tracking-[-0.035em] text-deck-ink text-balance sm:text-5xl">
            <Accent phrase={section.title} />
          </h2>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-deck-soft">
            {section.body}
          </p>

          {section.points?.length ? (
            <ul className="mt-9 space-y-4 border-l-2 border-deck-accent pl-6">
              {section.points.map((point) => (
                <li key={point} className="text-lg leading-relaxed text-deck-ink">
                  {point}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {section.illustration ? (
          <Illustration
            name={section.illustration}
            className="mx-auto w-full max-w-sm"
          />
        ) : null}
      </div>
    </Section>
  );
}
