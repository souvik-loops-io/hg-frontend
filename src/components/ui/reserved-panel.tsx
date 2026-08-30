import { SparkleIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

interface ReservedPanelProps {
  title: string;
  description: string;
  /** The env var this surface is waiting on. */
  dependsOn?: string;
  className?: string;
}

/**
 * Placeholder for a route whose data comes from a service that is not wired up
 * yet. Styled as a real part of the product rather than a blank page, so the
 * demo never dead-ends.
 */
export function ReservedPanel({
  title,
  description,
  className,
}: ReservedPanelProps) {
  return (
    <div
      className={cn(
        "rounded-card border-2 border-dashed border-sky-200 bg-paper/60 p-7 sm:p-10",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="flex size-12 items-center justify-center rounded-full bg-sky-300 text-brand-700"
      >
        <SparkleIcon className="size-5" />
      </span>
      <h2 className="mt-5 text-2xl font-bold tracking-[-0.025em] text-brand-600">
        {title}
      </h2>
      <p className="mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-ink-soft">
        {description}
      </p>
    </div>
  );
}
