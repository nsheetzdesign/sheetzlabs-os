import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLoaderData, useActionData, Form, Link, redirect, data, } from "react-router";
import { useState } from "react";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import { FormField } from "~/components/ui/FormField";
import { Input } from "~/components/ui/Input";
import { Select } from "~/components/ui/Select";
import { Button } from "~/components/ui/Button";
const KNOWLEDGE_TYPES = ["note", "learning", "playbook", "template"];
const TYPE_META = {
    playbook: { icon: "📋", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
    learning: { icon: "🧠", color: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
    template: { icon: "📐", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    note: { icon: "📝", color: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20" },
};
export async function loader({ params, context }) {
    const supabase = getSupabaseClient(context.cloudflare.env);
    const [articleRes, venturesRes] = await Promise.all([
        supabase.from("knowledge").select("*").eq("slug", params.slug).single(),
        supabase.from("ventures").select("id, name, slug").order("name"),
    ]);
    if (!articleRes.data)
        throw new Response("Not found", { status: 404 });
    return {
        article: articleRes.data,
        ventures: venturesRes.data ?? [],
    };
}
export async function action({ request, params, context }) {
    const supabase = getSupabaseClient(context.cloudflare.env);
    const fd = await request.formData();
    const intent = fd.get("intent");
    if (intent === "delete") {
        await supabase.from("knowledge").delete().eq("slug", params.slug);
        return redirect("/dashboard/knowledge");
    }
    const title = fd.get("title")?.trim();
    const newSlug = fd.get("slug")?.trim();
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
    if (!newSlug)
        errors.slug = "Required";
    if (Object.keys(errors).length)
        return data({ errors }, { status: 400 });
    const { error } = await supabase
        .from("knowledge")
        .update({ title, slug: newSlug, type, tags, venture_id, content })
        .eq("slug", params.slug);
    if (error)
        return data({ errors: { _form: error.message } }, { status: 500 });
    // Redirect to new slug if it changed
    return redirect(`/dashboard/knowledge/${newSlug}`);
}
/** Minimal markdown → HTML: headings, bold, italic, code, bullets, paragraphs */
function renderMarkdown(md) {
    return md
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/^#### (.+)$/gm, "<h4 class=\"text-sm font-semibold text-zinc-300 mt-4 mb-1\">$1</h4>")
        .replace(/^### (.+)$/gm, "<h3 class=\"text-base font-semibold text-zinc-200 mt-5 mb-2\">$1</h3>")
        .replace(/^## (.+)$/gm, "<h2 class=\"text-lg font-semibold text-zinc-100 mt-6 mb-2\">$1</h2>")
        .replace(/^# (.+)$/gm, "<h1 class=\"text-xl font-bold text-zinc-100 mt-6 mb-3\">$1</h1>")
        .replace(/`([^`]+)`/g, "<code class=\"rounded bg-surface-2/60 px-1 py-0.5 font-mono text-xs text-brand\">$1</code>")
        .replace(/\*\*(.+?)\*\*/g, "<strong class=\"font-semibold text-zinc-100\">$1</strong>")
        .replace(/\*(.+?)\*/g, "<em class=\"italic text-zinc-300\">$1</em>")
        .replace(/^- (.+)$/gm, "<li class=\"ml-4 list-disc text-zinc-400 text-sm\">$1</li>")
        .replace(/^(\d+)\. (.+)$/gm, "<li class=\"ml-4 list-decimal text-zinc-400 text-sm\">$2</li>")
        .replace(/\n\n/g, "</p><p class=\"text-zinc-400 text-sm mt-3\">")
        .replace(/^(?!<[h|l|p])(.+)$/gm, (_, line) => line.trim() ? `<p class="text-zinc-400 text-sm">${line}</p>` : "");
}
export default function EditKnowledge() {
    const { article, ventures } = useLoaderData();
    const actionData = useActionData();
    const errors = actionData?.errors ?? {};
    const [mode, setMode] = useState("edit");
    const meta = TYPE_META[article.type] ?? TYPE_META.note;
    const tagsString = (article.tags ?? []).join(", ");
    return (_jsxs("div", { className: "flex flex-1 flex-col", children: [_jsx(Header, { title: article.title }), _jsx("main", { className: "flex-1 p-6", children: _jsxs("div", { className: "mx-auto max-w-3xl space-y-4", children: [_jsxs("div", { className: "flex items-center gap-3 rounded-xl border border-surface-2/50 bg-surface-1/40 px-5 py-3 backdrop-blur-sm", children: [_jsxs("span", { className: `rounded border px-2 py-0.5 text-xs font-medium ${meta.color}`, children: [meta.icon, " ", article.type] }), (article.tags ?? []).length > 0 && (_jsx("div", { className: "flex flex-wrap gap-1", children: (article.tags ?? []).map((tag) => (_jsxs("span", { className: "rounded bg-surface-2/40 px-1.5 py-0.5 text-xs text-zinc-600", children: ["#", tag] }, tag))) })), _jsx(Link, { to: "/dashboard/knowledge", className: "ml-auto text-xs text-zinc-600 hover:text-zinc-400", children: "\u2190 All articles" })] }), errors._form && (_jsx("div", { className: "rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400", children: errors._form })), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { type: "button", onClick: () => setMode("edit"), className: `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${mode === "edit" ? "bg-brand text-white" : "text-zinc-400 hover:text-zinc-200"}`, children: "Edit" }), _jsx("button", { type: "button", onClick: () => setMode("preview"), className: `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${mode === "preview" ? "bg-brand text-white" : "text-zinc-400 hover:text-zinc-200"}`, children: "Preview" })] }), mode === "preview" ? (
                        /* Preview pane */
                        _jsxs("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 p-6 backdrop-blur-sm", children: [_jsx("h1", { className: "mb-4 text-xl font-bold text-zinc-100", children: article.title }), article.content ? (_jsx("div", { className: "prose-sm space-y-1", dangerouslySetInnerHTML: { __html: renderMarkdown(article.content) } })) : (_jsx("p", { className: "text-sm italic text-zinc-600", children: "No content yet." }))] })) : (
                        /* Edit form */
                        _jsxs(Form, { method: "post", className: "space-y-5 rounded-xl border border-surface-2/50 bg-surface-1/40 p-6 backdrop-blur-sm", children: [_jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [_jsx(FormField, { label: "Title", required: true, error: errors.title, children: _jsx(Input, { name: "title", defaultValue: article.title, error: !!errors.title }) }), _jsx(FormField, { label: "Slug", required: true, error: errors.slug, children: _jsx(Input, { name: "slug", defaultValue: article.slug, error: !!errors.slug }) })] }), _jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [_jsx(FormField, { label: "Type", children: _jsx(Select, { name: "type", defaultValue: article.type ?? "note", children: KNOWLEDGE_TYPES.map((t) => (_jsx("option", { value: t, children: t }, t))) }) }), _jsx(FormField, { label: "Venture", children: _jsxs(Select, { name: "venture_id", defaultValue: article.venture_id ?? "", children: [_jsx("option", { value: "", children: "None (general)" }), ventures.map((v) => (_jsx("option", { value: v.id, children: v.name }, v.id)))] }) })] }), _jsx(FormField, { label: "Tags", hint: "Comma-separated", children: _jsx(Input, { name: "tags", defaultValue: tagsString }) }), _jsx(FormField, { label: "Content", hint: "Markdown supported", children: _jsx("textarea", { name: "content", rows: 20, defaultValue: article.content ?? "", className: "w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand" }) }), _jsxs("div", { className: "flex items-center gap-3 pt-2", children: [_jsx(Button, { type: "submit", children: "Save Changes" }), _jsx(Link, { to: "/dashboard/knowledge", children: _jsx(Button, { type: "button", variant: "secondary", children: "Cancel" }) })] })] })), _jsxs(Form, { method: "post", className: "rounded-xl border border-red-500/10 bg-red-500/5 p-4", onSubmit: (e) => {
                                if (!confirm(`Delete "${article.title}"? This cannot be undone.`))
                                    e.preventDefault();
                            }, children: [_jsx("input", { type: "hidden", name: "intent", value: "delete" }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-red-400", children: "Delete Article" }), _jsx("p", { className: "text-xs text-zinc-600", children: "Permanently removes this article." })] }), _jsx(Button, { type: "submit", variant: "danger", children: "Delete" })] })] })] }) })] }));
}
