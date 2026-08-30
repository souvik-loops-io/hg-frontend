import type { BadgeTone } from "@/components/ui/badge";
import type { BlockKind } from "@/lib/types";

/**
 * A block's kind is its colour. Hook is settled green, Concept is sky because
 * you can open it, Interactive is amber because students act on it, and
 * Assessment is neutral so it never competes with the teaching.
 */
export const blockKindTone: Record<BlockKind, BadgeTone> = {
  hook: "leaf",
  concept: "sky",
  interactive: "sun",
  assessment: "neutral",
};

export const blockKindLabel: Record<BlockKind, string> = {
  hook: "Hook",
  concept: "Concept",
  interactive: "Interactive",
  assessment: "Assessment",
};

/** Human-readable block type, as shown in the settings panel. */
export const blockTypeLabel: Record<BlockKind, string> = {
  hook: "Opening Hook",
  concept: "Concept Explainer",
  interactive: "Interactive Activity",
  assessment: "Quick Assessment",
};
