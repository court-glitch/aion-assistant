import { useEffect, useState } from "react";
import { Mail, NotebookPen, CalendarClock, Telescope, type LucideIcon } from "lucide-react";

import { ACTIVITY_EVENT, readActivity, timeAgo, type ActivityItem } from "@/lib/activity";

const icons: Record<ActivityItem["tool"], LucideIcon> = {
  email: Mail,
  meetings: NotebookPen,
  planner: CalendarClock,
  research: Telescope,
};

export function ActivityFeed({ limit = 6 }: { limit?: number }) {
  const [items, setItems] = useState<ActivityItem[]>([]);

  useEffect(() => {
    const sync = () => setItems(readActivity());
    sync();
    window.addEventListener(ACTIVITY_EVENT, sync);
    return () => window.removeEventListener(ACTIVITY_EVENT, sync);
  }, []);

  if (!items.length) {
    return (
      <div className="glass-card p-6 text-sm text-muted-foreground">
        No activity yet — generate something and it will appear here.
      </div>
    );
  }

  return (
    <ul className="glass-card divide-y divide-border">
      {items.slice(0, limit).map((item) => {
        const Icon = icons[item.tool];
        return (
          <li key={item.id} className="flex items-center gap-4 p-4">
            <span
              className="rounded-lg p-2"
              style={{ backgroundImage: "var(--gradient-aion)" }}
              aria-hidden
            >
              <Icon className="h-4 w-4 text-primary-foreground" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-foreground">
                {item.label}: <span className="font-medium">{item.title}</span>
              </p>
            </div>
            <time className="shrink-0 text-xs text-muted-foreground">{timeAgo(item.at)}</time>
          </li>
        );
      })}
    </ul>
  );
}
