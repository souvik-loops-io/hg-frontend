import type { Metadata } from "next";
import { FlowWorkspace } from "@/components/planner/flow-workspace";
import { LiveWorkspace } from "@/components/planner/live-workspace";
import { getLessonModule } from "@/lib/api/client";
import { fetchLessonModule } from "@/lib/api/engine";

export const metadata: Metadata = { title: "Lesson Flow" };

/**
 * The lesson editor.
 *
 * With `?lesson=<id>` (set by the Setup screen after a run) we load that real
 * engine lesson server-side — no CORS, and the whole `LessonModule` is fetched
 * in one round trip — and hand it to the engine-backed `LiveWorkspace`. Without
 * an id, or if the engine is unreachable, we fall back to the fixture module so
 * the screen is never a dead end.
 */
export default async function LessonFlowPage({
  searchParams,
}: {
  searchParams: Promise<{ lesson?: string }>;
}) {
  const { lesson } = await searchParams;

  if (lesson) {
    try {
      const module = await fetchLessonModule(lesson);
      if (module) return <LiveWorkspace module={module} />;
    } catch {
      // Engine unreachable — fall through to the fixture rather than erroring.
    }
  }

  const lessonModule = await getLessonModule();
  return <FlowWorkspace module={lessonModule} />;
}
