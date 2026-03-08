import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLoaderData, useActionData, Form, Link, redirect, data, } from "react-router";
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
    const name = fd.get("name")?.trim();
    const problem_statement = fd.get("problem_statement")?.trim() || null;
    const target_market = fd.get("target_market")?.trim() || null;
    const stage = fd.get("stage") || "idea";
    const notes = fd.get("notes")?.trim() || null;
    const errors = {};
    if (!name)
        errors.name = "Required";
    if (Object.keys(errors).length)
        return data({ errors }, { status: 400 });
    const { data: inserted, error } = await supabase
        .from("pipeline")
        .insert({ name, problem_statement, target_market, stage: stage, notes })
        .select("id")
        .single();
    if (error)
        return data({ errors: { _form: error.message } }, { status: 500 });
    return redirect(`/dashboard/pipeline/${inserted.id}`);
}
export default function NewPipeline() {
    const { ventures } = useLoaderData();
    const actionData = useActionData();
    const errors = actionData?.errors ?? {};
    const STAGES = [
        "idea",
        "researching",
        "validating",
        "speccing",
        "building",
        "beta",
        "launched",
        "parked",
    ];
    return (_jsxs("div", { className: "flex flex-1 flex-col", children: [_jsx(Header, { title: "New Idea" }), _jsx("main", { className: "flex-1 p-6", children: _jsxs("div", { className: "mx-auto max-w-2xl", children: [errors._form && (_jsx("div", { className: "mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400", children: errors._form })), _jsxs(Form, { method: "post", className: "space-y-5 rounded-xl border border-surface-2/50 bg-surface-1/40 p-6 backdrop-blur-sm", children: [_jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [_jsx(FormField, { label: "Idea Name", required: true, error: errors.name, children: _jsx(Input, { name: "name", placeholder: "Operator OS for Restaurants", error: !!errors.name, autoFocus: true }) }), _jsx(FormField, { label: "Stage", children: _jsx(Select, { name: "stage", defaultValue: "idea", children: STAGES.map((s) => (_jsx("option", { value: s, children: s }, s))) }) })] }), _jsx(FormField, { label: "Problem Statement", hint: "What problem does this solve?", children: _jsx("textarea", { name: "problem_statement", rows: 3, placeholder: "Restaurant operators spend 20% of their week on scheduling and comms...", className: "w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand" }) }), _jsx(FormField, { label: "Target Market", hint: "Who is the customer?", children: _jsx(Input, { name: "target_market", placeholder: "Independent restaurant owners, 1-5 locations" }) }), _jsx(FormField, { label: "Notes", children: _jsx("textarea", { name: "notes", rows: 3, placeholder: "Initial thoughts, market research links...", className: "w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand" }) }), _jsxs("div", { className: "flex items-center gap-3 pt-2", children: [_jsx(Button, { type: "submit", children: "Create Idea" }), _jsx(Link, { to: "/dashboard/pipeline", children: _jsx(Button, { type: "button", variant: "secondary", children: "Cancel" }) })] })] })] }) })] }));
}
