import type { ChatMessage, LessonBlock, LessonModule, QuickAction } from "@/lib/types";

/**
 * The module currently open in the planner.
 *
 * Served by the content service once `NEXT_PUBLIC_API_URL` is set; the shape
 * here is the contract the UI expects.
 */
export const lessonModule: LessonModule = {
  id: "fraction-mastery",
  title: "Fraction Mastery",
  headline: "Let's Learn Fractions!",
  subheadline: "Sharing is caring (and math).",
  grade: "Grade 4",
  subject: "Mathematics",
  blocks: [
    {
      id: "pizza-problem",
      kind: "hook",
      title: "The Pizza Problem",
      summary: "Real-world intro to sharing.",
      instruction:
        "Four friends want to share one large pizza equally. How much of the pizza does each friend get?",
    },
    {
      id: "numerator-denominator",
      kind: "concept",
      title: "Numerator & Denominator",
      summary: "Core vocabulary definitions.",
      instruction:
        "The bottom number counts the equal pieces. The top number counts how many we took.",
    },
    {
      id: "explore-number-line",
      kind: "interactive",
      title: "Explore the Number Line",
      summary: "Drag fractions to their correct place.",
      instruction: "Drag the fractions to their correct spots.",
      settings: {
        showFractions: true,
        autoSnapToGrid: true,
      },
      representation: {
        id: "fraction-number-line",
        name: "Fraction Number Line",
        caption:
          "Students drag fractions to their correct positions on a number line from 0 to 1.",
        status: "updating",
        statusLabel: "Simplifying to halves and quarters...",
      },
    },
    {
      id: "quick-check",
      kind: "assessment",
      title: "Quick Check",
      summary: "3 multiple choice questions.",
      instruction: "Which shape shows three quarters shaded?",
    },
  ],
};

/**
 * The opening turn of the assistant conversation for a block.
 *
 * Each block gets its own thread, so switching blocks inside the editor keeps
 * the conversation you were having about each one.
 */
export function initialConversation(block: LessonBlock): ChatMessage[] {
  if (block.representation) {
    return [
      {
        id: `${block.id}-1`,
        author: "assistant",
        text: `I've set up the ${block.representation.name.toLowerCase()} from 0 to 1 with eighths. How does that look?`,
      },
    ];
  }

  return [
    {
      id: `${block.id}-1`,
      author: "assistant",
      text: `This is the "${block.title}" block. Tell me what to change — the wording, the difficulty, or the whole approach.`,
    },
  ];
}

/** One-tap follow-ups, scoped to what the block actually is. */
export function quickActionsFor(block: LessonBlock): QuickAction[] {
  if (block.representation) {
    return [
      { id: "decimals", label: "Change to Decimals" },
      { id: "extend", label: "Extend to 2" },
      { id: "simplify", label: "Simplify for Grade 3" },
    ];
  }

  if (block.kind === "assessment") {
    return [
      { id: "more-items", label: "Add two more questions" },
      { id: "distractors", label: "Better wrong answers" },
      { id: "easier", label: "Make it easier" },
    ];
  }

  return [
    { id: "simpler", label: "Simplify the language" },
    { id: "example", label: "Add a worked example" },
    { id: "harder", label: "Make it harder" },
  ];
}
