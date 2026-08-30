"use client";

import { useCallback, useEffect, useState } from "react";
import { LessonRenderer } from "@/components/lesson/lesson-renderer";
import {
  LiveInspector,
  type BlockEditInput,
  type InspectorTab,
} from "@/components/planner/live-inspector";
import { ReorderableBlockList } from "@/components/planner/reorderable-block-list";
import { ClockIcon, MonitorIcon, PhoneIcon } from "@/components/icons";
import { editBlock, editLesson, reorderModule } from "@/lib/api/engine";
import { cn } from "@/lib/cn";
import type { ChatMessage, LessonBlock, LessonModule } from "@/lib/types";

type Pane = "blocks" | "preview" | "inspector";
type Viewport = "desktop" | "mobile";

const PANES: { id: Pane; label: string }[] = [
  { id: "blocks", label: "Blocks" },
  { id: "preview", label: "Preview" },
  { id: "inspector", label: "Inspect" },
];

let messageSeq = 0;
const nextMessageId = () => `m${++messageSeq}`;

function seedThread(block: LessonBlock): ChatMessage[] {
  return [
    {
      id: `${block.id}-seed`,
      author: "assistant",
      text: `This is the “${block.title}” block. Tell me how to change it — the wording, the difficulty, or make it more visual.`,
    },
  ];
}

