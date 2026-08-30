/**
 * The student-facing presentation.
 *
 * A deck is a list of typed sections. Adding a new kind of slide means adding a
 * variant here and a renderer in `components/deck/sections/` — nothing else in
 * the deck machinery needs to know about it.
 */

export type IllustrationKey =
  | "thermometer"
  | "bundle"
  | "plant"
  | "beaker-correct"
  | "beaker-vertical"
  | "beaker-read"
  | "thermometer-eye";

/** A phrase with one word lifted into the handwritten accent. */
export interface AccentPhrase {
  /** Text before the accented word. */
  lead?: string;
  /** The word set in script, on a highlight. */
  accent: string;
  /** Text after it. */
  tail?: string;
}

interface BaseSection {
  id: string;
  /** Shown in the right-hand progress rail and the contents list. */
  navLabel: string;
}

export interface CoverSection extends BaseSection {
  kind: "cover";
  unitTitle: string;
  lessonLabel: string;
  lessonTitle: AccentPhrase;
  illustration: IllustrationKey;
}

export interface ContentsSection extends BaseSection {
  kind: "contents";
  eyebrow: string;
  title: AccentPhrase;
  items: { n: string; label: string }[];
}

export interface ConceptSection extends BaseSection {
  kind: "concept";
  eyebrow: string;
  title: AccentPhrase;
  body: string;
  points?: string[];
  illustration?: IllustrationKey;
}

/** The "break the rule" interactive from the sample deck. */
export interface RulesSection extends BaseSection {
  kind: "rules";
  title: AccentPhrase;
  intro: string;
  hint: string;
  rules: {
    n: number;
    text: string;
    /** What the student sees when the rule is broken. */
    broken: string;
    illustration: IllustrationKey;
  }[];
  callout: string;
  calloutAction: string;
}

export interface CheckpointSection extends BaseSection {
  kind: "checkpoint";
  eyebrow: string;
  title: AccentPhrase;
  prompt: string;
  options: { id: string; label: string; correct?: boolean }[];
}

export interface CloseSection extends BaseSection {
  kind: "close";
  eyebrow: string;
  title: AccentPhrase;
  body: string;
}

export type DeckSection =
  | CoverSection
  | ContentsSection
  | ConceptSection
  | RulesSection
  | CheckpointSection
  | CloseSection;

export interface Deck {
  id: string;
  subject: string;
  grade: number;
  /** Card + browser title. */
  title: string;
  /** Card illustration. */
  illustration: IllustrationKey;
  sections: DeckSection[];
}

export interface School {
  name: string;
  tagline: string;
  /** Two-line lockup, as in the sample. */
  markTop: string;
  markBottom: string;
}
