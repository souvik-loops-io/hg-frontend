"use client";

import { AssistantPanel } from "@/components/planner/assistant-panel";
import { BlockSettings } from "@/components/planner/block-settings";
import { cn } from "@/lib/cn";
import type { ChatMessage, LessonBlock } from "@/lib/types";

export type InspectorTab = "assistant" | "settings";

interface InspectorProps {
  block: LessonBlock;
  tab: InspectorTab;
  onTabChange: (tab: InspectorTab) => void;
  messages: ChatMessage[];
  onSend: (text: string) => void;
  onChange: (patch: Partial<LessonBlock>) => void;
  onDelete: () => void;
  busy: boolean;
}

/**
 * The right pane, in both modes. Two tabs so the assistant and the manual
 * controls — including Delete — are always one click apart, never a screen
 * apart.
 */
export function Inspector({
  block,
  tab,
  onTabChange,
  messages,
  onSend,
  onChange,
  onDelete,
  busy,
}: InspectorProps) {
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
          <AssistantPanel
            block={block}
            messages={messages}
            onSend={onSend}
            busy={busy}
          />
        ) : (
          <BlockSettings block={block} onChange={onChange} onDelete={onDelete} />
        )}
      </div>
    </div>
  );
}
