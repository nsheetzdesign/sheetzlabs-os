import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, Link } from "react-router";
import { useState } from "react";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import { Button } from "~/components/ui/Button";

const STATUS_META: Record<string, { color: string; label: string }> = {
  completed: { color: "text-green-400 bg-green-500/10 border-green-500/30", label: "Completed" },
  running: { color: "text-amber-400 bg-amber-500/10 border-amber-500/30", label: "Running" },
  failed: { color: "text-red-400 bg-red-500/10 border-red-500/30", label: "Failed" },
};

export async function loader({ params, context }: LoaderFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);
  const { data } = await supabase
    .from("agent_runs")
    .select("*")
    .eq("id", params.id!)
    .single();

  if (!data) throw new Response("Not found", { status: 404 });

  return { run: data };
}

function formatTime(str: string | null) {
  if (!str) return "—";
  return new Date(str).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatDuration(ms: number | null) {
  if (!ms) return "—";
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function JsonBlock({ label, data }: { label: string; data: unknown }) {
  const [open, setOpen] = useState(false);
  const isEmpty = data === null || data === undefined;

  return (
    <div className="rounded-lg border border-surface-2/50 bg-surface-1/30">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="text-sm font-medium text-zinc-300">{label}</span>
        <div className="flex items-center gap-2">
          {isEmpty && <span className="text-xs text-zinc-600">empty</span>}
          <span className="text-xs text-zinc-600">{open ? "▲ collapse" : "▼ expand"}</span>
        </div>
      </button>
      {open && (
        <div className="border-t border-surface-2/50 px-4 py-3">
          {isEmpty ? (
            <p className="text-xs italic text-zinc-600">No data</p>
          ) : (
            <pre className="overflow-x-auto font-mono text-xs text-zinc-400">
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}

export default function AgentRunDetail() {
  const { run } = useLoaderData<typeof loader>();
  const sm = STATUS_META[run.status ?? "running"] ?? STATUS_META.running;

  const duration =
    run.duration_ms ??
    (run.started_at && run.completed_at
      ? new Date(run.completed_at).getTime() - new Date(run.started_at).getTime()
      : null);

  return (
    <div className="flex flex-1 flex-col">
      <Header title={run.agent_name} />
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-3xl space-y-4">
          {/* Status bar */}
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-surface-2/50 bg-surface-1/40 px-5 py-4 backdrop-blur-sm">
            <span className={`rounded border px-2.5 py-1 text-sm font-semibold ${sm.color}`}>
              {sm.label}
            </span>
            {run.trigger_type && (
              <span className="rounded border border-surface-2/50 px-2 py-0.5 text-xs text-zinc-500">
                via {run.trigger_type}
              </span>
            )}
            <Link to="/dashboard/agents" className="ml-auto text-xs text-zinc-600 hover:text-zinc-400">
              ← All runs
            </Link>
          </div>

          {/* Meta grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Started", value: formatTime(run.started_at) },
              { label: "Completed", value: formatTime(run.completed_at) },
              { label: "Duration", value: formatDuration(duration) },
              {
                label: "Tokens Used",
                value: run.tokens_used ? run.tokens_used.toLocaleString() : "—",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-surface-2/50 bg-surface-1/40 p-3"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-600">
                  {item.label}
                </p>
                <p className="mt-1 font-mono text-sm text-zinc-300">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Error message */}
          {run.error_message && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-red-400">
                Error
              </p>
              <pre className="whitespace-pre-wrap font-mono text-sm text-red-300">
                {run.error_message}
              </pre>
            </div>
          )}

          {/* JSON blocks */}
          <JsonBlock label="Input Data" data={run.input_data} />
          <JsonBlock label="Output Data" data={run.output_data} />
        </div>
      </main>
    </div>
  );
}
