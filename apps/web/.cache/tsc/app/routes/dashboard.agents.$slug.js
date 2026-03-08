import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLoaderData, Link, Form, useNavigation } from "react-router";
import { useState } from "react";
import { ArrowLeft, Play, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import { Button } from "~/components/ui/Button";
const STATUS_META = {
    completed: { color: "text-green-400 bg-green-500/10 border-green-500/30", label: "Completed", Icon: CheckCircle },
    running: { color: "text-amber-400 bg-amber-500/10 border-amber-500/30", label: "Running", Icon: Loader2 },
    failed: { color: "text-red-400 bg-red-500/10 border-red-500/30", label: "Failed", Icon: XCircle },
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
function formatCost(cents) {
    if (!cents)
        return "—";
    return `$${(cents / 100).toFixed(4)}`;
}
function JsonBlock({ label, data }) {
    const [open, setOpen] = useState(false);
    const isEmpty = data === null || data === undefined;
    return (_jsxs("div", { className: "rounded-lg border border-surface-2/50 bg-surface-1/30", children: [_jsxs("button", { type: "button", onClick: () => setOpen((o) => !o), className: "flex w-full items-center justify-between px-4 py-3 text-left", children: [_jsx("span", { className: "text-sm font-medium text-zinc-300", children: label }), _jsxs("span", { className: "text-xs text-zinc-600", children: [open ? "▲" : "▼", " ", isEmpty ? "empty" : ""] })] }), open && (_jsx("div", { className: "border-t border-surface-2/50 px-4 py-3", children: isEmpty ? (_jsx("p", { className: "text-xs italic text-zinc-600", children: "No data" })) : (_jsx("pre", { className: "overflow-x-auto font-mono text-xs text-zinc-400", children: JSON.stringify(data, null, 2) })) }))] }));
}
export async function loader({ params, context }) {
    const supabase = getSupabaseClient(context.cloudflare.env);
    const { data: agent } = await supabase
        .from("agents")
        .select("*")
        .eq("slug", params.slug)
        .single();
    if (!agent)
        throw new Response("Not found", { status: 404 });
    const { data: runs } = await supabase
        .from("agent_runs")
        .select("*")
        .eq("agent_id", agent.id)
        .order("created_at", { ascending: false })
        .limit(20);
    return { agent, runs: runs ?? [] };
}
export async function action({ params, request, context }) {
    const supabase = getSupabaseClient(context.cloudflare.env);
    const formData = await request.formData();
    const intent = formData.get("intent");
    if (intent === "toggle") {
        const { data: agent } = await supabase
            .from("agents")
            .select("enabled")
            .eq("slug", params.slug)
            .single();
        if (agent) {
            await supabase
                .from("agents")
                .update({ enabled: !agent.enabled })
                .eq("slug", params.slug);
        }
    }
    if (intent === "run") {
        // Fire via API — web can't hold long-running execution
        const apiUrl = context.cloudflare.env.INTERNAL_API_URL ?? "https://api.sheetzlabs.com";
        await fetch(`${apiUrl}/agents/${params.slug}/run`, { method: "POST" });
    }
    return null;
}
export default function AgentDetail() {
    const { agent, runs } = useLoaderData();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    return (_jsxs("div", { className: "flex flex-1 flex-col", children: [_jsx(Header, { title: agent.name }), _jsx("main", { className: "flex-1 p-6", children: _jsxs("div", { className: "mx-auto max-w-4xl space-y-6", children: [_jsxs(Link, { to: "/dashboard/agents", className: "inline-flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-300 transition-colors", children: [_jsx(ArrowLeft, { className: "h-3.5 w-3.5" }), "All departments"] }), _jsxs("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 px-6 py-5 backdrop-blur-sm", children: [_jsxs("div", { className: "flex flex-wrap items-start justify-between gap-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("span", { className: "rounded border border-surface-2/50 px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-zinc-500", children: agent.department }), _jsx("span", { className: `rounded border px-2 py-0.5 text-xs font-medium ${agent.enabled
                                                                ? "border-green-500/30 bg-green-500/10 text-green-400"
                                                                : "border-zinc-500/30 bg-zinc-500/10 text-zinc-500"}`, children: agent.enabled ? "Enabled" : "Disabled" })] }), _jsx("h2", { className: "text-lg font-semibold text-zinc-100", children: agent.name }), agent.description && (_jsx("p", { className: "mt-1 text-sm text-zinc-500", children: agent.description }))] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Form, { method: "post", children: [_jsx("input", { type: "hidden", name: "intent", value: "toggle" }), _jsx(Button, { type: "submit", variant: "secondary", disabled: isSubmitting, children: agent.enabled ? "Disable" : "Enable" })] }), _jsxs(Form, { method: "post", children: [_jsx("input", { type: "hidden", name: "intent", value: "run" }), _jsxs(Button, { type: "submit", disabled: !agent.enabled || isSubmitting, children: [_jsx(Play, { className: "h-3.5 w-3.5 mr-1.5" }), "Run Now"] })] })] })] }), _jsx("div", { className: "mt-4 grid grid-cols-2 gap-3 border-t border-surface-2/30 pt-4 sm:grid-cols-4", children: [
                                        { label: "Model", value: agent.model },
                                        { label: "Max Tokens", value: agent.max_tokens?.toLocaleString() },
                                        { label: "Schedule", value: agent.schedule ?? "On demand" },
                                        { label: "Slug", value: agent.slug },
                                    ].map((item) => (_jsxs("div", { children: [_jsx("p", { className: "text-xs font-medium uppercase tracking-wide text-zinc-600", children: item.label }), _jsx("p", { className: "mt-0.5 font-mono text-xs text-zinc-400 break-all", children: item.value ?? "—" })] }, item.label))) })] }), _jsxs("div", { className: "space-y-3", children: [_jsx(JsonBlock, { label: "System Prompt", data: agent.system_prompt }), _jsx(JsonBlock, { label: "User Prompt Template", data: agent.user_prompt_template }), _jsx(JsonBlock, { label: "Input Sources", data: agent.input_sources }), _jsx(JsonBlock, { label: "Output Actions", data: agent.output_actions })] }), _jsxs("div", { children: [_jsx("h3", { className: "mb-3 text-sm font-semibold text-zinc-300", children: "Recent Runs" }), _jsx("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 backdrop-blur-sm", children: runs.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center gap-2 py-10", children: [_jsx(Clock, { className: "h-7 w-7 text-zinc-700" }), _jsx("p", { className: "text-sm text-zinc-600", children: "No runs yet" })] })) : (_jsx("div", { className: "divide-y divide-surface-2/30", children: runs.map((run) => {
                                            const sm = STATUS_META[run.status ?? "running"] ?? STATUS_META.running;
                                            const StatusIcon = sm.Icon;
                                            return (_jsxs("div", { className: "flex items-center gap-4 px-4 py-3", children: [_jsx(StatusIcon, { className: `h-4 w-4 shrink-0 ${sm.color.split(" ")[0]} ${run.status === "running" ? "animate-spin" : ""}` }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: `rounded border px-1.5 py-0.5 text-xs font-medium ${sm.color}`, children: sm.label }), run.trigger_type && (_jsxs("span", { className: "text-xs text-zinc-600", children: ["via ", run.trigger_type] }))] }), _jsx("p", { className: "mt-0.5 text-xs text-zinc-600", children: formatTime(run.created_at ?? run.started_at) })] }), _jsxs("div", { className: "flex shrink-0 items-center gap-4 text-xs font-mono text-zinc-600", children: [_jsx("span", { children: formatDuration(run.duration_ms) }), run.tokens_input && (_jsxs("span", { className: "hidden sm:block", children: [(run.tokens_input + (run.tokens_output ?? 0)).toLocaleString(), " tok"] })), _jsx("span", { children: formatCost(run.cost_cents) })] })] }, run.id));
                                        }) })) })] })] }) })] }));
}
