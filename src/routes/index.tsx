import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BotMessageSquare,
  ListChecks,
  Mail,
  NotebookPen,
  ShieldAlert,
  Telescope,
} from "lucide-react";

import { AppShell } from "@/components/AppShell";

const TITLE = "AI Workplace Productivity Assistant";
const DESC =
  "Automate workplace tasks with AI: draft emails, summarize meetings, plan work, research topics and chat with an assistant.";

export const Route = createFileRoute("/")({
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
  component: Dashboard,
});

const CARDS = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    text: "Professional drafts with the right tone, ready to edit and send.",
  },
  {
    to: "/notes",
    icon: NotebookPen,
    title: "Meeting Notes Summarizer",
    text: "Decisions, action items and open questions from raw notes.",
  },
  {
    to: "/planner",
    icon: ListChecks,
    title: "AI Task Planner",
    text: "Turn a goal into prioritised tasks and a realistic schedule.",
  },
  {
    to: "/research",
    icon: Telescope,
    title: "AI Research Assistant",
    text: "Structured briefings with clear flags for what to verify.",
  },
  {
    to: "/chat",
    icon: BotMessageSquare,
    title: "AI Chatbot",
    text: "Ask anything about your workday and iterate in conversation.",
  },
] as const;

function Dashboard() {
  return (
    <AppShell
      title="Dashboard"
      subtitle="Five AI workspaces to take the busywork out of your day."
    >
      <section className="overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <p className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          Powered by Lovable AI
        </p>
        <h2 className="mt-4 max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl">
          Automate your workplace writing, planning and research
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Structured prompts do the heavy lifting: you give the context, the assistant produces a
          first draft, and every output stays fully editable so the final word is always yours.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/email"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            Draft an email <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium transition hover:bg-accent"
          >
            Open the chatbot
          </Link>
        </div>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map(({ to, icon: Icon, title, text }) => (
          <Link
            key={to}
            to={to}
            className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-sm font-semibold">{title}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{text}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary">
              Open
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>

      <section className="mt-6 rounded-2xl border border-border bg-secondary/40 p-5">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <ShieldAlert className="h-4 w-4 text-primary" />
          Responsible AI use
        </h3>
        <ul className="mt-3 space-y-1.5 text-xs leading-relaxed text-muted-foreground">
          <li>• AI can be confidently wrong — check facts, names, numbers and dates yourself.</li>
          <li>• Never paste confidential, personal or regulated data you are not cleared to share.</li>
          <li>• Use outputs as a first draft, not a final decision; a human stays accountable.</li>
          <li>• The research assistant cannot browse the web and will flag what needs verifying.</li>
        </ul>
      </section>
    </AppShell>
  );
}
