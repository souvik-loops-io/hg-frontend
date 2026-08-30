import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import type { WeeklyFocus } from "@/lib/types";

export function WeeklyFocusCard({ focus }: { focus: WeeklyFocus }) {
  return (
    <article className="relative overflow-hidden rounded-panel bg-paper p-6 shadow-card sm:p-8">
      {/* A soft wash from the top-right corner, behind the content. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full bg-gradient-to-br from-sky-50 to-leaf-50"
      />

      <div className="relative">
        <Badge tone="leaf" caps>
          {focus.eyebrow}
        </Badge>

        <h2 className="mt-4 text-2xl font-bold leading-tight tracking-[-0.03em] text-balance sm:text-3xl">
          {focus.title}
        </h2>
        <p className="mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-ink-soft">
          {focus.body}
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <ButtonLink href="/analytics" variant="brand">
            View Analytics
          </ButtonLink>
          <ButtonLink href="/curriculum/flow" variant="soft">
            Modify Module
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
