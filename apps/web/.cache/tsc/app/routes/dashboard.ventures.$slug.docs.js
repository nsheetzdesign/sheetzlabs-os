import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Form, useLoaderData, data } from "react-router";
import { useState } from "react";
import { getSupabaseClient } from "~/lib/supabase.server";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Select } from "~/components/ui/Select";
import { FormField } from "~/components/ui/FormField";
const DOC_TYPES = [
    { value: "claude_md", label: "CLAUDE.md", icon: "🤖", path: "CLAUDE.md" },
    { value: "skill", label: "Skill", icon: "⚡", path: ".claude/skills/" },
    { value: "hook", label: "Hook", icon: "🪝", path: ".claude/hooks/" },
    { value: "adr", label: "ADR", icon: "📝", path: "docs/decisions/" },
    { value: "runbook", label: "Runbook", icon: "📖", path: "docs/runbooks/" },
    { value: "architecture", label: "Architecture", icon: "🏗️", path: "docs/" },
];
export async function loader({ params, context }) {
    const supabase = getSupabaseClient(context.cloudflare.env);
    const { data: v } = await supabase
        .from("ventures")
        .select("id, name, tagline, slug")
        .eq("slug", params.slug)
        .single();
    if (!v)
        throw new Response("Not found", { status: 404 });
    const { data: docs } = await supabase
        .from("venture_docs")
        .select("*")
        .eq("venture_id", v.id)
        .order("type")
        .order("path");
    // Also load the SaaS template for scaffold
    const { data: template } = await supabase
        .from("stack_templates")
        .select("*")
        .eq("venture_type", "saas")
        .single();
    return {
        venture: v,
        docs: docs ?? [],
        template,
    };
}
export async function action({ request, params, context }) {
    const supabase = getSupabaseClient(context.cloudflare.env);
    const fd = await request.formData();
    const intent = fd.get("intent");
    const { data: v } = await supabase
        .from("ventures")
        .select("id, name, tagline")
        .eq("slug", params.slug)
        .single();
    if (!v)
        throw new Response("Not found", { status: 404 });
    if (intent === "delete") {
        await supabase.from("venture_docs").delete().eq("id", fd.get("id"));
        return { ok: true };
    }
    if (intent === "save") {
        const docId = fd.get("doc_id");
        const path = fd.get("path")?.trim();
        const content = fd.get("content") ?? "";
        const type = fd.get("type");
        if (!path)
            return data({ error: "Path required" }, { status: 400 });
        const { error } = await supabase.from("venture_docs").upsert({
            id: docId || undefined,
            venture_id: v.id,
            path,
            content,
            type,
            updated_at: new Date().toISOString(),
        }, { onConflict: "venture_id,path" });
        if (error)
            return data({ error: error.message }, { status: 500 });
        return { ok: true };
    }
    if (intent === "scaffold-from-template") {
        const { data: template } = await supabase
            .from("stack_templates")
            .select("*")
            .eq("venture_type", "saas")
            .single();
        if (!template?.claude_md_template)
            return { ok: false };
        const content = template.claude_md_template
            .replace(/\{\{VENTURE_NAME\}\}/g, v.name)
            .replace(/\{\{TAGLINE\}\}/g, v.tagline ?? "");
        const { error } = await supabase.from("venture_docs").upsert({
            venture_id: v.id,
            path: "CLAUDE.md",
            content,
            type: "claude_md",
            updated_at: new Date().toISOString(),
        }, { onConflict: "venture_id,path" });
        if (error)
            return data({ error: error.message }, { status: 500 });
        return { ok: true };
    }
    return { ok: true };
}
export default function VentureDocs() {
    const { venture, docs, template } = useLoaderData();
    const [editingId, setEditingId] = useState(null);
    const [newType, setNewType] = useState("skill");
    const claudeDoc = docs.find((d) => d.type === "claude_md");
    const otherDocs = docs.filter((d) => d.type !== "claude_md");
    const typeGroups = DOC_TYPES.slice(1).reduce((acc, dt) => {
        const items = otherDocs.filter((d) => d.type === dt.value);
        if (items.length)
            acc[dt.value] = items;
        return acc;
    }, {});
    const defaultPath = DOC_TYPES.find((dt) => dt.value === newType)?.path ?? "";
    return (_jsxs("div", { className: "mx-auto max-w-3xl space-y-6", children: [_jsxs("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 p-5", children: [_jsxs("div", { className: "mb-4 flex items-center justify-between", children: [_jsx("h2", { className: "text-sm font-semibold text-zinc-300", children: "\uD83E\uDD16 CLAUDE.md" }), _jsxs("div", { className: "flex gap-2", children: [!claudeDoc && template && (_jsxs(Form, { method: "post", children: [_jsx("input", { type: "hidden", name: "intent", value: "scaffold-from-template" }), _jsx(Button, { type: "submit", variant: "secondary", className: "text-xs", children: "Generate from SaaS template" })] })), _jsx(Button, { type: "button", variant: "secondary", className: "text-xs", onClick: () => setEditingId(claudeDoc ? claudeDoc.id : "new-claude-md"), children: claudeDoc ? "Edit" : "Create" })] })] }), editingId === (claudeDoc?.id ?? "new-claude-md") ? (_jsxs(Form, { method: "post", onSubmit: () => setEditingId(null), children: [_jsx("input", { type: "hidden", name: "intent", value: "save" }), _jsx("input", { type: "hidden", name: "doc_id", value: claudeDoc?.id ?? "" }), _jsx("input", { type: "hidden", name: "path", value: "CLAUDE.md" }), _jsx("input", { type: "hidden", name: "type", value: "claude_md" }), _jsx("textarea", { name: "content", rows: 20, defaultValue: claudeDoc?.content ?? "", className: "w-full rounded-lg border border-surface-2/50 bg-surface-0 px-4 py-3 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand", placeholder: `# ${venture.name}\n\n## Purpose\n${venture.tagline ?? ""}\n\n## Stack\n...` }), _jsxs("div", { className: "mt-3 flex gap-2", children: [_jsx(Button, { type: "submit", children: "Save CLAUDE.md" }), _jsx(Button, { type: "button", variant: "secondary", onClick: () => setEditingId(null), children: "Cancel" })] })] })) : claudeDoc ? (_jsx("pre", { className: "max-h-64 overflow-y-auto rounded-lg bg-surface-0 p-4 font-mono text-xs text-zinc-400", children: claudeDoc.content })) : (_jsx("p", { className: "text-sm text-zinc-600", children: "No CLAUDE.md yet. Create one or generate from the SaaS template." }))] }), editingId === "new" ? (_jsxs(Form, { method: "post", className: "rounded-xl border border-surface-2/50 bg-surface-1/40 p-5", onSubmit: () => setEditingId(null), children: [_jsx("input", { type: "hidden", name: "intent", value: "save" }), _jsx("h2", { className: "mb-4 text-sm font-semibold text-zinc-300", children: "New Document" }), _jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [_jsx(FormField, { label: "Type", children: _jsx(Select, { name: "type", value: newType, onChange: (e) => setNewType(e.target.value), children: DOC_TYPES.slice(1).map((dt) => (_jsxs("option", { value: dt.value, children: [dt.icon, " ", dt.label] }, dt.value))) }) }), _jsx(FormField, { label: "Path", children: _jsx(Input, { name: "path", defaultValue: defaultPath, placeholder: ".claude/skills/deploy.md" }) })] }), _jsx(FormField, { label: "Content", className: "mt-4", children: _jsx("textarea", { name: "content", rows: 12, className: "w-full rounded-lg border border-surface-2/50 bg-surface-0 px-4 py-3 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand", placeholder: "# Document title\n\nContent here..." }) }), _jsxs("div", { className: "mt-3 flex gap-2", children: [_jsx(Button, { type: "submit", children: "Save" }), _jsx(Button, { type: "button", variant: "secondary", onClick: () => setEditingId(null), children: "Cancel" })] })] })) : (_jsx("div", { className: "flex justify-end", children: _jsx(Button, { type: "button", variant: "secondary", onClick: () => setEditingId("new"), children: "+ Add Document" }) })), Object.entries(typeGroups).map(([type, items]) => {
                const dtMeta = DOC_TYPES.find((dt) => dt.value === type);
                return (_jsxs("div", { children: [_jsxs("h3", { className: "mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500", children: [dtMeta?.icon, " ", dtMeta?.label ?? type] }), _jsx("div", { className: "space-y-2", children: items.map((doc) => (_jsxs("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40", children: [_jsxs("div", { className: "flex items-center justify-between px-4 py-3", children: [_jsx("code", { className: "text-sm text-zinc-400", children: doc.path }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { type: "button", onClick: () => setEditingId(editingId === doc.id ? null : doc.id), className: "text-xs text-zinc-500 hover:text-zinc-300 transition-colors", children: editingId === doc.id ? "Close" : "Edit" }), _jsxs(Form, { method: "post", children: [_jsx("input", { type: "hidden", name: "intent", value: "delete" }), _jsx("input", { type: "hidden", name: "id", value: doc.id }), _jsx("button", { type: "submit", className: "text-xs text-zinc-600 hover:text-red-400 transition-colors", children: "\u2715" })] })] })] }), editingId === doc.id && (_jsxs(Form, { method: "post", className: "border-t border-surface-2/50 p-4", onSubmit: () => setEditingId(null), children: [_jsx("input", { type: "hidden", name: "intent", value: "save" }), _jsx("input", { type: "hidden", name: "doc_id", value: doc.id }), _jsx("input", { type: "hidden", name: "path", value: doc.path }), _jsx("input", { type: "hidden", name: "type", value: doc.type }), _jsx("textarea", { name: "content", rows: 12, defaultValue: doc.content ?? "", className: "w-full rounded-lg border border-surface-2/50 bg-surface-0 px-4 py-3 font-mono text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand" }), _jsxs("div", { className: "mt-3 flex gap-2", children: [_jsx(Button, { type: "submit", children: "Save" }), _jsx(Button, { type: "button", variant: "secondary", onClick: () => setEditingId(null), children: "Cancel" })] })] }))] }, doc.id))) })] }, type));
            })] }));
}
