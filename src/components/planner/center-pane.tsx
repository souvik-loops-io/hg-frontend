"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MonitorIcon,
  PhoneIcon,
  RedoIcon,
  UndoIcon,
} from "@/components/icons";
import { BlockCanvas } from "@/components/planner/block-canvas";
import { StudentPreviewBody } from "@/components/planner/student-preview";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/cn";
import type { LessonBlock, LessonModule } from "@/lib/types";

export type FlowMode = "preview" | "edit";

interface CenterPaneProps {
  module: LessonModule;
  blocks: LessonBlock[];
  activeBlock: LessonBlock | null;
  activeBlockId: string;
  mode: FlowMode;
  onModeChange: (mode: FlowMode) => void;
  onSelectBlock: (id: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onApply: () => void;
  busy: boolean;
}

/**
 * The middle column. One header, two bodies: the live student preview, or the
 * editor canvas for the selected block.
 *
 * Switching blocks in the left rail keeps whichever mode you are in, so you can
 * work through several blocks in the editor without leaving it.
 */
export function CenterPane({
  module,
  blocks,
  activeBlock,
  activeBlockId,
  mode,
  onModeChange,
  onSelectBlock,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onApply,
  busy,
}: CenterPaneProps) {
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const isEditing = mode === "edit";

  return (
    <div className="flex h-full flex-col">
      <header className="flex shrink-0 flex-wrap items-center gap-3 border-b border-line px-4 py-3 sm:px-5">
        {/* Mode switch — the editor is a mode of this screen, not another page. */}
        <div
          role="tablist"
          aria-label="Centre pane mode"
          className="flex items-center gap-1 rounded-field bg-surface p-1"
        >
          {(
            [
              ["preview", "Preview"],
              ["edit", "Edit"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={mode === value}
              onClick={() => onModeChange(value)}
              className={cn(
                "rounded-field px-4 py-1.5 text-[0.8125rem] font-semibold transition-colors",
                mode === value
                  ? "bg-paper text-brand-600 shadow-card"
                  : "text-ink-soft hover:text-ink",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <p className="label-caps min-w-0 flex-1 truncate">
          {isEditing
            ? `Editing · ${activeBlock?.title ?? "no block"}`
            : "Live student preview"}
        </p>

        {!isEditing ? (
          <Link
            href="/preview"
            target="_blank"
            className="hidden rounded-field border border-line px-3 py-1.5 text-[0.75rem] font-semibold text-brand-600 transition-colors hover:bg-brand-50 sm:inline-flex"
          >
            Open full preview
          </Link>
        ) : null}

        <div className="flex shrink-0 items-center gap-1">
          <IconButton
            label="Undo"
            onClick={onUndo}
            disabled={!canUndo}
            className="disabled:pointer-events-none disabled:opacity-30"
          >
            <UndoIcon className="size-[1.125rem]" />
          </IconButton>
          <IconButton
            label="Redo"
            onClick={onRedo}
            disabled={!canRedo}
            className="disabled:pointer-events-none disabled:opacity-30"
          >
            <RedoIcon className="size-[1.125rem]" />
          </IconButton>

          {isEditing ? (
            <Button
              variant="brand"
              size="sm"
              className="ml-2"
              onClick={onApply}
              disabled={busy}
            >
              Apply Changes
            </Button>
          ) : (
            <div
              role="radiogroup"
              aria-label="Preview viewport"
              className="ml-2 flex items-center gap-1 rounded-field bg-surface p-1"
            >
              {(
                [
                  ["desktop", MonitorIcon, "Desktop"],
                  ["mobile", PhoneIcon, "Mobile"],
                ] as const
              ).map(([value, Icon, label]) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={viewport === value}
                  aria-label={label}
                  title={label}
                  onClick={() => setViewport(value)}
                  className={cn(
                    "flex size-8 items-center justify-center rounded-field transition-colors",
                    viewport === value
                      ? "bg-paper text-brand-600 shadow-card"
                      : "text-ink-muted hover:text-ink",
                  )}
                >
                  <Icon className="size-4" />
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="min-h-0 flex-1">
        {isEditing && activeBlock ? (
          <BlockCanvas block={activeBlock} busy={busy} />
        ) : (
          <StudentPreviewBody
            module={module}
            blocks={blocks}
            activeBlockId={activeBlockId}
            viewport={viewport}
            onEditBlock={(id) => {
              onSelectBlock(id);
              onModeChange("edit");
            }}
          />
        )}
      </div>
    </div>
  );
}
