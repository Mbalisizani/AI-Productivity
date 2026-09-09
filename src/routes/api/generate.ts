import { createFileRoute } from "@tanstack/react-router";
import { streamText } from "ai";

import { AI_MODEL_ID, createGateway, reasoningOptions } from "@/lib/ai-gateway.server";
import { buildPrompt, TOOLS, type ToolId } from "@/lib/prompts";

type Body = { tool?: string; data?: Record<string, string> };

export const Route = createFileRoute("/api/generate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as Body;
        const tool = body.tool as ToolId;
        if (!tool || !(tool in TOOLS)) {
          return new Response("Unknown tool", { status: 400 });
        }

        const built = buildPrompt(tool, body.data ?? {});
        if (!built) return new Response("Invalid request", { status: 400 });

        try {
          const gateway = createGateway();
          const result = streamText({
            model: gateway.responses(AI_MODEL_ID),
            system: built.system,
            prompt: built.prompt,
            providerOptions: reasoningOptions,
            abortSignal: request.signal,
          });

          return result.toTextStreamResponse();
        } catch (error) {
          console.error("generate failed", error);
          const message = error instanceof Error ? error.message : "AI request failed";
          return new Response(message, { status: 500 });
        }
      },
    },
  },
});
