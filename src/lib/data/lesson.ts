import type { ChatMessage, LessonBlock, LessonModule, QuickAction } from "@/lib/types";

/**
 * The demo module — a complete, hand-authored lesson used whenever there is no
 * live engine lesson to show (the `/curriculum/flow` fallback and the student
 * `/preview`). Every figure kind the renderer supports appears here with real,
 * playable content (a working MCQ, a tappable number line, comparable bars, a
 * numbered flow, a tickable exit ticket) so the product is always demoable
 * without waiting on generation.
 */
export const lessonModule: LessonModule = {
  id: "demo-pizza-fractions",
  title: "Fractions: The Great Pizza Share",
  headline: "The Great Pizza Share 🍕",
  subheadline: "Fractions are just fair shares — let's prove it, slice by slice.",
  grade: "Grade 4",
  subject: "Mathematics",
  durationMinutes: 40,
  timeNote: "Fits ~38 of 40 min",
  blocks: [
    {
      id: "hook-pizza-heist",
      kind: "hook",
      title: "The Pizza Problem",
      summary: "A real-world reason to split things fairly.",
      instruction: "Four friends. One pizza. Nobody wants to be the person who got the smallest slice. How do we make it **fair**?",
      body: [
        "Imagine you and three friends order one big pizza after a long day. You are starving. So is everyone else. If you just start grabbing slices, someone ends up with a sliver and someone ends up with half the pie — and friendships end over pizza.",
        "A fraction is the tool that keeps the peace. It is a promise that every share is exactly equal. Today we'll turn \"that's not fair!\" into math you can actually see.",
      ],
    },
    {
      id: "concept-fraction-family",
      kind: "concept",
      title: "Meet the Numerator & Denominator",
      summary: "The two numbers and what each one does.",
      instruction: "Every fraction is two numbers doing two jobs.",
      body: [
        "The **bottom number (denominator)** tells you how many equal pieces the whole was cut into. Cut the pizza into 4 equal slices, and the bottom number is 4.",
        "The **top number (numerator)** tells you how many of those pieces you actually took. Grab 3 of the 4 slices and you have 3/4 of the pizza.",
        "So 3/4 literally reads as: \"3 pieces out of 4 equal pieces.\" Same whole, different amount — just change the top number.",
      ],
    },
    {
      id: "flow-share-fairly",
      kind: "interactive",
      title: "How to Share Anything Fairly",
      summary: "A 4-step recipe for equal shares.",
      instruction: "Follow the steps in order — tap each one as you go.",
      figure: {
        kind: "flow",
        steps: [
          { title: "Count the sharers", text: "How many people (or groups) need a share? That count becomes your denominator." },
          { title: "Cut equal pieces", text: "Split the whole into that many equal pieces. Equal is the whole point — no cheating with a bigger slice." },
          { title: "Hand them out", text: "Give one piece to each sharer. Every person now holds 1 out of the total — a unit fraction." },
          { title: "Name the share", text: "Write it as a fraction: pieces you have on top, total pieces on the bottom. Done — that's a fair share." },
        ],
      },
    },
    {
      id: "interactive-number-line",
      kind: "interactive",
      title: "Walk the Fraction Line",
      summary: "Place quarters between 0 and 1.",
      instruction: "Between 0 (no pizza) and 1 (whole pizza), where does each quarter land? Tap a mark to place it.",
      figure: {
        kind: "number_line",
        min: 0,
        max: 1,
        step: 0.25,
        question: "Where does each fraction sit between 0 and 1?",
        marks: [
          { value: 0.25, label: "1/4" },
          { value: 0.5, label: "1/2" },
          { value: 0.75, label: "3/4" },
        ],
      },
    },
    {
      id: "interactive-equivalent-bars",
      kind: "interactive",
      title: "Same Size, Different Name",
      summary: "Why 1/2, 2/4 and 3/6 are the same amount.",
      instruction: "Look at how much of each bar is filled. Different numbers — but is it the same amount of pizza?",
      figure: {
        kind: "bars",
        items: [
          { label: "One half", numerator: 1, denominator: 2 },
          { label: "Two quarters", numerator: 2, denominator: 4 },
          { label: "Three sixths", numerator: 3, denominator: 6 },
        ],
        caption: "All three bars fill the same length — these are equivalent fractions.",
      },
    },
    {
      id: "assessment-pop-quiz",
      kind: "assessment",
      title: "Pizza Pop Quiz",
      summary: "One question, tap to answer.",
      instruction: "You've earned a challenge. Pick the best answer.",
      figure: {
        kind: "mcq",
        question: "You cut a pizza into 8 equal slices and eat 2. How much of the pizza is left?",
        options: ["2/8", "6/8", "8/6", "2/6"],
        answerIndex: 1,
        explanation: "8 slices total, 2 eaten, so 6 remain — that's 6 out of 8, or 6/8 (which also simplifies to 3/4).",
      },
    },
    {
      id: "assessment-exit-ticket",
      kind: "assessment",
      title: "Exit Ticket",
      summary: "Check what stuck before you go.",
      instruction: "Tick each one you can do now.",
      figure: {
        kind: "checklist",
        title: "I can…",
        items: [
          "Explain what the denominator tells me about a whole",
          "Explain what the numerator counts",
          "Place 1/4, 1/2 and 3/4 on a number line",
          "Give two fractions that mean the same amount",
          "Write a fair share as a fraction",
        ],
      },
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
