import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Zap, Clock, Layers } from "lucide-react";

import { Disclaimer } from "@/components/aion/AppShell";
import { PageHeader } from "@/components/aion/PageHeader";
import { navItems } from "@/lib/aion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AION Dashboard — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "AION automates workplace tasks with AI: emails, meeting summaries, task plans and research — all editable.",
      },
      { property: "og:title", content: "AION — Your Intelligence, Accelerated." },
      {
        property: "og:description",
        content: "AI workplace productivity assistant for emails, meetings, planning and research.",
      },
    ],
  }),
  component: Dashboard,
});

const stats = [
  { label: "Tools ready", value: "4", icon: Layers },
  { label: "Avg. draft time", value: "12s", icon: Clock },
  { label: "Editable outputs", value: "100%", icon: Zap },
];

function Dashboard() {
  const tools = navItems.filter((n) => n.url !== "/");

  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title="Your Intelligence, Accelerated."
        description="Pick a tool and let AION draft the first version. Every output is editable, exportable and saved locally in your browser."
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="glass-card p-5">
            <s.icon className="h-5 w-5 text-violet" />
            <p className="mt-3 font-sans text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-10 font-sans text-lg font-semibold text-foreground">Quick actions</h2>
      <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
        {tools.map((tool) => (
          <Link key={tool.url} to={tool.url} className="glass-card group p-6 transition hover:glow">
            <div className="flex items-start gap-4">
              <span
                className="rounded-xl p-3"
                style={{ backgroundImage: "var(--gradient-aion)" }}
                aria-hidden
              >
                <tool.icon className="h-5 w-5 text-primary-foreground" />
              </span>
              <div>
                <h3 className="font-sans text-base font-semibold text-foreground">{tool.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{tool.description}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-violet">
                  Open tool <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Disclaimer />
    </>
  );
}
