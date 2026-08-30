import { CheckpointSlide } from "@/components/deck/sections/checkpoint-section";
import { CloseSlide } from "@/components/deck/sections/close-section";
import { ConceptSlide } from "@/components/deck/sections/concept-section";
import { ContentsSlide } from "@/components/deck/sections/contents-section";
import { CoverSlide } from "@/components/deck/sections/cover-section";
import { RulesSlide } from "@/components/deck/sections/rules-section";
import type { DeckSection } from "@/lib/deck-types";

/**
 * Renders one section by kind.
 *
 * `index` only decides the background band — alternating paper and shell is
 * what gives the deck its rhythm on a long scroll.
 */
export function DeckSectionView({
  section,
  index,
}: {
  section: DeckSection;
  index: number;
}) {
  switch (section.kind) {
    case "cover":
      return <CoverSlide section={section} />;
    case "contents":
      return <ContentsSlide section={section} />;
    case "concept":
      return (
        <ConceptSlide section={section} tone={index % 2 === 0 ? "paper" : "shell"} />
      );
    case "rules":
      return <RulesSlide section={section} />;
    case "checkpoint":
      return <CheckpointSlide section={section} />;
    case "close":
      return <CloseSlide section={section} />;
  }
}
