import type { MetaFunction, LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  Clock,
  Zap,
  ArrowUpRight,
  Plus,
} from "lucide-react";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import type { Venture, PipelineItem, Task } from "@sheetzlabs/shared";

export const meta: MetaFunction = () => [
  { title: "Command Center — Sheetz Labs OS" },
];

// ─── Loader ───────────────────────────────────────────────────────────────────

export async function loader({ context }: LoaderFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);

  const [venturesRes, pipelineRes, tasksRes] = await Promise.all([
    supabase.from("ventures").select("*").order("created_at"),
    supabase
      .from("pipeline")
      .select("*")
      .is("venture_id", null)
      .order("total_score", { ascending: false }),
    supabase
      .from("tasks")
      .select("*")
      .neq("status", "done")
      .order("due_date")
      .limit(5),
  ]);

  return {
    ventures: venturesRes.data ?? [],
    pipeline: pipelineRes.data ?? [],
    tasks: tasksRes.data ?? [],
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusLabel(status: Venture["status"]): string {
  switch (status) {
    case "active":
      return "Live";
    case "building":
      return "Dev";
    case "validating":
      return "Validating";
    case "idea":
      return "Idea";
    case "maintenance":
      return "Maint.";
    case "sunset":
      return "Sunset";
    case "sold":
      return "Sold";
    default:
      return status ?? "—";
  }
}

function statusColor(status: Venture["status"]): string {
  if (status === "active") return "bg-brand/10 text-brand";
  if (status === "building") return "bg-zinc-800 text-zinc-400";
  return "bg-zinc-900 text-zinc-600";
}

function formatMrr(cents: number): string {
  if (cents === 0) return "—";
  return `$${(cents / 100).toLocaleString()}`;
}

// Stage → rough % complete through the pipeline
const STAGE_PCT: Record<string, number> = {
  idea: 8,
  researching: 18,
  validating: 30,
  speccing: 45,
  building: 60,
  beta: 75,
  launched: 100,
  parked: 5,
};

// ─── Shared card wrapper ──────────────────────────────────────────────────────

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
  return (
    <h2 className="mb-4 text-sm font-semibold text-zinc-300">{children}</h2>
  );
}

// ─── Portfolio Overview ───────────────────────────────────────────────────────

