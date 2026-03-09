import type { MetaFunction, LoaderFunctionArgs } from "react-router";
import { useLoaderData, Link } from "react-router";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Bot,
  Zap,
  CheckCircle2,
  AlertCircle,
  Clock,
  Mail,
  PenSquare,
  Rocket,
} from "lucide-react";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";

export const meta: MetaFunction = () => [
  { title: "Analytics — Sheetz Labs OS" },
];

// ─── Loader ───────────────────────────────────────────────────────────────────

export async function loader({ context }: LoaderFunctionArgs) {
  const env = context.cloudflare.env;
  const supabase = getSupabaseClient(env);

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const daysSince = (date: string) =>
    Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));

  const [
    // Snapshot
    snapshotRes,
    // Real-time counts
    venturesRes,
    pipelineRes,
    relationshipsRes,
    tasksRes,
    // Agent data
    agentsRes,
    agentRunsRes,
    // Pipeline details
    pipelineDetailsRes,
    // Relationship health
    relationshipDetailsRes,
    // System
    agentRuns24hRes,
    emailAccountsRes,
    calendarAccountsRes,
    contentQueueRes,
    capturesRes,
  ] = await Promise.all([
    supabase
      .from("analytics_snapshots")
      .select("*")
      .order("snapshot_date", { ascending: false })
      .limit(1)
      .single(),
    supabase.from("ventures").select("id", { count: "exact" }).eq("status", "active"),
    supabase.from("pipeline").select("id", { count: "exact" }),
    supabase.from("relationships").select("id", { count: "exact" }),
    supabase
      .from("tasks")
      .select("id", { count: "exact" })
      .in("status", ["todo", "in_progress"]),
    supabase.from("agents").select("id, name, slug, department, enabled"),
    supabase
      .from("agent_runs")
      .select("agent_id, status, cost_cents, duration_ms")
      .gte("created_at", sevenDaysAgo.toISOString()),
    supabase.from("pipeline").select("id, name, stage, total_score"),
    supabase
      .from("relationships")
      .select("id, name, company, type, last_contact, strength"),
    supabase
      .from("agent_runs")
      .select("status", { count: "exact" })
      .gte("created_at", oneDayAgo.toISOString()),
    supabase.from("email_accounts").select("email, last_sync_at, sync_enabled"),
    supabase.from("calendar_accounts").select("email, last_sync_at, sync_enabled"),
    supabase.from("content").select("id").eq("status", "scheduled"),
    supabase.from("captures").select("id").eq("processed", false),
  ]);

  // --- Snapshot data ---
  const latest = snapshotRes.data;

  // --- Real-time counts ---
  const realtime = {
    ventures: venturesRes.count || 0,
    pipeline: pipelineRes.count || 0,
    relationships: relationshipsRes.count || 0,
    open_tasks: tasksRes.count || 0,
  };

  // --- Agent performance (7d) ---
  const agentStats: Record<
    string,
    {
      id: string;
      name: string;
      slug: string;
      department: string;
      enabled: boolean;
      runs_total: number;
      runs_success: number;
      runs_failed: number;
      success_rate: number;
      total_cost: number;
      avg_duration: number;
    }
  > = {};

  for (const agent of agentsRes.data || []) {
    const agentRuns = (agentRunsRes.data || []).filter((r) => r.agent_id === agent.id);
    const successRuns = agentRuns.filter((r) => r.status === "completed");
    agentStats[agent.id] = {
      ...agent,
      runs_total: agentRuns.length,
      runs_success: successRuns.length,
      runs_failed: agentRuns.filter((r) => r.status === "failed").length,
      success_rate:
        agentRuns.length > 0
          ? Math.round((successRuns.length / agentRuns.length) * 100)
          : 100,
      total_cost:
        agentRuns.reduce((s, r) => s + Number(r.cost_cents || 0), 0) / 100,
      avg_duration:
        agentRuns.length > 0
          ? Math.round(
              agentRuns.reduce((s, r) => s + Number(r.duration_ms || 0), 0) /
                agentRuns.length
            )
          : 0,
    };
  }

  const byDepartment: Record<
    string,
    { runs: number; cost: number; success: number; failed: number }
  > = {};
  for (const stats of Object.values(agentStats)) {
    const dept = stats.department;
    if (!byDepartment[dept]) byDepartment[dept] = { runs: 0, cost: 0, success: 0, failed: 0 };
    byDepartment[dept].runs += stats.runs_total;
    byDepartment[dept].cost += stats.total_cost;
    byDepartment[dept].success += stats.runs_success;
    byDepartment[dept].failed += stats.runs_failed;
  }

  // --- Pipeline funnel ---
  const stages = ["idea", "researching", "validating", "building", "launched", "archived"] as const;
  const funnel: Record<string, number> = {};
  for (const stage of stages) {
    funnel[stage] =
      (pipelineDetailsRes.data || []).filter((p) => p.stage === stage).length;
  }
  const total = pipelineDetailsRes.data?.length || 1;
  const conversions = {
    idea_to_research:
      funnel.idea > 0
        ? Math.round(
            ((funnel.researching + funnel.validating + funnel.building + funnel.launched) /
              total) *
              100
          )
        : 0,
    research_to_build:
      funnel.researching + funnel.validating > 0
        ? Math.round(
            ((funnel.building + funnel.launched) /
              Math.max(
                1,
                funnel.researching + funnel.validating + funnel.building + funnel.launched
              )) *
              100
          )
        : 0,
    build_to_launch:
      funnel.building > 0
        ? Math.round(
            (funnel.launched / Math.max(1, funnel.building + funnel.launched)) * 100
          )
        : 0,
  };

  // --- Relationship health ---
  const relHealthy: typeof relationshipDetailsRes.data = [];
  const relWarning: typeof relationshipDetailsRes.data = [];
  const relCritical: typeof relationshipDetailsRes.data = [];

  for (const r of relationshipDetailsRes.data || []) {
    const days = r.last_contact ? daysSince(r.last_contact) : 999;
    const item = { ...r, days_since_contact: days } as any;
    if (days <= 14) relHealthy.push(item);
    else if (days <= 30) relWarning.push(item);
    else relCritical.push(item);
  }

  const needsAttention = [...relCritical, ...relWarning].slice(0, 10) as Array<{
    id: string;
    name: string;
    company: string | null;
    days_since_contact: number;
  }>;

  // --- System health ---
  const runs24h = agentRuns24hRes.data || [];
  const runs24hCount = agentRuns24hRes.count || 0;
  const success24h = runs24h.filter((r) => r.status === "completed").length;
  const system = {
    agents: {
      runs_24h: runs24hCount,
      success: success24h,
      failed: runs24h.filter((r) => r.status === "failed").length,
      success_rate: runs24hCount ? Math.round((success24h / runs24hCount) * 100) : 100,
    },
    email: {
      accounts: emailAccountsRes.data?.length || 0,
      syncing: emailAccountsRes.data?.filter((a) => a.sync_enabled).length || 0,
    },
    calendar: {
      accounts: calendarAccountsRes.data?.length || 0,
      syncing: calendarAccountsRes.data?.filter((a) => a.sync_enabled).length || 0,
    },
    queues: {
      content_scheduled: contentQueueRes.data?.length || 0,
      captures_pending: capturesRes.data?.length || 0,
    },
  };

  return {
    latest,
    realtime,
    byDepartment,
    funnel,
    conversions,
    relHealthy: relHealthy.length,
    relWarning: relWarning.length,
    relCritical: relCritical.length,
    needsAttention,
    system,
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

type LoaderData = Awaited<ReturnType<typeof loader>>;

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-surface-2/50 bg-surface-1/40 p-5 backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-4 text-sm font-semibold text-zinc-300">{children}</h2>;
}

