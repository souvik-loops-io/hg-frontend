import type { Metadata } from "next";
import { LessonPreview } from "@/components/student/lesson-preview";
import { getLessonModule } from "@/lib/api/client";
import { fetchLessonModule } from "@/lib/api/engine";

export const metadata: Metadata = {
  title: "Student Preview",
  description: "A student-facing CuePilot lesson preview.",
};

/**
 * The student-facing preview.
 *
 * With `?lesson=<id>` (set by the Preview button in the editor) we load that
 * real engine lesson server-side and show it exactly as a student would. Without
 * an id — or if the engine is unreachable — we fall back to the hand-authored
 * demo module so the preview is never empty.
 */
export default async function PreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ lesson?: string }>;
}) {
  const { lesson } = await searchParams;

  if (lesson) {
    try {
      const mod = await fetchLessonModule(lesson);
      if (mod) return <LessonPreview module={mod} />;
    } catch {
      // Engine unreachable — fall through to the demo module.
    }
  }

  const mod = await getLessonModule();
  return <LessonPreview module={mod} />;
}