function PortfolioOverview({
  ventures,
  taskCount,
}: {
  ventures: Venture[];
  taskCount: number;
}) {
  const activeCount = ventures.filter(
    (v) => v.status !== "sunset" && v.status !== "sold",
  ).length;
  const totalMrrCents = ventures.reduce((s, v) => s + (v.mrr_cents ?? 0), 0);

  const metrics = [
    {
      label: "Active Ventures",
      value: String(activeCount),
      delta: `${activeCount} tracked`,
      up: true,
    },
    {
      label: "MRR",
      value: totalMrrCents > 0 ? `$${(totalMrrCents / 100).toLocaleString()}` : "$0",
      delta: totalMrrCents > 0 ? "across all ventures" : "pre-revenue",
      up: totalMrrCents > 0,
    },
    {
      label: "Pipeline Ideas",
      value: "—",
      delta: "from pipeline page",
      up: true,
    },
    {
      label: "Open Tasks",
      value: String(taskCount),
      delta: taskCount > 0 ? `${taskCount} open` : "all clear",
      up: taskCount === 0,
    },
  ];

  return (
    <Card className="col-span-12 lg:col-span-8">
      <SectionTitle>Portfolio Overview</SectionTitle>

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="rounded-lg border border-surface-2/50 bg-surface-0/60 p-3"
          >
            <div className="mb-1 text-xs text-zinc-500">{m.label}</div>
            <div className="text-xl font-semibold">{m.value}</div>
            <div
              className={`mt-1 flex items-center gap-1 text-xs ${m.up ? "text-brand" : "text-red-400"}`}
            >
              {m.up ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {m.delta}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-3 px-3 text-xs font-medium uppercase tracking-wide text-zinc-600">
          <span>Venture</span>
          <span>Status</span>
          <span className="text-right">MRR</span>
        </div>
        {ventures.length === 0 ? (
          <div className="px-3 py-4 text-center text-sm text-zinc-600">
            No ventures yet
          </div>
        ) : (
          ventures.map((v) => (
            <div
              key={v.id}
              className="grid grid-cols-3 items-center rounded-lg px-3 py-2.5 transition-colors hover:bg-surface-2/30"
            >
              <span className="text-sm font-medium">{v.name}</span>
              <span>
                <span
                  className={`rounded-full px-2 py-0.5 font-mono text-xs ${statusColor(v.status)}`}
                >
                  {statusLabel(v.status)}
                </span>
              </span>
              <span className="text-right font-mono text-sm text-zinc-300">
                {formatMrr(v.mrr_cents ?? 0)}
              </span>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

// ─── Alerts (static for now — no alerts table yet) ────────────────────────────

const STATIC_ALERTS = [
  {
    icon: AlertCircle,
    color: "text-red-400",
    title: "Deal at risk",
    body: "Cornerstone Church — no activity in 12 days",
  },
  {
    icon: Clock,
    color: "text-yellow-400",
    title: "Follow-up due",
    body: "Summit Community — proposal sent 5 days ago",
  },
  {
    icon: TrendingUp,
    color: "text-brand",
    title: "MRR milestone",
    body: "BOHP crossed $8K MRR this week",
  },
];

function Alerts() {
  return (
    <Card className="col-span-12 lg:col-span-4">
      <SectionTitle>Alerts</SectionTitle>
      <div className="space-y-3">
        {STATIC_ALERTS.map((a) => (
          <div
            key={a.title}
            className="flex gap-3 rounded-lg border border-surface-2/30 bg-surface-0/40 p-3"
          >
            <a.icon className={`mt-0.5 h-4 w-4 shrink-0 ${a.color}`} />
            <div>
              <div className="text-sm font-medium">{a.title}</div>
              <div className="mt-0.5 text-xs text-zinc-500">{a.body}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Today's Tasks ────────────────────────────────────────────────────────────

function TodaysTasks({ tasks }: { tasks: Task[] }) {
  return (
    <Card className="col-span-12 sm:col-span-6 lg:col-span-5">
      <SectionTitle>Today&apos;s Tasks</SectionTitle>
      <div className="space-y-2">
        {tasks.length === 0 ? (
          <div className="py-4 text-center text-sm text-zinc-600">
            No open tasks — all clear 🎉
          </div>
        ) : (
          tasks.map((t) => {
            const done = t.status === "done";
            return (
              <div
                key={t.id}
                className="flex items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-surface-2/30"
              >
                <CheckCircle2
                  className={`mt-0.5 h-4 w-4 shrink-0 ${done ? "text-brand" : "text-zinc-700"}`}
                />
                <div className="min-w-0 flex-1">
                  <div
                    className={`text-sm ${done ? "text-zinc-600 line-through" : "text-zinc-200"}`}
                  >
                    {t.title}
                  </div>
                  <div className="mt-0.5 font-mono text-xs text-zinc-600">
                    {t.priority} · {t.status}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}

// ─── Pipeline ─────────────────────────────────────────────────────────────────

function Pipeline({ pipeline }: { pipeline: PipelineItem[] }) {
  return (
    <Card className="col-span-12 sm:col-span-6 lg:col-span-4">
      <SectionTitle>Pipeline</SectionTitle>
      {pipeline.length === 0 ? (
        <div className="py-4 text-center text-sm text-zinc-600">
          No pipeline ideas yet
        </div>
      ) : (
        <div className="space-y-4">
          {pipeline.map((p) => {
            const pct = STAGE_PCT[p.stage ?? "idea"] ?? 10;
            return (
              <div key={p.id}>
                <div className="mb-1.5 flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-medium">{p.name}</div>
                    <div className="font-mono text-xs text-zinc-500">
                      {p.stage} · score {p.total_score ?? 0}
                    </div>
                  </div>
                  <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-zinc-600" />
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full bg-brand transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

// ─── AI Agents (static for now) ───────────────────────────────────────────────

const STATIC_AGENTS = [
  {
    name: "Morning Brief",
    status: "Ran 6:00 AM",
    ok: true,
    desc: "Daily context synthesis",
  },
  {
    name: "Deal Watcher",
    status: "Monitoring",
    ok: true,
    desc: "Flags stale opportunities",
  },
];

function AiAgents() {
  return (
    <Card className="col-span-12 sm:col-span-6 lg:col-span-3">
      <SectionTitle>AI Agents</SectionTitle>
      <div className="space-y-3">
        {STATIC_AGENTS.map((a) => (
          <div
            key={a.name}
            className="rounded-lg border border-surface-2/30 bg-surface-0/40 p-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{a.name}</span>
              <Zap
                className={`h-3.5 w-3.5 ${a.ok ? "text-brand" : "text-zinc-600"}`}
              />
            </div>
            <div className="mt-1 text-xs text-zinc-500">{a.desc}</div>
            <div className="mt-1 font-mono text-xs text-zinc-600">
              {a.status}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Quick Actions ────────────────────────────────────────────────────────────

const QUICK_ACTIONS = [
  { label: "Log a contact", icon: Plus },
  { label: "Add deal", icon: Plus },
  { label: "Create task", icon: Plus },
  { label: "Run AI brief", icon: Zap },
];

function QuickActions() {
  return (
    <Card className="col-span-12">
      <SectionTitle>Quick Actions</SectionTitle>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {QUICK_ACTIONS.map((a) => (
          <button
            key={a.label}
            className="flex items-center justify-center gap-2 rounded-lg border border-surface-2 bg-surface-0/60 py-3 text-sm text-zinc-400 transition-colors hover:border-brand/30 hover:bg-brand/5 hover:text-brand"
          >
            <a.icon className="h-4 w-4" />
            {a.label}
          </button>
        ))}
      </div>
    </Card>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function CommandCenter() {
  const { ventures, pipeline, tasks } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-1 flex-col">
      <Header title="Command Center" />
      <main className="flex-1 p-6">
        <div className="grid grid-cols-12 gap-4">
          <PortfolioOverview ventures={ventures} taskCount={tasks.length} />
          <Alerts />
          <TodaysTasks tasks={tasks} />
          <Pipeline pipeline={pipeline} />
          <AiAgents />
          <QuickActions />
        </div>
      </main>
    </div>
  );
}
