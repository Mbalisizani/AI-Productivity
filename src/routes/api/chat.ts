import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

import { AI_MODEL_ID, createGateway, reasoningOptions } from "@/lib/ai-gateway.server";
import { CHAT_SYSTEM_PROMPT } from "@/lib/prompts";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as { messages?: UIMessage[] };
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        try {
          const gateway = createGateway();
          const result = streamText({
            model: gateway.responses(AI_MODEL_ID),
            system: CHAT_SYSTEM_PROMPT,
            messages: await convertToModelMessages(messages),
            providerOptions: reasoningOptions,
            abortSignal: request.signal,
          });

          return result.toUIMessageStreamResponse({ originalMessages: messages });
        } catch (error) {
          console.error("chat failed", error);
          const message = error instanceof Error ? error.message : "AI request failed";
          return new Response(message, { status: 500 });
        }
      },
    },
  },
});
