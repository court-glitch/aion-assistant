import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Upload, Wand2 } from "lucide-react";

import { Disclaimer } from "@/components/aion/AppShell";
import { PageHeader } from "@/components/aion/PageHeader";
import { OutputEditor } from "@/components/aion/OutputEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAion } from "@/hooks/useAion";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — AION" },
      {
        name: "description",
        content:
          "Turn raw meeting notes into an executive summary, key decisions, action items and deadlines.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — AION" },
      {
        property: "og:description",
        content: "Executive summaries, decisions and action items from your meeting notes.",
      },
    ],
  }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const { output, setOutput, loading, error, generate } = useAion("aion.meetings");
  const [notes, setNotes] = useState("");
  const [context, setContext] = useState("");
  const [duration, setDuration] = useState("45");

  const submit = () =>
    generate(
      "You are AION, a meeting analyst. Return plain-text sections in this exact order: EXECUTIVE SUMMARY, KEY DECISIONS (bullets), ACTION ITEMS (a text table with columns Owner | Task | Due date | Priority), DEADLINES (bullets). Be concise and specific.",
      `Meeting context: ${context}\nDuration: ${duration} minutes\nRaw notes:\n${notes}`,
    );

  return (
    <>
      <PageHeader
        eyebrow="Meeting Notes Summarizer"
        title="From messy notes to clear actions"
        description="Paste or upload your notes — AION extracts decisions, owners and deadlines."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="glass-card space-y-5 p-6 lg:col-span-5">
          <div className="space-y-2">
            <Label htmlFor="context">Meeting context</Label>
            <Input
              id="context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Weekly product sync — roadmap review"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              min={5}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              rows={10}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste raw notes or transcript…"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="upload" className="text-xs text-muted-foreground">
              Or upload a .txt / .md file
            </Label>
            <label
              htmlFor="upload"
              className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border px-4 py-4 text-xs text-muted-foreground hover:bg-accent/30"
            >
              <Upload className="h-4 w-4" /> Choose file
            </label>
            <input
              id="upload"
              type="file"
              accept=".txt,.md,text/plain"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) setNotes(await file.text());
              }}
            />
          </div>
          <Button className="w-full" onClick={submit} disabled={loading || !notes}>
            <Wand2 className="h-4 w-4" /> {loading ? "AION is thinking…" : "Summarize notes"}
          </Button>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        <div className="lg:col-span-7">
          <OutputEditor
            storageKey="aion.meetings"
            value={output}
            onChange={setOutput}
            onRegenerate={submit}
            loading={loading}
            emptyHint="Paste your notes and generate to get an executive summary, key decisions, an editable action-items table and deadlines."
          />
        </div>
      </div>

      <Disclaimer />
    </>
  );
}
