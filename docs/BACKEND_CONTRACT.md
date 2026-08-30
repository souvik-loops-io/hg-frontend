# Backend Contract — what the frontend expects

**Status:** proposal from the frontend, for the backend to argue with.
**Transport decision:** **HTTP polling only.** No WebSocket, no SSE.
**Audience:** whoever builds the content service and the generation service.

This document is written against the types that already exist in this repo. Every
JSON shape below maps 1:1 to a TypeScript interface in
[`src/lib/types.ts`](../src/lib/types.ts) or
[`src/lib/deck-types.ts`](../src/lib/deck-types.ts). If a field here disagrees with
those files, **the files win** — tell us and we change the file, not the parser.

---

## 0 · The one-paragraph version

There are two services. The **content service** serves and stores lesson data over
plain REST. The **generation service** runs AI jobs; because we have no socket, a
job is a **resource we poll**. Long jobs — generating a whole module — must not
make us wait for the last block before we can show the first. So a run exposes a
**monotonic cursor** and we poll with `?since=<cursor>`, receiving only what is new.
Blocks appear on the teacher's canvas one at a time, as the backend finishes them.

---

## 1 · Ground rules

These apply to every endpoint on both services.

### 1.1 Base URLs

Two environment variables, both optional, both already wired:

| Variable | Service | Blank means |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Content — artifacts, modules, library, templates, decks | Frontend serves fixtures from `src/lib/data/` |
| `NEXT_PUBLIC_AI_URL` | Generation — runs | Assistant drafts on-device and says so |

They may point at the same origin. Every path below is appended verbatim to the
base URL — no trailing slash on the base, leading slash on the path. Paths live in
[`src/lib/api/endpoints.ts`](../src/lib/api/endpoints.ts).

### 1.2 Response envelope — bare JSON, no wrapper

This is the single most likely place to waste an afternoon, so it is rule one.

```ts
return (await response.json()) as T;   // src/lib/api/client.ts
```

A list endpoint returns **an array at the top level**. An object endpoint returns
**the object at the top level**.

```jsonc
// GOOD — GET /v1/artifacts
[ { "id": "fraction-mastery" }, { "id": "plant-life-cycles" } ]

// BAD — we will not unwrap any of these
{ "data": [] }
{ "success": true, "result": [] }
{ "items": [], "meta": {} }
```

If you need envelopes for pagination later, say so and we will add an unwrap step
deliberately — but not by surprise at integration time.

### 1.3 Errors

Any non-2xx throws `ApiError(status, url)` on our side. The **status code is what
we branch on**; the body is for the console and for you.

```jsonc
// any 4xx / 5xx
{
  "error": {
    "code": "module_not_found",                 // stable, snake_case, safe to switch on
    "message": "No module with id mod_123.",    // human, may change
    "details": { "moduleId": "mod_123" }        // optional
  }
}
```

Status codes we handle distinctly:

| Status | We do |
| --- | --- |
| `200` | Normal path |
| `304` | Reuse cached body (see 1.5) |
| `404` | Content reads fall back to fixtures; `getArtifact` renders not-found |
| `409` | Save conflict — we re-fetch and tell the teacher |
| `422` | Validation — we surface `error.message` in the form |
| `429` | Back off using `Retry-After` |
| `5xx` | Content reads fall back to fixtures; runs surface the failure honestly |

**Never return `200` with an error body.** Content reads fall back to fixtures on
throw, so a `200`-wrapped error renders as real data and silently lies to a teacher.

### 1.4 CORS — matters for the generation service, not the content service

This is not symmetric, and it trips people up:

- **Content reads happen on the Next.js server** (React Server Components). They are
  server-to-server. CORS does not apply. Don't debug a CORS problem that isn't there.
- **Generation runs happen in the browser.** `FlowWorkspace` is a client component;
  `startRun` and the poll loop are `fetch` calls from the user's tab.

So the **generation service must send CORS headers**:

```
Access-Control-Allow-Origin: http://localhost:3000   (and the deployed origin)
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, If-None-Match, Authorization
Access-Control-Expose-Headers: ETag, Retry-After
Access-Control-Max-Age: 600
```

