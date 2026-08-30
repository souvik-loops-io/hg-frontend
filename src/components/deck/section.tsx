import { cn } from "@/lib/cn";

interface SectionProps {
  id: string;
  /** Alternating bands are what give the deck its rhythm when scrolling. */
  tone?: "paper" | "shell";
  className?: string;
  children: React.ReactNode;
}

export function Section({ id, tone = "paper", className, children }: SectionProps) {
  return (
    <section
      id={id}
      data-deck-section={id}
      className={cn(
        "scroll-mt-0 px-6 py-20 sm:px-10 lg:px-16 lg:py-28",
        tone === "shell" ? "bg-deck-shell" : "bg-deck-paper",
        className,
      )}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}
