import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLoaderData, useFetcher, data } from "react-router";
import { useState } from "react";
import { Rss, Plus, Trash2, RefreshCw, BookmarkPlus, Check, ExternalLink } from "lucide-react";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import { EmptyState } from "~/components/ui/EmptyState";
import { Button } from "~/components/ui/Button";
export const meta = () => [{ title: "RSS Feeds — Sheetz Labs OS" }];
export async function loader({ context }) {
    const supabase = getSupabaseClient(context.cloudflare.env);
    const [feedsRes, unreadRes] = await Promise.all([
        supabase.from("feed_sources").select("*").order("name"),
        supabase
            .from("feed_items")
            .select("*, feed_sources(name, category)")
            .eq("is_read", false)
            .order("published_at", { ascending: false })
            .limit(100),
    ]);
    return {
        feeds: feedsRes.data ?? [],
        unreadItems: unreadRes.data ?? [],
    };
}
export async function action({ request, context }) {
    const supabase = getSupabaseClient(context.cloudflare.env);
    const fd = await request.formData();
    const intent = fd.get("intent");
    const apiUrl = context.cloudflare.env.INTERNAL_API_URL ??
        "https://api.sheetzlabs.com";
    if (intent === "add_feed") {
        const url = fd.get("url")?.trim();
        const name = fd.get("name")?.trim() || new URL(url).hostname;
        const category = fd.get("category")?.trim() || null;
        if (!url)
            return data({ error: "URL required" }, { status: 400 });
        const res = await fetch(`${apiUrl}/knowledge/feeds`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url, name, category }),
        });
        const result = (await res.json());
        return { feed: result.feed };
    }
    if (intent === "delete_feed") {
        const id = fd.get("id");
        await fetch(`${apiUrl}/knowledge/feeds/${id}`, { method: "DELETE" });
        return { ok: true };
    }
    if (intent === "fetch_feed") {
        const id = fd.get("id");
        const res = await fetch(`${apiUrl}/knowledge/feeds/${id}/fetch`, { method: "POST" });
        const result = (await res.json());
        return { added: result.added };
    }
    if (intent === "mark_read") {
        const id = fd.get("id");
        await supabase.from("feed_items").update({ is_read: true }).eq("id", id);
        return { ok: true };
    }
    if (intent === "save_item") {
        const id = fd.get("id");
        const res = await fetch(`${apiUrl}/knowledge/feeds/items/${id}/save`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "clip" }),
        });
        const result = (await res.json());
        return { item: result.item };
    }
    return { ok: false };
}
const CATEGORIES = ["ai", "saas", "indie", "church_tech", "news", "tech", "design", "other"];
export default function Feeds() {
    const { feeds, unreadItems } = useLoaderData();
    const addFetcher = useFetcher();
    const [newUrl, setNewUrl] = useState("");
    const [newName, setNewName] = useState("");
    const [newCategory, setNewCategory] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);
    function handleAddFeed() {
        if (!newUrl.trim())
            return;
        addFetcher.submit({ intent: "add_feed", url: newUrl, name: newName, category: newCategory }, { method: "post" });
        setNewUrl("");
        setNewName("");
        setNewCategory("");
        setShowAddForm(false);
    }
    return (_jsxs("div", { className: "flex flex-1 flex-col", children: [_jsx(Header, { title: "RSS Feeds" }), _jsx("main", { className: "flex-1 p-6", children: _jsxs("div", { className: "mx-auto max-w-3xl space-y-6", children: [_jsxs("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 p-4 backdrop-blur-sm", children: [_jsxs("div", { className: "mb-3 flex items-center justify-between", children: [_jsxs("h2", { className: "text-sm font-semibold text-zinc-300", children: ["Subscribed Feeds (", feeds.length, ")"] }), _jsxs(Button, { type: "button", variant: "secondary", onClick: () => setShowAddForm(!showAddForm), children: [_jsx(Plus, { className: "mr-1.5 h-3.5 w-3.5" }), "Add Feed"] })] }), showAddForm && (_jsxs("div", { className: "mb-4 space-y-2 rounded-lg border border-surface-2/30 bg-surface-1/60 p-3", children: [_jsx("input", { type: "url", placeholder: "https://example.com/feed.xml", value: newUrl, onChange: (e) => setNewUrl(e.target.value), className: "w-full rounded border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", placeholder: "Name (optional)", value: newName, onChange: (e) => setNewName(e.target.value), className: "flex-1 rounded border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand" }), _jsxs("select", { value: newCategory, onChange: (e) => setNewCategory(e.target.value), className: "rounded border border-surface-2/50 bg-surface-1 px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-brand", children: [_jsx("option", { value: "", children: "Category" }), CATEGORIES.map((c) => (_jsx("option", { value: c, children: c }, c)))] })] }), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx(Button, { type: "button", variant: "secondary", onClick: () => setShowAddForm(false), children: "Cancel" }), _jsx(Button, { type: "button", onClick: handleAddFeed, disabled: !newUrl.trim() || addFetcher.state !== "idle", children: "Subscribe" })] })] })), feeds.length === 0 ? (_jsx("p", { className: "py-4 text-center text-sm text-zinc-600", children: "No feeds yet. Add one above." })) : (_jsx("div", { className: "divide-y divide-surface-2/30", children: feeds.map((feed) => (_jsx(FeedRow, { feed: feed }, feed.id))) }))] }), _jsxs("div", { children: [_jsxs("h2", { className: "mb-3 text-sm font-semibold text-zinc-300", children: ["Unread (", unreadItems.length, ")"] }), unreadItems.length === 0 ? (_jsx("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 backdrop-blur-sm", children: _jsx(EmptyState, { icon: Rss, title: "All caught up", description: "No unread feed items. Fetch your feeds to get new content." }) })) : (_jsx("div", { className: "space-y-2", children: unreadItems.map((item) => (_jsx(FeedItemRow, { item: item }, item.id))) }))] })] }) })] }));
}
function FeedRow({ feed }) {
    const fetcher = useFetcher();
    const isFetching = fetcher.state !== "idle" && fetcher.formData?.get("intent") === "fetch_feed";
    const isDeleting = fetcher.state !== "idle" && fetcher.formData?.get("intent") === "delete_feed";
    const added = fetcher.data?.added;
    if (isDeleting)
        return null;
    return (_jsxs("div", { className: "flex items-center gap-3 py-3", children: [_jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("p", { className: "truncate text-sm font-medium text-zinc-200", children: feed.name }), _jsx("p", { className: "truncate text-xs text-zinc-600", children: feed.url }), _jsxs("div", { className: "mt-0.5 flex items-center gap-2", children: [feed.category && (_jsx("span", { className: "rounded bg-surface-2/40 px-1.5 py-0.5 text-xs text-zinc-600", children: feed.category })), feed.last_fetched_at && (_jsxs("span", { className: "text-xs text-zinc-700", children: ["Last: ", new Date(feed.last_fetched_at).toLocaleDateString()] })), added !== undefined && (_jsxs("span", { className: "text-xs text-brand", children: ["+", added, " new"] }))] })] }), _jsxs("div", { className: "flex shrink-0 items-center gap-1", children: [_jsx("button", { onClick: () => fetcher.submit({ intent: "fetch_feed", id: feed.id }, { method: "post" }), disabled: isFetching, title: "Fetch new items", className: "rounded-lg p-1.5 text-zinc-600 transition-colors hover:bg-surface-2/40 hover:text-zinc-300 disabled:opacity-50", children: _jsx(RefreshCw, { className: `h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}` }) }), _jsx("button", { onClick: () => fetcher.submit({ intent: "delete_feed", id: feed.id }, { method: "post" }), title: "Remove feed", className: "rounded-lg p-1.5 text-zinc-600 transition-colors hover:bg-red-500/10 hover:text-red-400", children: _jsx(Trash2, { className: "h-3.5 w-3.5" }) })] })] }));
}
function FeedItemRow({ item }) {
    const fetcher = useFetcher();
    const isSaving = fetcher.state !== "idle" && fetcher.formData?.get("intent") === "save_item";
    const isMarkingRead = fetcher.state !== "idle" && fetcher.formData?.get("intent") === "mark_read";
    const saved = fetcher.data?.item;
    if (isMarkingRead && fetcher.state === "loading")
        return null;
    return (_jsxs("div", { className: "flex items-start gap-3 rounded-xl border border-surface-2/50 bg-surface-1/40 p-3 backdrop-blur-sm", children: [_jsxs("div", { className: "min-w-0 flex-1", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [item.url ? (_jsx("a", { href: item.url, target: "_blank", rel: "noopener noreferrer", className: "line-clamp-1 text-sm font-medium text-zinc-200 hover:text-brand", children: item.title })) : (_jsx("span", { className: "line-clamp-1 text-sm font-medium text-zinc-200", children: item.title })), item.url && _jsx(ExternalLink, { className: "h-3 w-3 shrink-0 text-zinc-700" })] }), _jsxs("div", { className: "mt-0.5 flex items-center gap-2 text-xs text-zinc-600", children: [item.feed_sources?.name && _jsx("span", { children: item.feed_sources.name }), item.feed_sources?.category && (_jsx("span", { className: "rounded bg-surface-2/40 px-1 py-0.5", children: item.feed_sources.category })), item.published_at && (_jsx("span", { children: new Date(item.published_at).toLocaleDateString() }))] })] }), _jsxs("div", { className: "flex shrink-0 items-center gap-1", children: [saved ? (_jsxs("span", { className: "flex items-center gap-1 text-xs text-brand", children: [_jsx(Check, { className: "h-3 w-3" }), " Saved"] })) : (_jsxs("button", { onClick: () => fetcher.submit({ intent: "save_item", id: item.id }, { method: "post" }), disabled: isSaving, title: "Save to knowledge base", className: "flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-zinc-500 transition-colors hover:bg-surface-2/40 hover:text-brand disabled:opacity-50", children: [_jsx(BookmarkPlus, { className: "h-3.5 w-3.5" }), isSaving ? "Saving…" : "Save"] })), _jsx("button", { onClick: () => fetcher.submit({ intent: "mark_read", id: item.id }, { method: "post" }), title: "Mark as read", className: "rounded-lg p-1 text-zinc-600 transition-colors hover:bg-surface-2/40 hover:text-zinc-300", children: _jsx(Check, { className: "h-3.5 w-3.5" }) })] })] }));
}