`POST /v1/runs` sends `Content-Type: application/json`, which triggers a preflight.
**`OPTIONS` must return 204 with those headers**, or every run fails before it starts.

Any content-service write endpoint we call from the browser needs the same treatment.
Flagged per-endpoint below.

### 1.5 Caching

| Kind of request | What we send | What we want back |
| --- | --- | --- |
| Content GET | Next.js ISR, `revalidate: 30` | `Cache-Control: public, max-age=30`, plus an `ETag` |
| Run POST | `cache: "no-store"` | `Cache-Control: no-store` |
| Run poll GET | `cache: "no-store"`, `If-None-Match` | `ETag`; `304` when nothing changed |

`304` on run polls is the cheap win — a 3-minute module generation is ~90 polls and
most of them have nothing new. Return `304` and we skip the parse entirely.

### 1.6 Identifiers, timestamps, enums

- **IDs** — opaque, URL-safe strings. We `encodeURIComponent` them anyway. Don't
  assume we parse structure out of them; we don't and won't.
- **Timestamps** — ISO 8601 with an explicit offset, UTC preferred:
  `"2026-08-30T14:22:05Z"`. `updatedAt` renders as relative time
  ([`src/lib/relative-time.ts`](../src/lib/relative-time.ts)), so clock skew shows up
  to a teacher as "in 4 minutes". Please use server time consistently.
- **Enums are closed sets.** `kind`, `state`, `status`, `subject`, `category`, `icon`,
  and every deck `kind` drive `switch` statements and colour tokens. An unknown value
  is not a styling miss — it is a blank region of the screen. Adding one is a one-line
  frontend change; just tell us first.

### 1.7 Auth

There is none today, and nothing in the client sends a credential. When it lands we
want a **bearer token in an `Authorization` header**, set once inside `request()`.

Please do **not** use cookie auth — content reads are server-side and would need the
cookie forwarded across the RSC boundary, which is a far larger change than a header.

---

## 2 · Content service

Base: `NEXT_PUBLIC_API_URL`. All reads fall back to fixtures on any failure, so a cold
service degrades to a working demo rather than a white screen. That safety net is also
why a `200`-with-error-body is worse than a clean `500`.

### 2.1 Reads (already called by the app today)

#### `GET /v1/artifacts`

Dashboard grid. Returns `Artifact[]`, newest `updatedAt` first.

```jsonc
[
  {
    "id": "fraction-mastery",
    "title": "Fraction Mastery",
    "subject": "Math",                  // "Math" | "Science" | "Literacy" | "Geography"
    "grade": 6,                         // integer, rendered as "Gr 6"
    "icon": "calculator",               // "calculator" | "leaf" | "sigma" | "book"
    "state": "progress",                // "progress" | "complete" | "draft"
    "progress": 75,                     // 0-100 integer; ignored when state is "complete"
    "updatedAt": "2026-08-30T12:11:00Z"
  }
]
```

#### `GET /v1/artifacts/{id}`

One `Artifact`, same shape. `404` when unknown.

#### `GET /v1/dashboard/weekly-focus`

```jsonc
{
  "eyebrow": "Weekly focus",
  "title": "Fraction Mastery engagement is up 24%",
  "body": "Your Grade 6 students are progressing rapidly through the visual models."
}
```

#### `GET /v1/setup/context`

Everything the Setup & Planning form needs, in one round trip.

```jsonc
{
  "defaults": {
    "gradeLevel": "grade-4",
    "subject": "math",
    "topicFocus": "Fractions on a number line",
    "framework": "cbse",
    "difficulty": 3,                    // integer 1-5
    "durationMinutes": 40               // integer, 3 <= n <= 240
  },
  "options": {
    "gradeLevels": [{ "value": "grade-4", "label": "Grade 4" }],
    "subjects":    [{ "value": "math",    "label": "Mathematics" }],
    "frameworks":  [{ "value": "cbse",    "label": "CBSE" }]
  },
  "tip": { "title": "Discovery tip", "body": "Start with what they already know." },
  "recentTopics": ["Equivalent fractions", "Place value to 10,000"]
}
```