/** The engine-backed lesson editor: block spine · live preview · inspector. */
export function LiveWorkspace({ module }: { module: LessonModule }) {
  const lessonId = module.id;

  const [mod, setMod] = useState<LessonModule>(module);
  const [activeId, setActiveId] = useState(module.blocks[0]?.id ?? "");
  const [tab, setTab] = useState<InspectorTab>("settings");
  const [pane, setPane] = useState<Pane>("preview");
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [threads, setThreads] = useState<Record<string, ChatMessage[]>>({});

  const blocks = mod.blocks;
  const activeBlock = blocks.find((block) => block.id === activeId) ?? null;
  const messages = activeBlock
    ? (threads[activeBlock.id] ?? seedThread(activeBlock))
    : [];

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 6000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  // Keep a selection even after edits change the block set.
  useEffect(() => {
    if (blocks.length === 0) return;
    if (!blocks.some((block) => block.id === activeId)) {
      setActiveId(blocks[0]!.id);
    }
  }, [blocks, activeId]);

  const selectBlock = useCallback((id: string) => {
    setActiveId(id);
    setPane("preview");
  }, []);

  const timeTone = mod.timeNote?.startsWith("Fits") ? "leaf" : "sun";

  /* ---- Reorder (optimistic, persisted via /reorder — no LLM) ---- */
  const handleReorder = useCallback(
    async (orderedIds: string[]) => {
      const previous = mod;
      const byId = new Map(mod.blocks.map((block) => [block.id, block]));
      const reordered = orderedIds
        .map((id) => byId.get(id))
        .filter((block): block is LessonBlock => block !== undefined);
      setMod({ ...mod, blocks: reordered }); // optimistic

      setBusy(true);
      try {
        const { module: next } = await reorderModule(lessonId, orderedIds);
        setMod(next);
      } catch (error) {
        setMod(previous); // revert
        setNotice(errorText(error, "Couldn't reorder the blocks."));
      } finally {
        setBusy(false);
      }
    },
    [mod, lessonId],
  );

  /* ---- Add / lesson-level edits (Path B: /edit-lesson) ---- */
  const handleAdd = useCallback(
    async (prompt: string) => {
      setBusy(true);
      setNotice(null);
      try {
        const { module: next, note } = await editLesson(lessonId, prompt);
        setMod(next);
        setNotice(note ?? "Lesson updated.");
      } catch (error) {
        setNotice(errorText(error, "Couldn't update the lesson."));
      } finally {
        setBusy(false);
      }
    },
    [lessonId],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      const target = blocks.find((block) => block.id === id);
      if (!target) return;
      setBusy(true);
      try {
        const { module: next } = await editLesson(
          lessonId,
          `Remove the "${target.title}" block.`,
        );
        setMod(next);
        setNotice(`Deleted “${target.title}”.`);
      } catch (error) {
        setNotice(errorText(error, "Couldn't delete the block."));
      } finally {
        setBusy(false);
      }
    },
    [blocks, lessonId],
  );

  /* ---- Per-block edits (Path A: /edit-block) ---- */
  const handleApply = useCallback(
    async (input: BlockEditInput) => {
      if (!activeBlock) return;
      setBusy(true);
      try {
        const { module: next } = await editBlock(
          lessonId,
          activeBlock.id,
          input,
        );
        setMod(next);
        setNotice(`Updated “${activeBlock.title}”.`);
      } catch (error) {
        setNotice(errorText(error, "Couldn't update the block."));
      } finally {
        setBusy(false);
      }
    },
    [activeBlock, lessonId],
  );

  const handleSend = useCallback(
    async (text: string) => {
      if (!activeBlock || busy) return;
      const blockId = activeBlock.id;
      const thread = threads[blockId] ?? seedThread(activeBlock);
      const pendingId = nextMessageId();

      setThreads((current) => ({
        ...current,
        [blockId]: [
          ...thread,
          { id: nextMessageId(), author: "educator", text },
          { id: pendingId, author: "assistant", text: "Working on it", pending: true },
        ],
      }));
      setBusy(true);

      try {
        const { module: next } = await editBlock(lessonId, blockId, {
          instruction: text,
        });
        setMod(next);
        replacePending(setThreads, blockId, pendingId, "Done — I've reworked that block. Take a look.");
      } catch (error) {
        replacePending(
          setThreads,
          blockId,
          pendingId,
          errorText(error, "That didn't go through — try again."),
        );
      } finally {
        setBusy(false);
      }
    },
    [activeBlock, busy, threads, lessonId],
  );

  const blockList = (
    <ReorderableBlockList
      blocks={blocks}
      activeId={activeId}
      busy={busy}
      onSelect={selectBlock}
      onReorder={handleReorder}
      onAdd={handleAdd}
    />
  );

  const inspector = activeBlock ? (
    <LiveInspector
      block={activeBlock}
      tab={tab}
      onTabChange={setTab}
      messages={messages}
      onSend={handleSend}
      onApply={handleApply}
      onDelete={() => handleDelete(activeBlock.id)}
      busy={busy}
    />
  ) : (
    <div className="flex h-full items-center justify-center p-8 text-center text-[0.875rem] text-ink-soft">
      Select a block to edit it.
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
            pane === "preview" ? "block" : "hidden md:block",
          )}
        >
          <div className="flex h-full flex-col">
            <header className="flex shrink-0 flex-wrap items-center gap-3 border-b border-line px-4 py-3 sm:px-5">
              <p className="label-caps min-w-0 flex-1 truncate">
                Live student preview
              </p>
              {mod.timeNote ? (
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-field px-2.5 py-1 text-[0.75rem] font-semibold",
                    timeTone === "leaf"
                      ? "bg-leaf-100 text-leaf-600"
                      : "bg-sun-100 text-sun-600",
                  )}
                >
                  <ClockIcon className="size-3.5" />
                  {mod.timeNote}
                </span>
              ) : null}
              <div
                role="radiogroup"
                aria-label="Preview viewport"
                className="flex items-center gap-1 rounded-field bg-surface p-1"
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
            </header>

            <div className="scroll-slim min-h-0 flex-1 overflow-y-auto bg-gradient-to-b from-paper to-canvas px-4 py-8">
              <div
                className={cn(
                  "mx-auto w-full transition-[max-width] duration-200",
                  viewport === "desktop" ? "max-w-2xl" : "max-w-[22rem]",
                )}
              >
                <LessonRenderer
                  blocks={blocks}
                  activeId={activeId}
                  onSelectBlock={selectBlock}
                />
              </div>
            </div>
          </div>
        </section>

        <section
          className={cn(
            "min-w-0 flex-1 border-l border-line bg-paper xl:w-96 xl:flex-none",
            pane === "inspector" ? "block" : "hidden xl:block",
          )}
        >
          {inspector}
        </section>
      </div>

      {notice ? (
        <div
          role="status"
          className="pointer-events-none fixed bottom-5 left-1/2 z-40 -translate-x-1/2 rounded-field bg-ink px-5 py-3 text-center text-[0.8125rem] text-paper shadow-lift"
        >
          {notice}
        </div>
      ) : null}
    </div>
  );
}

function replacePending(
  setThreads: React.Dispatch<React.SetStateAction<Record<string, ChatMessage[]>>>,
  blockId: string,
  pendingId: string,
  text: string,
) {
  setThreads((current) => ({
    ...current,
    [blockId]: (current[blockId] ?? []).map((message) =>
      message.id === pendingId
        ? { id: pendingId, author: "assistant", text }
        : message,
    ),
  }));
}

function errorText(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}
