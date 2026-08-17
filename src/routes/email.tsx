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
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAion } from "@/hooks/useAion";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — AION" },
      {
        name: "description",
        content:
          "Generate formal, friendly or persuasive workplace emails with AION and edit them inline.",
      },
      { property: "og:title", content: "Smart Email Generator — AION" },
      {
        property: "og:description",
        content: "AI-drafted workplace emails with tone and length control.",
      },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const { output, setOutput, loading, error, generate } = useAion("aion.email");
  const [recipient, setRecipient] = useState("");
  const [context, setContext] = useState("");
  const [points, setPoints] = useState("");
  const [tone, setTone] = useState("Formal");
  const [length, setLength] = useState(50);

  const submit = () =>
    generate(
      "You are AION, an expert workplace communication assistant. Write clear, professional emails. Return only the email with a Subject line, greeting, body and sign-off.",
      `Recipient: ${recipient || "colleague"}\nSubject context: ${context}\nKey points: ${points}\nTone: ${tone}\nLength: ${length < 34 ? "short (under 90 words)" : length < 67 ? "medium (120-180 words)" : "detailed (250+ words)"}`,
      { tool: "email", label: "Email generated", title: context || recipient || "Untitled email" },
    );


  return (
    <>
      <PageHeader
        eyebrow="Smart Email Generator"
        title="Write the right email, first time"
        description="Give AION the essentials — it handles structure, tone and polish."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="glass-card space-y-5 p-6 lg:col-span-5">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Input
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Head of Operations, Nadia"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="context">Subject context</Label>
            <Input
              id="context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Delayed Q3 vendor onboarding"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="points">Key points</Label>
            <Textarea
              id="points"
              rows={6}
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              placeholder="Timeline slipped two weeks; propose new milestones; request approval by Friday"
            />
          </div>
          <div className="space-y-2">
            <Label>Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Formal", "Friendly", "Persuasive"].map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <Label>Length — {length < 34 ? "Short" : length < 67 ? "Medium" : "Detailed"}</Label>
            <Slider value={[length]} onValueChange={(v) => setLength(v[0] ?? 50)} max={100} step={1} />
          </div>
          <Button className="w-full" onClick={submit} disabled={loading || !context}>
            <Wand2 className="h-4 w-4" /> {loading ? "AION is thinking…" : "Generate email"}
          </Button>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        <div className="lg:col-span-7">
          <OutputEditor
            storageKey="aion.email"
            value={output}
            onChange={setOutput}
            onRegenerate={submit}
            loading={loading}
            emptyHint="Add a subject context and key points, then generate. Your draft appears here as editable rich text."
          />
        </div>
      </div>

      <Disclaimer />
    </>
  );
}
