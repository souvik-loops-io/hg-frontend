"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowRightIcon, CheckCircleIcon, PizzaIcon, RulerIcon } from "@/components/icons";
import { FigureView } from "@/components/lesson/figure-view";
import type { Figure, LessonBlock, LessonModule } from "@/lib/types";

type NumberLineFigure = Extract<Figure, { kind: "number_line" }>;

const markdownComponents = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="text-3xl font-bold tracking-[-0.04em] text-slate-900 sm:text-4xl">{children}</h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="mt-6 text-xl font-bold tracking-[-0.025em] text-slate-900">{children}</h2>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mt-3 text-base leading-7 text-slate-600">{children}</p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-600 marker:text-teal-500">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="mt-3 list-decimal space-y-1 pl-5 text-slate-600 marker:font-bold marker:text-teal-600">{children}</ol>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => <strong className="font-bold text-slate-800">{children}</strong>,
  code: ({ children }: { children?: React.ReactNode }) => <code className="rounded bg-teal-50 px-1.5 py-0.5 font-mono text-[0.85em] text-teal-800">{children}</code>,
};

function LessonIcon({ block }: { block: LessonBlock }) {
  const Icon = block.kind === "interactive" ? RulerIcon : PizzaIcon;
  return <Icon className="size-5" />;
}

function GripIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" aria-hidden="true">
      {[4, 8, 12].map((y) =>
        [5, 11].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.4" />),
      )}
    </svg>
  );
}

/* ---------------------------------------------------------------------------
   Drag fractions onto the number line — chips snap to their spot with
   correct / incorrect feedback. Reads the block's number_line figure so the
   targets always match the lesson data.
   ------------------------------------------------------------------------- */
