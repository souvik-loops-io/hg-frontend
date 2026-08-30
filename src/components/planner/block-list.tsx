"use client";

import { useState } from "react";
import {
  DragHandleIcon,
  HandIcon,
  PanelIcon,
  PlusCircleIcon,
  SparkleIcon,
} from "@/components/icons";
import { AddBlockComposer } from "@/components/planner/add-block-composer";
import { blockKindLabel, blockKindTone } from "@/components/planner/block-badges";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/cn";
import type { LessonBlock } from "@/lib/types";

interface BlockListProps {
  blocks: LessonBlock[];
  activeId: string;
  onSelect: (id: string) => void;
  onAdd: (prompt: string) => void;
  /** True while a drafted block is in flight. */
  drafting: boolean;
}

export function BlockList({
  blocks,
  activeId,
  onSelect,
  onAdd,
  drafting,
}: BlockListProps) {
  const [composerOpen, setComposerOpen] = useState(false);

  return (
    <div className="flex h-full flex-col">
      <header className="flex shrink-0 items-center gap-2.5 border-b border-line px-5 py-4">
        <PanelIcon className="size-5 text-brand-600" />
        <h2 className="flex-1 font-bold tracking-[-0.01em]">Lesson Blocks</h2>
        <span className="text-[0.8125rem] text-ink-muted">{blocks.length}</span>
      </header>

      <div className="scroll-slim flex-1 space-y-3 overflow-y-auto p-4">
        {blocks.map((block) => {
          const isActive = block.id === activeId;

          return (
            <button
              key={block.id}
              type="button"
              onClick={() => onSelect(block.id)}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "w-full rounded-card border-2 bg-paper p-4 text-left transition-all duration-150",
                isActive
                  ? "border-brand-600 shadow-card"
                  : "border-transparent shadow-card hover:border-sky-200",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <Badge tone={blockKindTone[block.kind]} caps>
                  {block.kind === "interactive" ? (
                    <HandIcon className="size-3" />
                  ) : null}
                  {blockKindLabel[block.kind]}
                </Badge>
                <DragHandleIcon
                  className="size-4 shrink-0 text-ink-muted"
                  aria-hidden="true"
                />
              </div>

              <h3
                className={cn(
                  "mt-3 font-bold tracking-[-0.015em]",
                  isActive ? "text-brand-600" : "text-ink",
                )}
              >
                {block.title}
              </h3>
              <p className="mt-1 text-[0.8125rem] leading-relaxed text-ink-soft">
                {block.summary}
              </p>
            </button>
          );
        })}

        {blocks.length === 0 && !drafting && !composerOpen ? (
          <p className="rounded-card border-2 border-dashed border-line-strong px-4 py-8 text-center text-[0.875rem] leading-relaxed text-ink-soft">
            No blocks yet. Describe the first one and the assistant will draft it.
          </p>
        ) : null}

        {/* A placeholder in the shape of the card that is coming. */}
        {drafting ? (
          <div
            role="status"
            aria-live="polite"
            className="rounded-card border-2 border-sky-200 bg-paper p-4 shadow-card"
          >
            <div className="flex items-center gap-2 text-brand-600">
              <SparkleIcon className="size-4 animate-breathe" />
              <span className="text-[0.8125rem] font-semibold animate-breathe">
                Drafting your block...
              </span>
            </div>
            <Skeleton className="mt-3 h-5 w-3/4 rounded-block" />
            <Skeleton className="mt-2 h-4 w-1/2 rounded-block" />
          </div>
        ) : null}

        {composerOpen ? (
          <AddBlockComposer
            busy={drafting}
            onCancel={() => setComposerOpen(false)}
            onSubmit={(prompt) => {
              onAdd(prompt);
              setComposerOpen(false);
            }}
          />
        ) : (
          <button
            type="button"
            onClick={() => setComposerOpen(true)}
            className="flex w-full flex-col items-center gap-2 rounded-card border-2 border-dashed border-line-strong px-4 py-6 text-ink-soft transition-colors hover:border-sky-300 hover:bg-sky-50 hover:text-brand-600"
          >
            <PlusCircleIcon className="size-5" />
            <span className="font-semibold">Add Block</span>
          </button>
        )}
      </div>
    </div>
  );
}
