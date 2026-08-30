# Product

## The problem

Lesson planning collapses into two bad options. Either a teacher writes every
lesson from a blank page on a Sunday night, or they download someone else's
worksheet that was never designed for their class, their board, or their grade.

The middle ground — *"give me a good lesson and let me change the parts that are
wrong for my kids"* — barely exists as software.

## The idea

Lessons are **assembled**, not authored.

Lumina keeps a catalogue of pedagogical components. A module is a sequence of
blocks; a block holds a representation; a representation is a thing students
actually manipulate. Generation picks components and orders them. Editing means
talking to the assistant about one component, in place, while the rest of the
lesson stays put.

This borrows directly from the
[CuePilot Building Blocks gallery](https://representations-gallery.vercel.app/),
which catalogues 532 specimens across 15 families and shows each one *inside a
real lesson* rather than in isolation.

## Vocabulary

Use these words consistently — they are the type names too.

| Term               | Meaning                                                                       |
| ------------------ | ----------------------------------------------------------------------------- |
| **Artifact**       | A complete teaching material — a lesson, quiz, or interactive module.          |
| **Module**         | An artifact open in the planner, with its foundation and block flow.           |
| **Block**          | One step in a module's flow. Has a kind, a title, a summary and instruction text. |
| **Kind**           | The pedagogical role of a block: `hook`, `concept`, `interactive`, `assessment`. |
| **Representation** | A subject-specific model that makes a concept tangible — number line, Elkonin boxes, base-ten blocks, climograph. |
| **Foundation**     | The framing of a module: grade level, subject, topic focus, curriculum framework. |
| **Family**         | A grouping in the library — Smart Charts, Mathematics, Literacy.               |
| **Specimen**       | One concrete example within a family.                                          |

Two top-level categories in the library:

- **Presentation blocks** — generic visual structure: charts, diagrams, layouts,
  infographics. Subject-agnostic.
- **Teaching representations** — subject-specific models. This is where the
  pedagogy lives.

## Who it's for

**Sarah**, the primary persona: a Grade 4 mathematics class teacher. Time-poor,
subject-confident, not a designer. She wants a lesson that is *nearly* right in
thirty seconds and completely right in five minutes.

Design consequences, and they are load-bearing:

- **Kid-legible, not kid-styled.** What she builds gets projected in front of
  eight-year-olds. Type is large, contrast is high, corners are round, colour
  carries meaning rather than decoration.
- **She sees what they see.** The lesson flow puts a live student preview in the
  middle of the editor, not behind a Preview button.
- **Nothing is a dead end.** Surfaces that aren't wired up yet still say what
  they will do and what they depend on.
- **Editing is conversational, not modal.** "Only show halves and quarters" beats
  a properties panel with a *denominators* dropdown.

## Colour as meaning

Five roles, each with a job. Full palette in [DESIGN.md](DESIGN.md).

- **Brand (teal)** — identity, headings, the primary commitment. `Save`,
  `Apply Changes`.
- **Sky** — anything you can touch. `New Module`, the active sidebar pill, block
  drag targets, the teacher's own chat bubble.
- **Leaf** — settled and complete. Hook blocks, a finished artifact, the
  assistant's mark.
- **Sun** — attention. The Discovery Tip, an in-progress bar, the Interactive
  block type, the `EDITING` tab.
- **Danger** — destructive, and nothing else. Exactly one button uses it.

**Never swap them.** A teacher should be able to tell from across the room
whether something is finished, in flight, or about to be deleted.

## Core journeys

### 1. Sunday-night pickup
Open the dashboard → the week's headline number → three recent artifacts with
progress → resume the one from two hours ago. *Built.*

### 2. Frame a new module
Setup & Planning: grade, subject, topic, curriculum framework. Drop in last
year's worksheet to inform it. A Discovery Tip suggests what tends to work at
this grade. *Built (fixture data; uploads stay in the browser).*

### 3. Build the lesson
Lesson Flow: block list on the left, live student preview in the middle, block
settings on the right. Select a block and all three panes agree on it. *Built
(fixture data).*

### 4. Argue with a representation
Open the full-screen block editor. "Only show halves and quarters." The assistant
restates what it has, the teacher corrects it, the preview updates in place.
*Built as UI; pipeline reserved.*

### 5. Generate from a brief
Foundation in, sequenced draft out, streamed stage by stage into the preview.
*Reserved — needs `NEXT_PUBLIC_AI_URL`.*

## What is deliberately not here

- Authentication and multi-teacher workspaces.
- Persistence — nothing edited in the UI survives a reload yet.
- Real generation. Every AI surface renders a scripted conversation.
- File upload. The dropzone accepts files and lists them; nothing is sent.
- Export to PPTX/PDF.

Each of these has a named home in the architecture; none of them are hidden
behind a "coming soon" that fails to say what it depends on — every reserved
surface names the env var it is waiting for.
