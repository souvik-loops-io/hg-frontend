import type { Deck, School } from "@/lib/deck-types";

/**
 * Sample presentations.
 *
 * Hard-coded so the preview can be seen end to end. When the content service
 * lands these come from `NEXT_PUBLIC_API_URL` and the section list is generated
 * from the module's blocks — the shapes here are the contract for that.
 */

export const school: School = {
  name: "Khaitan World School",
  tagline: "Be more. Be better.",
  markTop: "Khaitan",
  markBottom: "World School",
};

const temperature: Deck = {
  id: "measuring-temperature",
  subject: "Science",
  grade: 6,
  title: "Measuring Temperature with Precision",
  illustration: "thermometer",
  sections: [
    {
      id: "cover",
      kind: "cover",
      navLabel: "Cover",
      unitTitle: "Heat and its Measurement",
      lessonLabel: "Lesson 1",
      lessonTitle: {
        lead: "Measuring Temperature with ",
        accent: "Precision",
      },
      illustration: "thermometer",
    },
    {
      id: "contents",
      kind: "contents",
      navLabel: "Lesson flow",
      eyebrow: "Lesson flow & lesson legends",
      title: { lead: "Lesson ", accent: "Flow" },
      items: [
        { n: "01", label: "Class Agreements" },
        { n: "02", label: "Unit & Lesson Title" },
        { n: "03", label: "Lesson Anchors" },
        { n: "04", label: "Lesson Outcomes" },
        { n: "05", label: "Starter — The Wrong Reading" },
        { n: "06", label: "Taking Precautions" },
        { n: "07", label: "Quick Check" },
        { n: "08", label: "Wrap Up" },
      ],
    },
    {
      id: "agreements",
      kind: "concept",
      navLabel: "Class agreements",
      eyebrow: "01 · Class agreements",
      title: { lead: "How we work ", accent: "together" },
      body: "Before we touch any equipment, we agree on how this room runs. These four hold for every practical this term.",
      points: [
        "Hands off the apparatus until the instruction is given.",
        "One voice at a time — everyone hears the reading.",
        "Record what you actually see, not what you expected.",
        "A wrong reading is data. Say it out loud.",
      ],
    },
    {
      id: "starter",
      kind: "concept",
      navLabel: "The starter",
      eyebrow: "05 · Starter",
      title: { lead: "Two students, one beaker, ", accent: "two answers" },
      body: "Aarav reads 62 °C. Meera reads 58 °C. Same water, same thermometer, same minute. Only one of them can be right — and the difference is not the thermometer.",
      points: [
        "What could each of them have done differently?",
        "Which reading would you trust, and why?",
      ],
      illustration: "beaker-read",
    },
    {
      id: "precautions",
      kind: "rules",
      navLabel: "Precautions",
      title: {
        lead: "Taking ",
        accent: "precautions",
        tail: " when measuring temperature",
      },
      intro: "4 rules for measuring temperature with a laboratory thermometer:",
      hint: "Tap a rule to see what breaking it looks like.",
      rules: [
        {
          n: 1,
          text: "Bulb fully immersed, not touching the bottom or sides.",
          broken: "Bulb resting on the glass — you read the beaker, not the water.",
          illustration: "beaker-correct",
        },
        {
          n: 2,
          text: "Hold the thermometer vertical. Do not tilt it.",
          broken: "Tilted, so the column reads short against the scale.",
          illustration: "beaker-vertical",
        },
        {
          n: 3,
          text: "Read it while it is still immersed in the liquid.",
          broken: "Lifted out — the liquid starts cooling the instant it leaves.",
          illustration: "beaker-read",
        },
        {
          n: 4,
          text: "Keep your eye in line with the top of the liquid column.",
          broken: "Eye above or below the column — parallax shifts the value.",
          illustration: "thermometer-eye",
        },
      ],
      callout:
        "Break any rule → a wrong reading, exactly what happened in the starter.",
      calloutAction: "Back to the starter",
    },
    {
      id: "quick-check",
      kind: "checkpoint",
      navLabel: "Quick check",
      eyebrow: "07 · Quick check",
      title: { lead: "Which one is ", accent: "wrong" },
      prompt:
        "A student holds the thermometer at an angle and reads it after lifting it clear of the water. Which rule have they broken?",
      options: [
        { id: "a", label: "Rule 1 only" },
        { id: "b", label: "Rules 2 and 3", correct: true },
        { id: "c", label: "Rule 4 only" },
        { id: "d", label: "None — the reading is fine" },
      ],
    },
    {
      id: "wrap-up",
      kind: "close",
      navLabel: "Wrap up",
      eyebrow: "08 · Wrap up",
      title: { lead: "Say it in your own ", accent: "words" },
      body: "Finish this sentence on a sticky note before you leave: \"A reading I can trust is one where…\". We will read three of them at the start of tomorrow's lesson.",
    },
  ],
};

