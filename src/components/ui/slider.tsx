"use client";

import { cn } from "@/lib/cn";

interface SliderProps {
  id: string;
  label: string;
  /** Rendered beside the label — the human name for the current value. */
  valueLabel: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  /** Endpoint captions under the track, e.g. "Gentle" … "Challenging". */
  ticks?: string[];
  onChange: (value: number) => void;
  describedBy?: string;
}

export function Slider({
  id,
  label,
  valueLabel,
  value,
  min,
  max,
  step = 1,
  ticks,
  onChange,
  describedBy,
}: SliderProps) {
  // Fill the track up to the thumb so the value reads at a glance.
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="label-caps">
          {label}
        </label>
        <span className="text-[0.875rem] font-semibold text-brand-600">
          {valueLabel}
        </span>
      </div>

      <input
        id={id}
        name={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-describedby={describedBy}
        aria-valuetext={valueLabel}
        onChange={(event) => onChange(Number(event.target.value))}
        className="lumina-range w-full"
        style={{ ["--fill" as string]: `${percent}%` }}
      />

      {ticks?.length ? (
        <div
          aria-hidden="true"
          className="mt-2 flex justify-between text-[0.6875rem] text-ink-muted"
        >
          {ticks.map((tick, index) => (
            <span
              key={tick}
              className={cn(
                index === 0 && "text-left",
                index === ticks.length - 1 && "text-right",
              )}
            >
              {tick}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