function DragDropNumberLine({ figure }: { figure: NumberLineFigure }) {
  const span = figure.max - figure.min || 1;
  const interior = useMemo(
    () => figure.marks.filter((m) => m.value !== figure.min && m.value !== figure.max),
    [figure],
  );
  // Chips start shuffled (deterministic — reverse order, no Math.random in render).
  const [chips, setChips] = useState(() => [...interior].reverse());
  const [placed, setPlaced] = useState<Record<number, string>>({});
  const [wrong, setWrong] = useState<number | null>(null);
  const [over, setOver] = useState<number | null>(null);

  const pct = (v: number) => `${((v - figure.min) / span) * 100}%`;
  const done = Object.keys(placed).length === interior.length && interior.length > 0;

  function reset() {
    setChips([...interior].reverse());
    setPlaced({});
    setWrong(null);
    setOver(null);
  }

  function drop(markValue: number, label: string) {
    setOver(null);
    const target = interior.find((m) => m.label === label);
    if (target && target.value === markValue) {
      setPlaced((p) => ({ ...p, [markValue]: label }));
      setChips((c) => c.filter((m) => m.label !== label));
    } else {
      setWrong(markValue);
      setTimeout(() => setWrong((w) => (w === markValue ? null : w)), 600);
    }
  }

  return (
    <section className="mt-6 rounded-3xl bg-sky-50 p-5 sm:p-7" aria-label="Drag fractions onto the number line">
      <div className="flex items-center justify-between gap-4">
        <p className="font-semibold text-teal-900">Drag each fraction to its spot</p>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-teal-700 shadow-sm">
            {Object.keys(placed).length} / {interior.length} placed
          </span>
          <button type="button" onClick={reset} className="rounded-full px-3 py-1 text-xs font-bold text-slate-500 transition hover:bg-white hover:text-teal-700">
            Reset
          </button>
        </div>
      </div>

      {/* the line */}
      <div className="relative mx-4 mt-14 h-1 rounded-full bg-slate-300">
        {/* fixed endpoints */}
        {[{ v: figure.min, l: "0" }, { v: figure.max, l: "1" }].map((e) => (
          <span key={e.l} className="absolute -top-2.5 flex -translate-x-1/2 flex-col items-center" style={{ left: pct(e.v) }}>
            <span className="h-6 w-0.5 bg-slate-500" />
            <span className="mt-1 text-xs font-bold text-slate-600">{e.l}</span>
          </span>
        ))}
        {/* drop targets */}
        {interior.map((mark) => {
          const filled = placed[mark.value];
          const isOver = over === mark.value;
          const isWrong = wrong === mark.value;
          return (
            <span
              key={mark.value}
              className="absolute -top-5 -translate-x-1/2"
              style={{ left: pct(mark.value) }}
              onDragOver={(e) => {
                if (e.dataTransfer.types.includes("application/x-fraction")) {
                  e.preventDefault();
                  setOver(mark.value);
                }
              }}
              onDragLeave={() => setOver((o) => (o === mark.value ? null : o))}
              onDrop={(e) => {
                const raw = e.dataTransfer.getData("application/x-fraction");
                if (!raw) return;
                e.preventDefault();
                drop(mark.value, JSON.parse(raw).label as string);
              }}
            >
              <span
                className={[
                  "flex h-11 w-14 items-center justify-center rounded-2xl border-2 text-sm font-bold transition-all",
                  filled
                    ? "border-emerald-300 bg-emerald-500 text-white shadow-md"
                    : isWrong
                      ? "animate-shake border-rose-300 bg-rose-50 text-rose-600"
                      : isOver
                        ? "border-teal-500 bg-teal-50 text-teal-700 scale-110"
                        : "border-dashed border-slate-300 bg-white/70 text-slate-300",
                ].join(" ")}
              >
                {filled ? (
                  <span className="flex items-center gap-1">
                    <CheckCircleIcon className="size-4" />
                    {filled}
                  </span>
                ) : (
                  "?"
                )}
              </span>
            </span>
          );
        })}
      </div>

      {/* chip tray */}
      <div className="mt-12 flex min-h-[3rem] flex-wrap items-center justify-center gap-2">
        {chips.length === 0 && done ? (
          <p className="animate-breathe text-center text-sm font-bold text-emerald-600">🎉 Perfect — every fraction is in its place!</p>
        ) : (
          chips.map((mark) => (
            <button
              key={mark.label}
              type="button"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("application/x-fraction", JSON.stringify({ label: mark.label, value: mark.value }));
              }}
              className="cursor-grab select-none rounded-full border-2 border-sky-300 bg-white px-5 py-2.5 text-sm font-bold text-teal-800 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-500 hover:bg-teal-50 active:cursor-grabbing"
            >
              {mark.label}
            </button>
          ))
        )}
      </div>
      {figure.question ? <p className="mt-4 text-center text-sm font-medium text-slate-500">{figure.question}</p> : null}
    </section>
  );
}

interface StudentBlockProps {
  block: LessonBlock;
  index: number;
  total: number;
  nextBlockId?: string;
  editing: boolean;
  dragging: boolean;
  dropTarget: boolean;
  onToggleEdit: () => void;
  onChange: (patch: Partial<LessonBlock>) => void;
  onDragStartHandle: (e: React.DragEvent) => void;
  onDragOverCard: (e: React.DragEvent) => void;
  onDropCard: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}

