import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required — these buttons have no visible text. */
  label: string;
}

export function IconButton({ label, className, ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-full text-ink-soft",
        "transition-colors duration-150 hover:bg-surface hover:text-ink",
        className,
      )}
      {...props}
    />
  );
}
