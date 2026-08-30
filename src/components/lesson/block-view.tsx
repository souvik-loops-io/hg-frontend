"use client";

import {
  BookIcon,
  CheckCircleIcon,
  HandIcon,
  LightbulbIcon,
  PencilIcon,
} from "@/components/icons";
import { cn } from "@/lib/cn";
import type { BlockKind, LessonBlock } from "@/lib/types";

import { FigureView } from "./figure-view";

/** A block's kind is its colour — matches the planner's badge tones. */
const MARK_STYLE: Record<BlockKind, string> = {
  hook: "bg-leaf-100 text-leaf-600",
  concept: "bg-sky-100 text-brand-600",
  interactive: "bg-sun-100 text-sun-600",
  assessment: "bg-surface-strong text-ink-soft",
};

const MARK_ICON: Record<
  BlockKind,
  typeof BookIcon
> = {
  hook: LightbulbIcon,
  concept: BookIcon,
  interactive: HandIcon,
  assessment: CheckCircleIcon,
};

const KIND_LABEL: Record<BlockKind, string> = {
  hook: "Hook",
  concept: "Concept",
  interactive: "Interactive",
  assessment: "Assessment",
};

/**
 * One lesson block, student-facing: a kind-coloured mark, the title and
 * instruction, any prose `body`, then the structured `figure` if present.
 * `isActive` gives it a brand ring and an "Editing" chip.
 */
export function BlockView({
  block,
  isActive = false,
  onEdit,
}: {
  block: LessonBlock;
  isActive?: boolean;
  onEdit?: () => void;
}) {
  const Icon = MARK_ICON[block.kind];

  return (
    <article
      className={cn(
        "relative rounded-card border-2 bg-paper p-5 shadow-card transition-colors sm:p-6",
        isActive ? "border-brand-600" : "border-line",
      )}
    >
      {isActive ? (
        <span className="absolute -top-3.5 right-4 inline-flex items-center gap-1.5 rounded-field bg-sun-400 px-3 py-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-sun-600">
          <PencilIcon className="size-3" />
          Editing
        </span>
      ) : null}

      <div className="flex items-start gap-4">
        <span
          aria-hidden="true"
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-full",
            MARK_STYLE[block.kind],
          )}
        >
          <Icon className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-ink-muted">
            {KIND_LABEL[block.kind]}
          </span>
          <h3
            className={cn(
              "text-xl font-bold tracking-[-0.02em] sm:text-2xl",
              isActive ? "text-brand-600" : "text-ink",
            )}
          >
            {block.title}
          </h3>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">
            {block.instruction}
          </p>
        </div>
      </div>

      {block.body && block.body.length > 0 ? (
        <div className="mt-4 space-y-3">
          {block.body.map((paragraph, index) => (
            <p
              key={index}
              className="text-[0.9375rem] leading-relaxed text-ink"
            >
              {paragraph}
            </p>
          ))}
        </div>
      ) : null}

      {block.figure ? (
        <div className="mt-5 rounded-block border border-line bg-canvas p-4 sm:p-5">
          <FigureView figure={block.figure} />
        </div>
      ) : null}

      {onEdit ? (
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 rounded-field bg-sky-300 px-4 py-2 text-[0.8125rem] font-semibold text-brand-700 transition-colors hover:bg-sky-400"
          >
            <PencilIcon className="size-3.5" />
            Open in editor
          </button>
        </div>
      ) : null}
    </article>
  );
}
