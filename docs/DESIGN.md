# Design system

Everything lives in `src/app/globals.css` as Tailwind v4 `@theme` tokens. There
is no `tailwind.config.js`.

## Principle

Warm paper, deep teal ink, soft sky for anything you can touch. Everything is a
rounded rectangle or a pill; nothing has a hard corner.

The teacher builds it; eight-year-olds read it on a projector at the back of a
room. So: large type, high contrast, generous spacing — and colour that **means**
something rather than decorating.

## Colour

Five roles. Learn these and the whole product is predictable.

| Role       | Scale           | Means                                                |
| ---------- | --------------- | ---------------------------------------------------- |
| **brand**  | teal, 50–700    | Identity, headings, the primary commitment            |
| **sky**    | 50–500          | Interactive — buttons you press, blocks you drag      |
| **leaf**   | 50–600          | Settled and complete — Hook blocks, "Complete", the assistant |
| **sun**    | 50–600          | Attention — tips, in progress, the Interactive block type |
| **danger** | 50, 500         | Destructive, and nothing else                         |

**Never swap them.** A teacher should be able to tell from across the room
whether something is finished, in flight, or about to be deleted.

### Ink and paper

| Token                    | Value     | Use                                                    |
| ------------------------ | --------- | ------------------------------------------------------ |
| `--color-ink`            | `#2f3437` | Body text. Warm charcoal, never pure black.             |
| `--color-ink-soft`       | `#6b7480` | Secondary text, descriptions                            |
| `--color-ink-muted`      | `#9aa2ab` | Timestamps, hints, disabled                             |
| `--color-paper`          | `#ffffff` | Cards, panels, the sidebar                              |
| `--color-canvas`         | `#faf9f7` | Page background — warm, not grey                        |
| `--color-surface`        | `#f3f2f0` | Field fills, secondary buttons                          |
| `--color-surface-strong` | `#eae9e6` | Badges, progress tracks                                 |
| `--color-line`           | `#ebeae7` | Default borders                                         |
| `--color-line-strong`    | `#d8d6d2` | Dashed borders, emphasis                                |

### Key accents

`--color-brand-600` `#0e5e76` is the wordmark and every `Save` / `Apply Changes`.
`--color-sky-300` `#7dcdee` is `New Module`, the active sidebar pill, and the
teacher's chat bubble. `--color-sun-400` `#f2c94c` is the in-progress bar and the
`EDITING` tab.

## Type

One family: **Inter**, loaded through `next/font/google`. No monospace anywhere —
the earlier design used it for controls; this one uses weight and letterspacing
instead.

- Display headings: `text-3xl` → `text-5xl`, `font-bold`, `tracking-[-0.035em]`
- Card titles: `text-lg`/`text-xl`, `font-bold`, `tracking-[-0.02em]`
- Body: `text-[0.9375rem]`, `leading-relaxed`, `text-ink-soft`
- `.label-caps` — 11px, `font-semibold`, `0.09em` tracking, uppercase. Used for
  "GRADE LEVEL", "RECENT TOPICS", "BLOCK TYPE", "LIVE STUDENT PREVIEW".

Negative tracking on every heading is what keeps a friendly typeface from
reading as childish.

## Shape

| Token             | Value     | Use                                             |
| ----------------- | --------- | ----------------------------------------------- |
| `--radius-field`  | `999px`   | Every button, input, select, badge, nav item     |
| `--radius-block`  | `1rem`    | Inset panels inside a card                       |
| `--radius-card`   | `1.25rem` | Block cards, chat bubbles, preview blocks         |
| `--radius-panel`  | `1.5rem`  | Top-level cards — hero, foundation, editor panes  |

Two shadows only: `--shadow-card` for a resting card, `--shadow-lift` for
anything floating or hovered.

## Components

