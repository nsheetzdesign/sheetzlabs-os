import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLoaderData, useActionData, Form, Link, redirect, data, useFetcher, } from "react-router";
import { useState } from "react";
import { Pin, ExternalLink, Sparkles, Clock, ArrowLeft } from "lucide-react";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import { FormField } from "~/components/ui/FormField";
import { Input } from "~/components/ui/Input";
import { Select } from "~/components/ui/Select";
import { Button } from "~/components/ui/Button";
export const meta = ({ data }) => [
    { title: `${data?.article?.title ?? "Article"} — Sheetz Labs OS` },
];
const KNOWLEDGE_TYPES = [
    "note", "doc", "clip", "playbook", "spec",
    "research", "draft", "learning", "template",
    "meeting_prep", "daily_plan", "insight",
];
const TYPE_META = {
    doc: { icon: "📄", color: "text-sky-400 bg-sky-500/10 border-sky-500/20" },
    note: { icon: "📝", color: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20" },
    clip: { icon: "🔗", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    playbook: { icon: "📋", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
    spec: { icon: "⚙️", color: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
    research: { icon: "🔬", color: "text-teal-400 bg-teal-500/10 border-teal-500/20" },
    draft: { icon: "✏️", color: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
    learning: { icon: "🧠", color: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
    template: { icon: "📐", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    meeting_prep: { icon: "🗓", color: "text-pink-400 bg-pink-500/10 border-pink-500/20" },
    daily_plan: { icon: "📅", color: "text-green-400 bg-green-500/10 border-green-500/20" },
    insight: { icon: "💡", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
};
function getMeta(type) {
    return TYPE_META[type] ?? TYPE_META.note;
}
export async function loader({ params, context }) {
    const supabase = getSupabaseClient(context.cloudflare.env);
    const [articleRes, venturesRes] = await Promise.all([
        supabase
            .from("knowledge")
            .select("*, ventures(id, name, slug), knowledge_tags(tag_id, tags(id, name, color))")
            .eq("slug", params.slug)
            .single(),
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
    if (intent === "pin") {
        const { data: current } = await supabase
            .from("knowledge")
            .select("is_pinned")
            .eq("slug", params.slug)
            .single();
        await supabase
            .from("knowledge")
            .update({ is_pinned: !current?.is_pinned })
            .eq("slug", params.slug);
        return null;
    }
    if (intent === "summarize") {
        const { data: item } = await supabase
            .from("knowledge")
            .select("id")
            .eq("slug", params.slug)
            .single();
        if (item) {
            const apiUrl = context.cloudflare.env.INTERNAL_API_URL ??
                "https://api.sheetzlabs.com";
            const res = await fetch(`${apiUrl}/knowledge/${item.id}/summarize`, { method: "POST" });
            if (res.ok) {
                const { summary } = (await res.json());
                return { summary };
            }
        }
        return null;
    }
    const title = fd.get("title")?.trim();
    const newSlug = fd.get("slug")?.trim();
    const type = fd.get("type") || "note";
    const tagsRaw = fd.get("tags")?.trim();
    const tags = tagsRaw
        ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
        : null;
    const venture_id = fd.get("venture_id") || null;
    const content = fd.get("content")?.trim() || null;
    const source_url = fd.get("source_url")?.trim() || null;
    const errors = {};
    if (!title)
        errors.title = "Required";
    if (!newSlug)
        errors.slug = "Required";
    if (Object.keys(errors).length)
        return data({ errors }, { status: 400 });
    const wordCount = content ? content.trim().split(/\s+/).length : 0;
    const readingTime = wordCount > 0 ? Math.ceil(wordCount / 200) : null;
    const { error } = await supabase
        .from("knowledge")
        .update({
        title,
        slug: newSlug,
        type,
        tags,
        venture_id,
        content,
        source_url,
        word_count: wordCount || null,
        reading_time: readingTime,
    })
        .eq("slug", params.slug);
    if (error)
        return data({ errors: { _form: error.message } }, { status: 500 });
    return redirect(`/dashboard/knowledge/${newSlug}`);
}
/** Minimal markdown → HTML */
function renderMarkdown(md) {
    return md
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/^#### (.+)$/gm, '<h4 class="text-sm font-semibold text-zinc-300 mt-4 mb-1">$1</h4>')
        .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold text-zinc-200 mt-5 mb-2">$1</h3>')
        .replace(/^## (.+)$/gm, '<h2 class="text-lg font-semibold text-zinc-100 mt-6 mb-2">$1</h2>')
        .replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold text-zinc-100 mt-6 mb-3">$1</h1>')
        .replace(/`([^`]+)`/g, '<code class="rounded bg-surface-2/60 px-1 py-0.5 font-mono text-xs text-brand">$1</code>')
        .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-zinc-100">$1</strong>')
        .replace(/\*(.+?)\*/g, '<em class="italic text-zinc-300">$1</em>')
        .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-zinc-400 text-sm">$1</li>')
        .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal text-zinc-400 text-sm">$2</li>')
        .replace(/\n\n/g, '</p><p class="text-zinc-400 text-sm mt-3">')
        .replace(/^(?!<[h|l|p])(.+)$/gm, (_, line) => line.trim() ? `<p class="text-zinc-400 text-sm">${line}</p>` : "");
}
export default function EditKnowledge() {
    const { article, ventures } = useLoaderData();
    const actionData = useActionData();
    const errors = actionData?.errors ?? {};
    const fetcher = useFetcher();
    const [mode, setMode] = useState("edit");
    const meta = getMeta(article.type);
    const tagsString = (article.tags ?? []).join(", ");
    const knowledgeTags = article.knowledge_tags ?? [];
    const isSummarizing = fetcher.state !== "idle" && (fetcher.formData?.get("intent") === "summarize");
    const currentSummary = fetcher.data?.summary ?? article.summary;
    return (_jsxs("div", { className: "flex flex-1 flex-col", children: [_jsx(Header, { title: article.title }), _jsx("main", { className: "flex-1 p-6", children: _jsxs("div", { className: "mx-auto max-w-3xl space-y-4", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-3 rounded-xl border border-surface-2/50 bg-surface-1/40 px-5 py-3 backdrop-blur-sm", children: [_jsxs(Link, { to: "/dashboard/knowledge", className: "text-xs text-zinc-600 hover:text-zinc-400", children: [_jsx(ArrowLeft, { className: "inline h-3 w-3 mr-1" }), "All items"] }), _jsxs("span", { className: `rounded border px-2 py-0.5 text-xs font-medium ${meta.color}`, children: [meta.icon, " ", article.type] }), knowledgeTags.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-1", children: knowledgeTags.map((kt) => (_jsx("span", { className: "rounded bg-surface-2/40 px-1.5 py-0.5 text-xs text-zinc-600", style: { borderLeft: `2px solid ${kt.tags?.color ?? "#2FE8B6"}` }, children: kt.tags?.name }, kt.tag_id))) })), _jsxs("div", { className: "ml-auto flex items-center gap-2", children: [article.reading_time && (_jsxs("span", { className: "flex items-center gap-1 text-xs text-zinc-600", children: [_jsx(Clock, { className: "h-3 w-3" }), article.reading_time, "m"] })), article.is_pinned && _jsx(Pin, { className: "h-3.5 w-3.5 text-amber-400" }), article.source_url && (_jsx("a", { href: article.source_url, target: "_blank", rel: "noopener noreferrer", className: "text-zinc-600 hover:text-brand", children: _jsx(ExternalLink, { className: "h-3.5 w-3.5" }) }))] })] }), currentSummary && (_jsxs("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 px-5 py-4 backdrop-blur-sm", children: [_jsxs("div", { className: "mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-zinc-600", children: [_jsx(Sparkles, { className: "h-3 w-3" }), "AI Summary"] }), _jsx("p", { className: "text-sm text-zinc-400", children: currentSummary })] })), errors._form && (_jsx("div", { className: "rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400", children: errors._form })), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { type: "button", onClick: () => setMode("edit"), className: `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${mode === "edit" ? "bg-brand text-white" : "text-zinc-400 hover:text-zinc-200"}`, children: "Edit" }), _jsx("button", { type: "button", onClick: () => setMode("preview"), className: `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${mode === "preview" ? "bg-brand text-white" : "text-zinc-400 hover:text-zinc-200"}`, children: "Preview" }), _jsxs("div", { className: "ml-auto flex items-center gap-2", children: [_jsxs(fetcher.Form, { method: "post", children: [_jsx("input", { type: "hidden", name: "intent", value: "pin" }), _jsx("button", { type: "submit", title: article.is_pinned ? "Unpin" : "Pin", className: "rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-surface-2/40 hover:text-amber-400", children: _jsx(Pin, { className: `h-4 w-4 ${article.is_pinned ? "text-amber-400" : ""}` }) })] }), article.content && (_jsxs(fetcher.Form, { method: "post", action: `/dashboard/knowledge/${article.slug}`, children: [_jsx("input", { type: "hidden", name: "intent", value: "summarize" }), _jsxs("button", { type: "submit", disabled: isSummarizing, title: "Generate AI summary", className: "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-zinc-500 transition-colors hover:bg-surface-2/40 hover:text-brand disabled:opacity-50", children: [_jsx(Sparkles, { className: "h-3.5 w-3.5" }), isSummarizing ? "Summarizing…" : "Summarize"] })] }))] })] }), mode === "preview" ? (_jsxs("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 p-6 backdrop-blur-sm", children: [_jsx("h1", { className: "mb-4 text-xl font-bold text-zinc-100", children: article.title }), article.content ? (_jsx("div", { className: "prose-sm space-y-1", dangerouslySetInnerHTML: { __html: renderMarkdown(article.content) } })) : (_jsx("p", { className: "text-sm italic text-zinc-600", children: "No content yet." }))] })) : (_jsxs(Form, { method: "post", className: "space-y-5 rounded-xl border border-surface-2/50 bg-surface-1/40 p-6 backdrop-blur-sm", children: [_jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [_jsx(FormField, { label: "Title", required: true, error: errors.title, children: _jsx(Input, { name: "title", defaultValue: article.title, error: !!errors.title }) }), _jsx(FormField, { label: "Slug", required: true, error: errors.slug, children: _jsx(Input, { name: "slug", defaultValue: article.slug, error: !!errors.slug }) })] }), _jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [_jsx(FormField, { label: "Type", children: _jsx(Select, { name: "type", defaultValue: article.type ?? "note", children: KNOWLEDGE_TYPES.map((t) => (_jsx("option", { value: t, children: t }, t))) }) }), _jsx(FormField, { label: "Venture", children: _jsxs(Select, { name: "venture_id", defaultValue: article.venture_id ?? "", children: [_jsx("option", { value: "", children: "None (general)" }), ventures.map((v) => (_jsx("option", { value: v.id, children: v.name }, v.id)))] }) })] }), _jsx(FormField, { label: "Tags", hint: "Comma-separated", children: _jsx(Input, { name: "tags", defaultValue: tagsString }) }), _jsx(FormField, { label: "Source URL", hint: "Original URL if clipped from web", children: _jsx(Input, { name: "source_url", defaultValue: article.source_url ?? "", type: "url", placeholder: "https://example.com/article" }) }), _jsx(FormField, { label: "Content", hint: "Markdown supported", children: _jsx("textarea", { name: "content", rows: 20, defaultValue: article.content ?? "", className: "w-full rounded-lg border border-surface-2/50 bg-surface-1 px-3 py-2 font-mono text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand" }) }), _jsxs("div", { className: "flex items-center gap-3 pt-2", children: [_jsx(Button, { type: "submit", children: "Save Changes" }), _jsx(Link, { to: "/dashboard/knowledge", children: _jsx(Button, { type: "button", variant: "secondary", children: "Cancel" }) })] })] })), _jsxs(Form, { method: "post", className: "rounded-xl border border-red-500/10 bg-red-500/5 p-4", onSubmit: (e) => {
                                if (!confirm(`Delete "${article.title}"? This cannot be undone.`))
                                    e.preventDefault();
                            }, children: [_jsx("input", { type: "hidden", name: "intent", value: "delete" }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-red-400", children: "Delete Article" }), _jsx("p", { className: "text-xs text-zinc-600", children: "Permanently removes this article." })] }), _jsx(Button, { type: "submit", variant: "danger", children: "Delete" })] })] })] }) })] }));
}
