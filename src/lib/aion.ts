import {
  LayoutDashboard,
  Mail,
  NotebookPen,
  CalendarClock,
  Telescope,
  Activity,
  type LucideIcon,
} from "lucide-react";


export type NavItem = {
  title: string;
  short: string;
  url: string;
  icon: LucideIcon;
  description: string;
};

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    short: "Home",
    url: "/",
    icon: LayoutDashboard,
    description: "Your AION command centre.",
  },
  {
    title: "Smart Email Generator",
    short: "Email",
    url: "/email",
    icon: Mail,
    description: "Draft precise, on-tone emails in seconds.",
  },
  {
    title: "Meeting Notes Summarizer",
    short: "Notes",
    url: "/meetings",
    icon: NotebookPen,
    description: "Turn raw notes into decisions and actions.",
  },
  {
    title: "AI Task Planner",
    short: "Plan",
    url: "/planner",
    icon: CalendarClock,
    description: "Build a prioritised, drag-and-drop plan.",
  },
  {
    title: "AI Research Assistant",
    short: "Research",
    url: "/research",
    icon: Telescope,
    description: "Summaries, insights, recommendations, citations.",
  },
];

export const quickTips = [
  "Click any generated text to edit — saved locally.",
  "Use Insert Variables to templatise names and dates.",
  "Regenerate keeps your inputs — only the output changes.",
  "Export sends the current edited version, not the original draft.",
  "Add more context in your inputs for sharper AI output.",
];

export const USAGE_LIMIT = 25;

export function readUsage(): number {
  if (typeof window === "undefined") return 0;
  return Number(window.localStorage.getItem("aion.usage") ?? 0);
}

export function bumpUsage(): number {
  const next = readUsage() + 1;
  window.localStorage.setItem("aion.usage", String(next));
  window.dispatchEvent(new CustomEvent("aion:usage"));
  return next;
}
