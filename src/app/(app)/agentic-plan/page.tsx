import type { Metadata } from "next";
import { Page } from "@/components/shell/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { ReservedPanel } from "@/components/ui/reserved-panel";

export const metadata: Metadata = { title: "Agentic Plan" };

export default function AgenticPlanPage() {
  return (
    <Page>
      <PageHeader
        title="Agentic plan."
        subtitle="What the assistant is allowed to change on its own, and where it must ask you first."
      />
      <ReservedPanel
        title="Plan &amp; permissions"
        description="The stage sequence the assistant follows when it fills or revises this module, plus the guardrails on each stage."
        dependsOn="NEXT_PUBLIC_AI_URL"
      />
    </Page>
  );
}
