import type { Metadata } from "next";
import { Page } from "@/components/shell/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { ReservedPanel } from "@/components/ui/reserved-panel";

export const metadata: Metadata = { title: "Objectives" };

export default function ObjectivesPage() {
  return (
    <Page>
      <PageHeader
        title="Objectives."
        subtitle="The outcomes this module claims to move, in student-facing language."
      />
      <ReservedPanel
        title="Objective mapping"
        description="Each objective linked to the blocks that teach it and the standards it satisfies, so you can see at a glance what the lesson does not yet cover."
        dependsOn="NEXT_PUBLIC_API_URL"
      />
    </Page>
  );
}
