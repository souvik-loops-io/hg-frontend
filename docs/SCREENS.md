# Screens

Written in **flow order** — the path a teacher actually walks. Supporting
surfaces come after the spine.

```
  /                          Dashboard — pick up where you left off
  │
  ▼
  /curriculum                Setup & Planning — frame the module
  │                          grade · subject · topic · framework · materials
  ▼
  /curriculum/flow           Lesson Flow — the main working screen
  │                          blocks · live student preview · block settings
  ▼
  /blocks/[blockId]/edit     Block Editor — one representation, full screen
  │
  └──▶ back to /curriculum/flow with the change applied

  Supporting:  /library · /templates · /artifacts/[id]
  Reserved:    /objectives · /agentic-plan · /resources · /analytics
```

Each screen lists **Needs** — the env URL it is waiting on to stop being
fixtures.

---

## 1 · `/` — Dashboard

**The entry point.** "Good evening, Sarah 👋" with a one-line orientation, then
the week's headline and the work in flight.

**Weekly focus** is the hero: a leaf eyebrow badge, the number that changed, one
paragraph of what to do about it, and two actions — `View Analytics` (brand) and
`Modify Module` (soft). A pale sky-to-leaf wash sits behind the top-right corner.

**Create New Artifact** sits beside it as a dashed sky tile, so starting
something new is always one click from the front door.

**Recent Artifacts** is three cards under a `View All →` link. Each card carries
a coloured round mark keyed to its subject (calculator / leaf / sigma / book), a
grade badge, a subject badge, the relative update time, and a progress bar —
amber while in progress, leaf when complete, with the label switching from
`Progress · 75%` to `Status · Complete`.

`export const dynamic = "force-dynamic"`, because the fixtures use relative
timestamps.

**Exits to:** an artifact, or `/curriculum` to start a module.
**Needs:** `NEXT_PUBLIC_API_URL`.

---

## 2 · `/curriculum` — Setup & Planning

**Where a module starts.** "Let's build a welcoming foundation for your next
discovery."

**Foundation Details** — a real form, and every one of its six fields is
required. Grade level and subject sit side by side, then topic focus, then
curriculum framework. Below a divider, two controls that set the pitch:

- **Difficulty** — a 1–5 slider labelled Gentle · Easy · Balanced · Stretching ·
  Challenging. The track fills to the thumb, and the current word sits beside
  the label so the value reads without decoding a number.
- **Duration** — a number field in whole minutes with a hard **3-minute floor**
  and a 240-minute ceiling, plus 15/30/45/60 presets. The active preset
  highlights.

**Validation.** Errors appear only after a submit attempt — nagging someone
mid-typing about a field they have not finished is worse than useless. Once
they have been shown, the panel updates live as each is fixed. Invalid controls
get a red ring and `aria-invalid`; the first bad field takes focus on submit.

**Status notice** sits between the form and the button and always says what is
happening:

| State | Notice |
| ----- | ------ |
| Default | Sky "Ready when you are" with a live summary — *Grade 4 · Mathematics · 45 min · Balanced* |
| After a failed submit | Red "2 fields need your attention", each one a button that focuses that field |
| On success | Leaf "Foundation set — building your lesson flow" while the route changes |

Errors announce assertively (`role="alert"`); everything else is polite, so a
running commentary never interrupts typing.

**Material dropzone** — a dashed sky panel that accepts a real drag-and-drop or a
`Browse Files` picker. Dropped names are listed back as pills. Nothing is
uploaded: that needs a real endpoint, so the files stay in component state.

**Right rail** — the amber **Discovery Tip** (the one warm thing on a cool
screen) and **Recent topics** as tappable pills.

**Exits to:** `/curriculum/flow` via `Continue to Lesson Flow`.
**Needs:** `NEXT_PUBLIC_API_URL` for the options and the tip;
`NEXT_PUBLIC_AI_URL` to turn the foundation into a draft.

---

## 3 · `/curriculum/flow` — Lesson Flow

**The main working screen.** Three panes, and the top bar flips so `Preview`
leads and `Save` becomes the outline button.

**Left — Lesson Blocks.** One card per block, each with a kind badge whose colour
is its meaning: Hook is leaf, Concept is sky, Interactive is amber with a hand
icon, Assessment is neutral. A drag handle sits top-right. The selected card gets
a brand border and its title turns brand. The header carries a live count.

**Adding a block is typed, not picked from a menu.** The dashed `Add Block` tile
opens a composer: describe what you want — *"a quick exit ticket on comparing
halves and quarters"* — and the pipeline drafts it. Four suggestion chips seed
the field, Enter submits and Shift+Enter is a newline. While the draft is in
flight a placeholder card in the shape of the coming block holds the spot, then
the new block is appended and selected.

