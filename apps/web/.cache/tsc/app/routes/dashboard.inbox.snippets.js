import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useLoaderData, useFetcher, Link } from "react-router";
import { Plus, Pencil, Trash2, ArrowLeft, X } from "lucide-react";
import { getSupabaseClient } from "~/lib/supabase.server";
export const meta = () => [{ title: "Snippets — Inbox — Sheetz Labs OS" }];
export async function loader({ context }) {
    const env = context.cloudflare.env;
    const supabase = getSupabaseClient(env);
    const { data: snippets } = await supabase
        .from("email_snippets")
        .select("*")
        .order("trigger");
    return { snippets: snippets ?? [] };
}
export async function action({ request, context }) {
    const env = context.cloudflare.env;
    const supabase = getSupabaseClient(env);
    const formData = await request.formData();
    const intent = formData.get("intent");
    if (intent === "delete") {
        const trigger = formData.get("trigger");
        await supabase.from("email_snippets").delete().eq("trigger", trigger);
        return Response.json({ success: true });
    }
    if (intent === "upsert") {
        const trigger = formData.get("trigger").toLowerCase().replace(/[^a-z0-9]/g, "");
        const title = formData.get("title");
        const content = formData.get("content");
        const originalTrigger = formData.get("original_trigger");
        if (originalTrigger && originalTrigger !== trigger) {
            await supabase.from("email_snippets").delete().eq("trigger", originalTrigger);
        }
        const { error } = await supabase.from("email_snippets").upsert({ trigger, title, content, updated_at: new Date().toISOString() }, { onConflict: "user_id,trigger" });
        if (error)
            return Response.json({ error: error.message }, { status: 500 });
        return Response.json({ success: true });
    }
    if (intent === "seed") {
        const { data: defaults } = await supabase
            .from("email_snippet_defaults")
            .select("trigger, title, content");
        let seeded = 0;
        for (const s of defaults ?? []) {
            const { error } = await supabase
                .from("email_snippets")
                .insert({ trigger: s.trigger, title: s.title, content: s.content });
            if (!error)
                seeded++;
        }
        return Response.json({ seeded });
    }
    return Response.json({ error: "Unknown intent" }, { status: 400 });
}
function SnippetEditModal({ snippet, onClose }) {
    const fetcher = useFetcher();
    const [trigger, setTrigger] = useState(snippet?.trigger ?? "");
    const [title, setTitle] = useState(snippet?.title ?? "");
    const [content, setContent] = useState(snippet?.content ?? "");
    const handleSubmit = (e) => {
        e.preventDefault();
        fetcher.submit({
            intent: "upsert",
            trigger,
            title: title || trigger,
            content,
            original_trigger: snippet?.trigger ?? "",
        }, { method: "post" });
        onClose();
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60", children: _jsxs("div", { className: "w-[480px] rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl", children: [_jsxs("div", { className: "flex items-center justify-between border-b border-zinc-800 px-4 py-3", children: [_jsx("h2", { className: "text-sm font-medium text-zinc-200", children: snippet ? "Edit Snippet" : "New Snippet" }), _jsx("button", { onClick: onClose, className: "text-zinc-500 hover:text-zinc-300", children: _jsx(X, { className: "h-4 w-4" }) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "p-4 space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-xs text-zinc-500", children: "Trigger (type /trigger in compose)" }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("span", { className: "text-zinc-500", children: "/" }), _jsx("input", { type: "text", value: trigger, onChange: (e) => setTrigger(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "")), placeholder: "sig", required: true, className: "flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-xs text-zinc-500", children: "Name" }), _jsx("input", { type: "text", value: title, onChange: (e) => setTitle(e.target.value), placeholder: "Signature", className: "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-xs text-zinc-500", children: "Content" }), _jsx("textarea", { value: content, onChange: (e) => setContent(e.target.value), rows: 6, required: true, placeholder: "Expanded text...", className: "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none font-mono" })] }), _jsxs("div", { className: "flex justify-end gap-2 pt-1", children: [_jsx("button", { type: "button", onClick: onClose, className: "rounded-lg px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-200", children: "Cancel" }), _jsx("button", { type: "submit", disabled: !trigger || !content, className: "rounded-lg bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50", children: "Save" })] })] })] }) }));
}
export default function SnippetsPage() {
    const { snippets } = useLoaderData();
    const fetcher = useFetcher();
    const [editing, setEditing] = useState(null); // 'new' | snippet.id
    const handleDelete = (trigger) => {
        if (!confirm("Delete this snippet?"))
            return;
        fetcher.submit({ intent: "delete", trigger }, { method: "post" });
    };
    const editingSnippet = editing === "new" ? null : snippets.find((s) => s.id === editing) ?? null;
    return (_jsxs("div", { className: "flex flex-1 flex-col", children: [_jsxs("div", { className: "flex items-center gap-3 border-b border-surface-2/50 px-6 py-3", children: [_jsxs(Link, { to: "/dashboard/inbox", className: "flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-300", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), "Inbox"] }), _jsx("h1", { className: "text-sm font-semibold text-zinc-200", children: "Email Snippets" }), _jsxs("div", { className: "ml-auto flex items-center gap-2", children: [snippets.length === 0 && (_jsxs(fetcher.Form, { method: "post", children: [_jsx("input", { type: "hidden", name: "intent", value: "seed" }), _jsx("button", { type: "submit", className: "rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-400 hover:border-zinc-500 hover:text-zinc-200", children: "Load defaults" })] })), _jsxs("button", { onClick: () => setEditing("new"), className: "flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-500", children: [_jsx(Plus, { className: "h-4 w-4" }), "New Snippet"] })] })] }), _jsxs("div", { className: "mx-auto w-full max-w-2xl p-6", children: [_jsxs("p", { className: "mb-6 text-sm text-zinc-400", children: ["Type", " ", _jsx("kbd", { className: "rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-xs text-emerald-400", children: "/trigger" }), " ", "in compose to expand snippets. Press Tab to insert."] }), snippets.length === 0 ? (_jsxs("div", { className: "rounded-xl border border-dashed border-zinc-700 p-12 text-center", children: [_jsx("p", { className: "mb-3 text-sm text-zinc-500", children: "No snippets yet." }), _jsxs(fetcher.Form, { method: "post", children: [_jsx("input", { type: "hidden", name: "intent", value: "seed" }), _jsx("button", { type: "submit", className: "text-sm text-emerald-500 hover:text-emerald-400", children: "Load default snippets \u2192" })] })] })) : (_jsx("div", { className: "space-y-2", children: snippets.map((snippet) => (_jsxs("div", { className: "rounded-xl border border-zinc-800 bg-zinc-900 p-4", children: [_jsxs("div", { className: "mb-2 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("kbd", { className: "rounded bg-zinc-800 px-2 py-1 font-mono text-sm text-emerald-400", children: ["/", snippet.trigger] }), _jsx("span", { className: "text-sm text-zinc-200", children: snippet.title })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("button", { onClick: () => setEditing(snippet.id), className: "rounded p-1.5 text-zinc-500 hover:text-zinc-200", children: _jsx(Pencil, { className: "h-4 w-4" }) }), _jsx("button", { onClick: () => handleDelete(snippet.trigger), className: "rounded p-1.5 text-zinc-500 hover:text-red-400", children: _jsx(Trash2, { className: "h-4 w-4" }) })] })] }), _jsx("pre", { className: "whitespace-pre-wrap font-sans text-sm text-zinc-500", children: snippet.content })] }, snippet.id))) }))] }), editing !== null && (_jsx(SnippetEditModal, { snippet: editingSnippet, onClose: () => setEditing(null) }))] }));
}
