"use client";

import { useState } from "react";

import { AlertIcon, CheckCircleIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import type { McqFigure } from "@/lib/types";

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"] as const;

/**
 * A single multiple-choice question, answerable in place. Tapping an option
 * locks the question: the correct answer turns leaf, a wrong pick turns danger,
 * and the explanation is revealed. "Try again" clears the answer.
 */
export function McqView({ figure }: { figure: McqFigure }) {
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;
  const isCorrect = picked === figure.answerIndex;

  return (
    <div className="m-0">
      <p className="text-lg font-semibold text-ink text-balance">
        {figure.question}
      </p>

      <ul className="mt-4 space-y-2.5">
        {figure.options.map((option, index) => {
          const isAnswer = index === figure.answerIndex;
          const isPicked = index === picked;

          // Reveal the correct answer (leaf) and any wrong pick (danger) once
          // answered; unpicked wrong options stay quiet.
          const state: "idle" | "correct" | "wrong" | "muted" = !answered
            ? "idle"
            : isAnswer
              ? "correct"
              : isPicked
                ? "wrong"
                : "muted";

          const shell: Record<typeof state, string> = {
            idle: "border-line bg-paper hover:border-sky-300 hover:bg-sky-50",
            correct: "border-leaf-500 bg-leaf-50",
            wrong: "border-danger-500 bg-danger-50",
            muted: "border-line bg-paper opacity-60",
          };
          const chip: Record<typeof state, string> = {
            idle: "bg-surface-strong text-ink-soft",
            correct: "bg-leaf-500 text-paper",
            wrong: "bg-danger-500 text-paper",
            muted: "bg-surface-strong text-ink-soft",
          };

          return (
            <li key={`${option}-${index}`}>
              <button
                type="button"
                onClick={() => !answered && setPicked(index)}
                disabled={answered}
                aria-pressed={isPicked}
                className={cn(
                  "flex w-full items-center gap-3 rounded-block border-2 p-3.5 text-left transition-colors",
                  shell[state],
                  answered ? "cursor-default" : "cursor-pointer",
                )}
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors",
                    chip[state],
                  )}
                >
                  {state === "correct" ? (
                    <CheckCircleIcon className="size-5" />
                  ) : state === "wrong" ? (
                    <AlertIcon className="size-5" />
                  ) : (
                    (OPTION_LETTERS[index] ?? String(index + 1))
                  )}
                </span>
                <span className="text-base font-medium text-ink">{option}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {answered ? (
        <div
          className={cn(
            "mt-4 rounded-block border-2 p-4",
            isCorrect
              ? "border-leaf-200 bg-leaf-50"
              : "border-sun-200 bg-sun-50",
          )}
        >
          <p
            className={cn(
              "text-base font-bold",
              isCorrect ? "text-leaf-600" : "text-sun-600",
            )}
          >
            {isCorrect ? "Nice — that's right!" : "Not quite."}
          </p>
          {figure.explanation ? (
            <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
              {figure.explanation}
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => setPicked(null)}
            className="mt-3 inline-flex rounded-field bg-sky-300 px-4 py-2 text-sm font-semibold text-brand-700 transition-colors hover:bg-sky-400"
          >
            Try again
          </button>
        </div>
      ) : null}
    </div>
  );
}
