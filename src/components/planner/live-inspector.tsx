"use client";

import { useEffect, useRef, useState } from "react";
import { AssistantAvatar } from "@/components/ai/avatar";
import { ChatMessageRow } from "@/components/ai/chat-message";
import { Composer } from "@/components/ai/composer";
import { blockKindLabel } from "@/components/planner/block-badges";
import { HandIcon, SparkleIcon, TrashIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/cn";
import type { ChatMessage, LessonBlock, QuickAction } from "@/lib/types";

export type InspectorTab = "assistant" | "settings";

const COMPLEXITY_LABELS = ["Simplest", "Simple", "Balanced", "Deeper", "Complex"];
const DENSITY_LABELS = ["Text-first", "Mostly text", "Balanced", "Visual", "Visual-first"];

function labelFor(labels: string[], value: number): string {
  return labels[value - 1] ?? "Balanced";
}

const QUICK_ACTIONS: QuickAction[] = [
  { id: "simpler", label: "Simplify the language" },
  { id: "example", label: "Add a worked example" },
  { id: "visual", label: "Make it more visual" },
];

export interface BlockEditInput {
  instruction?: string;
  complexity?: number;
  visualDemand?: number;
}

interface LiveInspectorProps {
  block: LessonBlock;
  tab: InspectorTab;
  onTabChange: (tab: InspectorTab) => void;
  messages: ChatMessage[];
  /** Assistant: a free-text instruction for this block (→ /edit-block). */
  onSend: (text: string) => void;
  /** Settings: apply the sliders / a typed instruction (→ /edit-block). */
  onApply: (input: BlockEditInput) => void;
  onDelete: () => void;
  busy: boolean;
}

/**
 * The right pane for a live (engine-backed) lesson. Two tabs:
 *  - Assistant: talk to one block — the instruction regenerates just that block.
 *  - Settings: the two engine sliders (language depth + visual density) plus a
 *    one-off instruction, applied together; and Delete.
 *
 * Every write goes to `/edit-block`, which regenerates only this block and
 * leaves its siblings byte-identical.
 */
export function LiveInspector({
  block,
  tab,
  onTabChange,
  messages,
  onSend,
  onApply,
  onDelete,
  busy,
}: LiveInspectorProps) {
  const tabs: { id: InspectorTab; label: string }[] = [
    { id: "assistant", label: "Assistant" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 border-b border-line p-3">
        <div
          role="tablist"
          aria-label="Block inspector"
          className="flex items-center gap-1 rounded-field bg-surface p-1"
        >
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex-1 rounded-field px-3 py-2 text-[0.8125rem] font-semibold transition-colors",
                tab === item.id
                  ? "bg-paper text-brand-600 shadow-card"
                  : "text-ink-soft hover:text-ink",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1">
        {tab === "assistant" ? (
          <AssistantTab
            block={block}
            messages={messages}
            onSend={onSend}
            busy={busy}
          />
        ) : (
          <SettingsTab
            block={block}
            onApply={onApply}
            onDelete={onDelete}
            busy={busy}
          />
        )}
      </div>
    </div>
  );
}

function AssistantTab({
  block,
  messages,
  onSend,
  busy,
}: {
  block: LessonBlock;
  messages: ChatMessage[];
  onSend: (text: string) => void;
  busy: boolean;
}) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  return (
    <div className="flex h-full flex-col">
      <header className="flex shrink-0 items-center gap-3 border-b border-line px-4 py-4 sm:px-5">
        <AssistantAvatar className="size-10" />
        <div className="min-w-0">
          <h2 className="truncate font-bold tracking-[-0.015em]">
            Edit “{block.title}”
          </h2>
          <p className="mt-0.5 truncate text-[0.8125rem] text-ink-soft">
            Regenerates only this block
          </p>
        </div>
      </header>

      <div className="scroll-slim flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-5">
        {messages.map((message) => (
          <ChatMessageRow key={message.id} message={message} />
        ))}
        <div ref={endRef} />
      </div>

      <div className="shrink-0 border-t border-line p-4">
        <Composer
          key={block.id}
          placeholder="e.g. use a cricket example, or make it simpler..."
          quickActions={QUICK_ACTIONS}
          disabled={busy}
          onSend={onSend}
          onQuickAction={(action) => onSend(action.label)}
        />
      </div>
    </div>
  );
}

function SettingsTab({
  block,
  onApply,
  onDelete,
  busy,
}: {
  block: LessonBlock;
  onApply: (input: BlockEditInput) => void;
  onDelete: () => void;
  busy: boolean;
}) {
  const [complexity, setComplexity] = useState(block.complexity ?? 3);
  const [visualDemand, setVisualDemand] = useState(block.visualDemand ?? 3);
  const [instruction, setInstruction] = useState("");
  const [confirming, setConfirming] = useState(false);

  // Selecting a different block resets the controls to that block's values.
  useEffect(() => {
    setComplexity(block.complexity ?? 3);
    setVisualDemand(block.visualDemand ?? 3);
    setInstruction("");
    setConfirming(false);
  }, [block.id, block.complexity, block.visualDemand]);

  const dirty =
    complexity !== (block.complexity ?? 3) ||
    visualDemand !== (block.visualDemand ?? 3) ||
    instruction.trim().length > 0;

  function apply() {
    if (!dirty || busy) return;
    onApply({
      complexity,
      visualDemand,
      instruction: instruction.trim() || undefined,
    });
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
            {blockKindLabel[block.kind]}
          </p>
        </div>

        <div>
          <Slider
            id="block-complexity"
            label="Language depth"
            valueLabel={labelFor(COMPLEXITY_LABELS, complexity)}
            value={complexity}
            min={1}
            max={5}
            ticks={["Simple", "Complex"]}
            onChange={setComplexity}
          />
          <p className="mt-2 text-[0.8125rem] text-ink-soft">
            How advanced the wording and reasoning are.
          </p>
        </div>

        <div>
          <Slider
            id="block-visual"
            label="Visual density"
            valueLabel={labelFor(DENSITY_LABELS, visualDemand)}
            value={visualDemand}
            min={1}
            max={5}
            ticks={["Text", "Visual"]}
            onChange={setVisualDemand}
          />
          <p className="mt-2 text-[0.8125rem] text-ink-soft">
            A high setting can turn prose into a diagram or interactive.
          </p>
        </div>

        <div>
          <label htmlFor="block-instruction" className="label-caps mb-2 block">
            One-off instruction
            <span className="ml-1 font-normal normal-case text-ink-muted">
              (optional)
            </span>
          </label>
          <textarea
            id="block-instruction"
            rows={3}
            value={instruction}
            onChange={(event) => setInstruction(event.target.value)}
            placeholder="e.g. only use halves and quarters"
            className="w-full resize-none rounded-card bg-surface px-5 py-3.5 text-[0.9375rem] text-ink outline-none transition-colors placeholder:text-ink-muted hover:bg-surface-strong focus:bg-paper focus:ring-2 focus:ring-sky-300"
          />
        </div>

        <Button
          variant="brand"
          className="w-full"
          onClick={apply}
          disabled={!dirty || busy}
        >
          <SparkleIcon className="size-4" />
          {busy ? "Applying..." : "Apply Changes"}
        </Button>
      </div>

      <div className="shrink-0 border-t border-line p-5">
        {confirming ? (
          <div className="rounded-card border border-danger-500 bg-danger-50 p-4">
            <p className="text-[0.875rem] leading-relaxed text-ink">
              Delete <strong className="font-semibold">{block.title}</strong>?
              The rest of the lesson stays exactly as it is.
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
                disabled={busy}
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
            disabled={busy}
          >
            <TrashIcon className="size-4" />
            Delete Block
          </Button>
        )}
      </div>
    </div>
  );
}
