export type NavIcon =
  | "flow"
  | "target"
  | "dashboard"
  | "agent"
  | "resources"
  | "analytics";

export interface NavItem {
  label: string;
  href: string;
  icon: NavIcon;
}

/** The top bar's primary navigation. */
export const topNav: { label: string; href: string }[] = [
  { label: "Dashboard", href: "/" },
  { label: "Curriculum", href: "/curriculum" },
  { label: "Library", href: "/library" },
];

/**
 * The planner sidebar. One rail for the whole app — the module you are working
 * on stays pinned at the top no matter which section you are in.
 */
export const plannerNav: NavItem[] = [
  { label: "Lesson Flow", href: "/curriculum/flow", icon: "flow" },
  { label: "Objectives", href: "/objectives", icon: "target" },
  { label: "Dashboard", href: "/", icon: "dashboard" },
  { label: "Agentic Plan", href: "/agentic-plan", icon: "agent" },
  { label: "Resources", href: "/resources", icon: "resources" },
  { label: "Analytics", href: "/analytics", icon: "analytics" },
];
