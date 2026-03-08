import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, Form, Link } from "react-router";
import { Bot, ChevronRight } from "lucide-react";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import { Button } from "~/components/ui/Button";
import { EmptyState } from "~/components/ui/EmptyState";

const STATUS_META: Record<string, { color: string; dot: string }> = {
  completed: { color: "text-green-400 bg-green-500/10 border-green-500/20", dot: "bg-green-400" },
  running: { color: "text-amber-400 bg-amber-500/10 border-amber-500/20", dot: "bg-amber-400 animate-pulse" },
  failed: { color: "text-red-400 bg-red-500/10 border-red-500/20", dot: "bg-red-400" },
};

function formatDuration(ms: number | null) {
  if (!ms) return "—";
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function formatTime(str: string | null) {
  if (!str) return "—";
  const d = new Date(str);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);
  const url = new URL(request.url);
  const agentFilter = url.searchParams.get("agent") || "";
  const statusFilter = url.searchParams.get("status") || "";

  let query = supabase
    .from("agent_runs")
    .select("*")
    .order("started_at", { ascending: false })
    .limit(100);

  if (agentFilter) query = query.eq("agent_name", agentFilter);
  if (statusFilter) query = query.eq("status", statusFilter);

  const { data } = await query;
  const runs = data ?? [];

  // Collect unique agent names for filter
  const { data: allRuns } = await supabase
    .from("agent_runs")
    .select("agent_name")
    .order("agent_name");
  const agentNames = [...new Set((allRuns ?? []).map((r) => r.agent_name))].sort();

  // Stats
  const total = runs.length;
  const failed = runs.filter((r) => r.status === "failed").length;
  const avgDuration = runs.filter((r) => r.duration_ms).length
    ? Math.round(
        runs.reduce((sum, r) => sum + (r.duration_ms ?? 0), 0) /
          runs.filter((r) => r.duration_ms).length,
      )
    : null;

  return {
    runs,
    agentNames,
    filters: { agent: agentFilter, status: statusFilter },
    stats: { total, failed, avgDuration },
  };
}

export default function AgentsIndex() {
  const { runs, agentNames, filters, stats } = useLoaderData<typeof loader>();
  const STATUSES = ["running", "completed", "failed"];

  return (
    <div className="flex flex-1 flex-col">
      <Header title="AI Agents" />
      <main className="flex-1 p-6">
        {/* Stats */}
        {stats.total > 0 && (
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Total Runs", value: stats.total, hint: "matching filters" },
              { label: "Failed", value: stats.failed, hint: `${stats.total ? Math.round((stats.failed / stats.total) * 100) : 0}% error rate` },
              { label: "Avg Duration", value: formatDuration(stats.avgDuration), hint: "completed runs" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-surface-2/50 bg-surface-1/40 p-4 backdrop-blur-sm"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-600">{s.label}</p>
                <p className="mt-1 font-mono text-2xl font-semibold text-zinc-200">{s.value}</p>
                <p className="mt-0.5 text-xs text-zinc-700">{s.hint}</p>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <Form method="get" className="mb-4 flex flex-wrap items-center gap-2">
          {agentNames.length > 0 && (
            <select
              name="agent"
              defaultValue={filters.agent}
              className="rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-1.5 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-brand"
            >
              <option value="">All agents</option>
              {agentNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          )}

          <select
            name="status"
            defaultValue={filters.status}
            className="rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-1.5 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-brand"
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <Button type="submit" variant="secondary">
            Filter
          </Button>
          {(filters.agent || filters.status) && (
            <Link to="/dashboard/agents">
              <Button type="button" variant="secondary">
                Clear
              </Button>
            </Link>
          )}
        </Form>

        {/* Runs list */}
        <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 backdrop-blur-sm">
          <div
            className="grid border-b border-surface-2/50 px-4 py-2 text-xs font-medium uppercase tracking-wide text-zinc-600"
            style={{ gridTemplateColumns: "1fr auto" }}
          >
            <span>Run</span>
            <div className="flex items-center gap-4">
              <span className="hidden sm:block">Duration</span>
              <span className="hidden sm:block">Tokens</span>
              <span>Status</span>
              <span className="w-4" />
            </div>
          </div>

          {runs.length === 0 ? (
            <EmptyState
              icon={Bot}
              title="No agent runs"
              description={
                filters.agent || filters.status
                  ? "No runs match these filters."
                  : "Agent runs logged via the API will appear here."
              }
            />
          ) : (
            <div className="divide-y divide-surface-2/30 py-1">
              {runs.map((run) => {
                const sm = STATUS_META[run.status ?? "running"] ?? STATUS_META.running;
                return (
                  <Link
                    key={run.id}
                    to={run.id}
                    className="flex items-center gap-4 rounded-lg px-4 py-3 transition-colors hover:bg-surface-2/30"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 shrink-0 rounded-full ${sm.dot}`} />
                        <span className="text-sm font-medium text-zinc-200">
                          {run.agent_name}
                        </span>
                        {run.trigger_type && (
                          <span className="text-xs text-zinc-600">
                            via {run.trigger_type}
                          </span>
                        )}
                      </div>
                      <p className="ml-4 mt-0.5 text-xs text-zinc-600">
                        {formatTime(run.started_at)}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-4">
                      <span className="hidden font-mono text-xs text-zinc-600 sm:block">
                        {formatDuration(run.duration_ms)}
                      </span>
                      <span className="hidden w-14 text-right font-mono text-xs text-zinc-600 sm:block">
                        {run.tokens_used ? run.tokens_used.toLocaleString() : "—"}
                      </span>
                      <span className={`rounded border px-1.5 py-0.5 text-xs font-medium ${sm.color}`}>
                        {run.status}
                      </span>
                      <ChevronRight className="h-4 w-4 text-zinc-700" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
