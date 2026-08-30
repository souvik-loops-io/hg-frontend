import type { Metadata } from "next";
import { LessonPreview } from "@/components/student/lesson-preview";
import { getLessonModule } from "@/lib/api/client";

export const metadata: Metadata = {
  title: "Student Preview",
  description: "A student-facing CuePilot lesson preview.",
};

export default async function PreviewPage() {
  const module = await getLessonModule();
  return <LessonPreview module={module} />;
}
