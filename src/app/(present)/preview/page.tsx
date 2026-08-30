import type { Metadata } from "next";
import Link from "next/link";
import { LessonPreview } from "@/components/student/lesson-preview";
import { lessonModule, tectonicModule } from "@/lib/data/lesson";
import { fetchLessonModule } from "@/lib/api/engine";

export const metadata: Metadata = {
  title: "Student Preview",
  description: "A student-facing Chalk lesson preview.",
};

/**
 * The student-facing preview.
 *
 * With `?lesson=<id>` (set by Build) we load that real lesson from the engine.
 * With no id — e.g. the dashboard "View sample lesson" card — we render the
 * hardcoded demo module ("The Pizza Problem") so there is always something to
 * preview, engine or not.
 */
export default async function PreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ lesson?: string; sample?: string }>;
}) {
  const { lesson, sample } = await searchParams;

  // No id (e.g. the dashboard "View sample lesson" cards) → show a hardcoded
  // sample. Default is Tectonic Plates; `?sample=pizza` picks the fractions
  // lesson. Always renders, no engine needed.
  if (!lesson) {
    const demo = sample === "pizza" ? lessonModule : tectonicModule;
    return <LessonPreview module={demo} />;
  }

  let mod = null;
  try {
    mod = await fetchLessonModule(lesson);
  } catch {
    mod = null;
  }

  if (!mod) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-[#f6fbfa] px-6 text-center text-slate-700">
        <h1 className="text-2xl font-bold tracking-[-0.03em] text-slate-900">Couldn&apos;t load this lesson</h1>
        <p className="max-w-md text-slate-600">
          The lesson engine didn&apos;t return <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">{lesson}</code>. Make sure the engine is running, then build a lesson.
        </p>
        <Link href="/curriculum" className="rounded-full bg-teal-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-teal-800">
          Build a lesson
        </Link>
      </main>
    );
  }

  return <LessonPreview module={mod} />;
}
