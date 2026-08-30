"use client";

import { useLinkStatus } from "next/link";

/**
 * A small spinner that appears on the nav item you actually clicked.
 *
 * `useLinkStatus` only reports for the `<Link>` it is rendered inside, which is
 * exactly what we want here: the top progress bar says "something is loading",
 * this says "it was this one".
 */
export function NavPending() {
  const { pending } = useLinkStatus();

  if (!pending) return null;

  return (
    <span
      aria-hidden="true"
      className="ml-auto size-3.5 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent opacity-60"
    />
  );
}
