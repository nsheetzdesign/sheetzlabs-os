import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, Link } from "react-router";
import {
  Bot,
  ChevronRight,
  Briefcase,
  Megaphone,
  Package,
  DollarSign,
  Search,
  Settings,
} from "lucide-react";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";

const DEPT_META: Record<
  string,
  {
    label: string;
    Icon: React.ComponentType<{ className?: string }>;
    color: string;
    bg: string;
    border: string;
  }
> = {
  executive: {
    label: "Executive",
    Icon: Briefcase,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  marketing: {
    label: "Marketing",
    Icon: Megaphone,
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
  },
  product: {
    label: "Product",
    Icon: Package,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  finance: {
    label: "Finance",
    Icon: DollarSign,
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
  research: {
    label: "Research",
    Icon: Search,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  operations: {
    label: "Operations",
    Icon: Settings,
    color: "text-zinc-400",
    bg: "bg-zinc-500/10",
    border: "border-zinc-500/20",
  },
};

const STATUS_DOT: Record<string, string> = {
  completed: "bg-green-400",
  running: "bg-amber-400 animate-pulse",
  failed: "bg-red-400",
  skipped: "bg-zinc-500",
};

// Human-readable label for a run's terminated/skip reason (Prompt 65B).
const TERMINATED_LABEL: Record<string, string> = {
  max_iterations: "hit loop cap",
  wall_clock: "timed out",
  token_budget: "token cap",
  daily_budget: "daily spend cap",
  already_running: "overlap skipped",
  stuck_timeout: "stuck → reset",
};

function formatRelativeTime(str: string | null) {
  if (!str) return null;
  const diff = Date.now() - new Date(str).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export async function loader({ context }: LoaderFunctionArgs) {
  const env = context.cloudflare.env as Record<string, string | undefined>;
  const supabase = getSupabaseClient(context.cloudflare.env);
  const today = new Date().toISOString().slice(0, 10);

  const [{ data: agentsData }, { data: runsData }, { data: perfData }] =
    await Promise.all([
      supabase.from("agents").select("id, department, name, slug, enabled"),
      supabase
        .from("agent_runs")
        .select("agent_id, status, terminated_reason, created_at")
        .not("agent_id", "is", null)
        .order("created_at", { ascending: false })
        .limit(200),
      supabase.from("agent_performance").select("total_cost").eq("period_start", today),
    ]);

  const departments = [
    "executive",
    "marketing",
    "product",
    "finance",
    "research",
    "operations",
  ] as const;

  // Latest run per agent (runs are already newest-first).
  const latestByAgent = new Map<string, (typeof runsData)[number]>();
  for (const r of runsData ?? []) {
    if (r.agent_id && !latestByAgent.has(r.agent_id)) latestByAgent.set(r.agent_id, r);
  }

  const deptSummary = departments.map((dept) => {
    const deptAgents = (agentsData ?? [])
      .filter((a) => a.department === dept)
      .map((a) => {
        const last = latestByAgent.get(a.id);
        return {
          ...a,
          last_status: last?.status ?? null,
          last_terminated_reason: last?.terminated_reason ?? null,
        };
      });
    const deptIds = new Set(deptAgents.map((a) => a.id));
    const deptRuns = (runsData ?? []).filter((r) =>
      r.agent_id ? deptIds.has(r.agent_id) : false
    );

    return {
      dept,
      agents: deptAgents,
      agent_count: deptAgents.length,
      enabled_count: deptAgents.filter((a) => a.enabled).length,
      last_run: deptRuns[0]?.created_at ?? null,
      recent_status: deptRuns[0]?.status ?? null,
      recent_terminated_reason: deptRuns[0]?.terminated_reason ?? null,
    };
  });

  const totalAgents = (agentsData ?? []).length;
  const totalEnabled = (agentsData ?? []).filter((a) => a.enabled).length;

  // Today's spend vs. the configurable daily ceiling (mirrors the API default $20).
  const spentCents = (perfData ?? []).reduce(
    (sum, r) => sum + Number((r as { total_cost: unknown }).total_cost ?? 0),
    0
  );
  const capCentsRaw = Number(env.AGENT_DAILY_COST_CAP_CENTS);
  const capCents = Number.isFinite(capCentsRaw) && capCentsRaw > 0 ? capCentsRaw : 2000;

  return {
    deptSummary,
    totalAgents,
    totalEnabled,
    spend: { spentCents, capCents, overCap: spentCents >= capCents },
  };
}

function formatUsd(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function AgentsDepartmentDashboard() {
  const { deptSummary, totalAgents, totalEnabled, spend } =
    useLoaderData<typeof loader>();

  return (
    <div className="flex flex-1 flex-col">
      <Header title="AI Agents" />
      <main className="flex-1 p-6">
        {/* Stats bar */}
        <div className="mb-6 flex flex-wrap items-center gap-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-600">
              Total Agents
            </p>
            <p className="mt-0.5 font-mono text-2xl font-semibold text-zinc-200">
              {totalAgents}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-600">
              Enabled
            </p>
            <p className="mt-0.5 font-mono text-2xl font-semibold text-green-400">
              {totalEnabled}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-600">
              Spend today
            </p>
            <p
              className={`mt-0.5 font-mono text-2xl font-semibold ${
                spend.overCap ? "text-red-400" : "text-zinc-200"
              }`}
              title={
                spend.overCap
                  ? "Daily spend cap reached — scheduled agents are paused until tomorrow."
                  : "Total agent spend today vs. the daily ceiling."
              }
            >
              {formatUsd(spend.spentCents)}
              <span className="ml-1 text-xs font-normal text-zinc-600">
                / {formatUsd(spend.capCents)}
              </span>
            </p>
            {spend.overCap && (
              <p className="mt-0.5 text-[11px] font-medium text-red-400">
                cap reached — agents paused
              </p>
            )}
          </div>
          <Link
            to="/dashboard/agents/runs"
            className="ml-auto text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            View all runs →
          </Link>
          <Link
            to="/dashboard/agents/content"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Content queue →
          </Link>
        </div>

        {/* Department grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {deptSummary.map(
            ({
              dept,
              agents,
              agent_count,
              enabled_count,
              last_run,
              recent_status,
              recent_terminated_reason,
            }) => {
              const meta = DEPT_META[dept];
              const Icon = meta.Icon;
              const dot = recent_status ? STATUS_DOT[recent_status] : null;
              const reasonLabel = recent_terminated_reason
                ? TERMINATED_LABEL[recent_terminated_reason] ?? recent_terminated_reason
                : null;

              return (
                <div
                  key={dept}
                  className={`rounded-xl border ${meta.border} ${meta.bg} p-5 backdrop-blur-sm`}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-5 w-5 ${meta.color}`} />
                      <span className={`font-semibold ${meta.color}`}>
                        {meta.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {reasonLabel && (
                        <span
                          className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-400"
                          title={`Last run: ${reasonLabel}`}
                        >
                          {reasonLabel}
                        </span>
                      )}
                      {dot && (
                        <span className={`h-2 w-2 rounded-full ${dot}`} />
                      )}
                      <span className="text-xs text-zinc-600">
                        {last_run ? formatRelativeTime(last_run) : "never run"}
                      </span>
                    </div>
                  </div>

                  {/* Counts */}
                  <div className="mb-4 flex items-center gap-4 text-sm text-zinc-400">
                    <span>
                      <span className="font-mono font-semibold text-zinc-200">
                        {agent_count}
                      </span>{" "}
                      agent{agent_count !== 1 ? "s" : ""}
                    </span>
                    <span>
                      <span className="font-mono font-semibold text-green-400">
                        {enabled_count}
                      </span>{" "}
                      active
                    </span>
                  </div>

                  {/* Agent list */}
                  {agents.length === 0 ? (
                    <p className="text-xs italic text-zinc-600">No agents yet</p>
                  ) : (
                    <div className="space-y-1">
                      {agents.map((agent) => {
                        const agentReason = agent.last_terminated_reason
                          ? TERMINATED_LABEL[agent.last_terminated_reason] ??
                            agent.last_terminated_reason
                          : null;
                        const flagged =
                          agent.last_status === "failed" || agent.last_status === "skipped";
                        return (
                          <Link
                            key={agent.id}
                            to={`/dashboard/agents/${agent.slug}`}
                            className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-black/20"
                            title={
                              agent.last_status
                                ? `Last run: ${agent.last_status}${agentReason ? ` (${agentReason})` : ""}`
                                : "Never run"
                            }
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className={`h-1.5 w-1.5 shrink-0 rounded-full ${agent.enabled ? "bg-green-400" : "bg-zinc-600"}`}
                              />
                              <span className="truncate text-zinc-300">
                                {agent.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {flagged && (
                                <span
                                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${agent.last_status === "failed" ? "bg-red-400" : "bg-zinc-500"}`}
                                />
                              )}
                              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-zinc-600" />
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>

        {/* Empty state */}
        {totalAgents === 0 && (
          <div className="mt-8 flex flex-col items-center gap-3 rounded-xl border border-surface-2/50 bg-surface-1/40 py-16">
            <Bot className="h-10 w-10 text-zinc-700" />
            <p className="text-sm text-zinc-500">No agents configured yet.</p>
            <p className="text-xs text-zinc-600">
              Agents are defined in the database via the agents table.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