`defaults.gradeLevel` / `subject` / `framework` **must each be a `value` present in the
matching `options` array**, or the select renders blank. This is the most common
real-world break in this payload — worth a server-side assertion.

Duration bounds are enforced in the UI (`MIN_DURATION_MINUTES = 3`,
`MAX_DURATION_MINUTES = 240`). Please enforce them server-side too.

#### `GET /v1/modules/current`

The module the planner opens. Returns a `LessonModule` with its blocks inline.

```jsonc
{
  "id": "mod_fractions_g4",
  "title": "Fractions on a Number Line",        // teacher-facing
  "headline": "Let's Learn Fractions!",         // student-facing deck title
  "subheadline": "Halves, quarters, and where they live",
  "grade": "Grade 4",                           // string here, unlike Artifact.grade
  "subject": "Mathematics",
  "blocks": []                                  // LessonBlock[] - see 2.2
}
```

> `Artifact.grade` is a **number**; `LessonModule.grade` is a **string**. That is real
> and intentional (badge vs. prose). Don't normalise one into the other.

#### `GET /v1/modules/{id}` and `GET /v1/modules/{id}/blocks`

Same module by id; the second returns just `LessonBlock[]`.

#### `GET /v1/library/families`

```jsonc
[
  {
    "id": "smart-charts",
    "name": "Smart Charts",
    "category": "presentation",         // "presentation" | "representation"
    "specimenCount": 48,
    "summary": "Charts and diagrams that carry structure, not decoration."
  }
]
```

#### `GET /v1/templates`

```jsonc
[
  {
    "id": "five-e",
    "name": "5E Inquiry",
    "summary": "Engage, Explore, Explain, Elaborate, Evaluate.",
    "segments": 5,
    "subject": "Any"                    // Subject | "Any"
  }
]
```

### 2.2 The block — the central object

```jsonc
{
  "id": "block-3",
  "kind": "interactive",                // "hook" | "concept" | "interactive" | "assessment"
  "title": "Place the fraction",
  "summary": "One line under the title in the block rail.",
  "instruction": "Drag each card to where it belongs on the number line.",

  // Only meaningful when kind === "interactive". Both keys required if present.
  "settings": { "showFractions": true, "autoSnapToGrid": true },

  // Present when the block renders a manipulable representation.
  "representation": {
    "id": "number-line-0-1",
    "name": "Number line 0-1",
    "caption": "Halves and quarters marked.",
    "status": "updating",               // "ready" | "updating"
    "statusLabel": "Simplifying to halves..."   // shown only while updating
  }
}
```

Things we care about:

- `kind` drives the badge colour and the pedagogical read of the whole rail. It is not
  cosmetic.
- `summary` is **one line**. Long strings clip; we will not wrap them.
- `representation.status: "updating"` plus `statusLabel` is how a block says "the AI is
  still working on my visual". **This is our progressive-content primitive at the block
  level** — see §3.6.

### 2.3 Writes (not built yet — we need these)

Everything below is called **from the browser**, so all of it needs CORS.

| Method | Path | Body | Returns | Used by |
| --- | --- | --- | --- | --- |
| `POST` | `/v1/modules` | `FoundationDetails` | `LessonModule` | Setup & Planning → "Build module" |
| `PATCH` | `/v1/modules/{id}` | Partial foundation / title | `LessonModule` | Foundation edits from the planner |
| `POST` | `/v1/modules/{id}/blocks` | `{ block, afterBlockId? }` | `LessonBlock` | Manual block insert |
| `PATCH` | `/v1/modules/{id}/blocks/{blockId}` | `Partial<LessonBlock>` | `LessonBlock` | Inspector edits, settings toggles |
| `DELETE` | `/v1/modules/{id}/blocks/{blockId}` | — | `204` | Delete in the block rail |
| `PUT` | `/v1/modules/{id}/blocks/order` | `{ order: string[] }` | `LessonBlock[]` | Reorder |

**Concurrency.** Undo/redo is local ([`use-block-editor.ts`](../src/components/planner/use-block-editor.ts))
and a teacher may stack several edits before a save. Please support **optimistic
concurrency**: return an `ETag` (or a `version` integer) on the module, accept
`If-Match` on writes, and return `409` with the current server state in
`error.details.module` on a mismatch. We will re-base and re-ask rather than clobber.

