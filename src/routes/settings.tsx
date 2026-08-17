import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { Disclaimer } from "@/components/aion/AppShell";
import { PageHeader } from "@/components/aion/PageHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePreferences } from "@/hooks/usePreferences";
import type { Accent, Citation, FontSize, Moderation, Theme } from "@/lib/preferences";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — AION Workplace Assistant" },
      {
        name: "description",
        content:
          "Manage AION appearance, responsible AI preferences, local drafts and usage tracking.",
      },
      { property: "og:title", content: "AION Settings" },
      {
        property: "og:description",
        content: "Theme, accent colour, font size and responsible AI controls for AION.",
      },
    ],
  }),
  component: SettingsPage,
});

function Row({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-6 p-5">
      <div>
        <Label className="text-sm text-foreground">{title}</Label>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      {children}
    </div>
  );
}

function SettingsPage() {
  const { prefs, update } = usePreferences();

  return (
    <>
      <PageHeader
        eyebrow="Settings"
        title="Preferences"
        description="AION stores nothing on a server. Drafts, preferences and usage counts live in this browser only."
      />

      <h2 className="mb-3 font-sans text-lg font-semibold text-foreground">Appearance</h2>
      <div className="glass-card max-w-2xl divide-y divide-border">
        <Row title="Theme" hint="Light, dark or follow your system.">
          <Select value={prefs.theme} onValueChange={(v) => update("theme", v as Theme)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </Row>
        <Row title="Accent colour" hint="Applies to gradients, highlights and buttons.">
          <Select value={prefs.accent} onValueChange={(v) => update("accent", v as Accent)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="indigo">Indigo</SelectItem>
              <SelectItem value="violet">Violet</SelectItem>
              <SelectItem value="purple">Purple</SelectItem>
            </SelectContent>
          </Select>
        </Row>
        <Row title="Font size" hint="Scales the whole interface.">
          <Select value={prefs.fontSize} onValueChange={(v) => update("fontSize", v as FontSize)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </Row>
      </div>

      <h2 className="mb-3 mt-10 font-sans text-lg font-semibold text-foreground">
        Responsible AI Settings
      </h2>
      <div className="glass-card max-w-2xl divide-y divide-border">
        <Row title="Content moderation level" hint="How cautiously AION handles sensitive topics.">
          <Select
            value={prefs.moderation}
            onValueChange={(v) => update("moderation", v as Moderation)}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="strict">Strict</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="lenient">Lenient</SelectItem>
            </SelectContent>
          </Select>
        </Row>
        <Row title="Transparency mode" hint="Show AI reasoning alongside outputs.">
          <Switch
            checked={prefs.transparency}
            onCheckedChange={(v) => update("transparency", v)}
          />
        </Row>
        <Row title="Citation preference" hint="When AION should include sources.">
          <Select value={prefs.citation} onValueChange={(v) => update("citation", v as Citation)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="always">Always</SelectItem>
              <SelectItem value="on-request">On request</SelectItem>
              <SelectItem value="never">Never</SelectItem>
            </SelectContent>
          </Select>
        </Row>
      </div>

      <h2 className="mb-3 mt-10 font-sans text-lg font-semibold text-foreground">Data</h2>
      <div className="glass-card max-w-2xl divide-y divide-border">
        <Row title="Autosave drafts locally" hint="Edited outputs persist between visits.">
          <Switch defaultChecked />
        </Row>
        <Row title="Show Responsible AI disclaimer" hint="Always visible on feature pages.">
          <Switch defaultChecked disabled />
        </Row>
        <Row title="Clear local data" hint="Removes drafts, activity and usage counter.">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              window.localStorage.clear();
              window.dispatchEvent(new CustomEvent("aion:usage"));
              window.dispatchEvent(new CustomEvent("aion:activity"));
              toast.success("Local AION data cleared");
            }}
          >
            Clear
          </Button>
        </Row>
      </div>

      <Disclaimer />
    </>
  );
}
