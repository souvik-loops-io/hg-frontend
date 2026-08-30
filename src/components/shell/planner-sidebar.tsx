"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navIcons, PlusIcon } from "@/components/icons";
import { NavPending } from "@/components/shell/nav-pending";
import { buttonClasses } from "@/components/ui/button";
import { teacher } from "@/lib/data/fixtures";
import { plannerNav } from "@/lib/data/navigation";
import { cn } from "@/lib/cn";

/** Round initials mark — no photo dependency, no broken-image state. */
function Avatar({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-full",
        "bg-sky-200 text-[0.8125rem] font-bold text-brand-700 ring-2 ring-sky-300",
        className,
      )}
    >
      {teacher.initials}
    </span>
  );
}

/**
 * The planner rail, shared verbatim by the desktop sidebar and the mobile
 * drawer so the two can never drift apart.
 */
export function PlannerSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-paper">
      <div className="flex items-center gap-3 border-b border-line px-5 py-5">
        <Avatar />
        <div className="min-w-0">
          <p className="truncate font-bold text-brand-600">{teacher.role}</p>
          <p className="mt-0.5 truncate text-[0.8125rem] text-ink-soft">
            {teacher.context}
          </p>
        </div>
      </div>

      <div className="px-4 pt-5">
        <Link
          href="/curriculum"
          className={buttonClasses({ variant: "sky", className: "w-full text-base" })}
        >
          <PlusIcon className="size-5" />
          New Module
        </Link>
      </div>

      <nav
        aria-label="Planner"
        className="scroll-slim flex-1 overflow-y-auto px-4 py-5"
      >
        <ul className="space-y-1.5">
          {plannerNav.map((item) => {
            const Icon = navIcons[item.icon];
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-field px-4 py-3 transition-colors duration-150",
                    isActive
                      ? "bg-sky-300 font-semibold text-brand-700"
                      : "text-ink-soft hover:bg-surface hover:text-ink",
                  )}
                >
                  <Icon className="size-5 shrink-0" />
                  <span className="truncate text-[0.9375rem]">{item.label}</span>
                  <NavPending />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-line px-4 py-4">
        <Link
          href="/profile"
          className="flex items-center gap-3 rounded-field px-2 py-2 transition-colors hover:bg-surface"
        >
          <Avatar className="size-10 ring-0" />
          <span className="truncate text-[0.9375rem] text-ink">Teacher Profile</span>
        </Link>
      </div>
    </div>
  );
}
