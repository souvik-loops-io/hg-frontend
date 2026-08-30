import type { Metadata } from "next";
import { Page } from "@/components/shell/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { listBlockFamilies } from "@/lib/api/client";
import type { BlockFamily } from "@/lib/types";

export const metadata: Metadata = { title: "Library" };

function FamilyCard({ family }: { family: BlockFamily }) {
  return (
    <article className="flex flex-col rounded-panel bg-paper p-5 shadow-card transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-bold tracking-[-0.02em]">{family.name}</h3>
        <span className="shrink-0 rounded-field bg-surface px-2.5 py-1 text-[0.75rem] font-semibold text-ink-soft">
          {family.specimenCount}
        </span>
      </div>
      <p className="mt-3 text-[0.875rem] leading-relaxed text-ink-soft">
        {family.summary}
      </p>
    </article>
  );
}

function Section({ label, families }: { label: string; families: BlockFamily[] }) {
  const total = families.reduce((sum, family) => sum + family.specimenCount, 0);

  return (
    <section className="mt-10 first:mt-0">
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <h2 className="text-xl font-bold tracking-[-0.025em]">{label}</h2>
        <span className="label-caps">{total} specimens</span>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {families.map((family) => (
          <FamilyCard key={family.id} family={family} />
        ))}
      </div>
    </section>
  );
}

export default async function LibraryPage() {
  const families = await listBlockFamilies();

  return (
    <Page>
      <PageHeader
        title="Building blocks."
        subtitle="Every block we build with — presentation structures on one side, subject-specific teaching representations on the other."
      />
      <Section
        label="Presentation Blocks"
        families={families.filter((family) => family.category === "presentation")}
      />
      <Section
        label="Teaching Representations"
        families={families.filter((family) => family.category === "representation")}
      />
    </Page>
  );
}
