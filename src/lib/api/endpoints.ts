/**
 * Every remote path the app knows about, in one place.
 *
 * Two services, each reached through its own base URL from the environment:
 *   NEXT_PUBLIC_API_URL  — content: artifacts, modules, library, templates
 *   NEXT_PUBLIC_AI_URL   — generation: pipeline runs and their event streams
 */

export const contentEndpoints = {
  artifacts: {
    list: "/v1/artifacts",
    byId: (id: string) => `/v1/artifacts/${encodeURIComponent(id)}`,
  },
  dashboard: {
    weeklyFocus: "/v1/dashboard/weekly-focus",
  },
  modules: {
    current: "/v1/modules/current",
    byId: (id: string) => `/v1/modules/${encodeURIComponent(id)}`,
    blocks: (moduleId: string) =>
      `/v1/modules/${encodeURIComponent(moduleId)}/blocks`,
  },
  setup: {
    /** Foundation defaults, dropdown options, tip and recent topics. */
    context: "/v1/setup/context",
  },
  library: {
    families: "/v1/library/families",
  },
  templates: {
    list: "/v1/templates",
  },
} as const;

export const aiEndpoints = {
  /** POST — starts a generation or revision run. */
  runs: "/v1/runs",
  /** GET (SSE) — streams stage events while a run is in flight. */
  stream: (runId: string) => `/v1/runs/${encodeURIComponent(runId)}/events`,
  /** GET — terminal state, for clients that cannot hold an SSE connection. */
  run: (runId: string) => `/v1/runs/${encodeURIComponent(runId)}`,
} as const;
