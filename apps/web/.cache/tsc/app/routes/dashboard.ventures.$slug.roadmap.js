import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Form, Link, useLoaderData, data } from "react-router";
import { getSupabaseClient } from "~/lib/supabase.server";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Select } from "~/components/ui/Select";
import { FormField } from "~/components/ui/FormField";
const STATUS_OPTIONS = ["planned", "in-progress", "completed", "delayed"];
const STATUS_COLOR = {
    planned: "text-zinc-400 border-zinc-500/30 bg-zinc-500/10",
    "in-progress": "text-blue-400 border-blue-500/30 bg-blue-500/10",
    completed: "text-green-400 border-green-500/30 bg-green-500/10",
    delayed: "text-red-400 border-red-500/30 bg-red-500/10",
};
export async function loader({ params, context }) {
    const supabase = getSupabaseClient(context.cloudflare.env);
    const { data: v } = await supabase
        .from("ventures")
        .select("id")
        .eq("slug", params.slug)
        .single();
    if (!v)
        throw new Response("Not found", { status: 404 });
    const { data: milestones } = await supabase
        .from("milestones")
        .select("*")
        .eq("venture_id", v.id)
        .order("sort_order")
        .order("created_at");
    // Fetch tasks for this venture that have a milestone_id
    const { data: tasks } = await supabase
        .from("tasks")
        .select("id, title, status, milestone_id, priority")
        .eq("venture_id", v.id)
        .not("milestone_id", "is", null);
    return {
        ventureId: v.id,
        slug: params.slug,
        milestones: milestones ?? [],
        tasks: tasks ?? [],
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
    if (intent === "delete-milestone") {
        await supabase.from("milestones").delete().eq("id", fd.get("id"));
        return { ok: true };
    }
    if (intent === "complete-milestone") {
        const id = fd.get("id");
        const isComplete = fd.get("completed") === "true";
        await supabase
            .from("milestones")
            .update({
            status: isComplete ? "planned" : "completed",
            completed_at: isComplete ? null : new Date().toISOString(),
        })
            .eq("id", id);
        return { ok: true };
    }
    if (intent === "add-task") {
        const milestoneId = fd.get("milestone_id");
        const title = fd.get("title")?.trim();
        if (!title)
            return data({ error: "Title required" }, { status: 400 });
        await supabase.from("tasks").insert({
            venture_id: v.id,
            milestone_id: milestoneId,
            title,
            priority: "medium",
            status: "backlog",
        });
        return { ok: true };
    }
    if (intent === "update-status") {
        const id = fd.get("id");
        const status = fd.get("status");
        await supabase.from("milestones").update({ status }).eq("id", id);
        return { ok: true };
    }
    // Add milestone
    const title = fd.get("title")?.trim();
    const description = fd.get("description")?.trim() || null;
    const targetDate = fd.get("target_date") || null;
    const status = fd.get("status") || "planned";
    if (!title)
        return data({ error: "Title required" }, { status: 400 });
    const { data: existing } = await supabase
        .from("milestones")
        .select("sort_order")
        .eq("venture_id", v.id)
        .order("sort_order", { ascending: false })
        .limit(1)
        .single();
    const { error } = await supabase.from("milestones").insert({
        venture_id: v.id,
        title,
        description,
        target_date: targetDate,
        status,
        sort_order: (existing?.sort_order ?? 0) + 1,
    });
    if (error)
        return data({ error: error.message }, { status: 500 });
    return { ok: true };
}
export default function VentureRoadmap() {
    const { milestones, tasks, slug } = useLoaderData();
    const tasksByMilestone = tasks.reduce((acc, t) => {
        if (t.milestone_id) {
            acc[t.milestone_id] = acc[t.milestone_id] ?? [];
            acc[t.milestone_id].push(t);
        }
        return acc;
    }, {});
    return (_jsxs("div", { className: "mx-auto max-w-3xl space-y-6", children: [_jsxs(Form, { method: "post", className: "rounded-xl border border-surface-2/50 bg-surface-1/40 p-5 backdrop-blur-sm", children: [_jsx("h2", { className: "mb-4 text-sm font-semibold text-zinc-300", children: "Add Milestone" }), _jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [_jsx(FormField, { label: "Title", required: true, children: _jsx(Input, { name: "title", placeholder: "MVP Launch" }) }), _jsx(FormField, { label: "Target Date", children: _jsx(Input, { name: "target_date", type: "date" }) })] }), _jsxs("div", { className: "mt-4 grid gap-4 sm:grid-cols-2", children: [_jsx(FormField, { label: "Status", children: _jsx(Select, { name: "status", defaultValue: "planned", children: STATUS_OPTIONS.map((s) => (_jsx("option", { value: s, children: s }, s))) }) }), _jsx(FormField, { label: "Description", children: _jsx(Input, { name: "description", placeholder: "What defines done?" }) })] }), _jsx("div", { className: "mt-4 flex justify-end", children: _jsx(Button, { type: "submit", children: "Add Milestone" }) })] }), milestones.length === 0 ? (_jsx("p", { className: "py-8 text-center text-sm text-zinc-600", children: "No milestones yet. Add your first one above." })) : (milestones.map((m) => {
                const mTasks = tasksByMilestone[m.id] ?? [];
                const completedCount = mTasks.filter((t) => t.status === "done").length;
                const progress = mTasks.length > 0 ? (completedCount / mTasks.length) * 100 : 0;
                const isCompleted = m.status === "completed";
                return (_jsxs("div", { className: `rounded-xl border bg-surface-1/40 p-5 ${isCompleted
                        ? "border-green-500/20 opacity-60"
                        : "border-surface-2/50"}`, children: [_jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: `rounded border px-2 py-0.5 text-xs font-medium ${STATUS_COLOR[m.status ?? "planned"]}`, children: m.status }), _jsx("h3", { className: `font-semibold text-zinc-200 ${isCompleted ? "line-through text-zinc-500" : ""}`, children: m.title })] }), m.description && (_jsx("p", { className: "mt-1 text-sm text-zinc-500", children: m.description })), m.target_date && (_jsxs("p", { className: "mt-1 text-xs text-zinc-600", children: ["Target: ", new Date(m.target_date).toLocaleDateString()] }))] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Form, { method: "post", children: [_jsx("input", { type: "hidden", name: "intent", value: "complete-milestone" }), _jsx("input", { type: "hidden", name: "id", value: m.id }), _jsx("input", { type: "hidden", name: "completed", value: isCompleted ? "true" : "false" }), _jsx("button", { type: "submit", className: `text-xs transition-colors ${isCompleted ? "text-green-400 hover:text-zinc-400" : "text-zinc-600 hover:text-green-400"}`, children: isCompleted ? "✓ Done" : "Mark done" })] }), _jsxs(Form, { method: "post", children: [_jsx("input", { type: "hidden", name: "intent", value: "delete-milestone" }), _jsx("input", { type: "hidden", name: "id", value: m.id }), _jsx("button", { type: "submit", className: "text-zinc-600 hover:text-red-400 transition-colors text-xs", children: "\u2715" })] })] })] }), mTasks.length > 0 && (_jsxs("div", { className: "mt-3", children: [_jsxs("div", { className: "mb-1 flex items-center justify-between text-xs text-zinc-600", children: [_jsxs("span", { children: [completedCount, "/", mTasks.length, " tasks complete"] }), _jsxs("span", { children: [Math.round(progress), "%"] })] }), _jsx("div", { className: "h-1.5 w-full rounded-full bg-surface-2/50", children: _jsx("div", { className: "h-1.5 rounded-full bg-brand transition-all", style: { width: `${progress}%` } }) })] })), _jsxs("div", { className: "mt-4 space-y-1.5", children: [mTasks.map((t) => (_jsxs("div", { className: "flex items-center gap-2 rounded-lg bg-surface-2/30 px-3 py-2 text-sm", children: [_jsx("span", { className: `h-1.5 w-1.5 shrink-0 rounded-full ${t.status === "done" ? "bg-green-400" : "bg-zinc-500"}` }), _jsx(Link, { to: `/dashboard/tasks/${t.id}`, className: `flex-1 hover:text-brand transition-colors ${t.status === "done" ? "line-through text-zinc-600" : "text-zinc-300"}`, children: t.title }), _jsx("span", { className: "text-xs text-zinc-600 capitalize", children: t.status })] }, t.id))), _jsxs(Form, { method: "post", className: "flex items-center gap-2 pt-1", children: [_jsx("input", { type: "hidden", name: "intent", value: "add-task" }), _jsx("input", { type: "hidden", name: "milestone_id", value: m.id }), _jsx("input", { type: "text", name: "title", placeholder: "Add task\u2026", className: "flex-1 rounded-lg border border-surface-2/30 bg-surface-1/30 px-3 py-1.5 text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand" }), _jsx(Button, { type: "submit", variant: "secondary", className: "text-xs py-1 px-3", children: "Add" })] })] })] }, m.id));
            }))] }));
}
