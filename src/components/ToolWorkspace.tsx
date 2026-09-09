import { Check, Copy, Download, Loader2, RotateCcw, Wand2 } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import { AppShell } from "@/components/AppShell";
import type { ToolConfig } from "@/lib/prompts";

export function ToolWorkspace({ config }: { config: ToolConfig }) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      config.fields.map((f) => [f.name, f.type === "select" ? (f.options?.[0] ?? "") : ""]),
    ),
  );
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const set = (name: string, value: string) => setValues((v) => ({ ...v, [name]: value }));

  const missing = config.fields.some((f) => f.required && !values[f.name]?.trim());

  const run = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    setOutput("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: config.id, data: values }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Request failed (${res.status})`);
      }

      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        if (value) setOutput((prev) => prev + value);
      }
    } catch (err) {
      if ((err as Error)?.name === "AbortError") return;
      setError((err as Error).message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [config.id, values]);

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const download = () => {
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${config.id}-draft.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppShell title={config.title} subtitle={config.tagline}>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-sm font-semibold">Your inputs</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            The more context you give, the better the draft.
          </p>

          <div className="mt-5 space-y-4">
            {config.fields.map((f) => (
              <div key={f.name} className="space-y-1.5">
                <label htmlFor={f.name} className="block text-xs font-medium text-foreground">
                  {f.label}
                  {f.required && <span className="ml-1 text-primary">*</span>}
                </label>
                {f.type === "textarea" ? (
                  <textarea
                    id={f.name}
                    rows={f.name === "notes" ? 8 : 4}
                    value={values[f.name] ?? ""}
                    onChange={(e) => set(f.name, e.target.value)}
                    placeholder={f.placeholder}
                    className="w-full resize-y rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-ring"
                  />
                ) : f.type === "select" ? (
                  <select
                    id={f.name}
                    value={values[f.name] ?? ""}
                    onChange={(e) => set(f.name, e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-ring"
                  >
                    {f.options?.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={f.name}
                    value={values[f.name] ?? ""}
                    onChange={(e) => set(f.name, e.target.value)}
                    placeholder={f.placeholder}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-ring"
                  />
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={run}
            disabled={loading || missing}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-40"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4" />
            )}
            {loading ? "Working…" : config.cta}
          </button>
          {missing && (
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              Fill in the required field to continue.
            </p>
          )}
        </section>

        <section className="flex min-h-[420px] flex-col rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="mr-auto text-sm font-semibold">Draft output</h2>
            <button
              type="button"
              onClick={run}
              disabled={loading || missing}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground disabled:opacity-40"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Regenerate
            </button>
            <button
              type="button"
              onClick={copy}
              disabled={!output}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground disabled:opacity-40"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              type="button"
              onClick={download}
              disabled={!output}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground disabled:opacity-40"
            >
              <Download className="h-3.5 w-3.5" /> Save
            </button>
          </div>

          {error && (
            <p className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}
            </p>
          )}

          {output || loading ? (
            <textarea
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              spellCheck
              className="mt-4 min-h-[340px] flex-1 resize-y rounded-xl border border-input bg-background px-3.5 py-3 font-mono text-[13px] leading-relaxed outline-none transition focus:ring-2 focus:ring-ring"
            />
          ) : (
            <div className="mt-4 flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 text-center">
              <Wand2 className="h-6 w-6 text-muted-foreground" />
              <p className="mt-3 text-sm font-medium">Nothing generated yet</p>
              <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                Add your details on the left, then generate. The result appears here and stays fully
                editable.
              </p>
            </div>
          )}

          <p className="mt-3 text-[11px] text-muted-foreground">
            Output is editable — check facts, names and dates before you use it.
          </p>
        </section>
      </div>
    </AppShell>
  );
}
