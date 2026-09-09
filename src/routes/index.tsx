import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

type Category = "personal" | "work" | "shopping" | "health";

const CATEGORIES: { id: Category; label: string; dot: string }[] = [
  { id: "personal", label: "Personal", dot: "bg-sky-400" },
  { id: "work", label: "Work", dot: "bg-indigo-400" },
  { id: "shopping", label: "Shopping", dot: "bg-cyan-400" },
  { id: "health", label: "Health", dot: "bg-teal-400" },
];

type Task = {
  id: string;
  title: string;
  category: Category;
  done: boolean;
  createdAt: number;
};

type Filter = "all" | "active" | "completed";

const STORAGE_KEY = "calm-tasks-v1";
const THEME_KEY = "calm-tasks-theme";

function loadTasks(): Task[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Task[]) : [];
  } catch {
    return [];
  }
}

function loadTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  const saved = window.localStorage.getItem(THEME_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Calm — Task Manager" },
      {
        name: "description",
        content:
          "A clean, minimal task manager with categories and dark mode. Stay focused and organized.",
      },
      { property: "og:title", content: "Calm — Task Manager" },
      {
        property: "og:description",
        content:
          "A clean, minimal task manager with categories and dark mode. Stay focused and organized.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("personal");
  const [filter, setFilter] = useState<Filter>("all");
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
  const [theme, setTheme] = useState<"light" | "dark">(loadTheme);

  // Apply + persist theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // Persist tasks
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  function addTask(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    setTasks((prev) => [
      { id: crypto.randomUUID(), title: trimmed, category, done: false, createdAt: Date.now() },
      ...prev,
    ]);
    setTitle("");
  }

  function toggleTask(id: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  }

  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function clearCompleted() {
    setTasks((prev) => prev.filter((t) => !t.done));
  }

  const visibleTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (activeCategory !== "all" && t.category !== activeCategory) return false;
      if (filter === "active" && t.done) return false;
      if (filter === "completed" && !t.done) return false;
      return true;
    });
  }, [tasks, filter, activeCategory]);

  const remaining = tasks.filter((t) => !t.done).length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Ambient calm gradient backdrop */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-70"
        style={{
          background:
            "radial-gradient(60% 50% at 20% 0%, color-mix(in oklab, var(--primary) 16%, transparent), transparent 70%), radial-gradient(50% 40% at 100% 10%, color-mix(in oklab, var(--primary) 10%, transparent), transparent 70%)",
        }}
      />

      <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-10 sm:py-16">
        {/* Header */}
        <header className="sticky top-0 z-20 -mx-4 flex items-center justify-between bg-background/80 px-4 py-3 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <CheckIcon className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Calm</h1>
              <p className="text-xs text-muted-foreground">
                {remaining} task{remaining === 1 ? "" : "s"} left
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            aria-label="Toggle dark mode"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-accent"
          >
            {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </button>
        </header>

        {/* Add task */}
        <form onSubmit={addTask} className="flex flex-col gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm focus-within:ring-2 focus-within:ring-ring">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add a task…"
              className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-40"
              disabled={!title.trim()}
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => {
              const active = category === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:bg-accent"
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${c.dot}`} />
                  {c.label}
                </button>
              );
            })}
          </div>
        </form>

        {/* Category filter chips */}
        <div className="flex flex-wrap items-center gap-2">
          <CategoryChip
            active={activeCategory === "all"}
            onClick={() => setActiveCategory("all")}
            label="All"
          />
          {CATEGORIES.map((c) => (
            <CategoryChip
              key={c.id}
              active={activeCategory === c.id}
              onClick={() => setActiveCategory(c.id)}
              label={c.label}
              dot={c.dot}
            />
          ))}
        </div>

        {/* Status filters + clear */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1 rounded-full border border-border bg-card p-1">
            {(["all", "active", "completed"] as Filter[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
                  filter === f
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          {tasks.some((t) => t.done) && (
            <button
              type="button"
              onClick={clearCompleted}
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-destructive"
            >
              Clear completed
            </button>
          )}
        </div>

        {/* Task list */}
        <ul className="flex flex-col gap-2">
          {visibleTasks.map((t) => {
            const cat = CATEGORIES.find((c) => c.id === t.category)!;
            return (
              <li
                key={t.id}
                className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-[0_2px_8px_-2px_color-mix(in_oklab,var(--primary)_18%,transparent)] transition-colors hover:bg-accent/40"
              >
                <button
                  type="button"
                  onClick={() => toggleTask(t.id)}
                  aria-label={t.done ? "Mark as not done" : "Mark as done"}
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                    t.done
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/40 hover:border-primary"
                  }`}
                >
                  {t.done && <CheckIcon className="h-3.5 w-3.5" />}
                </button>
                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-sm ${
                      t.done
                        ? "text-muted-foreground line-through"
                        : "text-foreground"
                    }`}
                  >
                    {t.title}
                  </p>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${cat.dot}`} />
                    <span className="text-[11px] capitalize text-muted-foreground">
                      {cat.label}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => deleteTask(t.id)}
                  aria-label="Delete task"
                  className="shrink-0 rounded-lg p-1.5 text-muted-foreground opacity-0 transition-all hover:text-destructive group-hover:opacity-100"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </li>
            );
          })}
          {visibleTasks.length === 0 && (
            <li className="rounded-2xl border border-dashed border-border bg-card/50 px-4 py-12 text-center">
              <p className="text-sm text-muted-foreground">
                {tasks.length === 0
                  ? "No tasks yet. Add your first one above."
                  : "Nothing here. Try a different filter."}
              </p>
            </li>
          )}
        </ul>

        <footer className="mt-2 text-center text-xs text-muted-foreground">
          Calm · saved on this device
        </footer>
      </div>
    </div>
  );
}

function CategoryChip({
  active,
  onClick,
  label,
  dot,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  dot?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "border-foreground/20 bg-foreground/5 text-foreground"
          : "border-border bg-card text-muted-foreground hover:bg-accent"
      }`}
    >
      {dot && <span className={`h-2 w-2 rounded-full ${dot}`} />}
      {label}
    </button>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