**Autosave cadence.** We debounce block edits ~1.2s. Expect bursty `PATCH`es against
one block id, not one big save at the end.

---

## 3 · Generation service — the polling protocol

Base: `NEXT_PUBLIC_AI_URL`. **This is the part we most need agreement on.**

### 3.1 Why polling, and what that forces on you

We have no WebSocket and no SSE. A run is therefore a **resource we read repeatedly**.
Two consequences shape the whole design:

1. **Partial results are not optional.** If `GET /v1/runs/{id}` only becomes useful
   when `status === "done"`, generating a six-block module is a 90-second spinner and
   the product dies on stage. We need each block **the moment it exists**.
2. **Every poll must be cheap and idempotent.** A poll is a pure read. It never
   advances the job, never consumes a queue, never mutates state. Two clients polling
   the same run see the same thing.

> The SSE endpoint currently declared in `endpoints.ts` (`GET /v1/runs/{id}/events`,
> exposed as `runStreamUrl()`) is **out of scope**. Nothing calls it. Ignore it; we
> will delete it.

### 3.2 Start a run

```
POST /v1/runs
Content-Type: application/json
```

```jsonc
{
  "intent": "generate-module",    // "generate-module" | "add-block" | "revise-block"
  "brief": "Fractions on a number line, Grade 4, 40 minutes.",   // generate-module
  "moduleId": "mod_fractions_g4",                                 // all intents
  "blockId": "block-3",                                           // revise-block only
  "instruction": "Only show halves and quarters."                 // add-block, revise-block
}
```

Respond **`202 Accepted` immediately** — do not block until the model returns.

```jsonc
{
  "runId": "run_01JABCDEF",
  "status": "queued",             // "queued" | "running" | "done" | "failed" | "cancelled"
  "cursor": 0,
  "pollAfterMs": 700              // how long we should wait before the first poll
}
```

Rejections here are synchronous and worth distinguishing: `422` for a brief you can't
work with, `429` when the queue is full (with `Retry-After`), `503` when the model
provider is down.

### 3.3 Poll a run — the cursor is the whole trick

```
GET /v1/runs/{runId}?since={cursor}
If-None-Match: "<etag from last poll>"
```

`since` is the **highest `seq` we have already applied**. The response returns only
events after it. `since=0` (or omitted) means "everything from the start" — which is
exactly what a page reload needs.

```jsonc
{
  "runId": "run_01JABCDEF",
  "intent": "generate-module",
  "status": "running",
  "moduleId": "mod_fractions_g4",

  "cursor": 7,                    // highest seq in this response; send back as ?since
  "pollAfterMs": 1200,            // server-suggested wait before the next poll

  "progress": {
    "completed": 3,
    "total": 6,                   // null while unknown - we render indeterminate
    "label": "Drafting the hands-on activity..."   // teacher-facing, one line
  },

  "events": [
    {
      "seq": 6,
      "type": "block.added",
      "at": "2026-08-30T14:22:05Z",
      "index": 2,
      "block": { "id": "block-3", "kind": "interactive" }   // full LessonBlock
    },
    {
      "seq": 7,
      "type": "stage.started",
      "at": "2026-08-30T14:22:06Z",
      "stage": "assessment",
      "label": "Writing the exit ticket..."
    }
  ],

  "error": null
}
```

**Rules on `events`:**

- `seq` is a **monotonically increasing integer per run**, starting at 1. No gaps, no
  reuse, no reordering.
- Events are returned in ascending `seq`.
- `cursor` equals the `seq` of the last event in the array. When `events` is empty,
  `cursor` is unchanged.
- Events are **durable for the life of the run** (plus a grace window, §3.7). A client
  that reloads and polls `?since=0` must be able to rebuild the identical state.
- We apply events in order and ignore any `seq` at or below what we have applied.
  Duplicates are harmless — please make them possible rather than making us guess.

**When nothing has happened since `since`:** return `304 Not Modified` (same `ETag`),
or `200` with `"events": []`. Either is fine; `304` is cheaper.

