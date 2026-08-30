"use client";

import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowRightIcon, CheckCircleIcon, PizzaIcon, RulerIcon } from "@/components/icons";
import { FigureView } from "@/components/lesson/figure-view";
import type { LessonBlock, LessonModule } from "@/lib/types";

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

function NumberLine() {
  const values = useMemo(() => ["1/4", "1/2", "3/4"], []);
  const [placed, setPlaced] = useState<string[]>([]);
  const [message, setMessage] = useState("Choose each fraction in order from left to right.");

  function place(value: string) {
    if (placed.includes(value)) return;
    const next = [...placed, value];
    setPlaced(next);
    setMessage(next.length === values.length ? "Excellent work! You placed every fraction." : "Nice! Choose the next fraction.");
  }

  return (
    <section className="mt-6 rounded-3xl bg-sky-50 p-5 sm:p-7" aria-label="Fraction number line activity">
      <div className="flex items-center justify-between gap-4">
        <p className="font-semibold text-teal-900">Build the number line</p>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-teal-700 shadow-sm">{placed.length} / {values.length} placed</span>
      </div>
      <div className="relative mx-4 mt-10 h-10 border-t-4 border-slate-700">
        {[0, 1, 2, 3, 4].map((tick) => (
          <span key={tick} className="absolute -top-3 flex -translate-x-1/2 flex-col items-center" style={{ left: `${tick * 25}%` }}>
            <span className="h-5 border-l-2 border-slate-700" />
            <span className="mt-1 text-xs font-bold text-slate-600">{tick === 0 ? "0" : tick === 4 ? "1" : ""}</span>
          </span>
        ))}
      </div>
      <div className="mt-7 flex flex-wrap justify-center gap-2">
        {values.map((value) => (
          <button key={value} type="button" onClick={() => place(value)} disabled={placed.includes(value)} className="rounded-full border-2 border-sky-300 bg-white px-4 py-2 text-sm font-bold text-teal-800 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-500 hover:bg-teal-50 disabled:border-emerald-200 disabled:bg-emerald-50 disabled:text-emerald-700">
            {placed.includes(value) ? "Placed " : ""}{value}
          </button>
        ))}
      </div>
      <p aria-live="polite" className="mt-5 text-center text-sm font-medium text-slate-600">{message}</p>
    </section>
  );
}

function StudentBlock({ block, index, nextBlockId }: { block: LessonBlock; index: number; nextBlockId?: string }) {
  const isBuilding = block.status === "queued" || block.status === "processing" || block.status === "generating";

  return (
    <article className="preview-reveal rounded-[2rem] border border-slate-100 bg-white p-6 shadow-[0_16px_45px_rgba(15,23,42,0.08)] sm:p-8" style={{ animationDelay: `${index * 90}ms` }}>
      <div className="flex items-start gap-4">
        <span className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${block.kind === "interactive" ? "bg-amber-100 text-amber-700" : "bg-teal-100 text-teal-700"}`}><LessonIcon block={block} /></span>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Lesson {index + 1}</p>
          <h2 className="mt-1 text-2xl font-bold tracking-[-0.03em] text-slate-900">{block.title}</h2>
          {isBuilding ? <span className="mt-2 inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-amber-800 animate-breathe">Creating</span> : null}
        </div>
      </div>
      <div className="student-markdown mt-4"><ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{block.instruction}</ReactMarkdown></div>
      {isBuilding ? <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">More content for this block is still being prepared. You can continue with the available lesson below.</p> : null}
      {block.body && block.body.length > 0 ? (
        <div className="student-markdown mt-4 space-y-3">
          {block.body.map((paragraph, paragraphIndex) => (
            <ReactMarkdown key={paragraphIndex} remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {paragraph}
            </ReactMarkdown>
          ))}
        </div>
      ) : null}
      {block.figure ? (
        <div className="mt-6 rounded-3xl border border-slate-100 bg-slate-50/60 p-5 sm:p-6">
          <FigureView figure={block.figure} />
        </div>
      ) : block.kind === "interactive" ? (
        <NumberLine />
      ) : null}
      {nextBlockId ? <a href={`#${nextBlockId}`} className="mt-6 inline-flex items-center gap-2 rounded-full bg-teal-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-teal-700/20 transition hover:-translate-y-0.5 hover:bg-teal-800"><span>Keep learning</span><ArrowRightIcon className="size-4" /></a> : null}
    </article>
  );
}

export function LessonPreview({ module }: { module: LessonModule }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const observers = module.blocks.map((block, index) => {
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
  }, [module.blocks]);

  return (
    <main className="preview-scrollbar h-dvh overflow-y-auto bg-[#f6fbfa] text-slate-800">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_20%_10%,#d8f3ed_0,transparent_32%),radial-gradient(circle_at_80%_0%,#d9efff_0,transparent_28%)]" />
      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        <a href="/" className="text-lg font-extrabold tracking-[-0.04em] text-teal-800">CuePilot</a>
        <div className="flex items-center gap-2">
          <a href={`/curriculum/flow?lesson=${encodeURIComponent(module.id)}`} className="hidden rounded-full px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-white/70 hover:text-teal-800 sm:inline-flex">Back to editor</a>
          <a href="/" className="rounded-full border border-white bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500 backdrop-blur transition hover:bg-white hover:text-teal-800">Dashboard</a>
        </div>
      </header>
      <section className="relative mx-auto max-w-4xl px-5 pb-16 pt-8 sm:px-8 sm:pt-16">
        <div className="preview-reveal text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">{module.subject} · {module.grade}</p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-[-0.06em] text-slate-900 sm:text-6xl">{module.headline}</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate-600">{module.subheadline}</p>
        </div>
        <nav className="fixed right-4 top-1/2 z-30 -translate-y-1/2 sm:right-7" aria-label="Lesson progress">
          <div className="flex flex-col items-center gap-2 rounded-full border border-white/80 bg-white/90 px-2.5 py-3 shadow-[0_8px_24px_rgba(15,118,110,0.12)] backdrop-blur">
            {module.blocks.map((block, index) => (
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
          {module.blocks.map((block, index) => (
            <div id={block.id} key={block.id} className="scroll-mt-6">
              <StudentBlock block={block} index={index} nextBlockId={module.blocks[index + 1]?.id} />
              {index < module.blocks.length - 1 ? <div className="mx-auto h-6 w-px bg-teal-200" /> : null}
            </div>
          ))}
        </div>
        <div className="mt-8 flex items-center justify-center gap-2 text-sm font-medium text-slate-500"><CheckCircleIcon className="size-5 text-emerald-500" /> Learn at your own pace</div>
      </section>
    </main>
  );
}
