import type { Metadata } from "next";
import { FoundationForm } from "@/components/planner/foundation-form";
import { MaterialDropzone } from "@/components/planner/material-dropzone";
import {
  DiscoveryTipCard,
  RecentTopicsCard,
} from "@/components/planner/setup-rail";
import { Page } from "@/components/shell/app-shell";
import { getSetupData } from "@/lib/api/client";

export const metadata: Metadata = { title: "Setup & Planning" };

export default async function SetupPage() {
  const { defaults, options, tip, recentTopics } = await getSetupData();

  return (
    <Page>
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-[-0.035em] sm:text-4xl lg:text-5xl">
          Setup &amp; Planning
        </h1>
        <p className="mt-3 text-base text-ink-soft">
          Let&apos;s build a welcoming foundation for your next discovery.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)] lg:items-start">
        <div className="space-y-6">
          <FoundationForm defaults={defaults} options={options}>
            <MaterialDropzone />
          </FoundationForm>
        </div>

        <div className="space-y-6">
          <DiscoveryTipCard tip={tip} />
          <RecentTopicsCard topics={recentTopics} />
        </div>
      </div>
    </Page>
  );
}
