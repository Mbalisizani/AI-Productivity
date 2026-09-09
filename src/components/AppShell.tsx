import { Link } from "@tanstack/react-router";
import {
  BotMessageSquare,
  LayoutDashboard,
  ListChecks,
  Mail,
  Menu,
  Moon,
  NotebookPen,
  ShieldAlert,
  Sparkle,
  Sun,
  Telescope,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/notes", label: "Notes Summarizer", icon: NotebookPen },
  { to: "/planner", label: "Task Planner", icon: ListChecks },
  { to: "/research", label: "Research Assistant", icon: Telescope },
  { to: "/chat", label: "AI Chatbot", icon: BotMessageSquare },
] as const;

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground lg:flex">
      {open && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-foreground/30 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-border bg-sidebar transition-transform duration-200 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center gap-3 px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sparkle className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight">Workplace AI</p>
            <p className="truncate text-xs text-muted-foreground">Productivity Assistant</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
            className="ml-auto rounded-lg p-1.5 text-muted-foreground hover:bg-accent lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              activeOptions={{ exact: to === "/" }}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-[status=active]:bg-primary/10 data-[status=active]:text-primary"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="m-3 rounded-xl border border-border bg-card p-3">
          <p className="flex items-center gap-2 text-xs font-semibold">
            <ShieldAlert className="h-3.5 w-3.5 text-primary" />
            Responsible AI
          </p>
          <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
            AI outputs can be inaccurate or incomplete. Review and edit everything before you send,
            share or act on it, and never paste confidential data you are not permitted to share.
          </p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3.5 backdrop-blur-md sm:px-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
            className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-accent lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-semibold tracking-tight sm:text-lg">{title}</h1>
            {subtitle && (
              <p className="truncate text-xs text-muted-foreground sm:text-sm">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={toggle}
            aria-label="Toggle dark mode"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card transition-colors hover:bg-accent"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>

        <footer className="border-t border-border px-4 py-4 text-center text-[11px] text-muted-foreground sm:px-6">
          AI-generated content may be inaccurate. A human review is required before use.
        </footer>
      </div>
    </div>
  );
}