const numbers: Deck = {
  id: "building-numbers",
  subject: "Mathematics",
  grade: 3,
  title: "Building Numbers up to 100",
  illustration: "bundle",
  sections: [
    {
      id: "cover",
      kind: "cover",
      navLabel: "Cover",
      unitTitle: "Place Value and Number Sense",
      lessonLabel: "Lesson 1",
      lessonTitle: { lead: "Building Numbers up to ", accent: "100" },
      illustration: "bundle",
    },
    {
      id: "contents",
      kind: "contents",
      navLabel: "Lesson flow",
      eyebrow: "Lesson flow & lesson legends",
      title: { lead: "Lesson ", accent: "Flow" },
      items: [
        { n: "01", label: "Class Agreements" },
        { n: "02", label: "Unit & Lesson Title" },
        { n: "03", label: "Bundles of Ten" },
        { n: "04", label: "Loose Ones" },
        { n: "05", label: "Quick Check" },
        { n: "06", label: "Wrap Up" },
      ],
    },
    {
      id: "bundles",
      kind: "concept",
      navLabel: "Bundles of ten",
      eyebrow: "03 · Bundles of ten",
      title: { lead: "Ten sticks, one ", accent: "bundle" },
      body: "Count out ten sticks and tie them. That bundle is now a single thing you can count — one ten. Seven bundles and four loose sticks is seventy-four.",
      points: [
        "How many bundles can you make from 46 sticks?",
        "What is left over, and what do we call it?",
      ],
      illustration: "bundle",
    },
    {
      id: "quick-check",
      kind: "checkpoint",
      navLabel: "Quick check",
      eyebrow: "05 · Quick check",
      title: { lead: "How many ", accent: "bundles" },
      prompt: "You have 68 sticks. How many complete bundles of ten can you tie?",
      options: [
        { id: "a", label: "6 bundles and 8 loose", correct: true },
        { id: "b", label: "8 bundles and 6 loose" },
        { id: "c", label: "68 bundles" },
        { id: "d", label: "7 bundles and 2 loose" },
      ],
    },
    {
      id: "wrap-up",
      kind: "close",
      navLabel: "Wrap up",
      eyebrow: "06 · Wrap up",
      title: { lead: "Show me ", accent: "fifty-three" },
      body: "On your whiteboard, draw the bundles and the loose ones for fifty-three. Hold it up when you are ready.",
    },
  ],
};

const plants: Deck = {
  id: "which-part-of-the-plant",
  subject: "The World Around Us",
  grade: 3,
  title: "Which Part of the Plant Are We Eating?",
  illustration: "plant",
  sections: [
    {
      id: "cover",
      kind: "cover",
      navLabel: "Cover",
      unitTitle: "Plants and What They Give Us",
      lessonLabel: "Lesson 1",
      lessonTitle: {
        lead: "Which Part of the Plant Are We ",
        accent: "Eating",
        tail: "?",
      },
      illustration: "plant",
    },
    {
      id: "contents",
      kind: "contents",
      navLabel: "Lesson flow",
      eyebrow: "Lesson flow & lesson legends",
      title: { lead: "Lesson ", accent: "Flow" },
      items: [
        { n: "01", label: "Class Agreements" },
        { n: "02", label: "Unit & Lesson Title" },
        { n: "03", label: "Parts of a Plant" },
        { n: "04", label: "Sorting Our Lunch" },
        { n: "05", label: "Quick Check" },
        { n: "06", label: "Wrap Up" },
      ],
    },
    {
      id: "parts",
      kind: "concept",
      navLabel: "Parts of a plant",
      eyebrow: "03 · Parts of a plant",
      title: { lead: "Root, stem, leaf, flower, ", accent: "fruit" },
      body: "Every plant on your plate is one of these five parts. A carrot is a root. A potato is a stem. Spinach is a leaf. Broccoli is a flower. A tomato is a fruit.",
      points: [
        "Which part of the plant is a tomato — and how do you know?",
        "Name one thing you ate yesterday that was a leaf.",
      ],
      illustration: "plant",
    },
    {
      id: "quick-check",
      kind: "checkpoint",
      navLabel: "Quick check",
      eyebrow: "05 · Quick check",
      title: { lead: "Which part is a ", accent: "potato" },
      prompt: "A potato grows underground. Which part of the plant is it?",
      options: [
        { id: "a", label: "A root" },
        { id: "b", label: "A stem", correct: true },
        { id: "c", label: "A fruit" },
        { id: "d", label: "A seed" },
      ],
    },
    {
      id: "wrap-up",
      kind: "close",
      navLabel: "Wrap up",
      eyebrow: "06 · Wrap up",
      title: { lead: "Sort tomorrow's ", accent: "lunchbox" },
      body: "Bring in one plant food from home. We will sort the whole class's lunch into the five parts on the board.",
    },
  ],
};

export const decks: Deck[] = [temperature, numbers, plants];

export function getDeck(id: string): Deck | null {
  return decks.find((deck) => deck.id === id) ?? null;
}
