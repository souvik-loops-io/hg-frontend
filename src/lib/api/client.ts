import {
  artifacts,
  blockFamilies,
  discoveryTip,
  foundationDefaults,
  foundationOptions,
  recentTopics,
  templates,
  weeklyFocus,
} from "@/lib/data/fixtures";
import { lessonModule } from "@/lib/data/lesson";
import type {
  Artifact,
  BlockFamily,
  DiscoveryTip,
  FoundationDetails,
  FoundationOptions,
  LessonModule,
  Template,
  WeeklyFocus,
} from "@/lib/types";

/**
 * Fixture-backed content readers.
 *
 * The real product data — lessons and their blocks — comes from the Cuepilot
 * Lesson Engine through `src/lib/api/engine.ts`. The surfaces below (dashboard
 * artifacts, the library catalogue, templates, the setup form's dropdowns and
 * tip) have *no* backend equivalent yet, so they resolve to the local fixtures
 * in `src/lib/data/`. Kept async so wiring a future service is a one-file change.
 */

/* -------------------------------------------------------------------------
   Dashboard
   ------------------------------------------------------------------------- */

export function listArtifacts(): Promise<Artifact[]> {
  return Promise.resolve(artifacts);
}

export function getArtifact(id: string): Promise<Artifact | null> {
  return Promise.resolve(
    artifacts.find((artifact) => artifact.id === id) ?? null,
  );
}

export function getWeeklyFocus(): Promise<WeeklyFocus> {
  return Promise.resolve(weeklyFocus);
}

/* -------------------------------------------------------------------------
   Setup & Planning — dropdown options, defaults, the discovery tip
   ------------------------------------------------------------------------- */

export interface SetupContext {
  defaults: FoundationDetails;
  options: FoundationOptions;
  tip: DiscoveryTip;
  recentTopics: string[];
}

export function getSetupData(): Promise<SetupContext> {
  return Promise.resolve({
    defaults: foundationDefaults,
    options: foundationOptions,
    tip: discoveryTip,
    recentTopics,
  });
}

/* -------------------------------------------------------------------------
   Lesson flow — fixture fallback when no real lesson id is in the URL
   ------------------------------------------------------------------------- */

/**
 * The demo module shown when the flow screen is opened without a `?lesson=<id>`
 * from the engine. A real lesson is loaded in `curriculum/flow/page.tsx`.
 */
export function getLessonModule(): Promise<LessonModule> {
  return Promise.resolve(lessonModule);
}

/* -------------------------------------------------------------------------
   Library & Templates
   ------------------------------------------------------------------------- */

export function listBlockFamilies(): Promise<BlockFamily[]> {
  return Promise.resolve(blockFamilies);
}

export function listTemplates(): Promise<Template[]> {
  return Promise.resolve(templates);
}
