import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLoaderData, Form, Link } from "react-router";
import { Bot, ChevronRight, ArrowLeft } from "lucide-react";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import { Button } from "~/components/ui/Button";
import { EmptyState } from "~/components/ui/EmptyState";
const STATUS_META = {
    completed: { color: "text-green-400 bg-green-500/10 border-green-500/20", dot: "bg-green-400" },
    running: { color: "text-amber-400 bg-amber-500/10 border-amber-500/20", dot: "bg-amber-400 animate-pulse" },
    failed: { color: "text-red-400 bg-red-500/10 border-red-500/20", dot: "bg-red-400" },
};
function formatDuration(ms) {
    if (!ms)
        return "—";
    if (ms < 1000)
        return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
}
function formatTime(str) {
    if (!str)
        return "—";
    return new Date(str).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}
export async function loader({ request, context }) {
    const supabase = getSupabaseClient(context.cloudflare.env);
    const url = new URL(request.url);
    const agentFilter = url.searchParams.get("agent") || "";
    const statusFilter = url.searchParams.get("status") || "";
    let query = supabase
        .from("agent_runs")
        .select("*")
        .order("started_at", { ascending: false })
        .limit(100);
    if (agentFilter)
        query = query.eq("agent_name", agentFilter);
    if (statusFilter)
        query = query.eq("status", statusFilter);
    const { data } = await query;
    const runs = data ?? [];
    const { data: allRuns } = await supabase
        .from("agent_runs")
        .select("agent_name")
        .order("agent_name");
    const agentNames = [...new Set((allRuns ?? []).map((r) => r.agent_name).filter(Boolean))].sort();
    const total = runs.length;
    const failed = runs.filter((r) => r.status === "failed").length;
    const avgDuration = runs.filter((r) => r.duration_ms).length
        ? Math.round(runs.reduce((sum, r) => sum + (r.duration_ms ?? 0), 0) /
            runs.filter((r) => r.duration_ms).length)
        : null;
    return { runs, agentNames, filters: { agent: agentFilter, status: statusFilter }, stats: { total, failed, avgDuration } };
}
export default function RunsIndex() {
    const { runs, agentNames, filters, stats } = useLoaderData();
    const STATUSES = ["running", "completed", "failed"];
    return (_jsxs("div", { className: "flex flex-1 flex-col", children: [_jsx(Header, { title: "Agent Runs" }), _jsxs("main", { className: "flex-1 p-6", children: [_jsxs(Link, { to: "/dashboard/agents", className: "mb-4 inline-flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-300 transition-colors", children: [_jsx(ArrowLeft, { className: "h-3.5 w-3.5" }), "Departments"] }), stats.total > 0 && (_jsx("div", { className: "mb-6 grid gap-4 sm:grid-cols-3", children: [
                            { label: "Total Runs", value: stats.total, hint: "matching filters" },
                            { label: "Failed", value: stats.failed, hint: `${stats.total ? Math.round((stats.failed / stats.total) * 100) : 0}% error rate` },
                            { label: "Avg Duration", value: formatDuration(stats.avgDuration), hint: "completed runs" },
                        ].map((s) => (_jsxs("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 p-4 backdrop-blur-sm", children: [_jsx("p", { className: "text-xs font-medium uppercase tracking-wide text-zinc-600", children: s.label }), _jsx("p", { className: "mt-1 font-mono text-2xl font-semibold text-zinc-200", children: s.value }), _jsx("p", { className: "mt-0.5 text-xs text-zinc-700", children: s.hint })] }, s.label))) })), _jsxs(Form, { method: "get", className: "mb-4 flex flex-wrap items-center gap-2", children: [agentNames.length > 0 && (_jsxs("select", { name: "agent", defaultValue: filters.agent, className: "rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-1.5 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-brand", children: [_jsx("option", { value: "", children: "All agents" }), agentNames.map((name) => (_jsx("option", { value: name, children: name }, name)))] })), _jsxs("select", { name: "status", defaultValue: filters.status, className: "rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-1.5 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-brand", children: [_jsx("option", { value: "", children: "All statuses" }), STATUSES.map((s) => (_jsx("option", { value: s, children: s }, s)))] }), _jsx(Button, { type: "submit", variant: "secondary", children: "Filter" }), (filters.agent || filters.status) && (_jsx(Link, { to: "/dashboard/agents/runs", children: _jsx(Button, { type: "button", variant: "secondary", children: "Clear" }) }))] }), _jsxs("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 backdrop-blur-sm", children: [_jsxs("div", { className: "grid border-b border-surface-2/50 px-4 py-2 text-xs font-medium uppercase tracking-wide text-zinc-600", style: { gridTemplateColumns: "1fr auto" }, children: [_jsx("span", { children: "Run" }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("span", { className: "hidden sm:block", children: "Duration" }), _jsx("span", { className: "hidden sm:block", children: "Tokens" }), _jsx("span", { children: "Status" }), _jsx("span", { className: "w-4" })] })] }), runs.length === 0 ? (_jsx(EmptyState, { icon: Bot, title: "No agent runs", description: filters.agent || filters.status ? "No runs match these filters." : "Agent runs will appear here once triggered." })) : (_jsx("div", { className: "divide-y divide-surface-2/30 py-1", children: runs.map((run) => {
                                    const sm = STATUS_META[run.status ?? "running"] ?? STATUS_META.running;
                                    return (_jsxs(Link, { to: run.id, className: "flex items-center gap-4 rounded-lg px-4 py-3 transition-colors hover:bg-surface-2/30", children: [_jsxs("div", { className: "min-w-0 flex-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: `h-2 w-2 shrink-0 rounded-full ${sm.dot}` }), _jsx("span", { className: "text-sm font-medium text-zinc-200", children: run.agent_name }), run.trigger_type && (_jsxs("span", { className: "text-xs text-zinc-600", children: ["via ", run.trigger_type] }))] }), _jsx("p", { className: "ml-4 mt-0.5 text-xs text-zinc-600", children: formatTime(run.started_at) })] }), _jsxs("div", { className: "flex shrink-0 items-center gap-4", children: [_jsx("span", { className: "hidden font-mono text-xs text-zinc-600 sm:block", children: formatDuration(run.duration_ms) }), _jsx("span", { className: "hidden w-14 text-right font-mono text-xs text-zinc-600 sm:block", children: run.tokens_used ? run.tokens_used.toLocaleString() : "—" }), _jsx("span", { className: `rounded border px-1.5 py-0.5 text-xs font-medium ${sm.color}`, children: run.status }), _jsx(ChevronRight, { className: "h-4 w-4 text-zinc-700" })] })] }, run.id));
                                }) }))] })] })] }));
}
