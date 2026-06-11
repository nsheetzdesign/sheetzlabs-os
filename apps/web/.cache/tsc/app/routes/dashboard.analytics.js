import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLoaderData, Link } from "react-router";
import { BarChart3, TrendingUp, TrendingDown, Users, Bot, Zap, CheckCircle2, AlertCircle, Clock, Mail, PenSquare, Rocket, } from "lucide-react";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
export const meta = () => [
    { title: "Analytics — Sheetz Labs OS" },
];
// ─── Loader ───────────────────────────────────────────────────────────────────
export async function loader({ context }) {
    const env = context.cloudflare.env;
    const supabase = getSupabaseClient(env);
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const daysSince = (date) => Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
    const [
    // Snapshot
    snapshotRes, 
    // Real-time counts
    venturesRes, pipelineRes, relationshipsRes, tasksRes, 
    // Agent data
    agentsRes, agentRunsRes, 
    // Pipeline details
    pipelineDetailsRes, 
    // Relationship health
    relationshipDetailsRes, 
    // System
    agentRuns24hRes, emailAccountsRes, calendarAccountsRes, contentQueueRes, capturesRes,] = await Promise.all([
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
    const agentStats = {};
    for (const agent of agentsRes.data || []) {
        const agentRuns = (agentRunsRes.data || []).filter((r) => r.agent_id === agent.id);
        const successRuns = agentRuns.filter((r) => r.status === "completed");
        agentStats[agent.id] = {
            ...agent,
            runs_total: agentRuns.length,
            runs_success: successRuns.length,
            runs_failed: agentRuns.filter((r) => r.status === "failed").length,
            success_rate: agentRuns.length > 0
                ? Math.round((successRuns.length / agentRuns.length) * 100)
                : 100,
            total_cost: agentRuns.reduce((s, r) => s + Number(r.cost_cents || 0), 0) / 100,
            avg_duration: agentRuns.length > 0
                ? Math.round(agentRuns.reduce((s, r) => s + Number(r.duration_ms || 0), 0) /
                    agentRuns.length)
                : 0,
        };
    }
    const byDepartment = {};
    for (const stats of Object.values(agentStats)) {
        const dept = stats.department;
        if (!byDepartment[dept])
            byDepartment[dept] = { runs: 0, cost: 0, success: 0, failed: 0 };
        byDepartment[dept].runs += stats.runs_total;
        byDepartment[dept].cost += stats.total_cost;
        byDepartment[dept].success += stats.runs_success;
        byDepartment[dept].failed += stats.runs_failed;
    }
    // --- Pipeline funnel ---
    const stages = ["idea", "researching", "validating", "building", "launched", "archived"];
    const funnel = {};
    for (const stage of stages) {
        funnel[stage] =
            (pipelineDetailsRes.data || []).filter((p) => p.stage === stage).length;
    }
    const total = pipelineDetailsRes.data?.length || 1;
    const conversions = {
        idea_to_research: funnel.idea > 0
            ? Math.round(((funnel.researching + funnel.validating + funnel.building + funnel.launched) /
                total) *
                100)
            : 0,
        research_to_build: funnel.researching + funnel.validating > 0
            ? Math.round(((funnel.building + funnel.launched) /
                Math.max(1, funnel.researching + funnel.validating + funnel.building + funnel.launched)) *
                100)
            : 0,
        build_to_launch: funnel.building > 0
            ? Math.round((funnel.launched / Math.max(1, funnel.building + funnel.launched)) * 100)
            : 0,
    };
    // --- Relationship health ---
    const relHealthy = [];
    const relWarning = [];
    const relCritical = [];
    for (const r of relationshipDetailsRes.data || []) {
        const days = r.last_contact ? daysSince(r.last_contact) : 999;
        const item = { ...r, days_since_contact: days };
        if (days <= 14)
            relHealthy.push(item);
        else if (days <= 30)
            relWarning.push(item);
        else
            relCritical.push(item);
    }
    const needsAttention = [...relCritical, ...relWarning].slice(0, 10);
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
function Card({ children, className = "", }) {
    return (_jsx("div", { className: `rounded-xl border border-surface-2/50 bg-surface-1/40 p-5 backdrop-blur-sm ${className}`, children: children }));
}
function SectionTitle({ children }) {
    return _jsx("h2", { className: "mb-4 text-sm font-semibold text-zinc-300", children: children });
}
function MetricCard({ label, value, subtext, trend, icon: Icon, }) {
    return (_jsxs("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 p-4 backdrop-blur-sm", children: [_jsxs("div", { className: "mb-1 flex items-center gap-2 text-xs text-zinc-500", children: [Icon && _jsx(Icon, { className: "h-3.5 w-3.5" }), label] }), _jsx("div", { className: "text-2xl font-bold", children: value }), subtext && _jsx("div", { className: "mt-1 text-xs text-zinc-500", children: subtext }), trend != null && (_jsxs("div", { className: `mt-1 flex items-center gap-1 text-xs ${trend >= 0 ? "text-brand" : "text-red-400"}`, children: [trend >= 0 ? (_jsx(TrendingUp, { className: "h-3 w-3" })) : (_jsx(TrendingDown, { className: "h-3 w-3" })), Math.abs(trend).toFixed(1), "%"] }))] }));
}
function HealthDot({ status }) {
    const colors = {
        good: "bg-brand",
        warning: "bg-amber-500",
        error: "bg-red-500",
        neutral: "bg-zinc-500",
    };
    return _jsx("span", { className: `inline-block h-2 w-2 rounded-full ${colors[status]}` });
}
// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Analytics() {
    const { latest, realtime, byDepartment, funnel, conversions, relHealthy, relWarning, relCritical, needsAttention, system, } = useLoaderData();
    const mrr = Number(latest?.total_mrr || 0);
    const arr = mrr * 12;
    const expenses = Number(latest?.total_monthly_expenses || 0);
    const runway = expenses > 0 ? (mrr / expenses).toFixed(1) : "∞";
    const agentCost30d = Number(latest?.agent_cost_30d || 0);
    const agentCost24h = Number(latest?.agent_cost_24h || 0);
    const pipelineTotal = Object.values(funnel).reduce((s, v) => s + v, 0) || 1;
    return (_jsxs("div", { className: "flex flex-1 flex-col", children: [_jsx(Header, { title: "Analytics" }), _jsxs("main", { className: "flex-1 space-y-6 p-6", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4 md:grid-cols-4", children: [_jsx(MetricCard, { icon: TrendingUp, label: "Monthly Revenue", value: mrr > 0 ? `$${mrr.toLocaleString()}` : "$0", subtext: `ARR: $${arr.toLocaleString()}`, trend: latest?.mrr_growth ?? null }), _jsx(MetricCard, { icon: TrendingDown, label: "Monthly Expenses", value: `$${expenses.toLocaleString()}`, subtext: `Runway: ${runway} months` }), _jsx(MetricCard, { icon: Bot, label: "Agent Cost (30d)", value: `$${agentCost30d.toFixed(2)}`, subtext: `Today: $${agentCost24h.toFixed(4)}` }), _jsx(MetricCard, { icon: Rocket, label: "Active Ventures", value: realtime.ventures, subtext: `${realtime.pipeline} in pipeline` })] }), _jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [_jsxs(Card, { children: [_jsx(SectionTitle, { children: "Pipeline Funnel" }), _jsx("div", { className: "space-y-3", children: Object.entries(funnel).map(([stage, count]) => (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-24 shrink-0 text-xs capitalize text-zinc-400", children: stage }), _jsx("div", { className: "flex-1 overflow-hidden rounded-full bg-surface-2 h-3", children: _jsx("div", { className: "h-3 rounded-full bg-brand transition-all", style: {
                                                            width: `${Math.min(100, (count / pipelineTotal) * 100)}%`,
                                                        } }) }), _jsx("div", { className: "w-6 text-right font-mono text-xs text-zinc-400", children: count })] }, stage))) }), _jsxs("div", { className: "mt-4 space-y-1 border-t border-surface-2/50 pt-4 text-xs text-zinc-500", children: [_jsxs("div", { children: ["Idea \u2192 Research: ", conversions.idea_to_research, "%"] }), _jsxs("div", { children: ["Research \u2192 Build: ", conversions.research_to_build, "%"] }), _jsxs("div", { children: ["Build \u2192 Launch: ", conversions.build_to_launch, "%"] })] })] }), _jsxs(Card, { children: [_jsx(SectionTitle, { children: "Relationship Health" }), _jsxs("div", { className: "mb-4 grid grid-cols-3 gap-3", children: [_jsxs("div", { className: "rounded-lg bg-brand/10 p-3 text-center", children: [_jsx("div", { className: "text-2xl font-bold text-brand", children: relHealthy }), _jsx("div", { className: "mt-1 text-xs text-zinc-400", children: "Healthy" })] }), _jsxs("div", { className: "rounded-lg bg-amber-500/10 p-3 text-center", children: [_jsx("div", { className: "text-2xl font-bold text-amber-400", children: relWarning }), _jsx("div", { className: "mt-1 text-xs text-zinc-400", children: "Warning" })] }), _jsxs("div", { className: "rounded-lg bg-red-500/10 p-3 text-center", children: [_jsx("div", { className: "text-2xl font-bold text-red-400", children: relCritical }), _jsx("div", { className: "mt-1 text-xs text-zinc-400", children: "Critical" })] })] }), needsAttention.length > 0 && (_jsxs("div", { children: [_jsx("div", { className: "mb-2 text-xs text-zinc-500", children: "Needs Attention" }), _jsx("div", { className: "space-y-1", children: needsAttention.slice(0, 5).map((r) => (_jsxs(Link, { to: `/dashboard/relationships/${r.id}`, className: "-mx-2 flex items-center justify-between rounded-lg p-2 text-sm hover:bg-surface-2/30", children: [_jsx("span", { className: "text-zinc-300", children: r.name }), _jsxs("span", { className: r.days_since_contact > 30
                                                                ? "text-red-400"
                                                                : "text-amber-400", children: [r.days_since_contact, "d ago"] })] }, r.id))) })] })), needsAttention.length === 0 && (_jsx("div", { className: "py-4 text-center text-sm text-zinc-600", children: "All relationships healthy" }))] }), _jsxs(Card, { children: [_jsx(SectionTitle, { children: "Agent Performance (7d)" }), Object.keys(byDepartment).length === 0 ? (_jsx("div", { className: "py-4 text-center text-sm text-zinc-600", children: "No agent runs in the last 7 days" })) : (_jsx("div", { className: "space-y-4", children: Object.entries(byDepartment).map(([dept, stats]) => {
                                            const rate = stats.runs > 0
                                                ? Math.round((stats.success / stats.runs) * 100)
                                                : 100;
                                            const isUnhealthy = stats.runs > 0 && stats.failed / stats.runs > 0.1;
                                            return (_jsxs("div", { className: "flex items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium capitalize", children: dept }), _jsxs("div", { className: "text-xs text-zinc-500", children: [stats.runs, " runs \u00B7 $", stats.cost.toFixed(2)] })] }), _jsxs("div", { className: `text-sm font-mono ${isUnhealthy ? "text-red-400" : "text-brand"}`, children: [rate, "%"] })] }, dept));
                                        }) })), _jsx(Link, { to: "/dashboard/agents", className: "mt-4 block text-xs text-brand hover:text-brand/80", children: "View all agents \u2192" })] }), _jsxs(Card, { children: [_jsx(SectionTitle, { children: "System Health" }), _jsx("div", { className: "space-y-4", children: [
                                            {
                                                label: "Agent Success Rate (24h)",
                                                value: `${system.agents.success_rate}%`,
                                                status: system.agents.success_rate >= 90
                                                    ? "good"
                                                    : "warning",
                                                sub: `${system.agents.runs_24h} runs`,
                                            },
                                            {
                                                label: "Email Sync",
                                                value: `${system.email.syncing}/${system.email.accounts} accounts`,
                                                status: system.email.accounts > 0
                                                    ? "good"
                                                    : "neutral",
                                            },
                                            {
                                                label: "Calendar Sync",
                                                value: `${system.calendar.syncing}/${system.calendar.accounts} accounts`,
                                                status: system.calendar.accounts > 0
                                                    ? "good"
                                                    : "neutral",
                                            },
                                            {
                                                label: "Content Scheduled",
                                                value: `${system.queues.content_scheduled}`,
                                                status: "neutral",
                                            },
                                            {
                                                label: "Pending Captures",
                                                value: `${system.queues.captures_pending}`,
                                                status: system.queues.captures_pending > 10
                                                    ? "warning"
                                                    : "good",
                                            },
                                        ].map((item) => (_jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(HealthDot, { status: item.status }), _jsxs("div", { children: [_jsx("span", { className: "text-sm", children: item.label }), item.sub && (_jsx("div", { className: "text-xs text-zinc-600", children: item.sub }))] })] }), _jsx("span", { className: "font-mono text-sm text-zinc-400", children: item.value })] }, item.label))) })] })] }), _jsxs(Card, { children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx(PenSquare, { className: "h-4 w-4 text-zinc-400" }), _jsx("h2", { className: "text-sm font-semibold text-zinc-300", children: "Content (30d)" })] }), _jsxs("div", { className: "grid grid-cols-3 gap-4", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-3xl font-bold", children: latest?.content_published_30d ?? 0 }), _jsx("div", { className: "mt-1 text-xs text-zinc-400", children: "Published" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-3xl font-bold", children: latest?.content_scheduled ?? 0 }), _jsx("div", { className: "mt-1 text-xs text-zinc-400", children: "Scheduled" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-3xl font-bold", children: latest?.newsletter_subscribers ?? 0 }), _jsx("div", { className: "mt-1 text-xs text-zinc-400", children: "Subscribers" })] })] })] }), _jsxs(Card, { children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx(Mail, { className: "h-4 w-4 text-zinc-400" }), _jsx("h2", { className: "text-sm font-semibold text-zinc-300", children: "Email (24h)" })] }), _jsxs("div", { className: "grid grid-cols-3 gap-4", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-3xl font-bold", children: latest?.emails_received_24h ?? 0 }), _jsx("div", { className: "mt-1 text-xs text-zinc-400", children: "Received" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-3xl font-bold", children: latest?.emails_sent_24h ?? 0 }), _jsx("div", { className: "mt-1 text-xs text-zinc-400", children: "Sent" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-3xl font-bold text-amber-400", children: latest?.emails_action_required ?? 0 }), _jsx("div", { className: "mt-1 text-xs text-zinc-400", children: "Action Required" })] })] })] }), _jsxs("div", { className: "flex items-center justify-between rounded-xl border border-surface-2/50 bg-surface-1/40 px-5 py-4 backdrop-blur-sm", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(CheckCircle2, { className: "h-5 w-5 text-zinc-500" }), _jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium", children: "Open Tasks" }), _jsx("div", { className: "text-xs text-zinc-500", children: "todos + in progress" })] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "text-2xl font-bold", children: realtime.open_tasks }), _jsx(Link, { to: "/dashboard/tasks", className: "text-xs text-brand hover:text-brand/80", children: "View all \u2192" })] })] })] })] }));
}
