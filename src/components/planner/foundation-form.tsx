"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMaterials } from "@/components/planner/materials-context";
import { ingestMaterial, runLesson, TEACHER_ID } from "@/lib/api/engine";
import {
  ChevronDownIcon,
  ClockIcon,
  GaugeIcon,
  ShapesIcon,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/cn";
import {
  MAX_DURATION_MINUTES,
  MIN_DURATION_MINUTES,
  type FoundationDetails,
  type FoundationOptions,
} from "@/lib/types";

const DIFFICULTY_LABELS = [
  "Gentle",
  "Easy",
  "Balanced",
  "Stretching",
  "Challenging",
] as const;

const DURATION_PRESETS = [15, 30, 45, 60];

/** The engine speaks board names; the form speaks framework ids. */
const FRAMEWORK_TO_BOARD: Record<string, string> = {
  ccss: "Common Core",
  ncert: "CBSE",
  "national-curriculum": "National Curriculum",
  "ib-pyp": "IB PYP",
};

function boardForFramework(value: string, options: FoundationOptions): string {
  return (
    FRAMEWORK_TO_BOARD[value] ??
    options.frameworks.find((option) => option.value === value)?.label ??
    value
  );
}

/** Every field is required; this drives both validation and the error list. */
type FieldName = keyof FoundationDetails;

const FIELD_LABELS: Record<FieldName, string> = {
  gradeLevel: "Grade level",
  subject: "Subject",
  topicFocus: "Topic focus",
  framework: "Curriculum framework",
  difficulty: "Difficulty",
  durationMinutes: "Duration",
};

type Errors = Partial<Record<FieldName, string>>;

function validate(values: FoundationDetails): Errors {
  const errors: Errors = {};

  if (!values.gradeLevel) errors.gradeLevel = "Choose a grade level.";
  if (!values.subject) errors.subject = "Choose a subject.";
  if (!values.framework) errors.framework = "Choose a curriculum framework.";

  const topic = values.topicFocus.trim();
  if (!topic) {
    errors.topicFocus = "Tell us what this module is about.";
  } else if (topic.length < 3) {
    errors.topicFocus = "Use at least 3 characters.";
  }

  if (!Number.isFinite(values.difficulty)) {
    errors.difficulty = "Pick a difficulty.";
  }

  if (!Number.isFinite(values.durationMinutes)) {
    errors.durationMinutes = "Enter a duration in minutes.";
  } else if (!Number.isInteger(values.durationMinutes)) {
    errors.durationMinutes = "Use whole minutes.";
  } else if (values.durationMinutes < MIN_DURATION_MINUTES) {
    errors.durationMinutes = `Minimum is ${MIN_DURATION_MINUTES} minutes.`;
  } else if (values.durationMinutes > MAX_DURATION_MINUTES) {
    errors.durationMinutes = `Maximum is ${MAX_DURATION_MINUTES} minutes.`;
  }

  return errors;
}

const control =
  "w-full rounded-field bg-surface px-5 py-3.5 text-[0.9375rem] text-ink " +
  "outline-none transition-colors placeholder:text-ink-muted " +
  "hover:bg-surface-strong focus:bg-paper focus:ring-2 focus:ring-sky-300";

const controlInvalid = "bg-danger-50 ring-2 ring-danger-500";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 text-[0.8125rem] font-medium text-danger-500">
      {message}
    </p>
  );
}

function RequiredMark() {
  return (
    <span className="text-danger-500" aria-hidden="true">
      {" *"}
    </span>
  );
}

interface FoundationFormProps {
  defaults: FoundationDetails;
  options: FoundationOptions;
  /** Rendered between the details card and the status notice. */
  children?: React.ReactNode;
}

/**
 * Foundation Details as a real form: every field required, a difficulty slider,
 * and a duration with a hard 3-minute floor.
 *
 * Errors only appear after a submit attempt — nagging someone mid-typing about
 * a field they have not finished is worse than useless. Once they have seen the
 * errors, the panel updates live as each one is fixed.
 */
