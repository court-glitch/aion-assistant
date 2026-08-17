import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GripVertical, Wand2 } from "lucide-react";

import { Disclaimer } from "@/components/aion/AppShell";
import { PageHeader } from "@/components/aion/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { generateWithAion } from "@/lib/ai.functions";
import { bumpUsage } from "@/lib/aion";
import { logActivity } from "@/lib/activity";


export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — AION" },
      {
        name: "description",
        content:
          "Generate a prioritised daily or weekly plan and rearrange tasks with drag and drop.",
      },
      { property: "og:title", content: "AI Task Planner — AION" },
      {
        property: "og:description",
        content: "Prioritised daily and weekly plans with drag-and-drop scheduling.",
      },
    ],
  }),
  component: PlannerPage,
});

type Task = { id: string; title: string; time: string; priority: string; day: string };

const dailySlots = ["Morning", "Midday", "Afternoon", "Evening"];
const weekSlots = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function parseTasks(text: string, slots: string[]): Task[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.includes("|"))
    .map((line, i) => {
      const [day = "", time = "", title = "", priority = "Medium"] = line
        .replace(/^[-*\d.\s]+/, "")
        .split("|")
        .map((p) => p.trim());
      const matched = slots.find((s) => day.toLowerCase().startsWith(s.slice(0, 3).toLowerCase()));
      return {
        id: `${i}-${title}`,
        title,
        time,
        priority,
        day: matched ?? slots[i % slots.length]!,
      };
    })
    .filter((t) => t.title.length > 0);
}

function PlannerPage() {
  const run = useServerFn(generateWithAion);
  const [mode, setMode] = useState<"daily" | "weekly">("daily");
  const [role, setRole] = useState("");
  const [workload, setWorkload] = useState("");
  const [priorities, setPriorities] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragged, setDragged] = useState<string | null>(null);

  const slots = mode === "daily" ? dailySlots : weekSlots;

  useEffect(() => {
    const raw = window.localStorage.getItem("aion.planner");
    if (raw) setTasks(JSON.parse(raw) as Task[]);
  }, []);

  const persist = (next: Task[]) => {
    setTasks(next);
    window.localStorage.setItem("aion.planner", JSON.stringify(next));
  };

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await run({
        data: {
          system: `You are AION, a productivity planner. Return ONLY task lines, one per line, in the format: Slot | Time | Task | Priority. Slot must be one of: ${slots.join(", ")}. Priority is High, Medium or Low. Return 8-12 lines. No headings, no extra text.`,
          prompt: `Role: ${role}\nWorkload: ${workload}\nTop priorities: ${priorities}\nPlan type: ${mode}`,
        },
      });
      persist(parseTasks(result.text, slots));
      bumpUsage();
      logActivity({
        tool: "planner",
        label: "Task plan created",
        title: `${mode} plan${role ? ` — ${role}` : ""}`,
      });

    } catch (e) {
      const message = e instanceof Error ? e.message : "AION could not build this plan.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const drop = (slot: string) => {
    if (!dragged) return;
    persist(tasks.map((t) => (t.id === dragged ? { ...t, day: slot } : t)));
    setDragged(null);
  };

  return (
    <>
      <PageHeader
        eyebrow="AI Task Planner"
        title="A plan that matches your real workload"
        description="AION prioritises your work into time blocks. Drag any task to reschedule it."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="glass-card space-y-5 p-6 lg:col-span-4">
          <Tabs value={mode} onValueChange={(v) => setMode(v as "daily" | "weekly")}>
            <TabsList className="w-full">
              <TabsTrigger value="daily" className="flex-1">
                Daily
              </TabsTrigger>
              <TabsTrigger value="weekly" className="flex-1">
                Weekly
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Operations manager"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="workload">Workload</Label>
            <Input
              id="workload"
              value={workload}
              onChange={(e) => setWorkload(e.target.value)}
              placeholder="Heavy — 3 projects, 6 meetings"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="priorities">Top priorities</Label>
            <Textarea
              id="priorities"
              rows={5}
              value={priorities}
              onChange={(e) => setPriorities(e.target.value)}
              placeholder="Ship vendor report; interview two candidates; budget review"
            />
          </div>
          <Button className="w-full" onClick={generate} disabled={loading || !priorities}>
            <Wand2 className="h-4 w-4" /> {loading ? "AION is thinking…" : "Build plan"}
          </Button>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        <div className="lg:col-span-8">
          {loading ? (
            <div className="glass-card flex min-h-64 flex-col items-center justify-center gap-3 p-10">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-sm text-muted-foreground">AION is thinking…</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="glass-card flex min-h-64 flex-col items-center justify-center gap-2 p-10 text-center">
              <p className="font-sans text-base font-semibold text-foreground">No plan yet</p>
              <p className="max-w-md text-sm text-muted-foreground">
                Describe your role, workload and priorities to generate a prioritised calendar.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {slots.map((slot) => (
                <div
                  key={slot}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => drop(slot)}
                  className="glass-card min-h-40 space-y-3 p-4"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-violet">
                    {slot}
                  </p>
                  {tasks
                    .filter((t) => t.day === slot)
                    .map((task) => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={() => setDragged(task.id)}
                        className="cursor-grab rounded-xl border border-border bg-card/70 p-3 text-xs active:cursor-grabbing"
                      >
                        <div className="flex items-start gap-2">
                          <GripVertical className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-foreground">{task.title}</p>
                            <p className="mt-1 text-[11px] text-muted-foreground">
                              {task.time} · {task.priority}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          )}
          <p className="mt-3 text-[11px] text-muted-foreground">
            Drag tasks between blocks — your plan is saved locally.
          </p>
        </div>
      </div>

      <Disclaimer />
    </>
  );
}
