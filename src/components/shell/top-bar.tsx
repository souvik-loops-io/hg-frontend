"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon } from "@/components/icons";
import { Button, ButtonLink } from "@/components/ui/button";
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
  const previewLeads = primaryAction === "preview";

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
          Lumina Learning
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
              <Button variant="outline" className="hidden sm:inline-flex">
                Save
              </Button>
              <ButtonLink href="/present" variant="brand">
                Preview
              </ButtonLink>
            </>
          ) : (
            <>
              <ButtonLink
                href="/present"
                variant="ghost"
                className="hidden sm:inline-flex"
              >
                Preview
              </ButtonLink>
              <Button variant="brand">Save</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
