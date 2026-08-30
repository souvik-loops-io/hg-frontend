import Link from "next/link";
import { ArtifactCard } from "@/components/dashboard/artifact-card";
import { CreateArtifactCard } from "@/components/dashboard/create-artifact-card";
import { SampleLessonCard } from "@/components/dashboard/sample-lesson-card";
import { StudentAnalytics } from "@/components/dashboard/student-analytics";
import { WeeklyFocusCard } from "@/components/dashboard/weekly-focus-card";
import { ArrowRightIcon } from "@/components/icons";
import { Page } from "@/components/shell/app-shell";
import { listArtifacts, getWeeklyFocus } from "@/lib/api/client";
import { teacher } from "@/lib/data/fixtures";
import { greetingForHour } from "@/lib/relative-time";

/** Fixtures use relative timestamps, so this page is always rendered fresh. */
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [artifacts, focus] = await Promise.all([
    listArtifacts(),
    getWeeklyFocus(),
  ]);

  // Resolved once on the server and threaded down, so every relative timestamp
  // on the page is measured against the same instant.
  const now = Date.now();
  const greeting = greetingForHour(new Date(now).getHours());

  return (
    <Page>
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-[-0.035em] text-balance sm:text-4xl lg:text-5xl">
          {greeting}, {teacher.firstName}{" "}
          <span role="img" aria-label="waving hand">
            👋
          </span>
        </h1>
        <p className="mt-3 text-base text-ink-soft">
          Here is an overview of your recent educational artifacts.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <WeeklyFocusCard focus={focus} />
        <div className="flex flex-col gap-4">
          <CreateArtifactCard />
          <SampleLessonCard />
        </div>
      </div>

      <section className="mt-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-[-0.03em] sm:text-3xl">
            Recent Artifacts
          </h2>
          <Link
            href="/library"
            className="inline-flex shrink-0 items-center gap-1.5 text-[0.9375rem] font-semibold text-brand-600 transition-colors hover:text-brand-700"
          >
            View All
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {artifacts.slice(0, 3).map((artifact) => (
            <ArtifactCard key={artifact.id} artifact={artifact} now={now} />
          ))}
        </div>
      </section>

      <StudentAnalytics />
    </Page>
  );
}
