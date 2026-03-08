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
    const amountStr = fd.get("amount_dollars")?.trim();
    const amount_cents = Math.round(parseFloat(amountStr || "0") * 100);
    const type = fd.get("type") || "one-time";
    const description = fd.get("description")?.trim() || null;
    const client_name = fd.get("client_name")?.trim() || null;
    const venture_id = fd.get("venture_id") || null;
    const recorded_at = fd.get("recorded_at") || new Date().toISOString().slice(0, 10);
    const period_start = fd.get("period_start") || null;
    const period_end = fd.get("period_end") || null;
    const errors = {};
    if (!amountStr || isNaN(amount_cents) || amount_cents <= 0)
        errors.amount_dollars = "Enter a valid amount greater than $0";
    if (Object.keys(errors).length)
        return data({ errors }, { status: 400 });
    const { error } = await supabase.from("revenue").insert({
        amount_cents,
        type: type,
        description,
        client_name,
        venture_id,
        recorded_at,
        period_start,
        period_end,
    });
    if (error)
        return data({ errors: { _form: error.message } }, { status: 500 });
    return redirect("/dashboard/revenue");
}
export default function NewRevenue() {
    const { ventures } = useLoaderData();
    const actionData = useActionData();
    const errors = actionData?.errors ?? {};
    const today = new Date().toISOString().slice(0, 10);
    return (_jsxs("div", { className: "flex flex-1 flex-col", children: [_jsx(Header, { title: "Log Revenue" }), _jsx("main", { className: "flex-1 p-6", children: _jsxs("div", { className: "mx-auto max-w-2xl", children: [errors._form && (_jsx("div", { className: "mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400", children: errors._form })), _jsxs(Form, { method: "post", className: "space-y-5 rounded-xl border border-surface-2/50 bg-surface-1/40 p-6 backdrop-blur-sm", children: [_jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [_jsx(FormField, { label: "Amount ($)", required: true, error: errors.amount_dollars, children: _jsx(Input, { name: "amount_dollars", type: "number", step: "0.01", min: "0.01", placeholder: "500.00", error: !!errors.amount_dollars, autoFocus: true }) }), _jsx(FormField, { label: "Type", children: _jsx(Select, { name: "type", defaultValue: "one-time", children: ["recurring", "one-time", "retainer", "project"].map((t) => (_jsx("option", { value: t, children: t }, t))) }) })] }), _jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [_jsx(FormField, { label: "Description", children: _jsx(Input, { name: "description", placeholder: "Monthly subscription, Project milestone\u2026" }) }), _jsx(FormField, { label: "Client Name", children: _jsx(Input, { name: "client_name", placeholder: "Acme Corp" }) })] }), _jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [_jsx(FormField, { label: "Venture", children: _jsxs(Select, { name: "venture_id", defaultValue: "", children: [_jsx("option", { value: "", children: "None" }), ventures.map((v) => (_jsx("option", { value: v.id, children: v.name }, v.id)))] }) }), _jsx(FormField, { label: "Recorded Date", children: _jsx(Input, { name: "recorded_at", type: "date", defaultValue: today }) })] }), _jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [_jsx(FormField, { label: "Period Start", hint: "For recurring / retainers", children: _jsx(Input, { name: "period_start", type: "date" }) }), _jsx(FormField, { label: "Period End", children: _jsx(Input, { name: "period_end", type: "date" }) })] }), _jsxs("div", { className: "flex items-center gap-3 pt-2", children: [_jsx(Button, { type: "submit", children: "Log Revenue" }), _jsx(Link, { to: "/dashboard/revenue", children: _jsx(Button, { type: "button", variant: "secondary", children: "Cancel" }) })] })] })] }) })] }));
}