### 3.4 Event types

| `type` | Payload | What we do |
| --- | --- | --- |
| `run.status` | `status` | Update the run state |
| `stage.started` | `stage`, `label` | Replace the progress line |
| `stage.completed` | `stage` | Advance `progress.completed` |
| `block.added` | `block`, `index` | **Append the block to the canvas, live** |
| `block.updated` | `blockId`, `patch` | Shallow-merge onto the existing block |
| `block.removed` | `blockId` | Remove it |
| `module.updated` | `patch` | Merge onto the module header |
| `run.failed` | `error` | Stop polling, show the failure |

`block.added` is the one that makes the product feel alive.

`patch` in `block.updated` is a **shallow partial `LessonBlock`** — we do
`{ ...block, ...patch }`. To change one field of `representation`, send the **whole**
`representation` object.

### 3.5 Terminal states

`done`, `failed`, `cancelled` are terminal. **We stop polling on any of them.** Never
move a run back out of a terminal state.

The terminal poll must carry the complete result, not just a flag:

```jsonc
{
  "runId": "run_01JABCDEF",
  "status": "done",
  "cursor": 14,
  "progress": { "completed": 6, "total": 6, "label": "Module ready." },
  "events": [ { "seq": 14, "type": "run.status", "status": "done" } ],

  // Required on terminal success - the authoritative final state.
  "module": {},                   // full LessonModule (generate-module)
  "block": {},                    // full LessonBlock (add-block, revise-block)
  "reply": "Done - halves and quarters only. Have a look."   // optional assistant line
}
```

`block` on the terminal poll is **already consumed today** by
[`draft-block.ts`](../src/lib/ai/draft-block.ts) and
[`revise-block.ts`](../src/lib/ai/revise-block.ts). Those two work the moment you ship
`POST /v1/runs` plus a `GET /v1/runs/{id}` returning `{ status, block }`. Everything
else in this section is the upgrade that makes generation progressive.

On failure:

```jsonc
{
  "runId": "run_01JABCDEF",
  "status": "failed",
  "cursor": 9,
  "error": {
    "code": "model_timeout",
    "message": "The model did not respond in time.",
    "retryable": true             // drives whether we offer a Retry button
  },
  "blocks": []                    // anything usable produced before the failure
}
```

**Partial success is success.** If four of six blocks came out, say so and give them to
us — a teacher would rather have four blocks and a retry than nothing.

### 3.6 Two-phase blocks — text first, visual second

A representation takes longer to build than the prose around it. Don't hold the block
back for it. Emit the block with a placeholder, then patch it:

```jsonc
// seq 6 - the block lands and renders immediately
{
  "seq": 6, "type": "block.added", "index": 2,
  "block": {
    "id": "block-3",
    "kind": "interactive",
    "title": "Place the fraction",
    "summary": "Hands-on placement on a 0-1 line.",
    "instruction": "Drag each card to where it belongs.",
    "settings": { "showFractions": true, "autoSnapToGrid": true },
    "representation": {
      "id": "number-line-0-1",
      "name": "Number line 0-1",
      "caption": "Building...",
      "status": "updating",
      "statusLabel": "Marking halves and quarters..."
    }
  }
}

// seq 11 - the visual is ready
{
  "seq": 11, "type": "block.updated", "blockId": "block-3",
  "patch": {
    "representation": {
      "id": "number-line-0-1",
      "name": "Number line 0-1",
      "caption": "Halves and quarters marked.",
      "status": "ready"
    }
  }
}
```

The UI already renders `status: "updating"` as a live shimmer with `statusLabel`
underneath. This costs you nothing extra and is the difference between "loading" and
"watching it get built".

### 3.7 Run lifecycle, cancel, resume

```
POST /v1/runs/{runId}/cancel              -> 202, status becomes "cancelled"
GET  /v1/modules/{moduleId}/runs/active   -> RunState | 204 No Content
```

- **Cancel** — the teacher navigates away or hits stop. Idempotent; cancelling an
  already-terminal run is `200`/`204`, not an error.
