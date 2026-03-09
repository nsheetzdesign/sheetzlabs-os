import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLoaderData, Link, useSearchParams, useNavigate } from "react-router";
import { Plus, FileText, Linkedin, Mail, Twitter, Lightbulb, BookOpen, Calendar, Newspaper } from "lucide-react";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import { EmptyState } from "~/components/ui/EmptyState";
export const meta = () => [{ title: "Content — Sheetz Labs OS" }];
const TYPES = ["all", "idea", "blog", "linkedin", "newsletter", "twitter", "thread"];
const STATUSES = ["all", "idea", "draft", "review", "scheduled", "published"];
const TYPE_ICON = {
    idea: Lightbulb,
    blog: BookOpen,
    linkedin: Linkedin,
    newsletter: Mail,
    twitter: Twitter,
    thread: Twitter,
};
const STATUS_COLORS = {
    idea: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    draft: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
    review: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    scheduled: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    published: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    archived: "bg-zinc-700/20 text-zinc-600 border-zinc-700/30",
};
export async function loader({ request, context }) {
    const supabase = getSupabaseClient(context.cloudflare.env);
    const url = new URL(request.url);
    const type = url.searchParams.get("type") || "all";
    const status = url.searchParams.get("status") || "all";
    let query = supabase
        .from("content")
        .select("id, title, type, status, excerpt, scheduled_for, word_count, parent_id, created_at, parent:parent_id(id, title)")
        .order("created_at", { ascending: false })
        .limit(100);
    if (type !== "all")
        query = query.eq("type", type);
    if (status !== "all")
        query = query.eq("status", status);
    const { data: items } = await query;
    return { items: items ?? [], filters: { type, status } };
}
export default function ContentIndex() {
    const { items, filters } = useLoaderData();
    const [, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    function setFilter(key, value) {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set(key, value);
            return next;
        });
    }
    return (_jsxs("div", { className: "flex h-full", children: [_jsxs("aside", { className: "flex w-52 shrink-0 flex-col gap-5 overflow-auto border-r border-surface-2/50 p-4", children: [_jsx("div", { children: _jsxs(Link, { to: "new", className: "flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-3 py-2 text-sm font-medium text-white hover:bg-brand-dark", children: [_jsx(Plus, { className: "h-4 w-4" }), "New"] }) }), _jsxs("nav", { className: "space-y-0.5", children: [_jsx("div", { className: "mb-1 text-xs font-semibold uppercase tracking-widest text-zinc-600", children: "Type" }), TYPES.map((t) => {
                                const Icon = TYPE_ICON[t] || FileText;
                                const active = filters.type === t;
                                return (_jsxs("button", { onClick: () => setFilter("type", t), className: `flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${active
                                        ? "bg-surface-2/60 text-white"
                                        : "text-zinc-500 hover:bg-surface-2/30 hover:text-zinc-200"}`, children: [_jsx(Icon, { className: "h-3.5 w-3.5 shrink-0" }), _jsx("span", { className: "capitalize", children: t === "all" ? "All" : t })] }, t));
                            })] }), _jsxs("nav", { className: "space-y-0.5", children: [_jsx("div", { className: "mb-1 text-xs font-semibold uppercase tracking-widest text-zinc-600", children: "Status" }), STATUSES.map((s) => {
                                const active = filters.status === s;
                                return (_jsx("button", { onClick: () => setFilter("status", s), className: `flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${active
                                        ? "bg-surface-2/60 text-white"
                                        : "text-zinc-500 hover:bg-surface-2/30 hover:text-zinc-200"}`, children: _jsx("span", { className: "capitalize", children: s === "all" ? "All statuses" : s }) }, s));
                            })] }), _jsxs("div", { className: "mt-auto space-y-0.5 border-t border-surface-2/50 pt-3", children: [_jsxs(Link, { to: "/dashboard/content/calendar", className: "flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-500 transition-colors hover:bg-surface-2/30 hover:text-zinc-200", children: [_jsx(Calendar, { className: "h-3.5 w-3.5 shrink-0" }), "Calendar"] }), _jsxs(Link, { to: "/dashboard/content/newsletter", className: "flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-500 transition-colors hover:bg-surface-2/30 hover:text-zinc-200", children: [_jsx(Newspaper, { className: "h-3.5 w-3.5 shrink-0" }), "Newsletter"] }), _jsxs(Link, { to: "/dashboard/content/templates", className: "flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-500 transition-colors hover:bg-surface-2/30 hover:text-zinc-200", children: [_jsx(FileText, { className: "h-3.5 w-3.5 shrink-0" }), "Templates"] })] })] }), _jsxs("div", { className: "flex flex-1 flex-col overflow-auto", children: [_jsx(Header, { title: "Content" }), _jsx("main", { className: "flex-1 p-6", children: items.length === 0 ? (_jsx("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 backdrop-blur-sm", children: _jsx(EmptyState, { icon: FileText, title: "No content yet", description: "Create your first piece of content or generate one with AI.", action: _jsxs(Link, { to: "new", className: "inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark", children: [_jsx(Plus, { className: "h-4 w-4" }), "New Content"] }) }) })) : (_jsx("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 backdrop-blur-sm", children: _jsx("div", { className: "divide-y divide-surface-2/30 py-1", children: items.map((item) => {
                                    const Icon = TYPE_ICON[item.type] || FileText;
                                    return (_jsxs(Link, { to: item.id, className: "flex items-center gap-4 rounded-lg px-4 py-3 transition-colors hover:bg-surface-2/30", children: [_jsx("div", { className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-2/60", children: _jsx(Icon, { className: "h-4 w-4 text-zinc-400" }) }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "truncate text-sm font-medium text-zinc-200", children: item.title }), _jsx("span", { className: `shrink-0 rounded border px-1.5 py-0.5 text-xs font-medium ${STATUS_COLORS[item.status] ?? STATUS_COLORS.draft}`, children: item.status })] }), item.excerpt && (_jsx("p", { className: "mt-0.5 truncate text-xs text-zinc-500", children: item.excerpt })), _jsxs("div", { className: "mt-0.5 flex items-center gap-3 text-xs text-zinc-600", children: [_jsx("span", { className: "capitalize", children: item.type }), item.scheduled_for && (_jsxs("span", { children: ["\uD83D\uDCC5 ", new Date(item.scheduled_for).toLocaleDateString()] })), item.parent?.title && (_jsxs("span", { children: ["\u21B3 from ", item.parent.title] })), item.word_count && _jsxs("span", { children: [item.word_count, "w"] })] })] })] }, item.id));
                                }) }) })) })] })] }));
}
