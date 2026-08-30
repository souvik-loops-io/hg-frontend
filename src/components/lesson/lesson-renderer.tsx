"use client";

import { cn } from "@/lib/cn";
import type { LessonBlock } from "@/lib/types";

import { BlockView } from "./block-view";

/**
 * The student-facing lesson: a centered vertical stack of blocks. Clicking a
 * block (its chrome, controls, or the "Open in editor" affordance) reports the
 * selection through `onSelectBlock`.
 */
export function LessonRenderer({
  blocks,
  activeId,
  onSelectBlock,
}: {
  blocks: LessonBlock[];
  activeId?: string;
  onSelectBlock?: (id: string) => void;
}) {
  const selectable = Boolean(onSelectBlock);

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 px-4 py-8">
      {blocks.map((block) => (
        <div
          key={block.id}
          onClick={selectable ? () => onSelectBlock?.(block.id) : undefined}
          className={cn(selectable && "cursor-pointer")}
        >
          <BlockView
            block={block}
            isActive={block.id === activeId}
            onEdit={onSelectBlock ? () => onSelectBlock(block.id) : undefined}
          />
        </div>
      ))}

      {blocks.length === 0 ? (
        <p className="rounded-card border-2 border-dashed border-line-strong px-4 py-10 text-center text-[0.9375rem] leading-relaxed text-ink-soft">
          No blocks to show yet.
        </p>
      ) : null}
    </div>
  );
}
