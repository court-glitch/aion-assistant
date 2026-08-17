import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { Disclaimer } from "@/components/aion/AppShell";
import { PageHeader } from "@/components/aion/PageHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — AION Workplace Assistant" },
      {
        name: "description",
        content: "Manage AION preferences: local drafts, tone defaults and usage tracking.",
      },
      { property: "og:title", content: "AION Settings" },
      { property: "og:description", content: "Manage AION preferences and local draft storage." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Settings"
        title="Preferences"
        description="AION stores nothing on a server. Drafts and usage counts live in this browser only."
      />

      <div className="glass-card max-w-2xl divide-y divide-border">
        <div className="flex items-center justify-between gap-6 p-5">
          <div>
            <Label className="text-sm text-foreground">Autosave drafts locally</Label>
            <p className="text-xs text-muted-foreground">Edited outputs persist between visits.</p>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between gap-6 p-5">
          <div>
            <Label className="text-sm text-foreground">Show Responsible AI disclaimer</Label>
            <p className="text-xs text-muted-foreground">Always visible on feature pages.</p>
          </div>
          <Switch defaultChecked disabled />
        </div>
        <div className="flex items-center justify-between gap-6 p-5">
          <div>
            <Label className="text-sm text-foreground">Clear local data</Label>
            <p className="text-xs text-muted-foreground">Removes drafts and usage counter.</p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              window.localStorage.clear();
              window.dispatchEvent(new CustomEvent("aion:usage"));
              toast.success("Local AION data cleared");
            }}
          >
            Clear
          </Button>
        </div>
      </div>

      <Disclaimer />
    </>
  );
}
