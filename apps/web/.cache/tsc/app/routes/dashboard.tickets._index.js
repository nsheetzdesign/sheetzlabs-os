import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Form, Link, useLoaderData } from "react-router";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import { Button } from "~/components/ui/Button";
const STATUS_COLOR = {
    open: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    "in-progress": "text-amber-400 border-amber-500/30 bg-amber-500/10",
    resolved: "text-green-400 border-green-500/30 bg-green-500/10",
    closed: "text-zinc-500 border-zinc-600/30 bg-zinc-600/10",
};
const TYPE_ICON = {
    bug: "🐛",
    feature: "✨",
    support: "💬",
};
const PRIORITY_COLOR = {
    urgent: "text-red-400",
    high: "text-orange-400",
    medium: "text-amber-400",
    low: "text-zinc-500",
};
export async function loader({ request, context }) {
    const supabase = getSupabaseClient(context.cloudflare.env);
    const url = new URL(request.url);
    const filterVenture = url.searchParams.get("venture") || "";
    const filterStatus = url.searchParams.get("status") || "";
    const filterType = url.searchParams.get("type") || "";
    let q = supabase
        .from("tickets")
        .select("*, ventures(id, name, slug)")
        .order("created_at", { ascending: false });
    if (filterVenture)
        q = q.eq("venture_id", filterVenture);
    if (filterStatus)
        q = q.eq("status", filterStatus);
    if (filterType)
        q = q.eq("type", filterType);
    const [{ data: tickets }, { data: ventures }] = await Promise.all([
        q,
        supabase.from("ventures").select("id, name, slug").order("name"),
    ]);
    const summary = {
        open: tickets?.filter((t) => t.status === "open").length ?? 0,
        inProgress: tickets?.filter((t) => t.status === "in-progress").length ?? 0,
        resolved: tickets?.filter((t) => t.status === "resolved").length ?? 0,
        total: tickets?.length ?? 0,
    };
    return {
        tickets: tickets ?? [],
        ventures: ventures ?? [],
        summary,
        filterVenture,
        filterStatus,
        filterType,
    };
}
export async function action({ request, context }) {
    const supabase = getSupabaseClient(context.cloudflare.env);
    const fd = await request.formData();
    const intent = fd.get("intent");
    if (intent === "bulk-close") {
        const ids = fd.getAll("selected");
        if (ids.length) {
            await supabase.from("tickets").update({ status: "closed" }).in("id", ids);
        }
        return { ok: true };
    }
    if (intent === "bulk-convert-tasks") {
        const ids = fd.getAll("selected");
        for (const id of ids) {
            const { data: ticket } = await supabase
                .from("tickets")
                .select("*")
                .eq("id", id)
                .single();
            if (!ticket || ticket.converted_task_id)
                continue;
            const { data: newTask } = await supabase
                .from("tasks")
                .insert({
                venture_id: ticket.venture_id,
                title: `[${ticket.type?.toUpperCase()}] ${ticket.title}`,
                description: ticket.description,
                priority: ticket.priority ?? "medium",
                status: "backlog",
            })
                .select("id")
                .single();
            if (newTask) {
                await supabase
                    .from("tickets")
                    .update({ converted_task_id: newTask.id, status: "in-progress" })
                    .eq("id", id);
            }
        }
        return { ok: true };
    }
    return { ok: true };
}
export default function AllTickets() {
    const { tickets, ventures, summary, filterVenture, filterStatus, filterType } = useLoaderData();
    const buildFilter = (key, value) => {
        const params = new URLSearchParams();
        if (filterVenture && key !== "venture")
            params.set("venture", filterVenture);
        if (filterStatus && key !== "status")
            params.set("status", filterStatus);
        if (filterType && key !== "type")
            params.set("type", filterType);
        if (value)
            params.set(key, value);
        return `?${params.toString()}`;
    };
    return (_jsxs("div", { className: "flex flex-1 flex-col", children: [_jsx(Header, { title: "Tickets" }), _jsx("main", { className: "flex-1 p-6", children: _jsxs("div", { className: "mx-auto max-w-4xl space-y-6", children: [_jsx("div", { className: "grid gap-3 sm:grid-cols-4", children: [
                                { label: "Total", value: summary.total, color: "text-zinc-200" },
                                { label: "Open", value: summary.open, color: "text-blue-400" },
                                { label: "In Progress", value: summary.inProgress, color: "text-amber-400" },
                                { label: "Resolved", value: summary.resolved, color: "text-green-400" },
                            ].map((s) => (_jsxs("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 p-4", children: [_jsx("div", { className: "text-xs uppercase tracking-wide text-zinc-600", children: s.label }), _jsx("div", { className: `mt-1 text-2xl font-bold ${s.color}`, children: s.value })] }, s.label))) }), _jsxs("div", { className: "flex flex-wrap gap-3", children: [_jsxs("select", { className: "rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-1.5 text-sm text-zinc-300", value: filterVenture, onChange: (e) => (window.location.href = buildFilter("venture", e.target.value)), children: [_jsx("option", { value: "", children: "All ventures" }), ventures.map((v) => (_jsx("option", { value: v.id, children: v.name }, v.id)))] }), _jsx("div", { className: "flex gap-1", children: ["", "open", "in-progress", "resolved", "closed"].map((s) => (_jsx("a", { href: buildFilter("status", s), className: `rounded-full border px-3 py-1 text-xs font-medium transition-colors ${filterStatus === s
                                            ? "border-brand bg-brand/10 text-brand"
                                            : "border-surface-2/50 text-zinc-500 hover:text-zinc-300"}`, children: s || "All" }, s))) }), _jsx("div", { className: "flex gap-1", children: ["", "bug", "feature", "support"].map((t) => (_jsx("a", { href: buildFilter("type", t), className: `rounded-full border px-3 py-1 text-xs font-medium transition-colors ${filterType === t
                                            ? "border-brand bg-brand/10 text-brand"
                                            : "border-surface-2/50 text-zinc-500 hover:text-zinc-300"}`, children: t ? `${TYPE_ICON[t]} ${t}` : "All types" }, t))) })] }), _jsxs(Form, { method: "post", id: "tickets-form", children: [_jsxs("div", { className: "mb-3 flex items-center justify-between", children: [_jsxs("p", { className: "text-sm text-zinc-500", children: [tickets.length, " tickets"] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { type: "submit", name: "intent", value: "bulk-convert-tasks", variant: "secondary", className: "text-xs", children: "Convert selected \u2192 Tasks" }), _jsx(Button, { type: "submit", name: "intent", value: "bulk-close", variant: "danger", className: "text-xs", children: "Close selected" })] })] }), tickets.length === 0 ? (_jsx("p", { className: "py-12 text-center text-sm text-zinc-600", children: "No tickets found." })) : (_jsx("div", { className: "space-y-2", children: tickets.map((t) => {
                                        const venture = t.ventures;
                                        const isConverted = !!(t.converted_task_id || t.converted_milestone_id);
                                        return (_jsxs("div", { className: `flex items-center gap-3 rounded-xl border bg-surface-1/40 px-4 py-3 ${isConverted ? "border-green-500/20 opacity-60" : "border-surface-2/50"}`, children: [_jsx("input", { type: "checkbox", name: "selected", value: t.id, form: "tickets-form", className: "rounded border-surface-2 bg-surface-1 accent-brand" }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [_jsxs("span", { className: "text-xs text-zinc-600", children: [TYPE_ICON[t.type] ?? "📋", " ", t.type] }), _jsx("span", { className: "text-sm font-medium text-zinc-200", children: t.title }), _jsx("span", { className: `text-xs font-medium ${PRIORITY_COLOR[t.priority ?? "medium"]}`, children: t.priority }), _jsx("span", { className: `rounded border px-1.5 py-0.5 text-xs font-medium ${STATUS_COLOR[t.status ?? "open"]}`, children: t.status }), isConverted && (_jsx("span", { className: "rounded border border-green-500/30 bg-green-500/10 px-1.5 py-0.5 text-xs text-green-400", children: "\u2713 Converted" }))] }), venture && (_jsx(Link, { to: `/dashboard/ventures/${venture.slug}/tickets`, className: "mt-0.5 block text-xs text-zinc-600 hover:text-zinc-400 transition-colors", children: venture.name }))] }), t.source !== "manual" && (_jsx("span", { className: "shrink-0 text-xs text-zinc-700", children: t.source }))] }, t.id));
                                    }) }))] })] }) })] }));
}
