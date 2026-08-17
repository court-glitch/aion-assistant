export type ActivityItem = {
  id: string;
  tool: "email" | "meetings" | "planner" | "research";
  label: string;
  title: string;
  at: number;
};

const KEY = "aion.activity";
export const ACTIVITY_EVENT = "aion:activity";

const seed: ActivityItem[] = [
  { id: "s1", tool: "email", label: "Email generated", title: "Q4 Proposal", at: -25 },
  { id: "s2", tool: "meetings", label: "Meeting notes summarized", title: "Client Review", at: -90 },
  { id: "s3", tool: "planner", label: "Task plan created", title: "Weekly Sprint", at: -240 },
  { id: "s4", tool: "research", label: "Research completed", title: "AI Trends 2026", at: -1440 },
];

export function readActivity(): ActivityItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const stored = raw ? (JSON.parse(raw) as ActivityItem[]) : [];
    const now = Date.now();
    const seeded = seed.map((s) => ({ ...s, at: now + s.at * 60_000 }));
    return [...stored, ...seeded].sort((a, b) => b.at - a.at).slice(0, 30);
  } catch {
    return [];
  }
}

export function logActivity(item: Omit<ActivityItem, "id" | "at">) {
  if (typeof window === "undefined") return;
  const raw = window.localStorage.getItem(KEY);
  const stored = raw ? (JSON.parse(raw) as ActivityItem[]) : [];
  stored.unshift({ ...item, id: crypto.randomUUID(), at: Date.now() });
  window.localStorage.setItem(KEY, JSON.stringify(stored.slice(0, 30)));
  window.dispatchEvent(new CustomEvent(ACTIVITY_EVENT));
}

export function timeAgo(at: number): string {
  const mins = Math.max(0, Math.round((Date.now() - at) / 60_000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}
