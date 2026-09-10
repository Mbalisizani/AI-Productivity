import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarClock,
  Mail,
  MessageCircleHeart,
  NotebookPen,
  Search,
} from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { Disclaimer } from "@/components/Disclaimer";

const TITLE = "Mainstreet — AI assistant for small businesses";
const DESC =
  "One workspace to draft emails, summarize meetings, plan your tasks, research topics and ask questions — with AI drafts you always review.";

const CARDS = [
  {
    to: "/email",
    title: "Email Generator",
    text: "Turn a few notes into a ready-to-send email in the tone you choose.",
    icon: Mail,
  },
  {
    to: "/notes",
    title: "Meeting Notes Summarizer",
    text: "Paste messy notes and get a summary, decisions and action items.",
    icon: NotebookPen,
  },
  {
    to: "/planner",
    title: "Task Planner",
    text: "Prioritise your list and get a realistic, time-boxed schedule.",
    icon: CalendarClock,
  },
  {
    to: "/research",
    title: "Research Assistant",
    text: "Get a plain-language briefing with practical recommendations.",
    icon: Search,
  },
  {
    to: "/chat",
    title: "Ask Mainstreet",
    text: "Chat through any work question and keep the conversation history.",
    icon: MessageCircleHeart,
  },
] as const;

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

function Dashboard() {
  return (
    <AppShell title="Dashboard" subtitle="Your small business AI workspace">
      <section className="rounded-2xl bg-secondary px-6 py-8 text-secondary-foreground sm:px-8 sm:py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary-foreground/70">
          Welcome back
        </p>
        <h2 className="mt-3 font-display text-2xl leading-tight sm:text-3xl">
          Let's get the admin off your plate.
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-secondary-foreground/80">
          Pick a tool below and Mainstreet will write the first draft. You stay in control — every
          result is editable, and nothing is ever sent for you.
        </p>
      </section>

      <Disclaimer className="mt-6" />

      <h3 className="mt-8 font-display text-lg">Your tools</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {CARDS.map(({ to, title, text, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </span>
            <p className="mt-4 font-display text-base font-semibold">{title}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{text}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
              Open
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
