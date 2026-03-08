import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLoaderData } from "react-router";
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Clock, Zap, ArrowUpRight, Plus, Wifi, WifiOff, } from "lucide-react";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import { getAllVentureMetrics } from "~/lib/venture-metrics.server";
export const meta = () => [
    { title: "Command Center — Sheetz Labs OS" },
];
// ─── Loader ───────────────────────────────────────────────────────────────────
export async function loader({ context }) {
    const env = context.cloudflare.env;
    const supabase = getSupabaseClient(env);
    const [venturesRes, pipelineRes, tasksRes, liveMetrics, revenueRes, expensesRes] = await Promise.all([
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
        getAllVentureMetrics(env),
        supabase.from("revenue").select("amount_cents"),
        supabase.from("expenses").select("amount_cents"),
    ]);
    // Merge live metrics into ventures.
    // Live data overrides seed values; _live=true signals real-time data.
    const ventures = (venturesRes.data ?? []).map((v) => {
        const live = liveMetrics[v.slug];
        return {
            ...v,
            mrr_cents: live?.mrr_cents ?? v.mrr_cents ?? 0,
            customer_count: live?.customer_count ?? v.customer_count ?? 0,
            _live: live !== undefined && live !== null,
        };
    });
    const totalRevenueCents = (revenueRes.data ?? []).reduce((s, r) => s + (r.amount_cents ?? 0), 0);
    const totalExpenseCents = (expensesRes.data ?? []).reduce((s, e) => s + (e.amount_cents ?? 0), 0);
    return {
        ventures,
        pipeline: pipelineRes.data ?? [],
        tasks: tasksRes.data ?? [],
        financials: { totalRevenueCents, totalExpenseCents },
    };
}
// ─── Helpers ──────────────────────────────────────────────────────────────────
function statusLabel(status) {
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
function statusColor(status) {
    if (status === "active")
        return "bg-brand/10 text-brand";
    if (status === "building")
        return "bg-zinc-800 text-zinc-400";
    return "bg-zinc-900 text-zinc-600";
}
function formatMrr(cents) {
    if (cents === 0)
        return "—";
    return `$${(cents / 100).toLocaleString()}`;
}
// Stage → rough % complete through the pipeline
const STAGE_PCT = {
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
function Card({ children, className = "", }) {
    return (_jsx("div", { className: `rounded-xl border border-surface-2/50 bg-surface-1/40 p-5 backdrop-blur-sm ${className}`, children: children }));
}
function SectionTitle({ children }) {
    return (_jsx("h2", { className: "mb-4 text-sm font-semibold text-zinc-300", children: children }));
}
// ─── Portfolio Overview ───────────────────────────────────────────────────────
function PortfolioOverview({ ventures, taskCount, financials, }) {
    const activeVentures = ventures.filter((v) => v.status !== "sunset" && v.status !== "sold");
    const totalMrrCents = ventures.reduce((s, v) => s + (v.mrr_cents ?? 0), 0);
    const totalCustomers = ventures.reduce((s, v) => s + (v.customer_count ?? 0), 0);
    const liveCount = ventures.filter((v) => v._live).length;
    const metrics = [
        {
            label: "Active Ventures",
            value: String(activeVentures.length),
            delta: `${liveCount} live connection${liveCount !== 1 ? "s" : ""}`,
            up: true,
        },
        {
            label: "MRR",
            value: totalMrrCents > 0
                ? `$${(totalMrrCents / 100).toLocaleString()}`
                : "$0",
            delta: totalMrrCents > 0 ? "across all ventures" : "pre-revenue",
            up: totalMrrCents > 0,
        },
        {
            label: "Customers",
            value: totalCustomers > 0 ? String(totalCustomers) : "—",
            delta: totalCustomers > 0 ? "across connected products" : "no data yet",
            up: totalCustomers > 0,
        },
        {
            label: "Net Revenue",
            value: (() => {
                const net = financials.totalRevenueCents - financials.totalExpenseCents;
                const abs = Math.abs(net / 100).toLocaleString();
                return net >= 0 ? `+$${abs}` : `-$${abs}`;
            })(),
            delta: `$${(financials.totalExpenseCents / 100).toLocaleString()} expenses`,
            up: financials.totalRevenueCents >= financials.totalExpenseCents,
        },
        {
            label: "Open Tasks",
            value: String(taskCount),
            delta: taskCount > 0 ? `${taskCount} open` : "all clear",
            up: taskCount === 0,
        },
    ];
    return (_jsxs(Card, { className: "col-span-12 lg:col-span-8", children: [_jsx(SectionTitle, { children: "Portfolio Overview" }), _jsx("div", { className: "mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5", children: metrics.map((m) => (_jsxs("div", { className: "rounded-lg border border-surface-2/50 bg-surface-0/60 p-3", children: [_jsx("div", { className: "mb-1 text-xs text-zinc-500", children: m.label }), _jsx("div", { className: "text-xl font-semibold", children: m.value }), _jsxs("div", { className: `mt-1 flex items-center gap-1 text-xs ${m.up ? "text-brand" : "text-red-400"}`, children: [m.up ? (_jsx(TrendingUp, { className: "h-3 w-3" })) : (_jsx(TrendingDown, { className: "h-3 w-3" })), m.delta] })] }, m.label))) }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "grid grid-cols-4 px-3 text-xs font-medium uppercase tracking-wide text-zinc-600", children: [_jsx("span", { className: "col-span-2", children: "Venture" }), _jsx("span", { children: "Status" }), _jsx("span", { className: "text-right", children: "MRR" })] }), ventures.length === 0 ? (_jsx("div", { className: "px-3 py-4 text-center text-sm text-zinc-600", children: "No ventures yet" })) : (ventures.map((v) => (_jsxs("div", { className: "grid grid-cols-4 items-center rounded-lg px-3 py-2.5 transition-colors hover:bg-surface-2/30", children: [_jsxs("div", { className: "col-span-2 flex items-center gap-2", children: [_jsx("span", { className: "text-sm font-medium", children: v.name }), v._live ? (_jsx(Wifi, { className: "h-3 w-3 shrink-0 text-brand/70", title: "Live data" })) : (_jsx(WifiOff, { className: "h-3 w-3 shrink-0 text-zinc-700", title: "No connection \u2014 showing seed data" }))] }), _jsx("span", { children: _jsx("span", { className: `rounded-full px-2 py-0.5 font-mono text-xs ${statusColor(v.status)}`, children: statusLabel(v.status) }) }), _jsx("span", { className: "text-right font-mono text-sm text-zinc-300", children: formatMrr(v.mrr_cents ?? 0) })] }, v.id))))] })] }));
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
    return (_jsxs(Card, { className: "col-span-12 lg:col-span-4", children: [_jsx(SectionTitle, { children: "Alerts" }), _jsx("div", { className: "space-y-3", children: STATIC_ALERTS.map((a) => (_jsxs("div", { className: "flex gap-3 rounded-lg border border-surface-2/30 bg-surface-0/40 p-3", children: [_jsx(a.icon, { className: `mt-0.5 h-4 w-4 shrink-0 ${a.color}` }), _jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium", children: a.title }), _jsx("div", { className: "mt-0.5 text-xs text-zinc-500", children: a.body })] })] }, a.title))) })] }));
}
// ─── Today's Tasks ────────────────────────────────────────────────────────────
function TodaysTasks({ tasks }) {
    return (_jsxs(Card, { className: "col-span-12 sm:col-span-6 lg:col-span-5", children: [_jsx(SectionTitle, { children: "Today's Tasks" }), _jsx("div", { className: "space-y-2", children: tasks.length === 0 ? (_jsx("div", { className: "py-4 text-center text-sm text-zinc-600", children: "No open tasks \u2014 all clear \uD83C\uDF89" })) : (tasks.map((t) => {
                    const done = t.status === "done";
                    return (_jsxs("div", { className: "flex items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-surface-2/30", children: [_jsx(CheckCircle2, { className: `mt-0.5 h-4 w-4 shrink-0 ${done ? "text-brand" : "text-zinc-700"}` }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("div", { className: `text-sm ${done ? "text-zinc-600 line-through" : "text-zinc-200"}`, children: t.title }), _jsxs("div", { className: "mt-0.5 font-mono text-xs text-zinc-600", children: [t.priority, " \u00B7 ", t.status] })] })] }, t.id));
                })) })] }));
}
// ─── Pipeline ─────────────────────────────────────────────────────────────────
function Pipeline({ pipeline }) {
    return (_jsxs(Card, { className: "col-span-12 sm:col-span-6 lg:col-span-4", children: [_jsx(SectionTitle, { children: "Pipeline" }), pipeline.length === 0 ? (_jsx("div", { className: "py-4 text-center text-sm text-zinc-600", children: "No pipeline ideas yet" })) : (_jsx("div", { className: "space-y-4", children: pipeline.map((p) => {
                    const pct = STAGE_PCT[p.stage ?? "idea"] ?? 10;
                    return (_jsxs("div", { children: [_jsxs("div", { className: "mb-1.5 flex items-start justify-between gap-2", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium", children: p.name }), _jsxs("div", { className: "font-mono text-xs text-zinc-500", children: [p.stage, " \u00B7 score ", p.total_score ?? 0] })] }), _jsx(ArrowUpRight, { className: "mt-0.5 h-4 w-4 shrink-0 text-zinc-600" })] }), _jsx("div", { className: "h-1 overflow-hidden rounded-full bg-surface-2", children: _jsx("div", { className: "h-full rounded-full bg-brand transition-all", style: { width: `${pct}%` } }) })] }, p.id));
                }) }))] }));
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
    return (_jsxs(Card, { className: "col-span-12 sm:col-span-6 lg:col-span-3", children: [_jsx(SectionTitle, { children: "AI Agents" }), _jsx("div", { className: "space-y-3", children: STATIC_AGENTS.map((a) => (_jsxs("div", { className: "rounded-lg border border-surface-2/30 bg-surface-0/40 p-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm font-medium", children: a.name }), _jsx(Zap, { className: `h-3.5 w-3.5 ${a.ok ? "text-brand" : "text-zinc-600"}` })] }), _jsx("div", { className: "mt-1 text-xs text-zinc-500", children: a.desc }), _jsx("div", { className: "mt-1 font-mono text-xs text-zinc-600", children: a.status })] }, a.name))) })] }));
}
// ─── Quick Actions ────────────────────────────────────────────────────────────
const QUICK_ACTIONS = [
    { label: "Log a contact", icon: Plus },
    { label: "Add deal", icon: Plus },
    { label: "Create task", icon: Plus },
    { label: "Run AI brief", icon: Zap },
];
function QuickActions() {
    return (_jsxs(Card, { className: "col-span-12", children: [_jsx(SectionTitle, { children: "Quick Actions" }), _jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-4", children: QUICK_ACTIONS.map((a) => (_jsxs("button", { className: "flex items-center justify-center gap-2 rounded-lg border border-surface-2 bg-surface-0/60 py-3 text-sm text-zinc-400 transition-colors hover:border-brand/30 hover:bg-brand/5 hover:text-brand", children: [_jsx(a.icon, { className: "h-4 w-4" }), a.label] }, a.label))) })] }));
}
// ─── Page ────────────────────────────────────────────────────────────────────
export default function CommandCenter() {
    const { ventures, pipeline, tasks, financials } = useLoaderData();
    return (_jsxs("div", { className: "flex flex-1 flex-col", children: [_jsx(Header, { title: "Command Center" }), _jsx("main", { className: "flex-1 p-6", children: _jsxs("div", { className: "grid grid-cols-12 gap-4", children: [_jsx(PortfolioOverview, { ventures: ventures, taskCount: tasks.length, financials: financials }), _jsx(Alerts, {}), _jsx(TodaysTasks, { tasks: tasks }), _jsx(Pipeline, { pipeline: pipeline }), _jsx(AiAgents, {}), _jsx(QuickActions, {})] }) })] }));
}