function MetricCard({
  label,
  value,
  subtext,
  trend,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: number | null;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 p-4 backdrop-blur-sm">
      <div className="mb-1 flex items-center gap-2 text-xs text-zinc-500">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {label}
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {subtext && <div className="mt-1 text-xs text-zinc-500">{subtext}</div>}
      {trend != null && (
        <div
          className={`mt-1 flex items-center gap-1 text-xs ${
            trend >= 0 ? "text-brand" : "text-red-400"
          }`}
        >
          {trend >= 0 ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          {Math.abs(trend).toFixed(1)}%
        </div>
      )}
    </div>
  );
}

function HealthDot({ status }: { status: "good" | "warning" | "error" | "neutral" }) {
  const colors = {
    good: "bg-brand",
    warning: "bg-amber-500",
    error: "bg-red-500",
    neutral: "bg-zinc-500",
  };
  return <span className={`inline-block h-2 w-2 rounded-full ${colors[status]}`} />;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Analytics() {
  const {
    latest,
    realtime,
    byDepartment,
    funnel,
    conversions,
    relHealthy,
    relWarning,
    relCritical,
    needsAttention,
    system,
  } = useLoaderData<typeof loader>();

  const mrr = Number(latest?.total_mrr || 0);
  const arr = mrr * 12;
  const expenses = Number(latest?.total_monthly_expenses || 0);
  const runway = expenses > 0 ? (mrr / expenses).toFixed(1) : "∞";
  const agentCost30d = Number(latest?.agent_cost_30d || 0);
  const agentCost24h = Number(latest?.agent_cost_24h || 0);

  const pipelineTotal = Object.values(funnel).reduce((s, v) => s + v, 0) || 1;

  return (
    <div className="flex flex-1 flex-col">
      <Header title="Analytics" />
      <main className="flex-1 space-y-6 p-6">

        {/* ── Key Metrics ── */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <MetricCard
            icon={TrendingUp}
            label="Monthly Revenue"
            value={mrr > 0 ? `$${mrr.toLocaleString()}` : "$0"}
            subtext={`ARR: $${arr.toLocaleString()}`}
            trend={latest?.mrr_growth ?? null}
          />
          <MetricCard
            icon={TrendingDown}
            label="Monthly Expenses"
            value={`$${expenses.toLocaleString()}`}
            subtext={`Runway: ${runway} months`}
          />
          <MetricCard
            icon={Bot}
            label="Agent Cost (30d)"
            value={`$${agentCost30d.toFixed(2)}`}
            subtext={`Today: $${agentCost24h.toFixed(4)}`}
          />
          <MetricCard
            icon={Rocket}
            label="Active Ventures"
            value={realtime.ventures}
            subtext={`${realtime.pipeline} in pipeline`}
          />
        </div>

        {/* ── Two-Column Section ── */}
        <div className="grid gap-6 md:grid-cols-2">

          {/* Pipeline Funnel */}
          <Card>
            <SectionTitle>Pipeline Funnel</SectionTitle>
            <div className="space-y-3">
              {Object.entries(funnel).map(([stage, count]) => (
                <div key={stage} className="flex items-center gap-3">
                  <div className="w-24 shrink-0 text-xs capitalize text-zinc-400">
                    {stage}
                  </div>
                  <div className="flex-1 overflow-hidden rounded-full bg-surface-2 h-3">
                    <div
                      className="h-3 rounded-full bg-brand transition-all"
                      style={{
                        width: `${Math.min(100, (count / pipelineTotal) * 100)}%`,
                      }}
                    />
                  </div>
                  <div className="w-6 text-right font-mono text-xs text-zinc-400">
                    {count}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-1 border-t border-surface-2/50 pt-4 text-xs text-zinc-500">
              <div>Idea → Research: {conversions.idea_to_research}%</div>
              <div>Research → Build: {conversions.research_to_build}%</div>
              <div>Build → Launch: {conversions.build_to_launch}%</div>
            </div>
          </Card>

          {/* Relationship Health */}
          <Card>
            <SectionTitle>Relationship Health</SectionTitle>
            <div className="mb-4 grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-brand/10 p-3 text-center">
                <div className="text-2xl font-bold text-brand">{relHealthy}</div>
                <div className="mt-1 text-xs text-zinc-400">Healthy</div>
              </div>
              <div className="rounded-lg bg-amber-500/10 p-3 text-center">
                <div className="text-2xl font-bold text-amber-400">{relWarning}</div>
                <div className="mt-1 text-xs text-zinc-400">Warning</div>
              </div>
              <div className="rounded-lg bg-red-500/10 p-3 text-center">
                <div className="text-2xl font-bold text-red-400">{relCritical}</div>
                <div className="mt-1 text-xs text-zinc-400">Critical</div>
              </div>
            </div>
            {needsAttention.length > 0 && (
              <div>
                <div className="mb-2 text-xs text-zinc-500">Needs Attention</div>
                <div className="space-y-1">
                  {needsAttention.slice(0, 5).map((r) => (
                    <Link
                      key={r.id}
                      to={`/dashboard/relationships/${r.id}`}
                      className="-mx-2 flex items-center justify-between rounded-lg p-2 text-sm hover:bg-surface-2/30"
                    >
                      <span className="text-zinc-300">{r.name}</span>
                      <span
                        className={
                          r.days_since_contact > 30
                            ? "text-red-400"
                            : "text-amber-400"
                        }
                      >
                        {r.days_since_contact}d ago
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {needsAttention.length === 0 && (
              <div className="py-4 text-center text-sm text-zinc-600">
                All relationships healthy
              </div>
            )}
          </Card>

          {/* Agent Performance (7d) */}
          <Card>
            <SectionTitle>Agent Performance (7d)</SectionTitle>
            {Object.keys(byDepartment).length === 0 ? (
              <div className="py-4 text-center text-sm text-zinc-600">
                No agent runs in the last 7 days
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(byDepartment).map(([dept, stats]) => {
                  const rate =
                    stats.runs > 0
                      ? Math.round((stats.success / stats.runs) * 100)
                      : 100;
                  const isUnhealthy = stats.runs > 0 && stats.failed / stats.runs > 0.1;
                  return (
                    <div key={dept} className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-sm font-medium capitalize">{dept}</div>
                        <div className="text-xs text-zinc-500">
                          {stats.runs} runs · ${stats.cost.toFixed(2)}
                        </div>
                      </div>
                      <div
                        className={`text-sm font-mono ${
                          isUnhealthy ? "text-red-400" : "text-brand"
                        }`}
                      >
                        {rate}%
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <Link
              to="/dashboard/agents"
              className="mt-4 block text-xs text-brand hover:text-brand/80"
            >
              View all agents →
            </Link>
          </Card>

          {/* System Health */}
          <Card>
            <SectionTitle>System Health</SectionTitle>
            <div className="space-y-4">
              {[
                {
                  label: "Agent Success Rate (24h)",
                  value: `${system.agents.success_rate}%`,
                  status:
                    system.agents.success_rate >= 90
                      ? ("good" as const)
                      : ("warning" as const),
                  sub: `${system.agents.runs_24h} runs`,
                },
                {
                  label: "Email Sync",
                  value: `${system.email.syncing}/${system.email.accounts} accounts`,
                  status:
                    system.email.accounts > 0
                      ? ("good" as const)
                      : ("neutral" as const),
                },
                {
                  label: "Calendar Sync",
                  value: `${system.calendar.syncing}/${system.calendar.accounts} accounts`,
                  status:
                    system.calendar.accounts > 0
                      ? ("good" as const)
                      : ("neutral" as const),
                },
                {
                  label: "Content Scheduled",
                  value: `${system.queues.content_scheduled}`,
                  status: "neutral" as const,
                },
                {
                  label: "Pending Captures",
                  value: `${system.queues.captures_pending}`,
                  status:
                    system.queues.captures_pending > 10
                      ? ("warning" as const)
                      : ("good" as const),
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <HealthDot status={item.status} />
                    <div>
                      <span className="text-sm">{item.label}</span>
                      {item.sub && (
                        <div className="text-xs text-zinc-600">{item.sub}</div>
                      )}
                    </div>
                  </div>
                  <span className="font-mono text-sm text-zinc-400">{item.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ── Content Stats ── */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <PenSquare className="h-4 w-4 text-zinc-400" />
            <h2 className="text-sm font-semibold text-zinc-300">Content (30d)</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold">
                {latest?.content_published_30d ?? 0}
              </div>
              <div className="mt-1 text-xs text-zinc-400">Published</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">
                {latest?.content_scheduled ?? 0}
              </div>
              <div className="mt-1 text-xs text-zinc-400">Scheduled</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">
                {latest?.newsletter_subscribers ?? 0}
              </div>
              <div className="mt-1 text-xs text-zinc-400">Subscribers</div>
            </div>
          </div>
        </Card>

        {/* ── Email Stats ── */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Mail className="h-4 w-4 text-zinc-400" />
            <h2 className="text-sm font-semibold text-zinc-300">Email (24h)</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold">
                {latest?.emails_received_24h ?? 0}
              </div>
              <div className="mt-1 text-xs text-zinc-400">Received</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">
                {latest?.emails_sent_24h ?? 0}
              </div>
              <div className="mt-1 text-xs text-zinc-400">Sent</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-400">
                {latest?.emails_action_required ?? 0}
              </div>
              <div className="mt-1 text-xs text-zinc-400">Action Required</div>
            </div>
          </div>
        </Card>

        {/* ── Open Tasks quick stat ── */}
        <div className="flex items-center justify-between rounded-xl border border-surface-2/50 bg-surface-1/40 px-5 py-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-zinc-500" />
            <div>
              <div className="text-sm font-medium">Open Tasks</div>
              <div className="text-xs text-zinc-500">todos + in progress</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold">{realtime.open_tasks}</div>
            <Link
              to="/dashboard/tasks"
              className="text-xs text-brand hover:text-brand/80"
            >
              View all →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
