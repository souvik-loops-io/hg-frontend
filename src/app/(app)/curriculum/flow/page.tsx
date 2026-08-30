import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LiveWorkspace } from "@/components/planner/live-workspace";
import { fetchLessonModule } from "@/lib/api/engine";

export const metadata: Metadata = { title: "Lesson Flow" };

/**
 * The lesson editor.
 *
 * Requires `?lesson=<id>` (set by Build). We load that real engine lesson
 * server-side and hand it to the engine-backed LiveWorkspace. No fixture
 * fallback — without an id we send the teacher to build one, and if the lesson
 * can't be loaded we say so plainly rather than showing unrelated demo content.
 */
export default async function LessonFlowPage({
  searchParams,
}: {
  searchParams: Promise<{ lesson?: string }>;
}) {
  const { lesson } = await searchParams;
  if (!lesson) redirect("/curriculum");

  let mod = null;
  try {
    mod = await fetchLessonModule(lesson);
  } catch {
    mod = null;
  }

  if (!mod) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center text-ink-soft">
        <h1 className="text-2xl font-bold tracking-[-0.03em] text-ink">Couldn&apos;t load this lesson</h1>
        <p className="max-w-md">
          The lesson engine didn&apos;t return <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">{lesson}</code>. Make sure the engine is running, then build a lesson.
        </p>
        <Link href="/curriculum" className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-bold text-paper transition hover:bg-brand-700">
          Build a lesson
        </Link>
      </main>
    );
  }

  return <LiveWorkspace module={mod} />;
}