- **Resume after reload** — this is why a run is a resource. The teacher refreshes
  mid-generation; we ask the module for its active run, poll `?since=0`, and rebuild
  every block that landed while the tab was gone. Without this endpoint, a refresh
  loses the run.
- **Retention** — keep a terminal run readable for **at least 15 minutes** after it
  finishes. We may poll once more after `done` on a slow network.
- **Orphans** — a run whose client vanished should still complete and persist its
  blocks to the module. The work is paid for; don't throw it away.

### 3.8 Polling cadence

We honour `pollAfterMs` when you send it. Absent that, our defaults:

| Intent | First poll | Then | Cap | Give up |
| --- | --- | --- | --- | --- |
| `add-block` | 700 ms | 800 ms fixed | — | 45 s |
| `revise-block` | 700 ms | 800 ms fixed | — | 45 s |
| `generate-module` | 1 s | x1.5 backoff | 3 s | 5 min |

Current values live as `POLL_INTERVAL_MS` / `POLL_TIMEOUT_MS` in
[`draft-block.ts`](../src/lib/ai/draft-block.ts) and
[`revise-block.ts`](../src/lib/ai/revise-block.ts).

Budget roughly: **a 3-minute module generation is ~80-110 polls from one tab.** If that
is a problem for your infrastructure, raise `pollAfterMs` — we obey it — rather than
rate-limiting us into a broken UI.

On `429` we back off by `Retry-After` and keep the run alive. On a transient network
error we retry the poll (3 attempts: 1s, 2s, 4s) before declaring the run lost — **a
dropped poll must never be read as a failed run.**

### 3.9 A worked timeline

```
t+0.0s  POST /v1/runs {intent:"generate-module", brief:"..."}
        -> 202 {runId:"run_1", status:"queued", cursor:0, pollAfterMs:700}

t+0.7s  GET /v1/runs/run_1?since=0
        -> 200 cursor:2, status:"running"
           progress:{completed:0, total:null, label:"Reading the brief..."}
           events:[ {seq:1, type:"run.status", status:"running"},
                    {seq:2, type:"stage.started", stage:"plan",
                     label:"Reading the brief..."} ]
           UI: spinner + "Reading the brief..."

t+2.0s  GET /v1/runs/run_1?since=2   -> 304                UI: unchanged

t+3.5s  GET /v1/runs/run_1?since=2
        -> 200 cursor:4
           progress:{completed:1, total:6, label:"Drafting the hook..."}
           events:[ {seq:3, type:"stage.completed", stage:"plan"},
                    {seq:4, type:"block.added", index:0, block:{...hook...}} ]
           UI: >>> FIRST BLOCK APPEARS. Teacher can already read and click it.

t+6.5s  -> cursor:5,  block.added index:1 (concept)          UI: second block
t+11s   -> cursor:6,  block.added index:2 (interactive,
                      representation status "updating")      UI: third block, shimmering
t+14s   -> cursor:8,  block.updated block-3 -> "ready"       UI: shimmer resolves in place
t+19s   -> cursor:10, block.added index:3 (assessment)       UI: fourth block
t+22s   -> 200 cursor:12, status:"done", module:{...}        UI: stop polling, reconcile
```

The teacher watches the lesson build itself. That is the demo.

---

## 4 · Deck / presentation

The `/present` route renders the student-facing deck. Today it reads hard-coded
fixtures in [`src/lib/data/decks.ts`](../src/lib/data/decks.ts) — that file **is the
contract**, and the types live in [`deck-types.ts`](../src/lib/deck-types.ts).

```
GET /v1/modules/{moduleId}/deck   -> Deck
GET /v1/decks/{deckId}            -> Deck
GET /v1/decks                     -> Deck[]
GET /v1/school                    -> School
```

A `Deck` is `{ id, subject, grade, title, illustration, sections }` where `sections` is
a discriminated union on `kind`:
`cover · contents · concept · rules · checkpoint · close`.

Two things to know before generating decks:

- **`illustration` is a closed key set**, not a URL:
  `thermometer`, `bundle`, `plant`, `beaker-correct`, `beaker-vertical`, `beaker-read`,
  `thermometer-eye`. They map to hand-drawn local SVGs; an unknown key renders nothing.
  New illustrations are a frontend change — ask, don't invent.
