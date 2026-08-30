import type { Metadata } from "next";
import { Page } from "@/components/shell/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { ReservedPanel } from "@/components/ui/reserved-panel";

export const metadata: Metadata = { title: "Analytics" };

export default function AnalyticsPage() {
  return (
    <Page>
      <PageHeader
        title="Analytics."
        subtitle="How the class actually did, block by block."
      />
      <ReservedPanel
        title="Engagement &amp; results"
        description="Live quick-check results and time-on-block, so you can see which segment needs a second pass before you teach it again."
        dependsOn="NEXT_PUBLIC_API_URL"
      />
    </Page>
  );
}
