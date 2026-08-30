"use client";

import { useEffect, useRef } from "react";
import { AssistantAvatar } from "@/components/ai/avatar";
import { ChatMessageRow } from "@/components/ai/chat-message";
import { Composer } from "@/components/ai/composer";
import { quickActionsFor } from "@/lib/data/lesson";
import type { ChatMessage, LessonBlock } from "@/lib/types";

interface AssistantPanelProps {
  block: LessonBlock;
  messages: ChatMessage[];
  onSend: (text: string) => void;
  busy: boolean;
}

/** "Edit this representation" — one conversation per block. */
export function AssistantPanel({
  block,
  messages,
  onSend,
  busy,
}: AssistantPanelProps) {
  const endRef = useRef<HTMLDivElement>(null);

  // Keep the newest turn in view as the conversation grows.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  return (
    <div className="flex h-full flex-col">
      <header className="flex shrink-0 items-center gap-3 border-b border-line px-4 py-4 sm:px-5">
        <AssistantAvatar className="size-10" />
        <div className="min-w-0">
          <h2 className="truncate font-bold tracking-[-0.015em]">
            {block.representation ? "Edit this representation" : "Edit this block"}
          </h2>
          <p className="mt-0.5 truncate text-[0.8125rem] text-ink-soft">
            Lumina AI Assistant
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
          placeholder="Tell AI how to adjust this block..."
          quickActions={quickActionsFor(block)}
          disabled={busy}
          onSend={onSend}
          onQuickAction={(action) => onSend(action.label)}
        />
      </div>
    </div>
  );
}
