import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Form, Link, useLoaderData, data } from "react-router";
import { getSupabaseClient } from "~/lib/supabase.server";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Select } from "~/components/ui/Select";
import { FormField } from "~/components/ui/FormField";
const STATUS_ORDER = ["backlog", "todo", "in-progress", "review", "done", "blocked"];
const PRIORITY_ORDER = ["urgent", "high", "medium", "low"];
const STATUS_COLOR = {
    backlog: "text-zinc-500 border-zinc-600/30 bg-zinc-600/10",
    todo: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    "in-progress": "text-amber-400 border-amber-500/30 bg-amber-500/10",
    review: "text-purple-400 border-purple-500/30 bg-purple-500/10",
    done: "text-green-400 border-green-500/30 bg-green-500/10",
    blocked: "text-red-400 border-red-500/30 bg-red-500/10",
};
const PRIORITY_DOT = {
    urgent: "bg-red-400",
    high: "bg-orange-400",
    medium: "bg-amber-400",
    low: "bg-zinc-600",
};
export async function loader({ request, params, context }) {
    const supabase = getSupabaseClient(context.cloudflare.env);
    const url = new URL(request.url);
    const filterStatus = url.searchParams.get("status") || "";
    const { data: v } = await supabase
        .from("ventures")
        .select("id")
        .eq("slug", params.slug)
        .single();
    if (!v)
        throw new Response("Not found", { status: 404 });
    let q = supabase
        .from("tasks")
        .select("*, milestones(id, title)")
        .eq("venture_id", v.id)
        .order("priority")
        .order("created_at", { ascending: false });
    if (filterStatus)
        q = q.eq("status", filterStatus);
    else
        q = q.neq("status", "done"); // default: hide done tasks
    const { data: tasks } = await q;
    const { data: milestones } = await supabase
        .from("milestones")
        .select("id, title")
        .eq("venture_id", v.id)
        .order("sort_order");
    return {
        ventureId: v.id,
        tasks: tasks ?? [],
        milestones: milestones ?? [],
        filterStatus,
    };
}
export async function action({ request, params, context }) {
    const supabase = getSupabaseClient(context.cloudflare.env);
    const fd = await request.formData();
    const intent = fd.get("intent");
    const { data: v } = await supabase
        .from("ventures")
        .select("id")
        .eq("slug", params.slug)
        .single();
    if (!v)
        throw new Response("Not found", { status: 404 });
    if (intent === "add") {
        const title = fd.get("title")?.trim();
        const priority = fd.get("priority") || "medium";
        const milestoneId = fd.get("milestone_id") || null;
        const dueDate = fd.get("due_date") || null;
        if (!title)
            return data({ error: "Title required" }, { status: 400 });
        const { error } = await supabase.from("tasks").insert({
            venture_id: v.id,
            title,
            priority: priority,
            status: "backlog",
            milestone_id: milestoneId,
            due_date: dueDate,
        });
        if (error)
            return data({ error: error.message }, { status: 500 });
        return { ok: true };
    }
    if (intent === "complete") {
        const id = fd.get("id");
        await supabase
            .from("tasks")
            .update({ status: "done", completed_at: new Date().toISOString() })
            .eq("id", id);
        return { ok: true };
    }
    if (intent === "delete") {
        await supabase.from("tasks").delete().eq("id", fd.get("id"));
        return { ok: true };
    }
    return { ok: true };
}
export default function VentureTasks() {
    const { tasks, milestones, filterStatus } = useLoaderData();
    return (_jsxs("div", { className: "mx-auto max-w-3xl space-y-6", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [_jsx("a", { href: "?", className: `rounded-full border px-3 py-1 text-xs font-medium transition-colors ${!filterStatus ? "border-brand bg-brand/10 text-brand" : "border-surface-2/50 text-zinc-500 hover:text-zinc-300"}`, children: "Active" }), STATUS_ORDER.map((s) => (_jsx("a", { href: `?status=${s}`, className: `rounded-full border px-3 py-1 text-xs font-medium transition-colors ${filterStatus === s ? "border-brand bg-brand/10 text-brand" : "border-surface-2/50 text-zinc-500 hover:text-zinc-300"}`, children: s }, s)))] }), _jsxs(Form, { method: "post", className: "rounded-xl border border-surface-2/50 bg-surface-1/40 p-5 backdrop-blur-sm", children: [_jsx("input", { type: "hidden", name: "intent", value: "add" }), _jsx("h2", { className: "mb-4 text-sm font-semibold text-zinc-300", children: "Add Task" }), _jsxs("div", { className: "grid gap-4 sm:grid-cols-3", children: [_jsx("div", { className: "sm:col-span-2", children: _jsx(FormField, { label: "Title", required: true, children: _jsx(Input, { name: "title", placeholder: "What needs to be done?" }) }) }), _jsx(FormField, { label: "Priority", children: _jsx(Select, { name: "priority", defaultValue: "medium", children: PRIORITY_ORDER.map((p) => (_jsx("option", { value: p, children: p }, p))) }) })] }), milestones.length > 0 && (_jsxs("div", { className: "mt-4 grid gap-4 sm:grid-cols-2", children: [_jsx(FormField, { label: "Milestone", children: _jsxs(Select, { name: "milestone_id", defaultValue: "", children: [_jsx("option", { value: "", children: "No milestone" }), milestones.map((m) => (_jsx("option", { value: m.id, children: m.title }, m.id)))] }) }), _jsx(FormField, { label: "Due Date", children: _jsx(Input, { name: "due_date", type: "date" }) })] })), _jsx("div", { className: "mt-4 flex justify-end", children: _jsx(Button, { type: "submit", children: "Add Task" }) })] }), tasks.length === 0 ? (_jsx("p", { className: "py-8 text-center text-sm text-zinc-600", children: filterStatus ? `No ${filterStatus} tasks.` : "No active tasks." })) : (_jsx("div", { className: "space-y-2", children: tasks.map((task) => (_jsxs("div", { className: "flex items-center gap-3 rounded-xl border border-surface-2/50 bg-surface-1/40 px-4 py-3", children: [_jsx("span", { className: `h-2 w-2 shrink-0 rounded-full ${PRIORITY_DOT[task.priority ?? "medium"]}`, title: task.priority ?? "medium" }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx(Link, { to: `/dashboard/tasks/${task.id}`, className: "text-sm font-medium text-zinc-200 hover:text-brand transition-colors", children: task.title }), task.milestones && (_jsxs("p", { className: "text-xs text-zinc-600", children: ["Milestone: ", task.milestones.title] })), task.due_date && (_jsxs("p", { className: "text-xs text-zinc-600", children: ["Due: ", new Date(task.due_date).toLocaleDateString()] }))] }), _jsx("span", { className: `shrink-0 rounded border px-2 py-0.5 text-xs font-medium ${STATUS_COLOR[task.status ?? "backlog"]}`, children: task.status }), task.status !== "done" && (_jsxs(Form, { method: "post", children: [_jsx("input", { type: "hidden", name: "intent", value: "complete" }), _jsx("input", { type: "hidden", name: "id", value: task.id }), _jsx("button", { type: "submit", className: "text-zinc-600 hover:text-green-400 transition-colors text-xs", title: "Mark done", children: "\u2713" })] })), _jsxs(Form, { method: "post", children: [_jsx("input", { type: "hidden", name: "intent", value: "delete" }), _jsx("input", { type: "hidden", name: "id", value: task.id }), _jsx("button", { type: "submit", className: "text-zinc-600 hover:text-red-400 transition-colors text-xs", children: "\u2715" })] })] }, task.id))) })), _jsx("p", { className: "text-center text-xs text-zinc-700", children: _jsx(Link, { to: "/dashboard/tasks", className: "hover:text-zinc-400 transition-colors", children: "View all tasks \u2192" }) })] }));
}
