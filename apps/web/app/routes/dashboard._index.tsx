import type { MetaFunction } from "react-router";
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

export const meta: MetaFunction = () => [
  { title: "Command Center — Sheetz Labs OS" },
];

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

const metrics = [
  { label: "Active Ventures", value: "3", delta: "+1 this quarter", up: true },
  { label: "MRR", value: "$12.4K", delta: "+18% MoM", up: true },
  { label: "Open Deals", value: "7", delta: "2 closing soon", up: true },
  { label: "Tasks Due", value: "5", delta: "2 overdue", up: false },
];

const ventures = [
  { name: "Back of House Pro", status: "Live", mrr: "$8,200", trend: "up" },
  { name: "Sheetz Labs OS", status: "Dev", mrr: "—", trend: "neutral" },
  { name: "Project Helix", status: "Research", mrr: "—", trend: "neutral" },
];

function PortfolioOverview() {
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
        {ventures.map((v) => (
          <div
            key={v.name}
            className="grid grid-cols-3 items-center rounded-lg px-3 py-2.5 transition-colors hover:bg-surface-2/30"
          >
            <span className="text-sm font-medium">{v.name}</span>
            <span>
              <span
                className={`rounded-full px-2 py-0.5 font-mono text-xs ${
                  v.status === "Live"
                    ? "bg-brand/10 text-brand"
                    : v.status === "Dev"
                      ? "bg-zinc-800 text-zinc-400"
                      : "bg-zinc-900 text-zinc-600"
                }`}
              >
                {v.status}
              </span>
            </span>
            <span className="text-right font-mono text-sm text-zinc-300">
              {v.mrr}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Alerts ───────────────────────────────────────────────────────────────────

const alerts = [
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
        {alerts.map((a) => (
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

const tasks = [
  { done: true, label: "Review BOHP support queue", context: "Back of House" },
  { done: false, label: "Send Cornerstone follow-up", context: "Pipeline" },
  { done: false, label: "Draft OS onboarding flow", context: "Sheetz Labs OS" },
  { done: false, label: "Reconcile March expenses", context: "Finance" },
];

function TodaysTasks() {
  return (
    <Card className="col-span-12 sm:col-span-6 lg:col-span-5">
      <SectionTitle>Today&apos;s Tasks</SectionTitle>
      <div className="space-y-2">
        {tasks.map((t) => (
          <div
            key={t.label}
            className="flex items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-surface-2/30"
          >
            <CheckCircle2
              className={`mt-0.5 h-4 w-4 shrink-0 ${t.done ? "text-brand" : "text-zinc-700"}`}
            />
            <div className="min-w-0 flex-1">
              <div
                className={`text-sm ${t.done ? "text-zinc-600 line-through" : "text-zinc-200"}`}
              >
                {t.label}
              </div>
              <div className="mt-0.5 font-mono text-xs text-zinc-600">
                {t.context}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Pipeline ─────────────────────────────────────────────────────────────────

const deals = [
  { name: "Cornerstone Church", stage: "Proposal", value: "$2,400/yr", pct: 60 },
  { name: "Summit Community", stage: "Demo", value: "$1,800/yr", pct: 30 },
];

function Pipeline() {
  return (
    <Card className="col-span-12 sm:col-span-6 lg:col-span-4">
      <SectionTitle>Pipeline</SectionTitle>
      <div className="space-y-4">
        {deals.map((d) => (
          <div key={d.name}>
            <div className="mb-1.5 flex items-start justify-between gap-2">
              <div>
                <div className="text-sm font-medium">{d.name}</div>
                <div className="font-mono text-xs text-zinc-500">
                  {d.stage} · {d.value}
                </div>
              </div>
              <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-zinc-600" />
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full bg-brand transition-all"
                style={{ width: `${d.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── AI Agents ────────────────────────────────────────────────────────────────

const agents = [
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
        {agents.map((a) => (
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

const quickActions = [
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
        {quickActions.map((a) => (
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
  return (
    <div className="flex flex-1 flex-col">
      <Header title="Command Center" />
      <main className="flex-1 p-6">
        <div className="grid grid-cols-12 gap-4">
          <PortfolioOverview />
          <Alerts />
          <TodaysTasks />
          <Pipeline />
          <AiAgents />
          <QuickActions />
        </div>
      </main>
    </div>
  );
}
