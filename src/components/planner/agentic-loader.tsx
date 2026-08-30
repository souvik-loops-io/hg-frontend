"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A dummy multi-agent build transcript, shown while a lesson is generating.
 *
 * Purely presentational — it advances on timers, independent of the real
 * request, so the teacher sees the "agents" working even when generation is
 * instant. When the transcript has finished AND the real lesson id is ready,
 * it calls `onDone` (which navigates to the lesson).
 */
const AGENTS = [
  { icon: "🧭", name: "Planner agent", task: "Mapping the lesson spine and pacing" },
  { icon: "✍️", name: "Content agent", task: "Writing the hook and the explainer" },
  { icon: "❓", name: "Assessment agent", task: "Generating a correct-by-construction MCQ" },
  { icon: "📊", name: "Visual agent", task: "Building the number line and bar model" },
  { icon: "🧩", name: "Game agent", task: "Assembling the matching game" },
  { icon: "⏱️", name: "Editor agent", task: "Checking the time budget and flow" },
];

const STEP_MS = 850;

export function AgenticLoader({
  open,
  ready,
  onDone,
}: {
  open: boolean;
  ready: string | null;
  onDone: () => void;
}) {
  const [step, setStep] = useState(0);
  const fired = useRef(false);

  // Reset when the loader opens.
  useEffect(() => {
    if (open) {
      setStep(0);
      fired.current = false;
    }
  }, [open]);

  // Advance one agent at a time.
  useEffect(() => {
    if (!open || step >= AGENTS.length) return;
    const t = setTimeout(() => setStep((s) => s + 1), STEP_MS);
    return () => clearTimeout(t);
  }, [open, step]);

  const complete = step >= AGENTS.length;

  // Navigate once the transcript is done and the real lesson id has arrived.
  useEffect(() => {
    if (open && complete && ready && !fired.current) {
      fired.current = true;
      onDone();
    }
  }, [open, complete, ready, onDone]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[1.75rem] border border-white/60 bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-teal-100 text-xl">🤖</span>
          <div>
            <h2 className="text-lg font-bold tracking-[-0.02em] text-slate-900">Building your lesson</h2>
            <p className="text-sm text-slate-500">A team of agents is drafting each block…</p>
          </div>
        </div>

        <ol className="mt-6 space-y-3">
          {AGENTS.map((agent, i) => {
            const state = i < step ? "done" : i === step ? "active" : "pending";
            return (
              <li
                key={agent.name}
                className={[
                  "flex items-center gap-3 rounded-2xl border p-3 transition-all duration-300",
                  state === "done"
                    ? "border-emerald-200 bg-emerald-50/60"
                    : state === "active"
                      ? "border-teal-300 bg-teal-50 shadow-sm"
                      : "border-slate-100 bg-white opacity-50",
                ].join(" ")}
              >
                <span className="text-lg">{agent.icon}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-slate-800">{agent.name}</span>
                  <span className="block truncate text-xs text-slate-500">{agent.task}</span>
                </span>
                {state === "done" ? (
                  <span className="text-sm font-bold text-emerald-600">✓</span>
                ) : state === "active" ? (
                  <span className="size-4 animate-spin rounded-full border-2 border-teal-300 border-t-teal-600" />
                ) : (
                  <span className="text-xs font-medium text-slate-300">queued</span>
                )}
              </li>
            );
          })}
        </ol>

        <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-teal-500 transition-all duration-500 ease-out"
            style={{ width: `${Math.min(100, Math.round((step / AGENTS.length) * 100))}%` }}
          />
        </div>
        <p className="mt-3 text-center text-xs font-medium text-slate-400">
          {complete ? (ready ? "Opening your lesson…" : "Finalizing…") : `${step} of ${AGENTS.length} agents finished`}
        </p>
      </div>
    </div>
  );
}
