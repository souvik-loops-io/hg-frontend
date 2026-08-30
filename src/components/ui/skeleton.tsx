import { cn } from "@/lib/cn";

/**
 * A shimmering placeholder block.
 *
 * Always `aria-hidden` — the loading state is announced once by the region that
 * contains it, not by every bar inside it.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-shimmer rounded-field bg-surface", className)}
    />
  );
}

/**
 * Wraps a skeleton screen so assistive tech hears "Loading" once, politely,
 * instead of nothing at all.
 */
export function LoadingRegion({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div role="status" aria-live="polite" aria-busy="true" className={className}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}
