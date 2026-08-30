const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * "Updated 2h ago" / "Updated 1d ago".
 *
 * `now` is passed in rather than read from the clock so the server-rendered
 * string and the client-rendered string always agree.
 */
export function formatUpdatedAt(iso: string, now: number): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "Updated recently";

  const elapsed = Math.max(0, now - then);

  if (elapsed < MINUTE) return "Updated just now";
  if (elapsed < HOUR) return `Updated ${Math.floor(elapsed / MINUTE)}m ago`;
  if (elapsed < DAY) return `Updated ${Math.floor(elapsed / HOUR)}h ago`;

  const days = Math.floor(elapsed / DAY);
  if (days < 7) return `Updated ${days}d ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `Updated ${weeks}w ago`;
  return `Updated ${Math.floor(days / 30)}mo ago`;
}

/** Time-of-day greeting. `hour` is injectable so it can be tested. */
export function greetingForHour(hour: number): string {
  if (hour < 5) return "Good evening";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
