import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLoaderData, useActionData, Form, Link, redirect, data, } from "react-router";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import { FormField } from "~/components/ui/FormField";
import { Input } from "~/components/ui/Input";
import { Select } from "~/components/ui/Select";
import { Button } from "~/components/ui/Button";
const TYPES = ["client", "partner", "investor", "advisor", "vendor", "prospect", "friend"];
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
    const email = fd.get("email")?.trim() || null;
    const company = fd.get("company")?.trim() || null;
    const role = fd.get("role")?.trim() || null;
    const type = fd.get("type") || "prospect";
    const strength = parseInt(fd.get("strength") || "50", 10);
    const last_contact = fd.get("last_contact") || null;
    const notes = fd.get("notes")?.trim() || null;
    const venture_ids = fd.getAll("venture_ids").filter(Boolean);
    const errors = {};
    if (!name)
        errors.name = "Required";
    if (Object.keys(errors).length)
        return data({ errors }, { status: 400 });
    const { data: inserted, error } = await supabase
        .from("relationships")
        .insert({
        name,
        email,
        company,
        role,
        type: type,
        strength,
        last_contact: last_contact ? new Date(last_contact).toISOString() : null,
        notes,
        venture_ids: venture_ids.length > 0 ? venture_ids : null,
    })
        .select("id")
        .single();
    if (error)
        return data({ errors: { _form: error.message } }, { status: 500 });
    return redirect(`/dashboard/relationships/${inserted.id}`);
}
export default function NewRelationship() {
    const { ventures } = useLoaderData();
    const actionData = useActionData();
    const errors = actionData?.errors ?? {};
    return (_jsxs("div", { className: "flex flex-1 flex-col", children: [_jsx(Header, { title: "New Contact" }), _jsx("main", { className: "flex-1 p-6", children: _jsxs("div", { className: "mx-auto max-w-2xl", children: [errors._form && (_jsx("div", { className: "mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400", children: errors._form })), _jsxs(Form, { method: "post", className: "space-y-5 rounded-xl border border-surface-2/50 bg-surface-1/40 p-6 backdrop-blur-sm", children: [_jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [_jsx(FormField, { label: "Name", required: true, error: errors.name, children: _jsx(Input, { name: "name", placeholder: "Alex Johnson", error: !!errors.name, autoFocus: true }) }), _jsx(FormField, { label: "Email", children: _jsx(Input, { name: "email", type: "email", placeholder: "alex@example.com" }) })] }), _jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [_jsx(FormField, { label: "Company", children: _jsx(Input, { name: "company", placeholder: "Acme Corp" }) }), _jsx(FormField, { label: "Role", children: _jsx(Input, { name: "role", placeholder: "CEO, Investor, Freelancer\u2026" }) })] }), _jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [_jsx(FormField, { label: "Type", children: _jsx(Select, { name: "type", defaultValue: "prospect", children: TYPES.map((t) => (_jsx("option", { value: t, children: t }, t))) }) }), _jsx(FormField, { label: "Last Contact", children: _jsx(Input, { name: "last_contact", type: "date" }) })] }), _jsx(FormField, { label: "Relationship Strength", hint: "0 = cold, 100 = very close", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("input", { type: "range", name: "strength", min: 0, max: 100, defaultValue: 50, className: "h-2 w-full cursor-pointer accent-brand" }), _jsx(Input, { name: "_strength_display", type: "number", min: 0, max: 100, defaultValue: 50, className: "w-16", readOnly: true })] }) }), _jsx(FormField, { label: "Notes", children: _jsx("textarea", { name: "notes", rows: 3, placeholder: "How you met, context, follow-up ideas\u2026", className: "w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand" }) }), ventures.length > 0 && (_jsx(FormField, { label: "Associated Ventures", hint: "Hold Cmd/Ctrl to select multiple", children: _jsx("select", { name: "venture_ids", multiple: true, className: "h-32 w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand", children: ventures.map((v) => (_jsx("option", { value: v.id, children: v.name }, v.id))) }) })), _jsxs("div", { className: "flex items-center gap-3 pt-2", children: [_jsx(Button, { type: "submit", children: "Create Contact" }), _jsx(Link, { to: "/dashboard/relationships", children: _jsx(Button, { type: "button", variant: "secondary", children: "Cancel" }) })] })] })] }) })] }));
}
