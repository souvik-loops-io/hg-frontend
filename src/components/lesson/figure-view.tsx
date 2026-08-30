"use client";

import type { Figure } from "@/lib/types";

import { BarsView } from "./bars-view";
import { ChecklistView } from "./checklist-view";
import { FlowchartView } from "./flowchart-view";
import { McqView } from "./mcq-view";
import { NumberLineView } from "./number-line-view";

// Re-export each sub-view so callers can reach for a specific renderer.
export { BarsView } from "./bars-view";
export { ChecklistView } from "./checklist-view";
export { FlowchartView } from "./flowchart-view";
export { McqView } from "./mcq-view";
export { NumberLineView } from "./number-line-view";

/**
 * Renders a structured `Figure` as a real component, switching on its `kind`
 * discriminant. This is the single entry point block-view reaches for.
 */
export function FigureView({ figure }: { figure: Figure }) {
  switch (figure.kind) {
    case "number_line":
      return <NumberLineView figure={figure} />;
    case "bars":
      return <BarsView figure={figure} />;
    case "flow":
      return <FlowchartView figure={figure} />;
    case "mcq":
      return <McqView figure={figure} />;
    case "checklist":
      return <ChecklistView figure={figure} />;
    default: {
      // Exhaustiveness guard — a new Figure kind must be handled above.
      const _exhaustive: never = figure;
      return _exhaustive;
    }
  }
}
