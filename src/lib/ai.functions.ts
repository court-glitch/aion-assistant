import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  system: z.string().min(1),
  prompt: z.string().min(1),
});

async function runGateway(system: string, prompt: string) {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured (missing API key).");

  const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
  const { streamText } = await import("ai");

  const gateway = createLovableAiGatewayProvider(key);
  const result = streamText({
    model: gateway("google/gemini-3.6-flash"),
    system,
    prompt,
  });
  return await result.text;
}

export const generateWithAion = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }) => {
    try {
      return { text: await runGateway(data.system, data.prompt) };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      const status = /429/.test(message)
        ? "AION is rate limited right now. Please wait a moment and try again."
        : /402/.test(message)
          ? "AI credits are exhausted for this workspace. Add credits to keep generating."
          : /403/.test(message)
            ? "AI access is blocked by workspace policy."
            : message;
      throw new Error(status);
    }
  });
