"use client";

import { useState } from "react";
import { CheckCircleIcon, SparkleIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

/**
 * Student analytics for the dashboard — demo data only (no backend yet).
 * Shows a class-level summary, a per-student progress list, and a dummy
 * "Create Assessment" action.
 */

const SUMMARY = [
  { label: "Active students", value: "28", tone: "brand" as const },
  { label: "Avg. completion", value: "82%", tone: "leaf" as const },
  { label: "Avg. score", value: "76%", tone: "sky" as const },
  { label: "Need attention", value: "5", tone: "sun" as const },
];

const STUDENTS = [
  { name: "Aarav Sharma", completion: 94, score: 88 },
  { name: "Bella Nguyen", completion: 81, score: 79 },
  { name: "Chen Wei", completion: 67, score: 61 },
  { name: "Diego Ramos", completion: 45, score: 52 },
];

const TILE_TONE: Record<(typeof SUMMARY)[number]["tone"], string> = {
  brand: "bg-sky-100 text-brand-600",
  leaf: "bg-leaf-100 text-leaf-600",
  sky: "bg-sky-100 text-brand-600",
  sun: "bg-sun-100 text-sun-600",
};

function barTone(pct: number): string {
  if (pct >= 80) return "bg-leaf-500";
  if (pct >= 60) return "bg-sky-400";
  return "bg-sun-400";
}

export function StudentAnalytics() {
  const [created, setCreated] = useState(false);

  return (
    <section className="mt-12">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-[-0.03em] sm:text-3xl">
            Student Analytics
          </h2>
          <p className="mt-1 text-[0.9375rem] text-ink-soft">
            How your class is doing across recent lessons.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreated(true)}
          className={cn(
            "inline-flex shrink-0 items-center gap-2 rounded-field px-4 py-2.5 text-sm font-semibold transition-colors",
            created
              ? "bg-leaf-100 text-leaf-600"
              : "bg-brand-600 text-paper hover:bg-brand-700",
          )}
        >
          {created ? (
            <>
              <CheckCircleIcon className="size-4" />
              Assessment created
            </>
          ) : (
            <>
              <SparkleIcon className="size-4" />
              Create Assessment
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {SUMMARY.map((stat) => (
          <div key={stat.label} className="rounded-card bg-paper p-5 shadow-card">
            <span
              className={cn(
                "inline-flex rounded-field px-2.5 py-1 text-[0.75rem] font-semibold",
                TILE_TONE[stat.tone],
              )}
            >
              {stat.label}
            </span>
            <p className="mt-3 text-3xl font-bold tracking-[-0.02em] text-ink tabular-nums">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-card bg-paper p-5 shadow-card sm:p-6">
        <h3 className="mb-4 text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-ink-muted">
          Per-student progress
        </h3>
        <ul className="space-y-4">
          {STUDENTS.map((student) => (
            <li key={student.name} className="flex items-center gap-4">
              <span className="w-40 shrink-0 truncate text-[0.9375rem] font-semibold text-ink">
                {student.name}
              </span>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface-strong">
                <div
                  className={cn("h-full rounded-full", barTone(student.completion))}
                  style={{ width: `${student.completion}%` }}
                />
              </div>
              <span className="w-12 shrink-0 text-right text-sm font-semibold tabular-nums text-ink-soft">
                {student.completion}%
              </span>
              <span className="w-16 shrink-0 rounded-field bg-sky-100 px-2 py-1 text-center text-[0.75rem] font-bold tabular-nums text-brand-600">
                {student.score} pts
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