| Primitive       | Notes                                                                    |
| --------------- | ------------------------------------------------------------------------ |
| `Button`        | `brand · sky · soft · outline · ghost · danger` × `sm · md · lg`. Always a pill. |
| `Badge`         | `neutral · brand · sky · leaf · sun`, with a `caps` flag for taxonomy labels |
| `Toggle`        | Controlled `role="switch"`, label left, switch right                     |
| `IconButton`    | Requires `label`; sets `aria-label` and `title`                          |
| `Notice`        | On-page status in three tones (info, error, success) with matching ARIA live-ness |
| `Slider`        | Range input with a filled track and a human value label                  |
| `ReservedPanel` | Dashed sky panel naming the env var it waits on                          |
| `Page`          | The standard padded container, from `shell/app-shell`                     |

Variant maps in `Button` and `Badge` are written out in full because Tailwind
only sees literal class strings.

## Motion

Two keyframes, both slow enough not to distract a classroom:

- `animate-breathe` — a 2s opacity pulse for "AI is working". Applied only when
  `status === "updating"`.
- `animate-typing-dot` — a three-dot bounce, staggered 0.16s.

Everything else is a 150ms colour or transform transition. Buttons scale to
`0.98` on press; cards lift `0.5` on hover.

`prefers-reduced-motion: reduce` collapses every animation and transition to
0.01ms globally.

## Responsive

Tailwind defaults: `sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280.

### Everything inside the planner shell

| Width | Behaviour                                                        |
| ----- | ---------------------------------------------------------------- |
| `<sm` | One card column; `Preview` drops from the top bar                 |
| `sm`  | Two columns                                                      |
| `<lg` | Planner sidebar becomes a left drawer behind a hamburger          |
| `lg`  | Sidebar docks at 18rem; hero and rail split                       |
| `xl`  | Three artifact columns                                           |

### Lesson Flow (`/curriculum/flow`)

| Width    | Behaviour                                                            |
| -------- | -------------------------------------------------------------------- |
| `<md`    | Tab strip — one of Blocks / Preview / Settings at a time              |
| `md–xl`  | Blocks (20rem) + preview; settings is a right sheet behind a button   |
| `xl`     | All three panes docked: 20rem + flexible + 20rem                     |

### Block Editor (`/blocks/[id]/edit`)

| Width | Behaviour                                              |
| ----- | ------------------------------------------------------ |
| `<sm` | Header sheds `Edit Block:` and `Discard`                |
| `<lg` | Preview stacks above the assistant                     |
| `lg`  | Side by side: preview flexible, assistant 26rem         |

The shell is `h-dvh` with `main` as the only scroller, so a screen that wants
fixed-height panes just fills it.

## Accessibility

- Focus ring is a 2px sky outline with 2px offset, defined once on
  `:focus-visible` — never removed.
- Every icon-only control goes through `IconButton`, which **requires** a `label`.
- The viewport toggle is a real `radiogroup`; the pane switcher is a real
  `tablist`; `Toggle` is a real `role="switch"` with `aria-checked`.
- Overlays: `role="dialog"`, `aria-modal`, Escape to close, scroll lock, and
  `tabIndex={-1}` on contents while closed so hidden controls stay out of the
  tab order.
- Artifact cards use a stretched pseudo-element link — the whole card is
  clickable, but only the title is a tab stop.
- Progress bars carry `role="progressbar"` with `aria-valuenow`.
- Required fields are marked visually and with `aria-required`; invalid ones get
  `aria-invalid` plus an `aria-describedby` error message. The error `Notice` is
  `role="alert"`; the info and success tones are polite `role="status"`.
- Skeleton screens sit in one `LoadingRegion` — `role="status"`, `aria-busy`, and
  a single visually-hidden label, rather than one announcement per bar.
- Decorative SVGs are `aria-hidden`; the number line carries `role="img"` and a
  description.
- A skip-to-content link is the first focusable element on every page.

## Adding a component

1. Reach for `components/ui/` first.
2. Use semantic tokens (`text-ink-soft`, `bg-sky-300`), never a raw hex or a
   stock Tailwind palette colour (`text-gray-500`).
3. Pick the accent by meaning, not taste — see the five roles above.
4. Write full class strings. Never build a class name by interpolation.