function StudentBlock(props: StudentBlockProps) {
  const { block, index, total, nextBlockId, editing, dragging, dropTarget, onChange } = props;
  const numberLine = block.figure?.kind === "number_line" ? (block.figure as NumberLineFigure) : null;

  return (
    <article
      onDragOver={props.onDragOverCard}
      onDrop={props.onDropCard}
      className={[
        "relative rounded-[2rem] border bg-white p-6 shadow-[0_16px_45px_rgba(15,23,42,0.08)] transition-all sm:p-8",
        dragging ? "opacity-40" : "opacity-100",
        dropTarget ? "border-teal-400 ring-2 ring-teal-300" : "border-slate-100",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        {/* drag handle — reorders the block */}
        <button
          type="button"
          draggable
          onDragStart={props.onDragStartHandle}
          onDragEnd={props.onDragEnd}
          aria-label="Drag to reorder this block"
          title="Drag to reorder"
          className="mt-1 cursor-grab rounded-lg p-1.5 text-slate-300 transition hover:bg-slate-100 hover:text-slate-500 active:cursor-grabbing"
        >
          <GripIcon className="size-4" />
        </button>
        <span className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${block.kind === "interactive" ? "bg-amber-100 text-amber-700" : "bg-teal-100 text-teal-700"}`}>
          <LessonIcon block={block} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
            {block.kind} · Lesson {index + 1} of {total}
          </p>
          {editing ? (
            <input
              value={block.title}
              onChange={(e) => onChange({ title: e.target.value })}
              className="mt-1 w-full rounded-lg border border-teal-200 bg-teal-50/40 px-2 py-1 text-2xl font-bold tracking-[-0.03em] text-slate-900 outline-none focus:border-teal-400"
            />
          ) : (
            <h2 className="mt-1 text-2xl font-bold tracking-[-0.03em] text-slate-900">{block.title}</h2>
          )}
        </div>
        {/* edit toggle */}
        <button
          type="button"
          onClick={props.onToggleEdit}
          className={[
            "shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition",
            editing ? "bg-teal-600 text-white shadow-sm hover:bg-teal-700" : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700",
          ].join(" ")}
        >
          {editing ? "Done" : "Edit"}
        </button>
      </div>

      {editing ? (
        <textarea
          value={block.instruction}
          onChange={(e) => onChange({ instruction: e.target.value })}
          rows={3}
          className="mt-4 w-full resize-y rounded-xl border border-teal-200 bg-teal-50/30 p-3 text-base leading-7 text-slate-700 outline-none focus:border-teal-400"
        />
      ) : (
        <div className="student-markdown mt-4">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{block.instruction}</ReactMarkdown>
        </div>
      )}

      {block.body && block.body.length > 0 ? (
        <div className="student-markdown mt-4 space-y-3">
          {block.body.map((paragraph, paragraphIndex) => (
            <ReactMarkdown key={paragraphIndex} remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {paragraph}
            </ReactMarkdown>
          ))}
        </div>
      ) : null}

      {numberLine ? (
        <DragDropNumberLine figure={numberLine} />
      ) : block.figure ? (
        <div className="mt-6 rounded-3xl border border-slate-100 bg-slate-50/60 p-5 sm:p-6">
          <FigureView figure={block.figure} />
        </div>
      ) : null}

      {nextBlockId ? (
        <a href={`#${nextBlockId}`} className="mt-6 inline-flex items-center gap-2 rounded-full bg-teal-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-teal-700/20 transition hover:-translate-y-0.5 hover:bg-teal-800">
          <span>Keep learning</span>
          <ArrowRightIcon className="size-4" />
        </a>
      ) : null}
    </article>
  );
}

