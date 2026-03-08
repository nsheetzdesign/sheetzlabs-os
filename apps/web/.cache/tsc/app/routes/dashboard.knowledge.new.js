import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLoaderData, useActionData, Form, Link, redirect, data, } from "react-router";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import { FormField } from "~/components/ui/FormField";
import { Input } from "~/components/ui/Input";
import { Select } from "~/components/ui/Select";
import { Button } from "~/components/ui/Button";
const KNOWLEDGE_TYPES = ["note", "learning", "playbook", "template"];
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
    const rawSlug = fd.get("slug")?.trim();
    const slug = rawSlug ||
        title
            ?.toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
    const type = fd.get("type") || "note";
    const tagsRaw = fd.get("tags")?.trim();
    const tags = tagsRaw
        ? tagsRaw
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : null;
    const venture_id = fd.get("venture_id") || null;
    const content = fd.get("content")?.trim() || null;
    const errors = {};
    if (!title)
        errors.title = "Required";
    if (!slug)
        errors.slug = "Required";
    if (Object.keys(errors).length)
        return data({ errors }, { status: 400 });
    const { error } = await supabase.from("knowledge").insert({
        title,
        slug,
        type,
        tags,
        venture_id,
        content,
    });
    if (error)
        return data({ errors: { _form: error.message } }, { status: 500 });
    return redirect(`/dashboard/knowledge/${slug}`);
}
export default function NewKnowledge() {
    const { ventures } = useLoaderData();
    const actionData = useActionData();
    const errors = actionData?.errors ?? {};
    return (_jsxs("div", { className: "flex flex-1 flex-col", children: [_jsx(Header, { title: "New Article" }), _jsx("main", { className: "flex-1 p-6", children: _jsxs("div", { className: "mx-auto max-w-3xl", children: [errors._form && (_jsx("div", { className: "mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400", children: errors._form })), _jsxs(Form, { method: "post", className: "space-y-5 rounded-xl border border-surface-2/50 bg-surface-1/40 p-6 backdrop-blur-sm", children: [_jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [_jsx(FormField, { label: "Title", required: true, error: errors.title, children: _jsx(Input, { name: "title", placeholder: "Onboarding Playbook", error: !!errors.title, autoFocus: true }) }), _jsx(FormField, { label: "Slug", hint: "Auto-derived if blank", error: errors.slug, children: _jsx(Input, { name: "slug", placeholder: "onboarding-playbook", error: !!errors.slug }) })] }), _jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [_jsx(FormField, { label: "Type", children: _jsx(Select, { name: "type", defaultValue: "note", children: KNOWLEDGE_TYPES.map((t) => (_jsx("option", { value: t, children: t }, t))) }) }), _jsx(FormField, { label: "Venture", children: _jsxs(Select, { name: "venture_id", defaultValue: "", children: [_jsx("option", { value: "", children: "None (general)" }), ventures.map((v) => (_jsx("option", { value: v.id, children: v.name }, v.id)))] }) })] }), _jsx(FormField, { label: "Tags", hint: "Comma-separated: ops, hiring, marketing", children: _jsx(Input, { name: "tags", placeholder: "ops, onboarding, template" }) }), _jsx(FormField, { label: "Content", hint: "Markdown supported", children: _jsx("textarea", { name: "content", rows: 16, placeholder: `# Title\n\nWrite your content here. Markdown is supported.\n\n## Section\n\n- Bullet one\n- Bullet two`, className: "w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand" }) }), _jsxs("div", { className: "flex items-center gap-3 pt-2", children: [_jsx(Button, { type: "submit", children: "Create Article" }), _jsx(Link, { to: "/dashboard/knowledge", children: _jsx(Button, { type: "button", variant: "secondary", children: "Cancel" }) })] })] })] }) })] }));
}
