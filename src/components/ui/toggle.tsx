"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/** Label on the left, switch on the right — the Block Settings pattern. */
export function Toggle({ label, checked, onChange }: ToggleProps) {
  const id = useId();

  return (
    <div className="flex items-center justify-between gap-4">
      <label htmlFor={id} className="text-[0.9375rem] text-ink">
        {label}
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-7 w-13 shrink-0 rounded-field transition-colors duration-150",
          checked ? "bg-brand-600" : "bg-surface-strong",
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "absolute top-1 size-5 rounded-full bg-paper shadow-card transition-all duration-150",
            checked ? "left-7" : "left-1",
          )}
        />
      </button>
    </div>
  );
}