That request goes through `draftBlock()` in `src/lib/ai/draft-block.ts`. With
`NEXT_PUBLIC_AI_URL` set it POSTs an `add-block` run and polls it to completion.
With no service — or if the run fails or returns nothing — it drafts locally,
inferring the block kind from keywords in the prompt, and a toast says so
plainly rather than passing local work off as AI.

**Centre — Live student preview.** What the class actually sees, with a
desktop/mobile viewport toggle that narrows the frame rather than faking a device
chrome. The deck headline underlines its last word in amber. The selected block
carries an amber `✎ EDITING` tab on its top edge, and a block with a
representation shows a breathing sparkle, its status line, and an
`Open full editor` button.

**Right — Block Settings.** Block type as an amber pill, then title, instruction
text and the interactive toggles — all controlled, all writing straight back to
the workspace, so the live preview updates as you type.

`Delete Block` is wired. It takes two deliberate taps: the red button swaps for
an inline confirm naming the block, because deleting is not undoable in-session.
On confirm the block is removed and selection moves to whichever block slides
into its place; empty out the list entirely and the pane invites you to draft
the first one.

**Responsive.** Below `xl` settings becomes a right sheet behind a floating
`Block Settings` button. Below `md` all three panes collapse to a tab strip —
Blocks / Preview / Settings — because a three-column editor at 390px is a lie.
Picking a block on a phone switches you to Preview, since that is what you asked
to see.

**Exits to:** `/blocks/[blockId]/edit`.
**Needs:** `NEXT_PUBLIC_API_URL` for real blocks and to persist edits — nothing
is written back yet, so a reload restores the fixture. `NEXT_PUBLIC_AI_URL` for
real drafting.

---

## 4 · `/blocks/[blockId]/edit` — Block Editor

**One representation, full screen.** No app chrome — this screen is the whole
task.

**Header.** Close, `Edit Block: Fraction Number Line` in brand, then `Discard`
and `Apply Changes`.

**Left card** (sky border). A sky ruler mark, the block name, its
`Grade 4 · Fractions` breadcrumb, and undo/redo. Inside a dashed frame: a
breathing sparkle ring, the status in large brand type — *"Simplifying to halves
and quarters..."* — a plain-language subtitle, and the number line itself with
its quarter ticks.

That status string is not decoration. It is `statusLabel` on the representation,
fed by the AI service's stage stream, and it is written for a teacher rather than
a developer. The ring only breathes while `status` is `updating`.

**Right card** (leaf border). "Edit this representation · Lumina AI Assistant".
Assistant bubbles are grey with a leaf robot mark, the teacher's are sky and
right-aligned, and a pending turn is a three-dot bubble. Pill composer with a
brand send button, and follow-ups scoped to *this* representation —
`Change to Decimals`, `Extend to 2`.

**Responsive.** Cards stack below `lg`; the header sheds `Edit Block:` and
`Discard` below `sm`.

**Exits to:** `/curriculum/flow` — both Close and Discard return there.
**Needs:** `NEXT_PUBLIC_AI_URL`.

---

# Supporting screens

## `/library` — Building blocks

The catalogue you build from, split the way the gallery splits it:
**Presentation Blocks** (smart charts, smart diagrams, layouts, infographics) and
**Teaching Representations** (mathematics, literacy, interactive math, science
and geography). Each section header carries its specimen total; each family card
its own count and a one-line summary.

## `/templates` — Templates

Pedagogical shapes to start a module from. A list, not a grid: these are read as
sentences. Each row carries its subject and segment count.

## `/artifacts/[id]` — Artifact detail

The artifact's mark, title, subject/grade/state badges, and two ways in — open it
in Lesson Flow, or go back to its foundation.

## `/objectives` · `/agentic-plan` · `/resources` · `/analytics`

The remaining sidebar sections. Each states what it will do and names the env var
it depends on, rather than reading as a broken link.

## `404`

Rendered outside every shell, so it carries no chrome. One line and a way back.

---

## Adding a screen

1. Decide which chrome it wears — that picks the route group: `(app)` for
   anything inside the planner shell, `(editor)` for a full-screen takeover.
2. Wrap the body in `<Page>` from `components/shell/app-shell` unless it manages
   its own height like the lesson flow does.
3. Fetch in the page (a Server Component) through `src/lib/api/client.ts`. Add a
   reader there and a path in `endpoints.ts`; never `fetch` from a component.
4. If it is not wired up yet, use `ReservedPanel` and name the env var in
   `dependsOn`. Never ship a blank route.
5. Add it to the flow diagram at the top of this file.
