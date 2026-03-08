import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLoaderData, useFetcher, Form, Link } from "react-router";
import { Plus, CheckSquare } from "lucide-react";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { EmptyState } from "~/components/ui/EmptyState";
const STATUS_CYCLE = {
    backlog: "todo",
    todo: "in-progress",
    "in-progress": "review",
    review: "done",
    done: "todo",
    blocked: "todo",
};
export async function loader({ request, context }) {
    const supabase = getSupabaseClient(context.cloudflare.env);
    const url = new URL(request.url);
    const ventureId = url.searchParams.get("venture_id") || "";
    const status = url.searchParams.get("status") || "";
    const priority = url.searchParams.get("priority") || "";
    let query = supabase
        .from("tasks")
        .select("*, ventures(id, name, slug)")
        .order("due_date", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: false });
    if (ventureId)
        query = query.eq("venture_id", ventureId);
    if (status)
        query = query.eq("status", status);
    if (priority)
        query = query.eq("priority", priority);
    const [tasksRes, venturesRes] = await Promise.all([
        query,
        supabase.from("ventures").select("id, name, slug").order("name"),
    ]);
    return {
        tasks: tasksRes.data ?? [],
        ventures: venturesRes.data ?? [],
        filters: { ventureId, status, priority },
    };
}
export async function action({ request, context }) {
    const supabase = getSupabaseClient(context.cloudflare.env);
    const fd = await request.formData();
    const intent = fd.get("intent");
    if (intent === "toggle") {
        const id = fd.get("id");
        const currentStatus = fd.get("current_status");
        const nextStatus = STATUS_CYCLE[currentStatus] ?? "todo";
        const update = { status: nextStatus };
        if (nextStatus === "done")
            update.completed_at = new Date().toISOString();
        else
            update.completed_at = null;
        await supabase.from("tasks").update(update).eq("id", id);
        return { ok: true };
    }
    return { ok: false };
}
function formatDue(dateStr) {
    if (!dateStr)
        return null;
    const d = new Date(dateStr);
    const now = new Date();
    const isOverdue = d < now;
    const label = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    return { label, isOverdue };
}
function TaskRow({ task }) {
    const fetcher = useFetcher();
    const optimisticStatus = fetcher.state !== "idle" && fetcher.formData
        ? (STATUS_CYCLE[fetcher.formData.get("current_status")] ?? task.status)
        : task.status;
    const due = formatDue(task.due_date);
    return (_jsxs("div", { className: "flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-2/20", children: [_jsxs(fetcher.Form, { method: "post", className: "shrink-0", children: [_jsx("input", { type: "hidden", name: "intent", value: "toggle" }), _jsx("input", { type: "hidden", name: "id", value: task.id }), _jsx("input", { type: "hidden", name: "current_status", value: optimisticStatus ?? "todo" }), _jsx("button", { type: "submit", className: "flex items-center", title: `Status: ${optimisticStatus} → click to advance`, children: _jsx(Badge, { value: optimisticStatus ?? "todo", variant: "task-status" }) })] }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx(Link, { to: task.id, className: `text-sm font-medium transition-colors hover:text-brand ${optimisticStatus === "done" ? "text-zinc-600 line-through" : "text-zinc-200"}`, children: task.title }), task.ventures?.name && (_jsx("p", { className: "mt-0.5 text-xs text-zinc-600", children: task.ventures.name }))] }), _jsxs("div", { className: "flex shrink-0 items-center gap-3", children: [task.priority && (_jsx(Badge, { value: task.priority, variant: "task-priority" })), due && (_jsx("span", { className: `hidden font-mono text-xs sm:block ${due.isOverdue && optimisticStatus !== "done" ? "text-red-400" : "text-zinc-600"}`, children: due.label })), _jsx(Link, { to: task.id, className: "text-zinc-700 hover:text-zinc-400 transition-colors", children: _jsx("svg", { className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", strokeWidth: 2, stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M8.25 4.5l7.5 7.5-7.5 7.5" }) }) })] })] }));
}
export default function TasksIndex() {
    const { tasks, ventures, filters } = useLoaderData();
    const STATUSES = ["backlog", "todo", "in-progress", "review", "done", "blocked"];
    const PRIORITIES = ["urgent", "high", "medium", "low"];
    return (_jsxs("div", { className: "flex flex-1 flex-col", children: [_jsx(Header, { title: "Tasks" }), _jsxs("main", { className: "flex-1 p-6", children: [_jsxs(Form, { method: "get", className: "mb-4 flex flex-wrap items-center gap-2", children: [_jsxs("select", { name: "venture_id", defaultValue: filters.ventureId, className: "rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-1.5 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-brand", children: [_jsx("option", { value: "", children: "All ventures" }), ventures.map((v) => (_jsx("option", { value: v.id, children: v.name }, v.id)))] }), _jsxs("select", { name: "status", defaultValue: filters.status, className: "rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-1.5 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-brand", children: [_jsx("option", { value: "", children: "All statuses" }), STATUSES.map((s) => (_jsx("option", { value: s, children: s }, s)))] }), _jsxs("select", { name: "priority", defaultValue: filters.priority, className: "rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-1.5 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-brand", children: [_jsx("option", { value: "", children: "All priorities" }), PRIORITIES.map((p) => (_jsx("option", { value: p, children: p }, p)))] }), _jsx(Button, { type: "submit", variant: "secondary", children: "Filter" }), (filters.ventureId || filters.status || filters.priority) && (_jsx(Link, { to: "/dashboard/tasks", children: _jsx(Button, { type: "button", variant: "secondary", children: "Clear" }) })), _jsx("div", { className: "ml-auto", children: _jsxs(Link, { to: "new", className: "inline-flex items-center gap-2 rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark", children: [_jsx(Plus, { className: "h-4 w-4" }), "New Task"] }) })] }), _jsxs("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 backdrop-blur-sm", children: [_jsxs("div", { className: "grid border-b border-surface-2/50 px-4 py-2 text-xs font-medium uppercase tracking-wide text-zinc-600", style: { gridTemplateColumns: "1fr auto" }, children: [_jsx("span", { children: "Task" }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { children: "Priority" }), _jsx("span", { className: "hidden sm:block", children: "Due" }), _jsx("span", { className: "w-4" })] })] }), tasks.length === 0 ? (_jsx(EmptyState, { icon: CheckSquare, title: "No tasks", description: filters.status || filters.priority || filters.ventureId ? "No tasks match these filters." : "Create your first task to stay on top of your work.", action: _jsxs(Link, { to: "new", className: "inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark", children: [_jsx(Plus, { className: "h-4 w-4" }), "New Task"] }) })) : (_jsx("div", { className: "divide-y divide-surface-2/30 py-1", children: tasks.map((t) => (_jsx(TaskRow, { task: t }, t.id))) }))] }), _jsxs("p", { className: "mt-2 text-xs text-zinc-700", children: [tasks.length, " task", tasks.length !== 1 ? "s" : "", " \u2014 click status badge to advance"] })] })] }));
}
