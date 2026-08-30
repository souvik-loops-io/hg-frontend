"use client";

import { useMemo, useState } from "react";
import { CheckCircleIcon } from "@/components/icons";
import type { MatchGameFigure } from "@/lib/types";

/**
 * Click-to-match game: pick a left item, then its partner on the right. Correct
 * pairs lock in green; a wrong pick shakes. Deterministic shuffle (no random) so
 * server and client render the same order.
 */
export function MatchGameView({ figure }: { figure: MatchGameFigure }) {
  const lefts = figure.pairs.map((p) => p.left);
  // Right column shuffled deterministically (rotate by one, then reverse).
  const rights = useMemo(() => {
    const r = figure.pairs.map((p, i) => ({ text: p.right, pairIndex: i }));
    return [...r.slice(1), ...r.slice(0, 1)].reverse();
  }, [figure]);

  const [pickedLeft, setPickedLeft] = useState<number | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [wrong, setWrong] = useState<string | null>(null);

  const done = matched.size === figure.pairs.length && figure.pairs.length > 0;

  function pickRight(pairIndex: number) {
    if (pickedLeft === null || matched.has(pickedLeft)) return;
    if (pairIndex === pickedLeft) {
      setMatched((m) => new Set(m).add(pickedLeft));
      setPickedLeft(null);
    } else {
      const key = `r${pairIndex}`;
      setWrong(key);
      setTimeout(() => setWrong((w) => (w === key ? null : w)), 500);
    }
  }

  return (
    <section className="rounded-3xl bg-indigo-50/60 p-5 sm:p-7" aria-label="Matching game">
      <div className="flex items-center justify-between gap-4">
        <p className="font-semibold text-indigo-900">{figure.prompt || "Match each pair"}</p>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-indigo-700 shadow-sm">
          {matched.size} / {figure.pairs.length} matched
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          {lefts.map((text, i) => {
            const isMatched = matched.has(i);
            const isPicked = pickedLeft === i;
            return (
              <button
                key={i}
                type="button"
                disabled={isMatched}
                onClick={() => setPickedLeft(i)}
                className={[
                  "rounded-2xl border-2 px-4 py-3 text-left text-sm font-semibold transition",
                  isMatched
                    ? "border-emerald-300 bg-emerald-500 text-white"
                    : isPicked
                      ? "border-indigo-500 bg-indigo-100 text-indigo-900 shadow-sm"
                      : "border-indigo-200 bg-white text-slate-700 hover:border-indigo-400 hover:bg-indigo-50",
                ].join(" ")}
              >
                <span className="flex items-center gap-2">
                  {isMatched ? <CheckCircleIcon className="size-4 shrink-0" /> : null}
                  {text}
                </span>
              </button>
            );
          })}
        </div>
        <div className="flex flex-col gap-2">
          {rights.map(({ text, pairIndex }) => {
            const isMatched = matched.has(pairIndex);
            const isWrong = wrong === `r${pairIndex}`;
            return (
              <button
                key={pairIndex}
                type="button"
                disabled={isMatched}
                onClick={() => pickRight(pairIndex)}
                className={[
                  "rounded-2xl border-2 px-4 py-3 text-left text-sm font-semibold transition",
                  isMatched
                    ? "border-emerald-300 bg-emerald-500 text-white"
                    : isWrong
                      ? "animate-shake border-rose-300 bg-rose-50 text-rose-600"
                      : pickedLeft !== null
                        ? "border-indigo-300 bg-white text-slate-700 hover:border-indigo-500 hover:bg-indigo-50"
                        : "border-slate-200 bg-white text-slate-500",
                ].join(" ")}
              >
                {text}
              </button>
            );
          })}
        </div>
      </div>

      <p aria-live="polite" className="mt-5 text-center text-sm font-medium text-slate-600">
        {done ? "🎉 All matched — nicely done!" : pickedLeft !== null ? "Now tap its partner on the right." : "Tap an item on the left to start."}
      </p>
    </section>
  );
}
