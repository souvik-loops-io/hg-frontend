"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CheckCircleIcon, MenuIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { topNav } from "@/lib/data/navigation";
import { cn } from "@/lib/cn";

interface TopBarProps {
  onOpenMenu: () => void;
  /**
   * Which action leads. On working screens Preview is the commitment; on
   * planning screens Save is.
   */
  primaryAction?: "save" | "preview";
}

export function TopBar({ onOpenMenu, primaryAction = "save" }: TopBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const previewLeads = primaryAction === "preview";

  // Preview the lesson currently open in the editor. The lesson id lives in the
  // flow URL's `?lesson=` — read it at click time so Preview always targets the
  // real lesson (falling back to the demo module when there isn't one).
  function openPreview() {
    const lessonId =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("lesson")
        : null;
    router.push(lessonId ? `/preview?lesson=${encodeURIComponent(lessonId)}` : "/preview");
  }

  return (
    <header className="shrink-0 border-b border-line bg-canvas">
      <div className="flex h-16 items-center gap-3 px-3 sm:px-6 lg:h-20 lg:gap-10">
        <IconButton label="Open navigation" onClick={onOpenMenu} className="lg:hidden">
          <MenuIcon className="size-5" />
        </IconButton>

        <Link
          href="/"
          className="shrink-0 text-xl font-bold tracking-[-0.035em] text-brand-600 sm:text-2xl lg:text-3xl"
        >
          Chalk
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {topNav.map((item) => {
              const isActive =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "inline-block pb-1 text-base transition-colors duration-150",
                      isActive
                        ? "border-b-2 border-brand-500 font-semibold text-brand-600"
                        : "border-b-2 border-transparent text-ink-soft hover:text-ink",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {previewLeads ? (
            <>
              {/* Edits persist to the engine as you make them — so this reports
                  state, it isn't a button that could silently do nothing. */}
              <span
                role="status"
                title="Every edit is saved to the lesson engine automatically."
                className="hidden items-center gap-1.5 rounded-field bg-leaf-100 px-3 py-2 text-[0.8125rem] font-semibold text-leaf-600 sm:inline-flex"
              >
                <CheckCircleIcon className="size-4" />
                Auto-saved
              </span>
              <Button variant="brand" onClick={openPreview}>
                Preview
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={openPreview}
                className="hidden sm:inline-flex"
              >
                Preview
              </Button>
              <Button variant="brand">Save</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
