import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useLoaderData, Link, useFetcher, useNavigate } from "react-router";
import { useState } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getSupabaseClient } from "~/lib/supabase.server";
export const meta = ({ data }) => [
    { title: `${data?.item?.title ?? "Content"} — Sheetz Labs OS` },
];
export async function loader({ params, context }) {
    const supabase = getSupabaseClient(context.cloudflare.env);
    const { id } = params;
    const { data: item } = await supabase
        .from("content")
        .select(`
      *,
      ventures(id, name, slug),
      parent:parent_id(id, title, type),
      children:content(id, title, type, status, platform_url),
      knowledge(id, title)
    `)
        .eq("id", id)
        .single();
    return { item };
}
const STATUS_COLORS = {
    idea: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    draft: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
    review: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    scheduled: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    published: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    archived: "bg-zinc-700/20 text-zinc-600 border-zinc-700/30",
};
export default function ContentDetail() {
    const { item } = useLoaderData();
    const fetcher = useFetcher();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [editBody, setEditBody] = useState(item?.body ?? "");
    const [editTitle, setEditTitle] = useState(item?.title ?? "");
    const [repurposing, setRepurposing] = useState(false);
    if (!item) {
        return (_jsx("div", { className: "flex h-full items-center justify-center text-zinc-500", children: "Content not found." }));
    }
    async function handleSave() {
        const res = await fetch(`/api/content/${item.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: editTitle, body: editBody }),
        });
        if (res.ok) {
            setIsEditing(false);
            navigate(".", { replace: true });
        }
    }
    async function handleStatusChange(status, extra = {}) {
        await fetch(`/api/content/${item.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status, ...extra }),
        });
        navigate(".", { replace: true });
    }
    async function handleRepurpose() {
        setRepurposing(true);
        const targets = item.type === "blog"
            ? ["linkedin", "twitter", "newsletter"]
            : item.type === "linkedin"
                ? ["twitter", "thread"]
                : ["linkedin", "twitter"];
        await fetch(`/api/content/${item.id}/repurpose`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ target_types: targets }),
        });
        setRepurposing(false);
        navigate(".", { replace: true });
    }
    async function handlePublishLinkedIn() {
        await fetch(`/api/content/${item.id}/publish/linkedin`, { method: "POST" });
        navigate(".", { replace: true });
    }
    async function handleDelete() {
        if (!confirm("Delete this content?"))
            return;
        await fetch(`/api/content/${item.id}`, { method: "DELETE" });
        navigate("/dashboard/content");
    }
    const children = item.children ?? [];
    const parent = item.parent;
    return (_jsxs("div", { className: "mx-auto max-w-4xl p-6", children: [_jsxs(Link, { to: "/dashboard/content", className: "mb-4 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300", children: [_jsx(ArrowLeft, { className: "h-3.5 w-3.5" }), "Content"] }), _jsxs("div", { className: "mb-6 flex items-start justify-between gap-4", children: [_jsxs("div", { className: "min-w-0 flex-1", children: [isEditing ? (_jsx("input", { value: editTitle, onChange: (e) => setEditTitle(e.target.value), className: "w-full rounded-lg border border-surface-2 bg-surface-1 px-3 py-2 text-xl font-semibold text-zinc-100 focus:outline-none focus:ring-1 focus:ring-brand" })) : (_jsx("h1", { className: "text-2xl font-semibold", children: item.title })), _jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2 text-sm", children: [_jsx("span", { className: `rounded border px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[item.status] ?? STATUS_COLORS.draft}`, children: item.status }), _jsx("span", { className: "capitalize text-zinc-500", children: item.type }), item.word_count && (_jsxs("span", { className: "text-zinc-500", children: [item.word_count, " words \u00B7 ", item.reading_time, "m read"] })), item.scheduled_for && (_jsxs("span", { className: "text-zinc-500", children: ["\uD83D\uDCC5 ", new Date(item.scheduled_for).toLocaleDateString()] }))] })] }), _jsx("div", { className: "flex shrink-0 gap-2", children: isEditing ? (_jsxs(_Fragment, { children: [_jsx("button", { onClick: handleSave, className: "rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-dark", children: "Save" }), _jsx("button", { onClick: () => {
                                        setIsEditing(false);
                                        setEditTitle(item.title);
                                        setEditBody(item.body ?? "");
                                    }, className: "rounded-lg border border-surface-2 px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-200", children: "Cancel" })] })) : (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => setIsEditing(true), className: "rounded-lg border border-surface-2 px-3 py-1.5 text-sm text-zinc-400 hover:border-surface-3 hover:text-zinc-200", children: "Edit" }), _jsx("button", { onClick: handleDelete, className: "rounded-lg border border-surface-2 px-3 py-1.5 text-sm text-zinc-600 hover:border-red-500/30 hover:text-red-400", children: "Delete" })] })) })] }), parent && (_jsxs("div", { className: "mb-4 text-sm text-zinc-500", children: ["Repurposed from", " ", _jsx(Link, { to: `/dashboard/content/${parent.id}`, className: "text-brand hover:text-brand-dark", children: parent.title })] })), _jsx("div", { className: "mb-6 rounded-xl border border-surface-2/50 bg-surface-1/40 p-6", children: isEditing ? (_jsx("textarea", { value: editBody, onChange: (e) => setEditBody(e.target.value), rows: 20, className: "w-full bg-transparent font-mono text-sm text-zinc-200 focus:outline-none" })) : (_jsx("pre", { className: "whitespace-pre-wrap font-sans text-sm leading-relaxed text-zinc-200", children: item.body })) }), !isEditing && (_jsxs("div", { className: "mb-6 flex flex-wrap gap-3", children: [item.status === "draft" && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => handleStatusChange("review"), className: "rounded-lg bg-amber-600/80 px-4 py-2 text-sm font-medium hover:bg-amber-500", children: "Send to Review" }), _jsx("button", { onClick: () => handleStatusChange("scheduled", {
                                    scheduled_for: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                                }), className: "rounded-lg border border-surface-2 px-4 py-2 text-sm hover:border-surface-3", children: "Schedule (Tomorrow)" })] })), item.status === "review" && (_jsx("button", { onClick: () => handleStatusChange("scheduled"), className: "rounded-lg bg-blue-600/80 px-4 py-2 text-sm font-medium hover:bg-blue-500", children: "Approve & Schedule" })), ["scheduled", "review"].includes(item.status) && item.type === "linkedin" && (_jsx("button", { onClick: handlePublishLinkedIn, className: "rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark", children: "Publish to LinkedIn" })), ["scheduled", "review"].includes(item.status) && item.type === "newsletter" && (_jsx("button", { onClick: async () => {
                            await fetch(`/api/content/${item.id}/publish/newsletter`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ subject: item.title }),
                            });
                            navigate(".", { replace: true });
                        }, className: "rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark", children: "Send Newsletter" })), item.status !== "idea" && (_jsx("button", { onClick: handleRepurpose, disabled: repurposing, className: "rounded-lg border border-surface-2 px-4 py-2 text-sm hover:border-surface-3 disabled:opacity-50", children: repurposing ? "Repurposing…" : "Repurpose →" }))] })), children.length > 0 && (_jsxs("div", { className: "mb-6 border-t border-surface-2/50 pt-6", children: [_jsx("h2", { className: "mb-3 text-base font-semibold", children: "Repurposed Versions" }), _jsx("div", { className: "space-y-2", children: children.map((child) => (_jsxs(Link, { to: `/dashboard/content/${child.id}`, className: "flex items-center justify-between rounded-lg border border-surface-2/50 bg-surface-1/40 p-3 hover:border-surface-3/50", children: [_jsxs("div", { children: [_jsx("span", { className: "text-sm font-medium text-zinc-200", children: child.title }), _jsx("span", { className: "ml-2 text-xs text-zinc-500 capitalize", children: child.type })] }), _jsx("span", { className: `rounded border px-1.5 py-0.5 text-xs font-medium ${STATUS_COLORS[child.status] ?? STATUS_COLORS.draft}`, children: child.status })] }, child.id))) })] })), item.status === "published" && (_jsxs("div", { className: "border-t border-surface-2/50 pt-6", children: [_jsx("h2", { className: "mb-3 text-base font-semibold", children: "Performance" }), _jsx("div", { className: "grid grid-cols-5 gap-3", children: [
                            ["Views", item.views],
                            ["Likes", item.likes],
                            ["Comments", item.comments],
                            ["Shares", item.shares],
                            ["Clicks", item.clicks],
                        ].map(([label, val]) => (_jsxs("div", { className: "rounded-lg border border-surface-2/50 bg-surface-1/40 p-3 text-center", children: [_jsx("div", { className: "text-xl font-bold", children: val ?? 0 }), _jsx("div", { className: "text-xs text-zinc-500", children: label })] }, label))) }), item.platform_url && (_jsxs("a", { href: item.platform_url, target: "_blank", rel: "noopener noreferrer", className: "mt-3 inline-flex items-center gap-1.5 text-sm text-brand hover:text-brand-dark", children: ["View on ", item.type, _jsx(ExternalLink, { className: "h-3.5 w-3.5" })] }))] }))] }));
}
