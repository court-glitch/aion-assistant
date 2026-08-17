import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { generateWithAion } from "@/lib/ai.functions";
import { bumpUsage } from "@/lib/aion";
import { logActivity, type ActivityItem } from "@/lib/activity";

type ActivityMeta = { tool: ActivityItem["tool"]; label: string; title: string };

export function useAion(storageKey: string) {
  const run = useServerFn(generateWithAion);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setOutput(window.localStorage.getItem(storageKey) ?? "");
  }, [storageKey]);

  const generate = useCallback(
    async (system: string, prompt: string, activity?: ActivityMeta) => {
      setLoading(true);
      setError(null);
      try {
        const result = await run({ data: { system, prompt } });
        setOutput(result.text);
        window.localStorage.setItem(storageKey, result.text);
        bumpUsage();
        if (activity) logActivity(activity);
      } catch (e) {
        const message = e instanceof Error ? e.message : "AION could not complete this request.";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    [run, storageKey],
  );

  return { output, setOutput, loading, error, generate };
}

