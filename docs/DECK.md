# The deck — student-facing presentation

`/present` and `/present/[deckId]`. What a class sees on a projector when the
teacher hits **Preview**.

This is a **separate visual system** from the planner, deliberately. The planner
is a tool; the deck is the lesson. They share a codebase, a stack and nothing
else — no shared colours, no shared type scale, no planner chrome on the deck.

---

## Routes

| Route                | What it is                                                    |
| -------------------- | ------------------------------------------------------------- |
| `/present`           | Sample Presentations — the gallery, one card per deck          |
| `/present/[deckId]`  | One deck, as a long scroll with a progress rail                |

Both live in the `(present)` route group, which has its own layout and no
`AppShell`. The top bar's **Preview** button links to `/present`.

Decks are prerendered via `generateStaticParams` — they are fixtures today, so
there is nothing to fetch.

---

## The section model

A deck is `Deck.sections`: a list of typed sections, rendered by
`DeckSectionView`, which switches on `kind`. Adding a slide type means adding a
variant in [`src/lib/deck-types.ts`](../src/lib/deck-types.ts) and a renderer in
`components/deck/sections/`. Nothing else in the deck machinery changes.

| `kind`       | Renders                                                                   |
| ------------ | ------------------------------------------------------------------------- |
| `cover`      | Unit title at display size, lesson label, accented lesson title, scroll cue |
| `contents`   | "Lesson Flow" — numbered items with dotted leaders                        |
| `concept`    | Eyebrow, accented heading, body, optional discussion points and artwork    |
| `rules`      | The interactive "break the rule" grid                                     |
| `checkpoint` | A single multiple-choice check that reveals on selection                  |
| `close`      | The wrap-up ask                                                           |

`index` decides only the background band. Alternating paper and shell is what
gives a long scroll its rhythm.

## The rules section

The one genuinely interactive slide, and the model for future ones.

Four cards, each holding the correct procedure. Tap **Break this rule** and the
card tilts, the badge flips `Correct → Broken`, and the copy swaps to what
breaking it actually looks like. A live `n / 4` counter sits above, and
**Break all 4** flips every card at once.

The counter is the teaching point: break all four and every reading is wrong,
which is exactly the starter the lesson opened with. The callout bar says so and
links back to `#starter`.

## The progress rail

One dot per section, fixed to the right edge, tracked with an
`IntersectionObserver` (`rootMargin: -45% 0px -45% 0px`) rather than a scroll
listener — the browser does the work and it stays accurate when sections have
very different heights. Each dot is an anchor with the section's `navLabel`,
so it is navigable, not just decorative. Hidden below `sm`.

---

## Design

### Colour

Six tokens, all prefixed `deck-` so they can never leak into the planner.

| Token                       | Value     | Use                                    |
| --------------------------- | --------- | -------------------------------------- |
| `--color-deck-paper`        | `#faf6f2` | Warm paper — the default band           |
| `--color-deck-shell`        | `#f1eae2` | The alternating darker band             |
| `--color-deck-card`         | `#fdfbf9` | Gallery cards                           |
| `--color-deck-ink`          | `#17161a` | Headings and body                       |
| `--color-deck-soft`         | `#5c565a` | Secondary copy                          |
| `--color-deck-muted`        | `#9a918c` | Labels, numbers, inactive dots          |
| `--color-deck-line`         | `#e4dbd2` | Rules, dotted leaders, card borders     |
| `--color-deck-accent`       | `#c2142e` | **One** accent. Crimson.                |
| `--color-deck-accent-soft`  | `#f6dde1` | The script highlight, broken-state chip |

One accent, used sparingly, is what makes the deck feel printed rather than
designed-by-committee.

### Type

Three faces, each with exactly one job:

- **Inter** — display headings at `text-5xl`–`text-7xl`, `tracking-[-0.04em]`.
  Tight tracking is what keeps a big friendly heading from reading as childish.
- **JetBrains Mono** — every label, via `.deck-label` (12px, `0.22em` tracking)
  and `.deck-label-sm` (11px, `0.18em`). Always uppercase. Section eyebrows,
  "SCROLL", "RULES BROKEN", "BREAK THIS RULE".
- **Caveat** — the handwritten accent. Exactly one word per heading, on a soft
  rotated highlight, via `<Accent>`.

Both extra faces load in the `(present)` layout, not the root one, so the
planner never pays for fonts it does not use.

### The accent rule

`<Accent phrase={{ lead, accent, tail }} />` lifts **one** word into Caveat on a
`-0.6deg` highlight. It marks the idea the slide is actually about — *Precision*,
*precautions*, *bundle*. Two accented words in one heading means neither is the
point.

### Illustrations

Inline SVG line art in `components/deck/illustrations.tsx`, drawn in the deck's
two colours: crimson for the thing that matters, ink for everything else. No
image requests, scales to any card.

These are **placeholders for commissioned artwork** — same subject and weight as
the reference decks, deliberately simpler. Swapping in real assets means
replacing the registry entries; nothing else references them by shape.

---

## Making it dynamic

The deck currently reads `src/lib/data/decks.ts`. To drive it from a real module:

1. Add a `deck` reader to `src/lib/api/client.ts` and a path to
   `endpoints.ts` — `/v1/modules/{id}/deck`.
2. Generate `DeckSection[]` from the module's `LessonBlock[]`. The mapping is
   close to one-to-one: `hook → concept`, `concept → concept`,
   `interactive → rules` (or a new kind), `assessment → checkpoint`, plus a
   generated `cover` and `contents` at the front.
3. Point Preview at `/present/{moduleId}` instead of the gallery.

The section model was built for that shape — a deck is a list of typed sections,
which is what a block list already is.
