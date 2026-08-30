"use client";

import { useCallback, useEffect, useState } from "react";
import { BlockList } from "@/components/planner/block-list";
import { CenterPane, type FlowMode } from "@/components/planner/center-pane";
import { Inspector, type InspectorTab } from "@/components/planner/inspector";
import { useBlockEditor } from "@/components/planner/use-block-editor";
import { CloseIcon } from "@/components/icons";
import { IconButton } from "@/components/ui/icon-button";
import { draftBlock } from "@/lib/ai/draft-block";
import { reviseBlock } from "@/lib/ai/revise-block";
import { initialConversation } from "@/lib/data/lesson";
import { cn } from "@/lib/cn";
import type { ChatMessage, LessonModule } from "@/lib/types";

type Pane = "blocks" | "center" | "inspector";

const PANES: { id: Pane; label: string }[] = [
  { id: "blocks", label: "Blocks" },
  { id: "center", label: "Canvas" },
  { id: "inspector", label: "Inspect" },
];

let messageSeq = 0;
const nextMessageId = () => `m${++messageSeq}`;

/**
 * The whole lesson editor on one screen.
 *
 * Owns the blocks, the undo history, and one assistant conversation per block.
 * The editor is a *mode* of this screen rather than a separate route, so the
 * block rail stays live and you can work through several blocks without ever
 * leaving — adding, editing, reviewing and deleting from the same place.
 */
