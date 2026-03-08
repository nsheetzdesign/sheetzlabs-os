import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLoaderData, useActionData, Form, Link, redirect, data } from "react-router";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import { FormField } from "~/components/ui/FormField";
import { Input } from "~/components/ui/Input";
import { Select } from "~/components/ui/Select";
import { Button } from "~/components/ui/Button";
export async function loader({ context }) {
    const supabase = getSupabaseClient(context.cloudflare.env);
    const { data: ventures } = await supabase
        .from("ventures")
        .select("id, name, slug")
        .order("name");
    return { ventures: ventures ?? [] };
}
export async function action({ request, context }) {
    const supabase = getSupabaseClient(context.cloudflare.env);
    const fd = await request.formData();
    const title = fd.get("title")?.trim();
    const description = fd.get("description")?.trim() || null;
    const status = fd.get("status") || "todo";
    const priority = fd.get("priority") || null;
    const due_date = fd.get("due_date") || null;
    const venture_id = fd.get("venture_id") || null;
    const errors = {};
    if (!title)
        errors.title = "Required";
    if (Object.keys(errors).length)
        return data({ errors }, { status: 400 });
    const { error } = await supabase.from("tasks").insert({
        title,
        description,
        status: status,
        priority: priority,
        due_date,
        venture_id,
    });
    if (error)
        return data({ errors: { _form: error.message } }, { status: 500 });
    return redirect("/dashboard/tasks");
}
export default function NewTask() {
    const { ventures } = useLoaderData();
    const actionData = useActionData();
    const errors = actionData?.errors ?? {};
    return (_jsxs("div", { className: "flex flex-1 flex-col", children: [_jsx(Header, { title: "New Task" }), _jsx("main", { className: "flex-1 p-6", children: _jsxs("div", { className: "mx-auto max-w-2xl", children: [errors._form && (_jsx("div", { className: "mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400", children: errors._form })), _jsxs(Form, { method: "post", className: "space-y-5 rounded-xl border border-surface-2/50 bg-surface-1/40 p-6 backdrop-blur-sm", children: [_jsx(FormField, { label: "Title", required: true, error: errors.title, children: _jsx(Input, { name: "title", placeholder: "Ship the landing page", error: !!errors.title, autoFocus: true }) }), _jsx(FormField, { label: "Description", children: _jsx("textarea", { name: "description", rows: 3, placeholder: "Optional details...", className: "w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand" }) }), _jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [_jsx(FormField, { label: "Status", children: _jsx(Select, { name: "status", defaultValue: "todo", children: ["backlog", "todo", "in-progress", "review", "done", "blocked"].map((s) => (_jsx("option", { value: s, children: s }, s))) }) }), _jsx(FormField, { label: "Priority", children: _jsxs(Select, { name: "priority", defaultValue: "", children: [_jsx("option", { value: "", children: "None" }), ["urgent", "high", "medium", "low"].map((p) => (_jsx("option", { value: p, children: p }, p)))] }) })] }), _jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [_jsx(FormField, { label: "Due Date", children: _jsx(Input, { name: "due_date", type: "date" }) }), _jsx(FormField, { label: "Venture", children: _jsxs(Select, { name: "venture_id", defaultValue: "", children: [_jsx("option", { value: "", children: "None" }), ventures.map((v) => (_jsx("option", { value: v.id, children: v.name }, v.id)))] }) })] }), _jsxs("div", { className: "flex items-center gap-3 pt-2", children: [_jsx(Button, { type: "submit", children: "Create Task" }), _jsx(Link, { to: "/dashboard/tasks", children: _jsx(Button, { type: "button", variant: "secondary", children: "Cancel" }) })] })] })] }) })] }));
}
