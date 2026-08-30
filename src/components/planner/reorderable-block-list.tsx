"use client";

import { useState } from "react";
import { AddBlockComposer } from "@/components/planner/add-block-composer";
import { blockKindLabel, blockKindTone } from "@/components/planner/block-badges";
import {
  ArrowUpIcon,
  DragHandleIcon,
  HandIcon,
  PanelIcon,
  PlusCircleIcon,
  SparkleIcon,
} from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/cn";
import type { LessonBlock } from "@/lib/types";

/** Moves the item at `from` to `to`, returning a new array. */
function moveItem<T>(items: T[], from: number, to: number): T[] {
  const next = [...items];
  const [picked] = next.splice(from, 1);
  if (picked === undefined) return items;
  next.splice(to, 0, picked);
  return next;
}

interface ReorderableBlockListProps {
  blocks: LessonBlock[];
  activeId: string;
  busy: boolean;
  onSelect: (id: string) => void;
  /** Called with the full new order of block ids after a drag or nudge. */
  onReorder: (orderedIds: string[]) => void;
  /** Lesson-level: describe a block to add (goes through /edit-lesson). */
  onAdd: (prompt: string) => void;
}

/**
 * The lesson's blocks, reorderable.
 *
 * A lesson is an ordered spine of blocks; teachers rearrange it constantly.
 * Drag a card, or nudge it with the up/down handles — either way we emit the
 * whole new order and the workspace persists it through `/reorder` (no LLM, so
 * untouched blocks stay byte-identical).
 */
export function ReorderableBlockList({
  blocks,
  activeId,
  busy,
  onSelect,
  onReorder,
  onAdd,
}: ReorderableBlockListProps) {
  const [composerOpen, setComposerOpen] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const ids = blocks.map((block) => block.id);

  function commitMove(from: number, to: number) {
    if (from === to || to < 0 || to >= blocks.length) return;
    onReorder(moveItem(ids, from, to));
  }

  function onDrop(targetIndex: number) {
    if (dragIndex !== null) commitMove(dragIndex, targetIndex);
    setDragIndex(null);
    setOverIndex(null);
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex shrink-0 items-center gap-2.5 border-b border-line px-5 py-4">
        <PanelIcon className="size-5 text-brand-600" />
        <h2 className="flex-1 font-bold tracking-[-0.01em]">Lesson Blocks</h2>
        <span className="text-[0.8125rem] text-ink-muted">{blocks.length}</span>
      </header>

      <div className="scroll-slim flex-1 space-y-3 overflow-y-auto p-4">
        {blocks.map((block, index) => {
          const isActive = block.id === activeId;
          const isDragging = dragIndex === index;
          const isOver = overIndex === index && dragIndex !== index;

          return (
            <div
              key={block.id}
              draggable={!busy}
              onDragStart={() => setDragIndex(index)}
              onDragEnd={() => {
                setDragIndex(null);
                setOverIndex(null);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                setOverIndex(index);
              }}
              onDrop={() => onDrop(index)}
              className={cn(
                "group rounded-card border-2 bg-paper p-4 transition-all duration-150",
                isActive
                  ? "border-brand-600 shadow-card"
                  : "border-transparent shadow-card hover:border-sky-200",
                isDragging && "opacity-50",
                isOver && "border-sky-400 ring-2 ring-sky-200",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <Badge tone={blockKindTone[block.kind]} caps>
                  {block.kind === "interactive" ? (
                    <HandIcon className="size-3" />
                  ) : null}
                  {blockKindLabel[block.kind]}
                </Badge>

                <div className="flex shrink-0 items-center gap-0.5">
                  <IconButton
                    label="Move block up"
                    onClick={() => commitMove(index, index - 1)}
                    disabled={busy || index === 0}
                    className="size-7 disabled:pointer-events-none disabled:opacity-25"
                  >
                    <ArrowUpIcon className="size-4" />
                  </IconButton>
                  <IconButton
                    label="Move block down"
                    onClick={() => commitMove(index, index + 1)}
                    disabled={busy || index === blocks.length - 1}
                    className="size-7 disabled:pointer-events-none disabled:opacity-25"
                  >
                    <ArrowUpIcon className="size-4 rotate-180" />
                  </IconButton>
                  <span
                    aria-hidden="true"
                    className="ml-0.5 cursor-grab text-ink-muted active:cursor-grabbing"
                    title="Drag to reorder"
                  >
                    <DragHandleIcon className="size-4" />
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelect(block.id)}
                aria-current={isActive ? "true" : undefined}
                className="mt-3 block w-full text-left"
              >
                <h3
                  className={cn(
                    "font-bold tracking-[-0.015em]",
                    isActive ? "text-brand-600" : "text-ink",
                  )}
                >
                  {block.title}
                </h3>
                <p className="mt-1 text-[0.8125rem] leading-relaxed text-ink-soft">
                  {block.summary}
                </p>
              </button>
            </div>
          );
        })}

        {busy ? (
          <div
            role="status"
            aria-live="polite"
            className="flex items-center gap-2 rounded-card border-2 border-sky-200 bg-paper p-4 text-brand-600 shadow-card"
          >
            <SparkleIcon className="size-4 animate-breathe" />
            <span className="text-[0.8125rem] font-semibold animate-breathe">
              Updating the lesson...
            </span>
          </div>
        ) : null}

        {composerOpen ? (
          <AddBlockComposer
            busy={busy}
            onCancel={() => setComposerOpen(false)}
            onSubmit={(prompt) => {
              onAdd(prompt);
              setComposerOpen(false);
            }}
          />
        ) : (
          <button
            type="button"
            disabled={busy}
            onClick={() => setComposerOpen(true)}
            className="flex w-full flex-col items-center gap-2 rounded-card border-2 border-dashed border-line-strong px-4 py-6 text-ink-soft transition-colors hover:border-sky-300 hover:bg-sky-50 hover:text-brand-600 disabled:opacity-50"
          >
            <PlusCircleIcon className="size-5" />
            <span className="font-semibold">Add Block</span>
          </button>
        )}
      </div>
    </div>
  );
}
