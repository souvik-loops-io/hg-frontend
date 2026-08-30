# Lumina Learning — Pedagogical Builder

A teacher opens the app on a Sunday night with one sentence in their head:
*"fractions on a number line, Grade 4, forty minutes."* Lumina turns that into a
sequenced lesson made of reusable pedagogical blocks — and then lets them argue
with it. *"Only show halves and quarters — eighths are too much for this intro."*

The idea is borrowed from the
[CuePilot Building Blocks gallery](https://representations-gallery.vercel.app/):
lessons are assembled from a catalogue of **blocks** (presentation structures)
and **representations** (subject-specific models — number lines, Elkonin boxes,
base-ten blocks, climographs) rather than written from a blank page.

**This repository is the frontend.** The backend and the AI service are external
and arrive as URLs in the environment — nothing more.

---

## Quick start

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

Requires Node ≥ 20.11 and pnpm.

```bash
pnpm build          # production build
pnpm start          # serve the production build
pnpm typecheck      # tsc --noEmit
pnpm lint
```

> Don't run `pnpm dev` and `pnpm start` at the same time — they share `.next` and
> will overwrite each other's chunks, which surfaces as every route 500ing.

---

## Environment

Copy `.env.example` to `.env.local`. Both variables are optional.

| Variable              | Service                                          | Blank means                                     |
| --------------------- | ------------------------------------------------ | ----------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | Content — artifacts, modules, library, templates  | Serve fixtures from `src/lib/data/`              |
| `NEXT_PUBLIC_AI_URL`  | Generation — pipeline runs and SSE stage streams  | Assistant panels render a scripted conversation  |

Everything remote goes through one file:
[`src/lib/api/client.ts`](src/lib/api/client.ts). Set a URL and the same
functions issue real `fetch` calls; if a configured service fails, the client
logs and falls back to fixtures rather than blanking the page. **No component
changes are needed to go live.**

Paths live in [`src/lib/api/endpoints.ts`](src/lib/api/endpoints.ts) so no URL
string is written twice.

---

## Screens, in flow order

The product has one spine. Each screen hands off to the next.

```
  /                          Dashboard — pick up where you left off
  │
  ▼
  /curriculum                Setup & Planning — frame the module
  │
  ▼
  /curriculum/flow           Lesson Flow — blocks · live preview · settings
  │
  ▼
  /blocks/[blockId]/edit     Block Editor — one representation, full screen

  Supporting:  /library · /templates · /artifacts/[id]
  Reserved:    /objectives · /agentic-plan · /resources · /analytics
```

Screen-by-screen anatomy: [`docs/SCREENS.md`](docs/SCREENS.md).

---

## Layout

```
hackathon/
├─ src/
│  ├─ app/                 routes, grouped by which chrome they wear
│  │  ├─ layout.tsx        <html>, font, skip link — no chrome
│  │  ├─ (app)/            top bar + planner sidebar
│  │  └─ (editor)/         no chrome — full-screen takeover
│  ├─ components/
│  │  ├─ shell/            top bar, planner sidebar, app shell + Page
│  │  ├─ dashboard/        weekly focus, artifact cards, create tile
│  │  ├─ planner/          block list, student preview, settings, block editor
│  │  ├─ ai/               chat bubbles, composer, avatars
│  │  ├─ ui/               button, badge, field, toggle, page header
│  │  └─ icons.tsx         local SVGs on a shared 24px / 1.75-stroke grid
│  └─ lib/
│     ├─ api/              client.ts (the seam) + endpoints.ts
│     ├─ data/             fixtures — stand in for both services
│     └─ types.ts          the domain, and the response contract
└─ docs/
```

Stack: Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind v4
configured entirely in CSS via `@theme`. No component library, no CSS-in-JS, no
icon package.

---

## Documentation

Kept as separate files, meant to be edited as the product moves.

- [Product](docs/PRODUCT.md) — the idea, the vocabulary, the user journeys
- [Screens](docs/SCREENS.md) — every screen in flow order, and what it still needs
- [Architecture](docs/ARCHITECTURE.md) — route groups, the seam, conventions
- [Design system](docs/DESIGN.md) — tokens, what the colours mean, responsive rules
# hackathon-frontend
# hackathon-frontend
