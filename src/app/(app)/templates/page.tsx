import type { Metadata } from "next";
import { Page } from "@/components/shell/app-shell";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { listTemplates } from "@/lib/api/client";

export const metadata: Metadata = { title: "Templates" };

export default async function TemplatesPage() {
  const templates = await listTemplates();

  return (
    <Page>
      <PageHeader
        title="Templates."
        subtitle="Pedagogical shapes to start from. Each one fixes the sequence and leaves the content to you."
      />
      <ul className="space-y-3">
        {templates.map((template) => (
          <li
            key={template.id}
            className="flex flex-col gap-3 rounded-panel bg-paper p-5 shadow-card transition-shadow hover:shadow-lift sm:flex-row sm:items-center sm:justify-between sm:gap-6"
          >
            <div className="min-w-0">
              <h3 className="font-bold tracking-[-0.015em]">{template.name}</h3>
              <p className="mt-1.5 text-[0.875rem] leading-relaxed text-ink-soft">
                {template.summary}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <Badge tone="sky">{template.subject}</Badge>
              <Badge>{template.segments} segments</Badge>
            </div>
          </li>
        ))}
      </ul>
    </Page>
  );
}
