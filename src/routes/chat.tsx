import { useChat } from "@ai-sdk/react";
import { createFileRoute } from "@tanstack/react-router";
import { DefaultChatTransport, type UIMessage } from "ai";
import { RefreshCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { AppShell } from "@/components/AppShell";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";

const STORAGE_KEY = "aiwork-chat-v1";
const TITLE = "AI Chatbot Assistant | Workplace AI";
const DESC =
  "Chat with an AI assistant about emails, meetings, planning and prioritisation at work.";

const SUGGESTIONS = [
  "Help me prioritise five competing deadlines this week",
  "How do I politely push back on a last-minute request?",
  "Draft an agenda for a 30-minute project kickoff",
];

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  const [ready, setReady] = useState(false);
  const [initial, setInitial] = useState<UIMessage[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setInitial(JSON.parse(raw) as UIMessage[]);
    } catch {
      /* ignore corrupted history */
    }
    setReady(true);
  }, []);

  return (
    <AppShell
      title="AI Chatbot"
      subtitle="Your always-on assistant for day-to-day work questions."
    >
      {ready ? <ChatWindow initialMessages={initial} /> : <div className="h-[60vh]" />}
    </AppShell>
  );
}

function ChatWindow({ initialMessages }: { initialMessages: UIMessage[] }) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status, setMessages, stop, error } = useChat({
    id: "workplace-assistant",
    messages: initialMessages,
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* storage full or unavailable */
    }
  }, [messages]);

  useEffect(() => {
    if (status === "ready") textareaRef.current?.focus();
  }, [status]);

  const busy = status === "submitted" || status === "streaming";

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setInput("");
    await sendMessage({ text: trimmed });
  }

  return (
    <div className="flex h-[calc(100vh-13rem)] min-h-[520px] flex-col rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <p className="text-sm font-semibold">Conversation</p>
        <button
          type="button"
          onClick={() => {
            stop();
            setMessages([]);
            window.localStorage.removeItem(STORAGE_KEY);
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
        >
          <RefreshCcw className="h-3.5 w-3.5" /> New chat
        </button>
      </div>

      <Conversation className="flex-1">
        <ConversationContent>
          {messages.length === 0 && (
            <ConversationEmptyState
              title="How can I help with your work today?"
              description="Ask anything, or start with one of these."
            >
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:bg-accent hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </ConversationEmptyState>
          )}

          {messages.map((message) => (
            <Message from={message.role} key={message.id}>
              <MessageContent>
                {message.parts.map((part, i) =>
                  part.type === "text" ? (
                    <MessageResponse key={i}>{part.text}</MessageResponse>
                  ) : null,
                )}
              </MessageContent>
            </Message>
          ))}

          {status === "submitted" && (
            <Shimmer className="px-1 text-sm">Thinking…</Shimmer>
          )}

          {error && (
            <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error.message || "The assistant is unavailable right now. Please try again."}
            </p>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t border-border p-3">
        <PromptInput
          onSubmit={(message, event) => {
            event.preventDefault();
            void send(message.text || input);
          }}
        >
          <PromptInputTextarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
            placeholder="Ask about an email, a meeting, a plan…"
          />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit
              status={status}
              disabled={!input.trim() && !busy}
              onStop={stop}
            />
          </PromptInputFooter>
        </PromptInput>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          Responses are AI-generated and may be wrong. Verify before acting, and avoid sharing
          confidential information.
        </p>
      </div>
    </div>
  );
}
