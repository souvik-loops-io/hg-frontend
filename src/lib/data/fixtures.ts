import type {
  Artifact,
  BlockFamily,
  DiscoveryTip,
  FoundationDetails,
  FoundationOptions,
  Template,
  WeeklyFocus,
} from "@/lib/types";

/** Hours ago, as an ISO string — keeps fixtures readable and always "recent". */
function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

/* -------------------------------------------------------------------------
   Teacher
   ------------------------------------------------------------------------- */

export const teacher = {
  firstName: "Sarah",
  fullName: "Sarah Mitchell",
  initials: "SM",
  role: "Lesson Planner",
  context: "Grade 4 Mathematics",
} as const;

/* -------------------------------------------------------------------------
   Dashboard
   ------------------------------------------------------------------------- */

export const weeklyFocus: WeeklyFocus = {
  eyebrow: "Weekly focus",
  title: "Fraction Mastery engagement is up 24%",
  body: "Your Grade 6 students are progressing rapidly through the interactive visual models. Consider advancing to mixed numbers next week.",
};

export const artifacts: Artifact[] = [
  {
    id: "fraction-mastery",
    title: "Fraction Mastery",
    subject: "Math",
    grade: 6,
    icon: "calculator",
    state: "progress",
    progress: 75,
    updatedAt: hoursAgo(2),
  },
  {
    id: "plant-life-cycles",
    title: "Plant Life Cycles",
    subject: "Science",
    grade: 4,
    icon: "leaf",
    state: "complete",
    progress: 100,
    updatedAt: hoursAgo(26),
  },
  {
    id: "intro-to-algebra",
    title: "Intro to Algebra",
    subject: "Math",
    grade: 7,
    icon: "sigma",
    state: "draft",
    progress: 15,
    updatedAt: hoursAgo(72),
  },
  {
    id: "phoneme-segmentation",
    title: "Phoneme Segmentation",
    subject: "Literacy",
    grade: 1,
    icon: "book",
    state: "progress",
    progress: 48,
    updatedAt: hoursAgo(96),
  },
  {
    id: "climate-graphs",
    title: "Reading Climate Graphs",
    subject: "Geography",
    grade: 8,
    icon: "leaf",
    state: "draft",
    progress: 8,
    updatedAt: hoursAgo(170),
  },
  {
    id: "number-line-integers",
    title: "Integers on the Number Line",
    subject: "Math",
    grade: 6,
    icon: "calculator",
    state: "complete",
    progress: 100,
    updatedAt: hoursAgo(340),
  },
];

/* -------------------------------------------------------------------------
   Setup & Planning
   ------------------------------------------------------------------------- */

export const foundationDefaults: FoundationDetails = {
  gradeLevel: "grade-4",
  subject: "mathematics",
  topicFocus: "Introduction to Fractions",
  framework: "ccss",
  difficulty: 3,
  durationMinutes: 45,
};

export const foundationOptions: FoundationOptions = {
  gradeLevels: [
    { value: "grade-1", label: "Grade 1" },
    { value: "grade-2", label: "Grade 2" },
    { value: "grade-3", label: "Grade 3" },
    { value: "grade-4", label: "Grade 4" },
    { value: "grade-5", label: "Grade 5" },
    { value: "grade-6", label: "Grade 6" },
    { value: "grade-7", label: "Grade 7" },
    { value: "grade-8", label: "Grade 8" },
  ],
  subjects: [
    { value: "mathematics", label: "Mathematics" },
    { value: "science", label: "Science" },
    { value: "literacy", label: "Literacy" },
    { value: "geography", label: "Geography" },
  ],
  frameworks: [
    { value: "ccss", label: "Common Core State Standards (CCSS)" },
    { value: "ncert", label: "CBSE / NCERT" },
    { value: "national-curriculum", label: "National Curriculum (England)" },
    { value: "ib-pyp", label: "IB Primary Years Programme" },
  ],
};

export const discoveryTip: DiscoveryTip = {
  title: "Discovery Tip",
  body: "For Grade 4 mathematics, consider incorporating visual fraction models early in the flow. Tangible examples help students transition from concrete reasoning to abstract problem-solving in a low-pressure way.",
};

export const recentTopics: string[] = [
  "Long Division",
  "Geometry Basics",
  "Word Problems",
];

/* -------------------------------------------------------------------------
   Library
   ------------------------------------------------------------------------- */

export const blockFamilies: BlockFamily[] = [
  {
    id: "smart-charts",
    name: "Smart Charts",
    category: "presentation",
    specimenCount: 48,
    summary: "Data displays that stay legible when projected at the back of a room.",
  },
  {
    id: "smart-diagrams",
    name: "Smart Diagrams",
    category: "presentation",
    specimenCount: 61,
    summary: "Process, cycle and part–whole diagrams with labelled call-outs.",
  },
  {
    id: "layouts",
    name: "Layouts",
    category: "presentation",
    specimenCount: 44,
    summary: "Slide skeletons — title, split, gallery, worked-example frames.",
  },
  {
    id: "infographics",
    name: "Infographics",
    category: "presentation",
    specimenCount: 37,
    summary: "Dense summary panels for revision and knowledge organisers.",
  },
  {
    id: "math-representations",
    name: "Mathematics",
    category: "representation",
    specimenCount: 139,
    summary: "Base-ten blocks, number lines, area models, bar models, arrays.",
  },
  {
    id: "literacy-representations",
    name: "Literacy",
    category: "representation",
    specimenCount: 103,
    summary: "Elkonin boxes, morphology webs, story maps, syntax ladders.",
  },
  {
    id: "interactive-math",
    name: "Interactive Math",
    category: "representation",
    specimenCount: 26,
    summary: "Manipulables students drag, partition and recombine live.",
  },
  {
    id: "science-geography",
    name: "Science & Geography",
    category: "representation",
    specimenCount: 46,
    summary: "Climate graphs, food webs, particle models, cross-sections.",
  },
];

export const templates: Template[] = [
  {
    id: "concept-launch",
    name: "Concept Launch",
    summary: "Hook, worked example, guided practice, exit ticket.",
    segments: 4,
    subject: "Any",
  },
  {
    id: "cpa-sequence",
    name: "Concrete → Pictorial → Abstract",
    summary: "Three-phase sequence that fades the manipulative deliberately.",
    segments: 6,
    subject: "Math",
  },
  {
    id: "inquiry-cycle",
    name: "Inquiry Cycle",
    summary: "Notice, wonder, investigate, explain, apply.",
    segments: 5,
    subject: "Science",
  },
  {
    id: "close-reading",
    name: "Close Reading",
    summary: "First read for gist, second for structure, third for author craft.",
    segments: 3,
    subject: "Literacy",
  },
  {
    id: "retrieval-deck",
    name: "Retrieval Deck",
    summary: "Spaced low-stakes recall pack with interleaved prior units.",
    segments: 8,
    subject: "Any",
  },
  {
    id: "misconception-clinic",
    name: "Misconception Clinic",
    summary: "Diagnostic item, discussion prompt, targeted re-teach.",
    segments: 4,
    subject: "Any",
  },
];
