import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLoaderData, Link } from "react-router";
import { useState } from "react";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import { Button } from "~/components/ui/Button";
const STATUS_META = {
    completed: { color: "text-green-400 bg-green-500/10 border-green-500/30", label: "Completed" },
    running: { color: "text-amber-400 bg-amber-500/10 border-amber-500/30", label: "Running" },
    failed: { color: "text-red-400 bg-red-500/10 border-red-500/30", label: "Failed" },
};
export async function loader({ params, context }) {
    const supabase = getSupabaseClient(context.cloudflare.env);
    const { data } = await supabase
        .from("agent_runs")
        .select("*")
        .eq("id", params.id)
        .single();
    if (!data)
        throw new Response("Not found", { status: 404 });
    return { run: data };
}
function formatTime(str) {
    if (!str)
        return "—";
    return new Date(str).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}
function formatDuration(ms) {
    if (!ms)
        return "—";
    if (ms < 1000)
        return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
}
function JsonBlock({ label, data }) {
    const [open, setOpen] = useState(false);
    const isEmpty = data === null || data === undefined;
    return (_jsxs("div", { className: "rounded-lg border border-surface-2/50 bg-surface-1/30", children: [_jsxs("button", { type: "button", onClick: () => setOpen((o) => !o), className: "flex w-full items-center justify-between px-4 py-3 text-left", children: [_jsx("span", { className: "text-sm font-medium text-zinc-300", children: label }), _jsxs("div", { className: "flex items-center gap-2", children: [isEmpty && _jsx("span", { className: "text-xs text-zinc-600", children: "empty" }), _jsx("span", { className: "text-xs text-zinc-600", children: open ? "▲ collapse" : "▼ expand" })] })] }), open && (_jsx("div", { className: "border-t border-surface-2/50 px-4 py-3", children: isEmpty ? (_jsx("p", { className: "text-xs italic text-zinc-600", children: "No data" })) : (_jsx("pre", { className: "overflow-x-auto font-mono text-xs text-zinc-400", children: JSON.stringify(data, null, 2) })) }))] }));
}
export default function AgentRunDetail() {
    const { run } = useLoaderData();
    const sm = STATUS_META[run.status ?? "running"] ?? STATUS_META.running;
    const duration = run.duration_ms ??
        (run.started_at && run.completed_at
            ? new Date(run.completed_at).getTime() - new Date(run.started_at).getTime()
            : null);
    return (_jsxs("div", { className: "flex flex-1 flex-col", children: [_jsx(Header, { title: run.agent_name }), _jsx("main", { className: "flex-1 p-6", children: _jsxs("div", { className: "mx-auto max-w-3xl space-y-4", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-3 rounded-xl border border-surface-2/50 bg-surface-1/40 px-5 py-4 backdrop-blur-sm", children: [_jsx("span", { className: `rounded border px-2.5 py-1 text-sm font-semibold ${sm.color}`, children: sm.label }), run.trigger_type && (_jsxs("span", { className: "rounded border border-surface-2/50 px-2 py-0.5 text-xs text-zinc-500", children: ["via ", run.trigger_type] })), _jsx(Link, { to: "/dashboard/agents/runs", className: "ml-auto text-xs text-zinc-600 hover:text-zinc-400", children: "\u2190 All runs" })] }), _jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
                                { label: "Started", value: formatTime(run.started_at) },
                                { label: "Completed", value: formatTime(run.completed_at) },
                                { label: "Duration", value: formatDuration(duration) },
                                {
                                    label: "Tokens Used",
                                    value: run.tokens_used ? run.tokens_used.toLocaleString() : "—",
                                },
                            ].map((item) => (_jsxs("div", { className: "rounded-lg border border-surface-2/50 bg-surface-1/40 p-3", children: [_jsx("p", { className: "text-xs font-medium uppercase tracking-wide text-zinc-600", children: item.label }), _jsx("p", { className: "mt-1 font-mono text-sm text-zinc-300", children: item.value })] }, item.label))) }), run.error_message && (_jsxs("div", { className: "rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4", children: [_jsx("p", { className: "mb-1 text-xs font-semibold uppercase tracking-wide text-red-400", children: "Error" }), _jsx("pre", { className: "whitespace-pre-wrap font-mono text-sm text-red-300", children: run.error_message })] })), _jsx(JsonBlock, { label: "Input Data", data: run.input_data }), _jsx(JsonBlock, { label: "Output Data", data: run.output_data })] }) })] }));
}
