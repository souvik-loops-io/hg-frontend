"use client";

import { useState } from "react";
import { ArrowUpIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import type { QuickAction } from "@/lib/types";

interface ComposerProps {
  placeholder: string;
  quickActions: QuickAction[];
  /** Locks the field while the assistant is mid-turn. */
  disabled?: boolean;
  onSend?: (text: string) => void;
  onQuickAction?: (action: QuickAction) => void;
}

export function Composer({
  placeholder,
  quickActions,
  disabled = false,
  onSend,
  onQuickAction,
}: ComposerProps) {
  const [draft, setDraft] = useState("");
  const canSend = draft.trim().length > 0 && !disabled;

  return (
    <div className="space-y-3">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!canSend) return;
          onSend?.(draft.trim());
          setDraft("");
        }}
        className={cn(
          "flex items-center gap-2 rounded-field bg-surface py-2 pl-5 pr-2 transition-colors",
          "focus-within:bg-paper focus-within:ring-2 focus-within:ring-sky-300",
          disabled && "opacity-60",
        )}
      >
        <label htmlFor="ai-composer" className="sr-only">
          {placeholder}
        </label>
        <input
          id="ai-composer"
          value={draft}
          disabled={disabled}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={disabled ? "Working..." : placeholder}
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent py-2.5 text-[0.9375rem] text-ink outline-none placeholder:text-ink-muted"
        />
        <button
          type="submit"
          disabled={!canSend}
          aria-label="Send message"
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full",
            "bg-brand-600 text-paper transition-colors hover:bg-brand-700",
            "disabled:cursor-not-allowed disabled:opacity-35",
          )}
        >
          <ArrowUpIcon className="size-4" />
        </button>
      </form>

      {quickActions.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action) => (
            <button
              key={action.id}
              type="button"
              disabled={disabled}
              onClick={() => onQuickAction?.(action)}
              className="rounded-field border border-line bg-paper px-4 py-2 text-[0.8125rem] text-ink transition-colors hover:border-sky-300 hover:bg-sky-50 disabled:opacity-50"
            >
              {action.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