- **`AccentPhrase`** splits a title so one word can be set in the handwritten script:
  `{ "lead": "Measuring Temperature with ", "accent": "Precision" }`. Note the trailing
  space in `lead` — we do not insert one. `tail` is optional.

If a deck is generated by a run, it follows the same event protocol: `section.added`
events with identical `seq` / `cursor` semantics.

---

## 5 · What breaks us — the short list

Pin this above the desk.

1. **Wrapping responses in `{ data: ... }`.** We read the body as the type directly.
2. **`200` with an error body.** Reads fall back to fixtures on throw, so a fake `200`
   renders as real content and lies to a teacher.
3. **A `seq` that repeats, skips, or arrives out of order.** The cursor is the entire
   synchronisation mechanism; break it and blocks vanish or duplicate.
4. **A poll that mutates state** (consumes a queue, advances a stage). Polls must be
   pure — we retry them, and two tabs may poll the same run.
5. **Only returning content at `status: "done"`.** That turns the flagship interaction
   into a 90-second spinner.
6. **Missing CORS / no `OPTIONS` handler on the AI service.** Runs are browser-side;
   every run fails at preflight.
7. **Expecting us to deep-merge `block.updated.patch`.** It is a shallow merge. Send
   whole nested objects.
8. **Enum values outside the closed sets.** An unknown `kind` / `state` / `illustration`
   renders blank, not degraded.
9. **A run leaving a terminal state**, or terminal runs expiring in under 15 minutes.
10. **`defaults.*` values in `/v1/setup/context` that aren't in `options.*`.** Selects
    render empty.

---

## 6 · Delta against what the repo has today

| Piece | In the repo now | This document proposes |
| --- | --- | --- |
| Content reads | 7 endpoints, wired, fixture-backed | Unchanged — ship them as specced |
| Content writes | None | §2.3, with `ETag` / `If-Match` |
| `POST /v1/runs` | Wired, expects `{ runId, status }` | Add `cursor`, `pollAfterMs`, `202` |
| `GET /v1/runs/{id}` | Wired, expects `{ status, block? }` | Add `?since`, `events[]`, `cursor`, `progress` |
| SSE `/v1/runs/{id}/events` | Declared in `endpoints.ts`, **never called** | **Drop it** |
| `runStreamUrl()` | Exported, unused | Delete |
| Progressive blocks | Not possible | §3.3–3.6 |
| Resume after reload | Not possible | `GET /v1/modules/{id}/runs/active` |
| Cancel | Not possible | `POST /v1/runs/{id}/cancel` |
| Deck | Fixtures only | §4 |

**Minimum viable backend, in order:**

1. `POST /v1/runs` plus `GET /v1/runs/{id}` returning `{ status, block }` on `done`.
   → `add-block` and `revise-block` go live with **zero frontend changes**.
2. Add `?since` / `events[]` / `cursor` to the poll.
   → progressive `generate-module`; frontend adds a poll loop and an event reducer.
3. Content reads.
   → fixtures stop being the source of truth.
4. Content writes plus concurrency.
   → work actually persists.

Steps 1 and 3 are independent and can land in either order.

---

## 7 · Open questions for the backend

1. **One origin or two?** If content and generation are the same deployment we point
   both env vars at it and nothing else changes — but we want the CORS story settled
   once, not discovered.
2. **Who owns block IDs?** We mint client-side ids (`block-<8 hex>`) for locally drafted
   blocks. On save, do you return a server id we must swap in, or do you accept ours? A
   swap means we remap the undo history.
3. **Is a run scoped to a module, or can it exist before one?** "Generate from a brief"
   may need to create the module as its first act. If so, emit `module.created` as
   `seq: 1` carrying the id.
4. **`progress.total`** — can you commit to a block count at plan time, or is it `null`
   until the end? We render indeterminate for `null`, which is fine, but a real number
   is much better.
5. **Retention window for terminal runs** — 15 minutes is our ask. What can you give?
6. **Rate limits per tab.** Tell us the ceiling and we will size `pollAfterMs` to fit.
7. **Auth** — bearer header, and when?