export function FoundationForm({
  defaults,
  options,
  children,
}: FoundationFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<FoundationDetails>(defaults);
  const [submitted, setSubmitted] = useState(false);
  const [building, setBuilding] = useState(false);
  const { materials } = useMaterials();
  const [error, setError] = useState<string | null>(null);

  const errors = useMemo(() => validate(values), [values]);
  const errorList = Object.entries(errors) as [FieldName, string][];
  const showErrors = submitted && errorList.length > 0;

  function set<K extends FieldName>(key: K, value: FoundationDetails[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function focusField(name: FieldName) {
    document.getElementById(name)?.focus();
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    setError(null);

    if (errorList.length > 0) {
      focusField(errorList[0]![0]);
      return;
    }

    // The engine grounds every lesson in an uploaded material — no upload, no run.
    if (materials.length === 0) {
      setError(
        "Upload at least one teaching material — every lesson is grounded in what you provide.",
      );
      return;
    }

    setBuilding(true);
    try {
      const board = boardForFramework(values.framework, options);
      const grade = values.gradeLevel.replace(/^grade-/, "");
      const subjectLabel =
        options.subjects.find((option) => option.value === values.subject)
          ?.label ?? values.subject;

      // Ingest each material first, collecting the ids the lesson is grounded in.
      const materialIds: string[] = [];
      for (const material of materials) {
        const { materialId } = await ingestMaterial(material.file, {
          teacherId: TEACHER_ID,
          subject: subjectLabel,
          board,
          grade,
        });
        materialIds.push(materialId);
      }

      const { lessonId } = await runLesson(materialIds, {
        board,
        grade,
        subject: subjectLabel,
        topic: values.topicFocus.trim(),
        durationMins: values.durationMinutes,
        defaultComplexity: values.difficulty,
        visualDemand: 3,
      });

      // Build finished — drop the teacher straight into the student preview of
      // the lesson they just generated. "Back to editor" (in the preview) keeps
      // the same lesson id, so editing is one click away.
      router.push(`/preview?lesson=${encodeURIComponent(lessonId)}`);
    } catch (caught) {
      setBuilding(false);
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not reach the lesson engine. Is it running on port 3001?",
      );
    }
  }

  const difficultyLabel =
    DIFFICULTY_LABELS[values.difficulty - 1] ?? "Balanced";

  const summary = [
    options.gradeLevels.find((o) => o.value === values.gradeLevel)?.label,
    options.subjects.find((o) => o.value === values.subject)?.label,
    `${values.durationMinutes} min`,
    difficultyLabel,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <section className="relative overflow-hidden rounded-panel bg-paper p-6 shadow-card sm:p-8">
        {/* Corner wash — the same motif as the dashboard hero. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-leaf-50"
        />

        <div className="relative">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="flex items-center gap-2.5 text-lg font-bold tracking-[-0.02em] text-leaf-600">
              <ShapesIcon className="size-5" />
              Foundation Details
            </h2>
            <p className="text-[0.75rem] text-ink-muted">
              All fields required
              <RequiredMark />
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Grade level */}
            <div>
              <label htmlFor="gradeLevel" className="label-caps mb-2 block">
                Grade level
                <RequiredMark />
              </label>
              <div className="relative">
                <select
                  id="gradeLevel"
                  required
                  aria-required="true"
                  aria-invalid={showErrors && Boolean(errors.gradeLevel)}
                  aria-describedby={
                    showErrors && errors.gradeLevel ? "gradeLevel-error" : undefined
                  }
                  value={values.gradeLevel}
                  onChange={(event) => set("gradeLevel", event.target.value)}
                  className={cn(
                    control,
                    "cursor-pointer appearance-none pr-12",
                    showErrors && errors.gradeLevel && controlInvalid,
                  )}
                >
                  <option value="">Select a grade…</option>
                  {options.gradeLevels.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="pointer-events-none absolute right-5 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
              </div>
              <FieldError id="gradeLevel-error" message={showErrors ? errors.gradeLevel : undefined} />
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="label-caps mb-2 block">
                Subject
                <RequiredMark />
              </label>
              <div className="relative">
                <select
                  id="subject"
                  required
                  aria-required="true"
                  aria-invalid={showErrors && Boolean(errors.subject)}
                  aria-describedby={
                    showErrors && errors.subject ? "subject-error" : undefined
                  }
                  value={values.subject}
                  onChange={(event) => set("subject", event.target.value)}
                  className={cn(
                    control,
                    "cursor-pointer appearance-none pr-12",
                    showErrors && errors.subject && controlInvalid,
                  )}
                >
                  <option value="">Select a subject…</option>
                  {options.subjects.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="pointer-events-none absolute right-5 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
              </div>
              <FieldError id="subject-error" message={showErrors ? errors.subject : undefined} />
            </div>
          </div>

          {/* Topic focus */}
          <div className="mt-5">
            <label htmlFor="topicFocus" className="label-caps mb-2 block">
              Topic focus
              <RequiredMark />
            </label>
            <input
              id="topicFocus"
              type="text"
              required
              aria-required="true"
              aria-invalid={showErrors && Boolean(errors.topicFocus)}
              aria-describedby={
                showErrors && errors.topicFocus ? "topicFocus-error" : undefined
              }
              value={values.topicFocus}
              onChange={(event) => set("topicFocus", event.target.value)}
              placeholder="What is this module about?"
              className={cn(control, showErrors && errors.topicFocus && controlInvalid)}
            />
            <FieldError id="topicFocus-error" message={showErrors ? errors.topicFocus : undefined} />
          </div>

          {/* Curriculum framework */}
          <div className="mt-5">
            <label htmlFor="framework" className="label-caps mb-2 block">
              Curriculum framework
              <RequiredMark />
            </label>
            <div className="relative">
              <select
                id="framework"
                required
                aria-required="true"
                aria-invalid={showErrors && Boolean(errors.framework)}
                aria-describedby={
                  showErrors && errors.framework ? "framework-error" : undefined
                }
                value={values.framework}
                onChange={(event) => set("framework", event.target.value)}
                className={cn(
                  control,
                  "cursor-pointer appearance-none pr-12",
                  showErrors && errors.framework && controlInvalid,
                )}
              >
                <option value="">Select a framework…</option>
                {options.frameworks.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-5 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
            </div>
            <FieldError id="framework-error" message={showErrors ? errors.framework : undefined} />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 border-t border-line pt-7 sm:grid-cols-2">
            {/* Difficulty */}
            <div>
              <p className="mb-3 flex items-center gap-2 text-[0.8125rem] font-semibold text-ink">
                <GaugeIcon className="size-4 text-ink-soft" />
                How hard should it be?
              </p>
              <Slider
                id="difficulty"
                label="Difficulty"
                valueLabel={difficultyLabel}
                value={values.difficulty}
                min={1}
                max={5}
                ticks={["Gentle", "Challenging"]}
                onChange={(difficulty) => set("difficulty", difficulty)}
                describedBy="difficulty-hint"
              />
              <p id="difficulty-hint" className="mt-2 text-[0.8125rem] text-ink-soft">
                Sets the pitch of examples and how fast scaffolding fades.
              </p>
            </div>

            {/* Duration */}
            <div>
              <p className="mb-3 flex items-center gap-2 text-[0.8125rem] font-semibold text-ink">
                <ClockIcon className="size-4 text-ink-soft" />
                How long is the lesson?
              </p>
              <label htmlFor="durationMinutes" className="label-caps mb-2 block">
                Duration
                <RequiredMark />
              </label>
              <div className="relative">
                <input
                  id="durationMinutes"
                  type="number"
                  inputMode="numeric"
                  required
                  aria-required="true"
                  min={MIN_DURATION_MINUTES}
                  max={MAX_DURATION_MINUTES}
                  step={1}
                  aria-invalid={showErrors && Boolean(errors.durationMinutes)}
                  aria-describedby={
                    showErrors && errors.durationMinutes
                      ? "durationMinutes-error"
                      : "durationMinutes-hint"
                  }
                  value={Number.isFinite(values.durationMinutes) ? values.durationMinutes : ""}
                  onChange={(event) =>
                    set(
                      "durationMinutes",
                      event.target.value === "" ? Number.NaN : Number(event.target.value),
                    )
                  }
                  className={cn(
                    control,
                    "pr-14",
                    showErrors && errors.durationMinutes && controlInvalid,
                  )}
                />
                <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[0.875rem] text-ink-muted">
                  min
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {DURATION_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => set("durationMinutes", preset)}
                    className={cn(
                      "rounded-field border px-3 py-1.5 text-[0.75rem] transition-colors",
                      values.durationMinutes === preset
                        ? "border-sky-300 bg-sky-100 font-semibold text-brand-600"
                        : "border-line text-ink-soft hover:border-sky-300 hover:bg-sky-50",
                    )}
                  >
                    {preset} min
                  </button>
                ))}
              </div>

              <FieldError
                id="durationMinutes-error"
                message={showErrors ? errors.durationMinutes : undefined}
              />
              {showErrors && errors.durationMinutes ? null : (
                <p id="durationMinutes-hint" className="mt-2 text-[0.8125rem] text-ink-soft">
                  Minimum {MIN_DURATION_MINUTES} minutes, maximum{" "}
                  {MAX_DURATION_MINUTES}.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {children}

      {/* On-page status — says what is happening, and what is missing. */}
      {error ? (
        <Notice tone="error" title="Couldn't build the lesson">
          {error}
        </Notice>
      ) : building ? (
        <Notice tone="success" title="Grounding in your material — generating the lesson">
          {summary}
        </Notice>
      ) : showErrors ? (
        <Notice
          tone="error"
          title={`${errorList.length} ${errorList.length === 1 ? "field needs" : "fields need"} your attention`}
        >
          <ul className="space-y-1">
            {errorList.map(([name, message]) => (
              <li key={name}>
                <button
                  type="button"
                  onClick={() => focusField(name)}
                  className="text-left underline decoration-danger-500/40 underline-offset-2 hover:decoration-danger-500"
                >
                  <span className="font-medium text-ink">{FIELD_LABELS[name]}</span>
                  {" — "}
                  {message}
                </button>
              </li>
            ))}
          </ul>
        </Notice>
      ) : (
        <Notice tone="info" title="Ready when you are">
          {summary}. Every field is required — the pipeline uses all six to pitch
          the lesson.
        </Notice>
      )}

      <div className="flex justify-end">
        <Button type="submit" variant="brand" size="lg" disabled={building}>
          {building ? "Building..." : "Continue to Lesson Flow"}
        </Button>
      </div>
    </form>
  );
}
