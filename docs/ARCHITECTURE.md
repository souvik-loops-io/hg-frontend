# Architecture

This repository is **the frontend only**. The backend and the AI service are
external systems that arrive as URLs in the environment — nothing more.

```
┌──────────────────────────────────────────────────────────────┐
│  This repo — Next.js 15 · App Router · React 19 · Tailwind 4 │
│                                                              │
│    src/app          route groups + pages (RSC by default)    │
│    src/components   shell · dashboard · planner · ai · ui     │
│    src/lib/api      ← THE SEAM                               │
│    src/lib/data     fixtures (stand in for both services)    │
└───────────────┬──────────────────────────┬───────────────────┘
                │                          │
   NEXT_PUBLIC_API_URL          NEXT_PUBLIC_AI_URL
                │                          │
        ┌───────▼────────┐         ┌───────▼────────┐
        │ Content service│         │  AI service    │
        │ artifacts      │         │  pipeline runs │
        │ modules        │         │  SSE stage     │
        │ library        │         │  streams       │
        │ templates      │         │                │
        └────────────────┘         └────────────────┘
              external                  external
```

Neither URL is required to run the app.

## The seam

`src/lib/api/client.ts` is the single boundary between the UI and anything
remote. Every component reads through it; no component knows a URL exists.

```ts
async function readContent<T>(path: string, fixture: T): Promise<T> {
  if (!isApiConfigured) return fixture;          // NEXT_PUBLIC_API_URL unset
  try {
    return await request<T>(API_URL, path);
  } catch (error) {
    console.error("[lumina] content request failed, using fixtures.", error);
    return fixture;                              // never blank the page
  }
}
```

Three consequences worth stating:

1. The app runs standalone — no backend, no key, no database.
2. Pointing it at a real service is **one env var**, zero component changes.
3. A cold or crashed service degrades to fixtures instead of a white screen.
   That matters when a demo is being judged.

Paths live in `src/lib/api/endpoints.ts`, split by service, so no URL string is
written twice.

### Exports

| Export                               | What it does                              |
| ------------------------------------ | ----------------------------------------- |
| `listArtifacts`                      | Dashboard grid                            |
| `getArtifact`                        | Artifact detail                          |
| `getWeeklyFocus`                     | Dashboard hero                           |
| `getSetupData`                       | Setup & Planning — defaults, options, tip |
| `getLessonModule`                    | Lesson Flow and the Block Editor          |
| `listBlockFamilies`                  | Library catalogue                        |
| `listTemplates`                      | Templates list                           |
| `startRun`                           | POST a run. Rejects if no AI URL.         |
| `getRun`                             | Poll one run. Rejects if no AI URL.       |
| `runStreamUrl`                       | Absolute SSE URL, or `null`.             |
| `isApiConfigured` / `isAiConfigured` | Branch without reading env twice.        |

Content readers fall back to fixtures. Generation calls do **not** — a run either
happens or it does not, and silently faking one would be a lie.

One layer up, `src/lib/ai/draft-block.ts` turns a typed request into a lesson
block: it uses `startRun` + `getRun` when the AI service is configured, and
drafts locally otherwise. It returns `source: "ai" | "local"` so the UI can say
which path produced the block instead of implying the pipeline ran.

## Route groups

Two shells, so a screen never inherits chrome it shouldn't have.

```
src/app/
├─ layout.tsx              <html>, font, skip-link — no chrome
├─ not-found.tsx           404, outside every shell
├─ (app)/                  the planner shell
│  ├─ layout.tsx           → AppShell: top bar + planner sidebar
│  ├─ page.tsx             /                        dashboard
│  ├─ curriculum/
│  │  ├─ page.tsx          /curriculum              Setup & Planning
│  │  └─ flow/page.tsx     /curriculum/flow         Lesson Flow
│  ├─ library/             /library
│  ├─ templates/           /templates
│  ├─ artifacts/[id]/      /artifacts/[id]
│  └─ objectives/ · agentic-plan/ · resources/ · analytics/
└─ (editor)/               no chrome at all — full-screen takeover
   └─ blocks/[blockId]/edit/                        Block Editor
```

`AppShell` is `h-dvh` with `main` as the only scroller. `/curriculum/flow` opts
`main` out of scrolling and lays out its own fixed-height panes; every other
screen wraps its body in `<Page>` for the standard padded container. The shell
also flips the top bar's leading action to `Preview` on the flow screen.

## Server / client split

Server Components are the default. A component becomes `"use client"` only when
it owns interaction state:

| Client component            | Why                                             |
| --------------------------- | ----------------------------------------------- |
| `AppShell`                  | mobile drawer, scroll lock, Escape handling     |
| `TopBar`, `PlannerSidebar`  | `usePathname` for active nav                    |
| `FlowWorkspace`             | owns the block list — add, edit, delete         |
| `BlockList`                 | selection, add-block composer                   |
| `StudentPreview`            | viewport toggle                                 |
| `BlockSettings`, `Toggle`   | form state                                      |
| `FoundationForm`            | form values, validation, status notice          |
| `Slider`, `MaterialDropzone`| range value; drag state and file list           |
| `BlockEditor`, `Composer`   | composer state                                  |

Data fetching happens in the page (a Server Component) and is passed down. The
dashboard sets `export const dynamic = "force-dynamic"` because fixtures use
relative timestamps.

`FlowWorkspace` owns the block array for the session. `BlockList`,
`StudentPreview` and `BlockSettings` all render from it and write back through
`updateBlock` / `deleteBlock` / `addBlock`, so the three panes can never
disagree. Inputs are controlled, which is what makes the live preview live.

Nothing is persisted — writing back needs `NEXT_PUBLIC_API_URL`, so a reload
restores the fixture.

## Time handling

Relative timestamps ("Updated 2h ago") are a classic hydration mismatch. The fix:
the page resolves `Date.now()` **once** and threads it down as a `now` prop.
`formatUpdatedAt(iso, now)` is pure, so server and client always agree.

The same discipline applies to the greeting — `greetingForHour(hour)` takes the
hour rather than reading the clock.

## Styling

Tailwind v4, configured entirely in CSS via `@theme` in `src/app/globals.css` —
no `tailwind.config.js`. Tokens are semantic (`--color-ink`,
`--color-brand-600`, `--radius-card`), so utilities read as `text-ink`,
`bg-brand-600`, `rounded-card`.

Full rationale in [DESIGN.md](DESIGN.md).

## Conventions

- **Path alias** `@/*` → `src/*`.
- **Strict TS** with `noUncheckedIndexedAccess` — array access is `T | undefined`
  and must be handled.
- **Icons** are local SVG components on a shared 24px / 1.75-stroke grid. No icon
  package.
- **No CSS-in-JS, no component library.** Tailwind utilities plus a handful of
  primitives in `components/ui/`.
- **Class merging** is a six-line `cn()` — no `clsx`, no `tailwind-merge`.
- **Never interpolate class names.** Tailwind only sees literals; variant maps in
  `Button` and `Badge` are written out in full for exactly this reason.

## Wiring a real service

1. Stand the service up somewhere reachable.
2. Put its base URL in `.env.local` as `NEXT_PUBLIC_API_URL` and/or
   `NEXT_PUBLIC_AI_URL`.
3. Make it answer the paths in `src/lib/api/endpoints.ts` with the shapes in
   `src/lib/types.ts`.

Nothing in `src/components/` changes.
