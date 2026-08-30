import type { Metadata } from "next";
import { Page } from "@/components/shell/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { ReservedPanel } from "@/components/ui/reserved-panel";

export const metadata: Metadata = { title: "Resources" };

export default function ResourcesPage() {
  return (
    <Page>
      <PageHeader
        title="Resources."
        subtitle="Everything attached to this module, collected into one list."
      />
      <ReservedPanel
        title="Attached materials"
        description="Printables, manipulatives and links per block, gathered so you can send them home or hand them to a cover teacher."
        dependsOn="NEXT_PUBLIC_API_URL"
      />
    </Page>
  );
}