export function LessonPreview({ module }: { module: LessonModule }) {
  const [blocks, setBlocks] = useState<LessonBlock[]>(module.blocks);
  const [activeIndex, setActiveIndex] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const dragIndex = useRef<number | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  useEffect(() => setBlocks(module.blocks), [module.blocks]);

  useEffect(() => {
    const observers = blocks.map((block, index) => {
      const element = document.getElementById(block.id);
      if (!element) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) setActiveIndex(index);
        },
        { rootMargin: "-28% 0px -62% 0px", threshold: 0 },
      );
      observer.observe(element);
      return observer;
    });
    return () => observers.forEach((observer) => observer?.disconnect());
  }, [blocks]);

  function updateBlock(index: number, patch: Partial<LessonBlock>) {
    setBlocks((bs) => bs.map((b, i) => (i === index ? { ...b, ...patch } : b)));
  }

  function moveBlock(from: number, to: number) {
    if (from === to) return;
    setBlocks((bs) => {
      const next = [...bs];
      const moved = next[from];
      if (!moved) return bs;
      next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }

  return (
    <main className="preview-scrollbar h-dvh overflow-y-auto bg-[#f6fbfa] text-slate-800">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_20%_10%,#d8f3ed_0,transparent_32%),radial-gradient(circle_at_80%_0%,#d9efff_0,transparent_28%)]" />
      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        <Link href="/" className="text-lg font-extrabold tracking-[-0.04em] text-teal-800">Chalk</Link>
        <div className="flex items-center gap-2">
          <Link href={`/curriculum/flow?lesson=${encodeURIComponent(module.id)}`} className="hidden rounded-full px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-white/70 hover:text-teal-800 sm:inline-flex">Back to editor</Link>
          <Link href="/" className="rounded-full border border-white bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500 backdrop-blur transition hover:bg-white hover:text-teal-800">Dashboard</Link>
        </div>
      </header>
      <section className="relative mx-auto max-w-4xl px-5 pb-16 pt-8 sm:px-8 sm:pt-16">
        <div className="preview-reveal text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">{module.subject} · {module.grade}</p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-[-0.06em] text-slate-900 sm:text-6xl">{module.headline}</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate-600">{module.subheadline}</p>
          <p className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white/70 px-4 py-2 text-xs font-semibold text-teal-700 shadow-sm">
            ✨ Live &amp; interactive — drag the grip to reorder, drag fractions onto the line, tap <span className="rounded bg-slate-100 px-1.5 py-0.5">Edit</span> to change any block
          </p>
        </div>
        <nav className="fixed right-4 top-1/2 z-30 -translate-y-1/2 sm:right-7" aria-label="Lesson progress">
          <div className="flex flex-col items-center gap-2 rounded-full border border-white/80 bg-white/90 px-2.5 py-3 shadow-[0_8px_24px_rgba(15,118,110,0.12)] backdrop-blur">
            {blocks.map((block, index) => (
              <a
                key={block.id}
                href={`#${block.id}`}
                aria-label={`Go to ${block.title}`}
                aria-current={index === activeIndex ? "step" : undefined}
                className={`size-3 rounded-full transition-all duration-300 ${index === activeIndex ? "scale-125 bg-teal-600 shadow-[0_0_0_4px_rgba(13,148,136,0.14)]" : index < activeIndex ? "bg-teal-300" : "bg-slate-200 hover:bg-slate-300"}`}
              />
            ))}
          </div>
        </nav>
        <div className="mt-10 space-y-6">
          {blocks.map((block, index) => (
            <div id={block.id} key={block.id} className="scroll-mt-6">
              <StudentBlock
                block={block}
                index={index}
                total={blocks.length}
                nextBlockId={blocks[index + 1]?.id}
                editing={editingId === block.id}
                dragging={draggingIndex === index}
                dropTarget={dropIndex === index && draggingIndex !== index}
                onToggleEdit={() => setEditingId((id) => (id === block.id ? null : block.id))}
                onChange={(patch) => updateBlock(index, patch)}
                onDragStartHandle={(e) => {
                  dragIndex.current = index;
                  setDraggingIndex(index);
                  e.dataTransfer.effectAllowed = "move";
                  e.dataTransfer.setData("application/x-block-index", String(index));
                }}
                onDragOverCard={(e) => {
                  if (e.dataTransfer.types.includes("application/x-block-index")) {
                    e.preventDefault();
                    setDropIndex(index);
                  }
                }}
                onDropCard={(e) => {
                  if (!e.dataTransfer.types.includes("application/x-block-index")) return;
                  e.preventDefault();
                  const from = dragIndex.current;
                  if (from !== null) moveBlock(from, index);
                  dragIndex.current = null;
                  setDraggingIndex(null);
                  setDropIndex(null);
                }}
                onDragEnd={() => {
                  dragIndex.current = null;
                  setDraggingIndex(null);
                  setDropIndex(null);
                }}
              />
              {index < blocks.length - 1 ? <div className="mx-auto h-6 w-px bg-teal-200" /> : null}
            </div>
          ))}
        </div>
        <div className="mt-8 flex items-center justify-center gap-2 text-sm font-medium text-slate-500"><CheckCircleIcon className="size-5 text-emerald-500" /> Learn at your own pace</div>
      </section>
    </main>
  );
}
