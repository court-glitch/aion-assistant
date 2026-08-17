import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Wand2 } from "lucide-react";

import { Disclaimer } from "@/components/aion/AppShell";
import { PageHeader } from "@/components/aion/PageHeader";
import { OutputEditor } from "@/components/aion/OutputEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAion } from "@/hooks/useAion";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — AION" },
      {
        name: "description",
        content:
          "Research any topic or URL and get a summary, insights, recommendations and citations.",
      },
      { property: "og:title", content: "AI Research Assistant — AION" },
      {
        property: "og:description",
        content: "Structured research briefs with insights, recommendations and citations.",
      },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const { output, setOutput, loading, error, generate } = useAion("aion.research");
  const [topic, setTopic] = useState("");
  const [focus, setFocus] = useState("");
  const [depth, setDepth] = useState("Standard");

  const submit = () =>
    generate(
      "You are AION, a research analyst. Return plain-text sections in this order: SUMMARY, INSIGHTS (bullets), RECOMMENDATIONS (bullets), CITATIONS (named sources with links where known, and flag anything you are uncertain about). Never invent precise statistics.",
      `Topic or URL: ${topic}\nFocus area: ${focus}\nDepth: ${depth}`,
      { tool: "research", label: "Research completed", title: topic || "Untitled topic" },
    );


  return (
    <>
      <PageHeader
        eyebrow="AI Research Assistant"
        title="Brief yourself in minutes"
        description="Give AION a topic or link and the angle you care about — get a structured, editable brief."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="glass-card space-y-5 p-6 lg:col-span-5">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic or URL</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="AI adoption in South African logistics"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="focus">Focus area</Label>
            <Textarea
              id="focus"
              rows={5}
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
              placeholder="Cost impact and regulatory risk for mid-size operators"
            />
          </div>
          <div className="space-y-2">
            <Label>Depth</Label>
            <Select value={depth} onValueChange={setDepth}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Quick scan", "Standard", "Deep dive"].map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full" onClick={submit} disabled={loading || !topic}>
            <Wand2 className="h-4 w-4" /> {loading ? "AION is thinking…" : "Run research"}
          </Button>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        <div className="lg:col-span-7">
          <OutputEditor
            storageKey="aion.research"
            value={output}
            onChange={setOutput}
            onRegenerate={submit}
            loading={loading}
            emptyHint="Enter a topic or URL and generate to receive a summary, insights, recommendations and citations."
          />
        </div>
      </div>

      <Disclaimer />
    </>
  );
}
