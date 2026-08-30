import type { Metadata } from "next";
import { FlowWorkspace } from "@/components/planner/flow-workspace";
import { getLessonModule } from "@/lib/api/client";

export const metadata: Metadata = { title: "Lesson Flow" };

export default async function LessonFlowPage() {
  const lessonModule = await getLessonModule();
  return <FlowWorkspace module={lessonModule} />;
}
