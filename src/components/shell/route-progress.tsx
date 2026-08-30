"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type Phase = "idle" | "loading" | "finishing";

/** Bail out on anything that isn't a plain left-click in-app navigation. */
function isPlainNavigation(event: MouseEvent): boolean {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey &&
    !event.defaultPrevented
  );
}

/**
 * A thin progress bar across the top of the viewport during route changes.
 *
 * Navigation *start* is detected by capturing link clicks and `popstate`;
 * navigation *end* is the pathname actually changing. Next exposes no global
 * "router is pending" signal, and this covers every entry point — sidebar, top
 * nav, buttons, cards, browser back — without patching router internals.
 */
export function RouteProgress() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  // Width is driven from state so the ramp always has a frame to start from —
  // mounting straight at the target width would show no motion at all.
  const [width, setWidth] = useState(0);
  const settled = useRef(pathname);

  // Start: a click that will actually navigate somewhere else.
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (!isPlainNavigation(event)) return;

      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor || anchor.hasAttribute("download")) return;
      if (!anchor.getAttribute("href")) return;
      if (anchor.target && anchor.target !== "_self") return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      // External, or a jump inside this same page — neither is a route change.
      if (url.origin !== window.location.origin) return;
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search
      ) {
        return;
      }

      setPhase("loading");
    }

    function onPopState() {
      setPhase("loading");
    }

    document.addEventListener("click", onClick, { capture: true });
    window.addEventListener("popstate", onPopState);

    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  // Finish: the pathname changed, so the new segment has rendered.
  useEffect(() => {
    if (pathname === settled.current) return;
    settled.current = pathname;
    setPhase((current) => (current === "loading" ? "finishing" : "idle"));
  }, [pathname]);

  // Drive the ramp, then clear. A stalled navigation gives up after 12s rather
  // than leaving a bar stuck on screen forever.
  useEffect(() => {
    if (phase === "idle") {
      setWidth(0);
      return;
    }

    if (phase === "finishing") {
      setWidth(100);
      const timer = window.setTimeout(() => setPhase("idle"), 300);
      return () => window.clearTimeout(timer);
    }

    setWidth(8);
    const frame = window.requestAnimationFrame(() => setWidth(88));
    const bailout = window.setTimeout(() => setPhase("idle"), 12_000);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(bailout);
    };
  }, [phase]);

  if (phase === "idle") return null;

  const isFinishing = phase === "finishing";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px]"
    >
      <div
        style={{ width: `${width}%` }}
        className={
          "h-full rounded-r-full bg-gradient-to-r from-sky-400 to-brand-600 " +
          (isFinishing
            ? "opacity-0 transition-all duration-300 ease-out"
            : "opacity-100 transition-[width] duration-[1400ms] ease-out")
        }
      />
    </div>
  );
}
