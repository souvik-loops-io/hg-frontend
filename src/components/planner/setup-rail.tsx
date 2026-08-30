import { LightbulbIcon } from "@/components/icons";
import type { DiscoveryTip } from "@/lib/types";

/** The amber tip panel — the one warm thing on an otherwise cool screen. */
export function DiscoveryTipCard({ tip }: { tip: DiscoveryTip }) {
  return (
    <aside className="rounded-panel bg-gradient-to-br from-sun-50 to-sun-100 p-6">
      <span
        aria-hidden="true"
        className="flex size-11 items-center justify-center rounded-full bg-paper text-sun-500"
      >
        <LightbulbIcon className="size-5" />
      </span>
      <h2 className="mt-4 text-lg font-bold tracking-[-0.02em] text-sun-500">
        {tip.title}
      </h2>
      <p className="mt-3 text-[0.9375rem] leading-relaxed text-sun-600">
        {tip.body}
      </p>
    </aside>
  );
}

export function RecentTopicsCard({ topics }: { topics: string[] }) {
  return (
    <aside className="rounded-panel bg-paper p-6 shadow-card">
      <h2 className="label-caps">Recent topics</h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {topics.map((topic) => (
          <li key={topic}>
            <button
              type="button"
              className="rounded-field border border-line bg-paper px-4 py-2 text-[0.875rem] text-ink transition-colors hover:border-sky-300 hover:bg-sky-50"
            >
              {topic}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
