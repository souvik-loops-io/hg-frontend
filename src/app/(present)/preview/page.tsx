import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LessonPreview } from "@/components/student/lesson-preview";
import { fetchLessonModule } from "@/lib/api/engine";

export const metadata: Metadata = {
  title: "Student Preview",
  description: "A student-facing Chalk lesson preview.",
};

/**
 * The student-facing preview of a real, engine-generated lesson.
 *
 * Requires `?lesson=<id>` (set by Build). We load that lesson from the engine
 * and render it. No fixture fallback — if there's no id we send the teacher to
 * build one, and if the lesson can't be loaded we say so plainly rather than
 * showing unrelated demo content.
 */
export default async function PreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ lesson?: string }>;
}) {
  const { lesson } = await searchParams;
  if (!lesson) redirect("/curriculum");

  let module = null;
  try {
    module = await fetchLessonModule(lesson);
  } catch {
    module = null;
  }

  if (!module) {
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

  return <LessonPreview module={module} />;
}
