"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { PlannerSidebar } from "@/components/shell/planner-sidebar";
import { TopBar } from "@/components/shell/top-bar";
import { CloseIcon } from "@/components/icons";
import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/cn";

interface AppShellProps {
  children: React.ReactNode;
}

/**
 * Top bar + planner rail, with the rail collapsing to a drawer below `lg`.
 *
 * The shell owns the viewport height and `main` is the only scroller, so a
 * screen that wants fixed-height panes (the lesson flow) can simply fill it.
 */
export function AppShell({ children }: AppShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Navigating away always dismisses the drawer.
  useEffect(closeMenu, [pathname, closeMenu]);

  // While the drawer is open: freeze the page behind it, Escape closes it.
  useEffect(() => {
    if (!menuOpen) return;

    document.documentElement.classList.add("scroll-locked");
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.documentElement.classList.remove("scroll-locked");
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen, closeMenu]);

  // The lesson flow lays out its own panes; every other screen gets a preview
  // action in the bar and a scrolling main.
  const isFlow = pathname.startsWith("/curriculum/flow");

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <TopBar
        onOpenMenu={() => setMenuOpen(true)}
        primaryAction={isFlow ? "preview" : "save"}
      />

      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-72 shrink-0 border-r border-line lg:block">
          <PlannerSidebar />
        </aside>

        <main
          id="main"
          className={cn(
            "min-w-0 flex-1",
            isFlow ? "overflow-hidden" : "scroll-slim overflow-y-auto",
          )}
        >
          {children}
        </main>
      </div>

      {/* Mobile drawer — rendered always so the transition has something to run. */}
      <div
        aria-hidden={!menuOpen}
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          menuOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <button
          type="button"
          tabIndex={menuOpen ? 0 : -1}
          aria-label="Close navigation"
          onClick={closeMenu}
          className={cn(
            "absolute inset-0 bg-ink/25 transition-opacity duration-200",
            menuOpen ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          role="dialog"
          aria-modal={menuOpen}
          aria-label="Planner navigation"
          className={cn(
            "absolute inset-y-0 left-0 flex w-[86vw] max-w-80 flex-col",
            "border-r border-line bg-paper shadow-lift",
            "transition-transform duration-200 ease-out",
            menuOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="absolute right-3 top-3 z-10">
            <IconButton
              label="Close navigation"
              onClick={closeMenu}
              tabIndex={menuOpen ? 0 : -1}
            >
              <CloseIcon className="size-5" />
            </IconButton>
          </div>
          <PlannerSidebar />
        </div>
      </div>
    </div>
  );
}

/** Standard padded container for every screen except the lesson flow. */
export function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
      {children}
    </div>
  );
}
