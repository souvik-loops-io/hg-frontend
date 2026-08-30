import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { artifactIcons } from "@/components/icons";
import { Page } from "@/components/shell/app-shell";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { ReservedPanel } from "@/components/ui/reserved-panel";
import { getArtifact } from "@/lib/api/client";
import { formatUpdatedAt } from "@/lib/relative-time";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const artifact = await getArtifact(id);
  return { title: artifact?.title ?? "Artifact" };
}

export default async function ArtifactPage({ params }: PageProps) {
  const { id } = await params;
  const artifact = await getArtifact(id);

  if (!artifact) notFound();

  const Mark = artifactIcons[artifact.icon];

  return (
    <Page>
      <div className="mb-6 flex size-14 items-center justify-center rounded-full bg-sky-300 text-brand-700">
        <Mark className="size-6" />
      </div>

      <PageHeader title={artifact.title} />

      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="sky">{artifact.subject}</Badge>
        <Badge>Gr {artifact.grade}</Badge>
        <Badge tone={artifact.state === "complete" ? "leaf" : "sun"}>
          {artifact.state === "complete"
            ? "Complete"
            : artifact.state === "draft"
              ? "Draft"
              : `${artifact.progress}% complete`}
        </Badge>
        <span className="text-[0.875rem] text-ink-muted">
          {formatUpdatedAt(artifact.updatedAt, Date.now())}
        </span>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/curriculum/flow" variant="brand">
          Open in Lesson Flow
        </ButtonLink>
        <ButtonLink href="/curriculum" variant="soft">
          Edit foundation
        </ButtonLink>
      </div>

      <ReservedPanel
        className="mt-10"
        title="Artifact history"
        description="Every revision, who made it, and which pipeline run produced it — so you can roll a block back to the version that worked."
        dependsOn="NEXT_PUBLIC_API_URL"
      />
    </Page>
  );
}