export function FlowWorkspace({ module }: { module: LessonModule }) {
  const {
    blocks,
    canUndo,
    canRedo,
    updateBlock,
    addBlock,
    deleteBlock,
    undo,
    redo,
  } = useBlockEditor(module.blocks);

  const [activeId, setActiveId] = useState(
    module.blocks.find((block) => block.kind === "interactive")?.id ??
      module.blocks[0]?.id ??
      "",
  );
  const [mode, setMode] = useState<FlowMode>("preview");
  const [tab, setTab] = useState<InspectorTab>("settings");
  const [pane, setPane] = useState<Pane>("center");
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [drafting, setDrafting] = useState(false);
  const [revising, setRevising] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // One thread per block, created the first time you open that block.
  const [threads, setThreads] = useState<Record<string, ChatMessage[]>>({});

  const activeBlock = blocks.find((block) => block.id === activeId) ?? null;
  const messages = activeBlock
    ? (threads[activeBlock.id] ?? initialConversation(activeBlock))
    : [];

  // Escape dismisses the inspector sheet.
  useEffect(() => {
    if (!inspectorOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setInspectorOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [inspectorOpen]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 6000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  /** Selecting a block keeps the current mode — that is the point. */
  const selectBlock = useCallback((id: string) => {
    setActiveId(id);
    setPane("center");
  }, []);

  const changeMode = useCallback((next: FlowMode) => {
    setMode(next);
    // The editor leads with the assistant; preview leads with the controls.
    setTab(next === "edit" ? "assistant" : "settings");
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      const index = blocks.findIndex((block) => block.id === id);
      const remaining = blocks.filter((block) => block.id !== id);
      const neighbour = remaining[index] ?? remaining[index - 1];

      deleteBlock(id);
      setActiveId(neighbour?.id ?? "");
      setInspectorOpen(false);
      if (!neighbour) setMode("preview");
      setNotice("Block deleted — undo is in the canvas header.");
    },
    [blocks, deleteBlock],
  );

  const handleAdd = useCallback(
    async (prompt: string) => {
      setDrafting(true);
      setNotice(null);
      try {
        const { block, source } = await draftBlock({
          moduleId: module.id,
          prompt,
        });
        addBlock(block);
        setActiveId(block.id);
        setPane("center");
        if (source === "local") {
          setNotice(
            "Drafted on-device — set NEXT_PUBLIC_AI_URL to run the real pipeline.",
          );
        }
      } finally {
        setDrafting(false);
      }
    },
    [addBlock, module.id],
  );

  const handleSend = useCallback(
    async (text: string) => {
      const block = activeBlock;
      if (!block || revising) return;

      const thread = threads[block.id] ?? initialConversation(block);
      const pendingId = nextMessageId();

      setThreads((current) => ({
        ...current,
        [block.id]: [
          ...thread,
          { id: nextMessageId(), author: "educator", text },
          { id: pendingId, author: "assistant", text: "Thinking", pending: true },
        ],
      }));
      setRevising(true);

      try {
        const { reply, patch, source } = await reviseBlock({
          moduleId: module.id,
          block,
          instruction: text,
        });

        updateBlock(block.id, patch);
        setThreads((current) => ({
          ...current,
          [block.id]: (current[block.id] ?? []).map((message) =>
            message.id === pendingId
              ? { id: pendingId, author: "assistant", text: reply }
              : message,
          ),
        }));
        if (source === "local") {
          setNotice(
            "Revised on-device — set NEXT_PUBLIC_AI_URL to run the real pipeline.",
          );
        }
      } finally {
        setRevising(false);
      }
    },
    [activeBlock, module.id, revising, threads, updateBlock],
  );

  const handleApply = useCallback(() => {
    changeMode("preview");
    setNotice(
      activeBlock
        ? `Changes applied to "${activeBlock.title}".`
        : "Changes applied.",
    );
  }, [activeBlock, changeMode]);

  const blockList = (
    <BlockList
      blocks={blocks}
      activeId={activeId}
      onSelect={selectBlock}
      onAdd={handleAdd}
      drafting={drafting}
    />
  );

  const inspector = activeBlock ? (
    <Inspector
      block={activeBlock}
      tab={tab}
      onTabChange={setTab}
      messages={messages}
      onSend={handleSend}
      onChange={(patch) => updateBlock(activeBlock.id, patch)}
      onDelete={() => handleDelete(activeBlock.id)}
      busy={revising}
    />
  ) : (
    <div className="flex h-full items-center justify-center p-8 text-center text-[0.875rem] leading-relaxed text-ink-soft">
      Select a block to edit it, or describe a new one in the Blocks pane.
    </div>
  );

  return (
    <div className="flex h-full flex-col">
      {/* Phone-only pane switcher. */}
      <div className="shrink-0 border-b border-line bg-paper px-3 py-2 md:hidden">
        <div
          role="tablist"
          aria-label="Editor panes"
          className="flex items-center gap-1 rounded-field bg-surface p-1"
        >
          {PANES.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={pane === item.id}
              onClick={() => setPane(item.id)}
              className={cn(
                "flex-1 rounded-field px-3 py-2 text-[0.8125rem] font-semibold transition-colors",
                pane === item.id
                  ? "bg-paper text-brand-600 shadow-card"
                  : "text-ink-soft hover:text-ink",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        <section
          className={cn(
            "min-w-0 flex-1 border-r border-line bg-canvas md:w-80 md:flex-none",
            pane === "blocks" ? "block" : "hidden md:block",
          )}
        >
          {blockList}
        </section>

        <section
          className={cn(
            "min-w-0 flex-1 bg-paper",
            pane === "center" ? "block" : "hidden md:block",
          )}
        >
          <CenterPane
            module={module}
            blocks={blocks}
            activeBlock={activeBlock}
            activeBlockId={activeId}
            mode={mode}
            onModeChange={changeMode}
            onSelectBlock={setActiveId}
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={undo}
            onRedo={redo}
            onApply={handleApply}
            busy={revising}
          />
        </section>

        <section
          className={cn(
            "min-w-0 flex-1 border-l border-line bg-paper xl:w-96 xl:flex-none",
            pane === "inspector" ? "block" : "hidden",
            "xl:block",
          )}
        >
          {inspector}
        </section>
      </div>

      {/* Says which path produced a change, rather than pretending. */}
      {notice ? (
        <div
          role="status"
          className="pointer-events-none fixed bottom-5 left-1/2 z-40 -translate-x-1/2 rounded-field bg-ink px-5 py-3 text-center text-[0.8125rem] text-paper shadow-lift"
        >
          {notice}
        </div>
      ) : null}

      {/* Tablet trigger for the inspector sheet. */}
      <button
        type="button"
        onClick={() => setInspectorOpen(true)}
        className="fixed bottom-5 right-5 z-30 hidden rounded-field bg-brand-600 px-5 py-3.5 text-[0.875rem] font-semibold text-paper shadow-lift transition-colors hover:bg-brand-700 md:block xl:hidden"
      >
        {mode === "edit" ? "Assistant" : "Block Settings"}
      </button>

      <div
        aria-hidden={!inspectorOpen}
        className={cn(
          "fixed inset-0 z-50 hidden md:block xl:!hidden",
          inspectorOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <button
          type="button"
          tabIndex={inspectorOpen ? 0 : -1}
          aria-label="Close inspector"
          onClick={() => setInspectorOpen(false)}
          className={cn(
            "absolute inset-0 bg-ink/25 transition-opacity duration-200",
            inspectorOpen ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          role="dialog"
          aria-modal={inspectorOpen}
          aria-label="Block inspector"
          className={cn(
            "absolute inset-y-0 right-0 flex w-[90vw] max-w-96 flex-col border-l border-line bg-paper shadow-lift",
            "transition-transform duration-200 ease-out",
            inspectorOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="absolute right-3 top-3 z-10">
            <IconButton
              label="Close inspector"
              onClick={() => setInspectorOpen(false)}
              tabIndex={inspectorOpen ? 0 : -1}
            >
              <CloseIcon className="size-5" />
            </IconButton>
          </div>
          {inspector}
        </div>
      </div>
    </div>
  );
}
