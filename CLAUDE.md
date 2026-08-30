# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

CuePilot's frontend — a Next.js app for assembling lessons from reusable
pedagogical blocks. It is wired to the **Cuepilot Lesson Engine** backend (repo:
`../cuepilot-lesson-engine`), which does upload → RAG → generation → surgical
edits and **emits this app's own `LessonModule` JSON** at its `/v1/*` endpoints.
The frontend renders blocks with its own components (including real diagram /
flowchart renderers) rather than embedding backend HTML.

## Commands

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # production build
pnpm start        # serve the production build (port 3000)
pnpm typecheck    # tsc --noEmit   (there is no test framework)
pnpm lint         # next lint
```

- Requires Node ≥ 20.11 and **pnpm** (not npm/yarn); pnpm settings live in
  `pnpm-workspace.yaml`.
- **Don't run `pnpm dev` and `pnpm start` together** — they share `.next` and
  will 500 every route. If a route serves stale content, kill port 3000 and
  `rm -rf .next`.
- **Running the full stack:** start the engine first
  (`cd ../cuepilot-lesson-engine && PORT=3001 node server.js`), then `pnpm dev`.
  The engine defaults to port 3001 so it doesn't collide with the frontend.

## The seam — how the two connect

`src/lib/api/engine.ts` is the single boundary to the backend. The engine is one
service reached through `ENGINE_URL` (`NEXT_PUBLIC_ENGINE_URL`, default
`http://localhost:3001`). Its `/v1/*` endpoints return the frontend's own
`LessonModule` shape, so **no component re-shapes lesson data**.

- Reads (`fetchLessonModule`, `listLessons`) run **server-side** in a Server
  Component — no CORS needed.
- Writes (`ingestMaterial`, `runLesson`, `editBlock`, `editLesson`,
  `reorderModule`) run **in the browser** — the backend enables CORS for this.
- `src/lib/api/endpoints.ts` holds `ENGINE_URL` + `v1Endpoints` (the paths).
- `src/lib/api/client.ts` is now **fixture-only**: dashboard artifacts, library
  families, templates, and the setup form's dropdown options/tip have no backend
  equivalent, so they resolve to `src/lib/data/` fixtures.
- `src/lib/api/engine-types.ts` documents the engine's raw wire shapes (the
  backend adapts them to `LessonModule` in its `ui_adapter.js`).

**Golden rule — upload first.** Every lesson is grounded in an uploaded
material; `/v1/runs` (like `/generate`) returns `400 MATERIAL_REQUIRED` without a
`materialId`. There is no auth yet, so every request uses the demo
`TEACHER_ID = "demo-teacher"`.

## The core flow (upload → generate → edit)

1. **Setup** (`(app)/curriculum/page.tsx`, wrapped in `MaterialsProvider`): the
   dropzone (`material-dropzone.tsx`) stores real `File` objects in
   `materials-context.tsx`; `foundation-form.tsx` on submit **ingests each file**
   (`/ingest`), maps the form to a `spec`, calls `runLesson` (`/v1/runs`), then
   navigates to `/curriculum/flow?lesson=<id>`.
2. **Flow** (`(app)/curriculum/flow/page.tsx`, a Server Component): with a
   `?lesson=` id it `fetchLessonModule`s the real lesson and renders
   `LiveWorkspace`; without one (or if the engine is down) it falls back to the
   fixture `FlowWorkspace`.
3. **LiveWorkspace** (`components/planner/live-workspace.tsx`) owns the engine
   round-trips: `ReorderableBlockList` (drag / nudge → `reorderModule`),
   `LessonRenderer` (the live preview), and `LiveInspector` (per-block sliders +
   assistant → `editBlock`; add/delete/lesson-level → `editLesson`). Every write
   replaces the module with the backend's authoritative response.

## Rendering blocks (the diagram/flowchart renderers)

`src/components/lesson/` renders a `LessonBlock` from **structured JSON**, not
HTML. Each block may carry `body?: string[]` (prose) and/or a `figure?: Figure`
(a discriminated union in `src/lib/types.ts`):

| `figure.kind` | renderer | engine source |
| ------------- | -------- | ------------- |
| `flow`        | `FlowchartView` — numbered nodes + connectors + arrow | `sequence`, `flowchart` (decision nodes fold into step text) |
| `number_line` | `NumberLineView` — SVG line, tappable marks | `number_line` |
| `bars`        | `BarsView` — partitioned part–whole bars | `bar_compare` |
| `mcq`         | `McqView` — tappable options, reveal explanation | `mcq` |
| `checklist`   | `ChecklistView` — tickable rows | `activity`, `exit_ticket`, `match_game` |

`LessonRenderer({ blocks, activeId, onSelectBlock })` is the entry point;
`FigureView` dispatches on `figure.kind`. Adding a figure kind means touching the
`Figure` union in `types.ts`, `FigureView`, and the backend's `ui_adapter.js`.

Nine engine block types collapse to four UI **kinds** (`hook | concept |
interactive | assessment`) which drive badge colour — see the backend adapter and
`components/planner/block-badges.ts`.

## Server / client split & conventions

- Server Components by default; `"use client"` only when a component owns
  interaction state. Reads happen in the page and pass down.
- **Tailwind v4 in CSS** via `@theme` in `src/app/globals.css` (no config file).
  Semantic tokens: `text-ink`, `bg-brand-600`, `bg-sky-300`, `rounded-card`, etc.
- **Colour carries meaning, never repurposed:** brand/teal = identity, sky =
  interactive/touchable, leaf = settled/complete, sun = attention, danger =
  destructive only.
- **Never interpolate Tailwind class names** — variant maps are written out in
  full so the compiler sees literals. `cn()` (`src/lib/cn.ts`) joins classes.
- No component library, no CSS-in-JS, no icon package (local SVGs in
  `components/icons.tsx`). Path alias `@/*` → `src/*`. Strict TS with
  `noUncheckedIndexedAccess` — array access is `T | undefined`, guard it.

## Further reading

`docs/` (`PRODUCT.md`, `SCREENS.md`, `ARCHITECTURE.md`, `DESIGN.md`) describes the
product and design system. Note `ARCHITECTURE.md` predates the engine
integration and still describes the old imagined content/AI split — trust this
file and the code for how the backend is actually wired. The backend's own
`CONTRACT.md` is the source of truth for its API.
