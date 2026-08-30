import { cn } from "@/lib/cn";

export type BadgeTone = "neutral" | "brand" | "sky" | "leaf" | "sun";

const tones: Record<BadgeTone, string> = {
  neutral: "bg-surface-strong text-ink-soft",
  brand: "bg-brand-50 text-brand-600",
  sky: "bg-sky-100 text-brand-600",
  leaf: "bg-leaf-100 text-leaf-600",
  sun: "bg-sun-100 text-sun-600",
};

interface BadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
  /** Uppercased and letterspaced — for taxonomy labels like "HOOK". */
  caps?: boolean;
  className?: string;
}

export function Badge({
  children,
  tone = "neutral",
  caps = false,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-field px-2.5 py-1",
        "text-[0.6875rem] font-semibold leading-4",
        caps ? "uppercase tracking-[0.08em]" : "tracking-normal",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
