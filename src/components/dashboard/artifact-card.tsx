import Link from "next/link";
import { artifactIcons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { formatUpdatedAt } from "@/lib/relative-time";
import { cn } from "@/lib/cn";
import type { Artifact, ArtifactIcon } from "@/lib/types";

/** Each mark gets its own fill, so a card is recognisable before it is read. */
const markStyles: Record<ArtifactIcon, string> = {
  calculator: "bg-sky-300 text-brand-700",
  leaf: "bg-leaf-200 text-leaf-600",
  sigma: "bg-sun-200 text-sun-600",
  book: "bg-brand-100 text-brand-600",
};

const subjectTones = {
  Math: "sky",
  Science: "leaf",
  Literacy: "sun",
  Geography: "brand",
} as const;

function ProgressBar({ value, tone }: { value: number; tone: "sun" | "leaf" }) {
  return (
    <div
      className="h-2 w-full overflow-hidden rounded-field bg-surface-strong"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn(
          "h-full rounded-field transition-[width] duration-300",
          tone === "leaf" ? "bg-leaf-200" : "bg-sun-400",
        )}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

interface ArtifactCardProps {
  artifact: Artifact;
  /** Reference timestamp so server and client format the same string. */
  now: number;
}

export function ArtifactCard({ artifact, now }: ArtifactCardProps) {
  const { id, title, subject, grade, icon, state, progress, updatedAt } = artifact;
  const Mark = artifactIcons[icon];
  const isComplete = state === "complete";

  return (
    <article className="group relative flex flex-col rounded-panel bg-paper p-5 shadow-card transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex items-start justify-between gap-3">
        <span
          aria-hidden="true"
          className={cn(
            "flex size-11 items-center justify-center rounded-full",
            markStyles[icon],
          )}
        >
          <Mark className="size-5" />
        </span>
        <Badge>Gr {grade}</Badge>
      </div>

      <h3 className="mt-5 text-lg font-bold tracking-[-0.02em]">
        {/* Stretched link: the whole card is the hit target, one tab stop. */}
        <Link href={`/artifacts/${id}`} className="before:absolute before:inset-0">
          {title}
        </Link>
      </h3>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge tone={subjectTones[subject]}>{subject}</Badge>
        <span className="text-[0.8125rem] text-ink-muted">
          · {state === "draft" ? "Draft" : formatUpdatedAt(updatedAt, now)}
        </span>
      </div>

      <div className="mt-5 space-y-2">
        <ProgressBar
          value={isComplete ? 100 : progress}
          tone={isComplete ? "leaf" : "sun"}
        />
        <div className="flex items-center justify-between text-[0.8125rem]">
          <span className="text-ink-soft">{isComplete ? "Status" : "Progress"}</span>
          <span
            className={cn(
              "font-semibold",
              isComplete ? "text-leaf-600" : "text-ink",
            )}
          >
            {isComplete ? "Complete" : `${progress}%`}
          </span>
        </div>
      </div>
    </article>
  );
}
