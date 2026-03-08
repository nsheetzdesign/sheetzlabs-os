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
        .is("parent_venture_id", null)
        .order("name");
    return { parentOptions: ventures ?? [] };
}
export async function action({ request, context }) {
    const supabase = getSupabaseClient(context.cloudflare.env);
    const fd = await request.formData();
    const name = fd.get("name")?.trim();
    const rawSlug = fd.get("slug")?.trim();
    const slug = rawSlug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const domain = fd.get("domain")?.trim() || null;
    const tagline = fd.get("tagline")?.trim() || null;
    const status = fd.get("status") || "idea";
    const stage = fd.get("stage") || "pre-revenue";
    const parentId = fd.get("parent_venture_id") || null;
    const errors = {};
    if (!name)
        errors.name = "Required";
    if (!slug)
        errors.slug = "Required";
    if (Object.keys(errors).length)
        return data({ errors }, { status: 400 });
    const { error } = await supabase.from("ventures").insert({
        name,
        slug,
        domain,
        tagline,
        status: status,
        stage: stage,
        parent_venture_id: parentId,
    });
    if (error)
        return data({ errors: { _form: error.message } }, { status: 500 });
    return redirect("/dashboard/ventures");
}
export default function NewVenture() {
    const { parentOptions } = useLoaderData();
    const actionData = useActionData();
    const errors = actionData?.errors ?? {};
    return (_jsxs("div", { className: "flex flex-1 flex-col", children: [_jsx(Header, { title: "New Venture" }), _jsx("main", { className: "flex-1 p-6", children: _jsxs("div", { className: "mx-auto max-w-2xl", children: [errors._form && (_jsx("div", { className: "mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400", children: errors._form })), _jsxs(Form, { method: "post", className: "space-y-5 rounded-xl border border-surface-2/50 bg-surface-1/40 p-6 backdrop-blur-sm", children: [_jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [_jsx(FormField, { label: "Name", required: true, error: errors.name, children: _jsx(Input, { name: "name", placeholder: "Back of House Pro", error: !!errors.name, autoFocus: true }) }), _jsx(FormField, { label: "Slug", hint: "Auto-derived from name if blank", error: errors.slug, children: _jsx(Input, { name: "slug", placeholder: "bohp", error: !!errors.slug }) })] }), _jsx(FormField, { label: "Domain", hint: "Without https://", children: _jsx(Input, { name: "domain", placeholder: "backofhousepro.com" }) }), _jsx(FormField, { label: "Tagline", children: _jsx(Input, { name: "tagline", placeholder: "One-line description" }) }), _jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [_jsx(FormField, { label: "Status", children: _jsx(Select, { name: "status", defaultValue: "idea", children: ["idea", "validating", "building", "active", "maintenance", "sunset", "sold"].map((s) => (_jsx("option", { value: s, children: s }, s))) }) }), _jsx(FormField, { label: "Stage", children: _jsx(Select, { name: "stage", defaultValue: "pre-revenue", children: ["pre-revenue", "early-revenue", "growing", "profitable", "scaled"].map((s) => (_jsx("option", { value: s, children: s }, s))) }) })] }), parentOptions.length > 0 && (_jsx(FormField, { label: "Parent Venture", hint: "Optional \u2014 for sub-ventures", children: _jsxs(Select, { name: "parent_venture_id", defaultValue: "", children: [_jsx("option", { value: "", children: "None (top-level)" }), parentOptions.map((v) => (_jsx("option", { value: v.id, children: v.name }, v.id)))] }) })), _jsxs("div", { className: "flex items-center gap-3 pt-2", children: [_jsx(Button, { type: "submit", children: "Create Venture" }), _jsx(Link, { to: "/dashboard/ventures", children: _jsx(Button, { type: "button", variant: "secondary", children: "Cancel" }) })] })] })] }) })] }));
}
