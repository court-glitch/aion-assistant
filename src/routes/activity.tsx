import { createFileRoute } from "@tanstack/react-router";

import { Disclaimer } from "@/components/aion/AppShell";
import { ActivityFeed } from "@/components/aion/ActivityFeed";
import { PageHeader } from "@/components/aion/PageHeader";

export const Route = createFileRoute("/activity")({
  head: () => ({
    meta: [
      { title: "Recent Activity — AION Workplace Assistant" },
      {
        name: "description",
        content:
          "Track every AION generation: emails drafted, meetings summarized, plans built and research completed.",
      },
      { property: "og:title", content: "AION Recent Activity" },
      { property: "og:description", content: "A timeline of your recent AION AI generations." },
    ],
  }),
  component: ActivityPage,
});

function ActivityPage() {
  return (
    <>
      <PageHeader
        eyebrow="Activity"
        title="Recent Activity Feed"
        description="A running timeline of everything AION has generated in this browser."
      />
      <ActivityFeed limit={30} />
      <Disclaimer />
    </>
  );
}
