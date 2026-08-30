"use client";

import { useEffect, useState } from "react";
import { HandIcon, TrashIcon } from "@/components/icons";
import { blockTypeLabel } from "@/components/planner/block-badges";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import type { BlockSettings as Settings, LessonBlock } from "@/lib/types";

const control =
  "w-full rounded-field bg-surface px-5 py-3.5 text-[0.9375rem] text-ink " +
  "outline-none transition-colors placeholder:text-ink-muted " +
  "hover:bg-surface-strong focus:bg-paper focus:ring-2 focus:ring-sky-300";

interface BlockSettingsProps {
  block: LessonBlock;
  onChange: (patch: Partial<LessonBlock>) => void;
  onDelete: () => void;
}

/**
 * The right pane: everything about the selected block.
 *
 * Inputs are controlled and write straight back through `onChange`, so the
 * live student preview updates as you type.
 */
export function BlockSettings({ block, onChange, onDelete }: BlockSettingsProps) {
  const [confirming, setConfirming] = useState(false);

  // Selecting a different block cancels a half-finished delete.
  useEffect(() => setConfirming(false), [block.id]);

  function patchSettings(patch: Partial<Settings>) {
    const current: Settings = block.settings ?? {
      showFractions: false,
      autoSnapToGrid: false,
    };
    onChange({ settings: { ...current, ...patch } });
  }

  return (
    <div className="flex h-full flex-col">
      <header className="shrink-0 border-b border-line px-5 py-4">
        <h2 className="font-bold tracking-[-0.01em]">Block Settings</h2>
      </header>

      <div className="scroll-slim flex-1 space-y-6 overflow-y-auto p-5">
        <div>
          <p className="label-caps mb-2">Block type</p>
          <p className="flex items-center gap-2 rounded-field bg-sun-100 px-4 py-3 text-[0.9375rem] font-semibold text-sun-600">
            <HandIcon className="size-4 shrink-0" />
            {blockTypeLabel[block.kind]}
          </p>
        </div>

        <div>
          <label htmlFor="block-title" className="label-caps mb-2 block">
            Title
          </label>
          <input
            id="block-title"
            type="text"
            value={block.title}
            onChange={(event) => onChange({ title: event.target.value })}
            className={control}
          />
        </div>

        <div>
          <label htmlFor="block-instruction" className="label-caps mb-2 block">
            Instruction text
          </label>
          <textarea
            id="block-instruction"
            rows={3}
            value={block.instruction}
            onChange={(event) => onChange({ instruction: event.target.value })}
            className={`${control} resize-none rounded-card`}
          />
        </div>

        {block.settings ? (
          <div className="space-y-4 border-t border-line pt-6">
            <p className="label-caps">Interactive settings</p>
            <Toggle
              label="Show fractions"
              checked={block.settings.showFractions}
              onChange={(showFractions) => patchSettings({ showFractions })}
            />
            <Toggle
              label="Auto-snap to grid"
              checked={block.settings.autoSnapToGrid}
              onChange={(autoSnapToGrid) => patchSettings({ autoSnapToGrid })}
            />
          </div>
        ) : null}
      </div>

      <div className="shrink-0 border-t border-line p-5">
        {confirming ? (
          // Undoable, but still two deliberate taps — it removes a whole block.
          <div className="rounded-card border border-danger-500 bg-danger-50 p-4">
            <p className="text-[0.875rem] leading-relaxed text-ink">
              Delete <strong className="font-semibold">{block.title}</strong>?
              You can undo this from the canvas header.
            </p>
            <div className="mt-3 flex gap-2">
              <Button
                variant="soft"
                size="sm"
                className="flex-1"
                onClick={() => setConfirming(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                className="flex-1 bg-danger-500 text-paper hover:bg-danger-500/90"
                onClick={onDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="danger"
            className="w-full"
            onClick={() => setConfirming(true)}
          >
            <TrashIcon className="size-4" />
            Delete Block
          </Button>
        )}
      </div>
    </div>
  );
}
