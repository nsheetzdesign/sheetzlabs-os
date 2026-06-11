import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useLoaderData, useFetcher, Link } from "react-router";
import { Plus, Pencil, Trash2, ArrowLeft, X } from "lucide-react";
import { getSupabaseClient } from "~/lib/supabase.server";
export const meta = () => [{ title: "Templates — Inbox — Sheetz Labs OS" }];
export async function loader({ context }) {
    const env = context.cloudflare.env;
    const supabase = getSupabaseClient(env);
    const { data: templates } = await supabase
        .from("email_templates")
        .select("*")
        .order("name");
    return { templates: templates ?? [] };
}
export async function action({ request, context }) {
    const env = context.cloudflare.env;
    const supabase = getSupabaseClient(env);
    const formData = await request.formData();
    const intent = formData.get("intent");
    if (intent === "create") {
        const name = formData.get("name");
        const subject = formData.get("subject");
        const body = formData.get("body");
        const { error } = await supabase
            .from("email_templates")
            .insert({ name, subject: subject || null, body });
        if (error)
            return Response.json({ error: error.message }, { status: 500 });
        return Response.json({ success: true });
    }
    if (intent === "update") {
        const id = formData.get("id");
        const name = formData.get("name");
        const subject = formData.get("subject");
        const body = formData.get("body");
        const { error } = await supabase
            .from("email_templates")
            .update({ name, subject: subject || null, body, updated_at: new Date().toISOString() })
            .eq("id", id);
        if (error)
            return Response.json({ error: error.message }, { status: 500 });
        return Response.json({ success: true });
    }
    if (intent === "delete") {
        const id = formData.get("id");
        await supabase.from("email_templates").delete().eq("id", id);
        return Response.json({ success: true });
    }
    return Response.json({ error: "Unknown intent" }, { status: 400 });
}
function TemplateEditModal({ template, onClose }) {
    const fetcher = useFetcher();
    const [name, setName] = useState(template?.name ?? "");
    const [subject, setSubject] = useState(template?.subject ?? "");
    const [body, setBody] = useState(template?.body ?? "");
    const handleSubmit = (e) => {
        e.preventDefault();
        fetcher.submit({
            intent: template ? "update" : "create",
            id: template?.id ?? "",
            name,
            subject,
            body,
        }, { method: "post" });
        onClose();
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60", children: _jsxs("div", { className: "w-[560px] rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl", children: [_jsxs("div", { className: "flex items-center justify-between border-b border-zinc-800 px-4 py-3", children: [_jsx("h2", { className: "text-sm font-medium text-zinc-200", children: template ? "Edit Template" : "New Template" }), _jsx("button", { onClick: onClose, className: "text-zinc-500 hover:text-zinc-300", children: _jsx(X, { className: "h-4 w-4" }) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "p-4 space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-xs text-zinc-500", children: "Template Name" }), _jsx("input", { type: "text", value: name, onChange: (e) => setName(e.target.value), placeholder: "Cold outreach", required: true, className: "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-xs text-zinc-500", children: "Subject (optional)" }), _jsx("input", { type: "text", value: subject, onChange: (e) => setSubject(e.target.value), placeholder: "Leave blank to not pre-fill subject", className: "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-xs text-zinc-500", children: "Body" }), _jsx("textarea", { value: body, onChange: (e) => setBody(e.target.value), rows: 10, required: true, placeholder: "Email body...", className: "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none" })] }), _jsxs("div", { className: "flex justify-end gap-2 pt-1", children: [_jsx("button", { type: "button", onClick: onClose, className: "rounded-lg px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-200", children: "Cancel" }), _jsx("button", { type: "submit", disabled: !name || !body, className: "rounded-lg bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50", children: "Save" })] })] })] }) }));
}
export default function TemplatesPage() {
    const { templates } = useLoaderData();
    const fetcher = useFetcher();
    const [editing, setEditing] = useState(null);
    const handleDelete = (id) => {
        if (!confirm("Delete this template?"))
            return;
        fetcher.submit({ intent: "delete", id }, { method: "post" });
    };
    const editingTemplate = editing === "new"
        ? null
        : (templates.find((t) => t.id === editing) ?? null);
    return (_jsxs("div", { className: "flex flex-1 flex-col", children: [_jsxs("div", { className: "flex items-center gap-3 border-b border-surface-2/50 px-6 py-3", children: [_jsxs(Link, { to: "/dashboard/inbox", className: "flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-300", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), "Inbox"] }), _jsx("h1", { className: "text-sm font-semibold text-zinc-200", children: "Email Templates" }), _jsx("div", { className: "ml-auto", children: _jsxs("button", { onClick: () => setEditing("new"), className: "flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-500", children: [_jsx(Plus, { className: "h-4 w-4" }), "New Template"] }) })] }), _jsxs("div", { className: "mx-auto w-full max-w-2xl p-6", children: [_jsx("p", { className: "mb-6 text-sm text-zinc-400", children: "Use the \"Use template\" option in compose to populate a new email with a template." }), templates.length === 0 ? (_jsxs("div", { className: "rounded-xl border border-dashed border-zinc-700 p-12 text-center", children: [_jsx("p", { className: "mb-3 text-sm text-zinc-500", children: "No templates yet." }), _jsx("button", { onClick: () => setEditing("new"), className: "text-sm text-emerald-500 hover:text-emerald-400", children: "Create your first template \u2192" })] })) : (_jsx("div", { className: "space-y-3", children: templates.map((template) => (_jsxs("div", { className: "rounded-xl border border-zinc-800 bg-zinc-900 p-4", children: [_jsxs("div", { className: "mb-2 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium text-zinc-200", children: template.name }), template.subject && (_jsxs("div", { className: "mt-0.5 text-xs text-zinc-500", children: ["Subject: ", template.subject] }))] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("button", { onClick: () => setEditing(template.id), className: "rounded p-1.5 text-zinc-500 hover:text-zinc-200", children: _jsx(Pencil, { className: "h-4 w-4" }) }), _jsx("button", { onClick: () => handleDelete(template.id), className: "rounded p-1.5 text-zinc-500 hover:text-red-400", children: _jsx(Trash2, { className: "h-4 w-4" }) })] })] }), _jsx("pre", { className: "line-clamp-3 whitespace-pre-wrap font-sans text-sm text-zinc-500", children: template.body })] }, template.id))) }))] }), editing !== null && (_jsx(TemplateEditModal, { template: editingTemplate, onClose: () => setEditing(null) }))] }));
}
