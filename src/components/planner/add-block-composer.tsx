"use client";

import { useEffect, useRef, useState } from "react";
import { CloseIcon, SparkleIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";

const SUGGESTIONS = [
  "A real-world hook about sharing",
  "A hands-on activity with fraction strips",
  "A quick exit ticket on comparing fractions",
  "A vocabulary explainer for equivalent fractions",
];

interface AddBlockComposerProps {
  onSubmit: (prompt: string) => void;
  onCancel: () => void;
  /** Disables the form while a draft is in flight. */
  busy: boolean;
}

/** Type what you want; the pipeline drafts the block. */
export function AddBlockComposer({
  onSubmit,
  onCancel,
  busy,
}: AddBlockComposerProps) {
  const [prompt, setPrompt] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const canSubmit = prompt.trim().length > 2 && !busy;

  function submit() {
    if (!canSubmit) return;
    onSubmit(prompt.trim());
    setPrompt("");
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      className="rounded-card border-2 border-sky-300 bg-paper p-4 shadow-card"
    >
      <div className="flex items-center gap-2">
        <SparkleIcon className="size-4 shrink-0 text-brand-600" />
        <h3 className="flex-1 text-[0.875rem] font-bold text-brand-600">
          Describe the block
        </h3>
        <IconButton
          label="Cancel adding a block"
          onClick={onCancel}
          className="size-7"
        >
          <CloseIcon className="size-4" />
        </IconButton>
      </div>

      <label htmlFor="add-block-prompt" className="sr-only">
        What should this block do?
      </label>
      <textarea
        ref={inputRef}
        id="add-block-prompt"
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        onKeyDown={(event) => {
          // Enter submits; Shift+Enter is a newline.
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            submit();
          }
        }}
        rows={3}
        disabled={busy}
        placeholder="e.g. a quick exit ticket on comparing halves and quarters"
        className="mt-3 w-full resize-none rounded-block bg-surface px-4 py-3 text-[0.875rem] leading-relaxed text-ink outline-none transition-colors placeholder:text-ink-muted focus:bg-canvas focus:ring-2 focus:ring-sky-300 disabled:opacity-50"
      />

      <div className="mt-3 flex flex-wrap gap-1.5">
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            disabled={busy}
            onClick={() => setPrompt(suggestion)}
            className="rounded-field border border-line px-2.5 py-1 text-[0.6875rem] text-ink-soft transition-colors hover:border-sky-300 hover:bg-sky-50 hover:text-brand-600 disabled:opacity-50"
          >
            {suggestion}
          </button>
        ))}
      </div>

      <Button
        type="submit"
        variant="sky"
        size="sm"
        disabled={!canSubmit}
        className="mt-4 w-full"
      >
        <SparkleIcon className="size-4" />
        {busy ? "Drafting..." : "Generate block"}
      </Button>
    </form>
  );
}
