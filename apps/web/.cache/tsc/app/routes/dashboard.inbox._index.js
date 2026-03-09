import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLoaderData, Link } from "react-router";
import { useState } from "react";
import { Inbox, PenSquare, RefreshCw, Star, Plus, X } from "lucide-react";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import { EmptyState } from "~/components/ui/EmptyState";
export const meta = () => [{ title: "Inbox — Sheetz Labs OS" }];
const CATEGORIES = [
    { id: "all", label: "All" },
    { id: "action_required", label: "Action Required", color: "text-red-400" },
    { id: "fyi", label: "FYI", color: "text-blue-400" },
    { id: "newsletter", label: "Newsletters", color: "text-amber-400" },
    { id: "automated", label: "Automated", color: "text-zinc-400" },
];
function formatDate(dateStr) {
    if (!dateStr)
        return "";
    const d = new Date(dateStr);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) {
        return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
}
export async function loader({ request, context }) {
    const env = context.cloudflare.env;
    const supabase = getSupabaseClient(env);
    const url = new URL(request.url);
    const category = url.searchParams.get("category") ?? "all";
    const unreadOnly = url.searchParams.get("unread") === "true";
    let query = supabase
        .from("emails")
        .select("id, subject, snippet, from_email, from_name, is_read, is_starred, ai_category, ai_priority, received_at, email_accounts(email)")
        .order("received_at", { ascending: false })
        .limit(50);
    if (category !== "all")
        query = query.eq("ai_category", category);
    if (unreadOnly)
        query = query.eq("is_read", false);
    const { data: emails } = await query;
    const { data: accounts } = await supabase
        .from("email_accounts")
        .select("id, email, provider, sync_enabled, last_sync_at")
        .order("email");
    const { data: aliases } = await supabase
        .from("email_aliases")
        .select("id, account_id, email, name, source")
        .order("email");
    const unreadCount = (emails ?? []).filter((e) => !e.is_read).length;
    return { emails: emails ?? [], accounts: accounts ?? [], aliases: aliases ?? [], category, unreadOnly, unreadCount };
}
const API = "https://api.sheetzlabs.com";
export default function InboxIndex() {
    const { emails, accounts, aliases, category, unreadOnly, unreadCount } = useLoaderData();
    const [addingAliasFor, setAddingAliasFor] = useState(null);
    const [aliasEmail, setAliasEmail] = useState("");
    const [aliasName, setAliasName] = useState("");
    const [syncing, setSyncing] = useState(null);
    const callApi = async (url, method = "POST") => {
        setSyncing(url);
        await fetch(url, { method });
        setSyncing(null);
        window.location.reload();
    };
    return (_jsxs("div", { className: "flex h-full flex-col", children: [_jsx(Header, { title: "Inbox" }), _jsxs("div", { className: "flex flex-1 overflow-hidden", children: [_jsxs("aside", { className: "flex w-64 flex-col border-r border-surface-2/50 p-4", children: [_jsxs(Link, { to: "/dashboard/inbox/compose", className: "mb-4 flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark", children: [_jsx(PenSquare, { className: "h-4 w-4" }), "Compose"] }), _jsx("nav", { className: "space-y-0.5", children: CATEGORIES.map((cat) => (_jsxs(Link, { to: `/dashboard/inbox?category=${cat.id}${unreadOnly ? "&unread=true" : ""}`, className: `flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${category === cat.id
                                        ? "bg-surface-2 text-zinc-100"
                                        : "text-zinc-500 hover:bg-surface-1/50 hover:text-zinc-300"}`, children: [_jsx("span", { className: cat.color ?? "", children: cat.label }), cat.id === "all" && unreadCount > 0 && (_jsx("span", { className: "rounded-full bg-brand px-1.5 py-0.5 text-xs font-medium text-white", children: unreadCount }))] }, cat.id))) }), _jsx("div", { className: "mt-3 border-t border-surface-2/50 pt-3", children: _jsx(Link, { to: `/dashboard/inbox?category=${category}&unread=${!unreadOnly}`, className: "block rounded-lg px-3 py-2 text-sm text-zinc-500 transition-colors hover:bg-surface-1/50 hover:text-zinc-300", children: unreadOnly ? "Show all" : "Unread only" }) }), _jsxs("div", { className: "mt-4 border-t border-surface-2/50 pt-4", children: [_jsx("h3", { className: "mb-2 px-3 text-xs font-medium uppercase tracking-wide text-zinc-600", children: "Accounts" }), accounts.length === 0 ? (_jsx("a", { href: "https://api.sheetzlabs.com/email/auth/gmail", className: "flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-brand transition-colors hover:text-brand-light", children: "+ Connect Gmail" })) : (_jsxs("div", { className: "space-y-2", children: [accounts.map((account) => {
                                                const accountAliases = aliases.filter((a) => a.account_id === account.id);
                                                return (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between px-3 py-1", children: [_jsx("span", { className: "truncate text-xs text-zinc-400", children: account.email }), _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx("button", { onClick: () => callApi(`${API}/email/accounts/${account.id}/sync-aliases`), title: "Sync aliases from Gmail", className: "text-zinc-600 hover:text-zinc-300", children: _jsx(RefreshCw, { className: `h-3 w-3 ${syncing?.includes("sync-aliases") ? "animate-spin" : ""}` }) }), _jsx("button", { onClick: () => callApi(`${API}/email/accounts/${account.id}/sync`), title: "Sync emails", className: "text-zinc-600 hover:text-zinc-300", children: _jsx(RefreshCw, { className: `h-3 w-3 ${syncing?.includes("/sync") && !syncing.includes("aliases") ? "animate-spin" : ""}` }) })] })] }), accountAliases.map((alias) => (_jsxs("div", { className: "flex items-center justify-between py-0.5 pl-6 pr-3", children: [_jsx("span", { className: "truncate text-xs text-zinc-600", children: alias.email }), _jsx("button", { onClick: () => callApi(`${API}/email/aliases/${alias.id}`, "DELETE"), className: "text-zinc-700 hover:text-red-400", children: _jsx(X, { className: "h-3 w-3" }) })] }, alias.id))), addingAliasFor === account.id ? (_jsxs("div", { className: "mt-1 space-y-1 px-3", children: [_jsx("input", { type: "text", placeholder: "Email address", value: aliasEmail, onChange: (e) => setAliasEmail(e.target.value), className: "w-full rounded border border-surface-2/50 bg-surface-1 px-2 py-1 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none" }), _jsx("input", { type: "text", placeholder: "Name (optional)", value: aliasName, onChange: (e) => setAliasName(e.target.value), className: "w-full rounded border border-surface-2/50 bg-surface-1 px-2 py-1 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: async () => {
                                                                                if (!aliasEmail)
                                                                                    return;
                                                                                await fetch("https://api.sheetzlabs.com/email/aliases", {
                                                                                    method: "POST",
                                                                                    headers: { "Content-Type": "application/json" },
                                                                                    body: JSON.stringify({ account_id: account.id, email: aliasEmail, name: aliasName || undefined }),
                                                                                });
                                                                                setAliasEmail("");
                                                                                setAliasName("");
                                                                                setAddingAliasFor(null);
                                                                                window.location.reload();
                                                                            }, className: "text-xs text-brand hover:text-brand-light", children: "Save" }), _jsx("button", { onClick: () => { setAddingAliasFor(null); setAliasEmail(""); setAliasName(""); }, className: "text-xs text-zinc-600 hover:text-zinc-400", children: "Cancel" })] })] })) : (_jsxs("button", { onClick: () => setAddingAliasFor(account.id), className: "flex items-center gap-1 py-0.5 pl-6 text-xs text-zinc-700 hover:text-zinc-400", children: [_jsx(Plus, { className: "h-3 w-3" }), "Add alias"] }))] }, account.id));
                                            }), _jsxs("a", { href: "https://api.sheetzlabs.com/email/auth/gmail", className: "flex items-center gap-1 px-3 py-1 text-xs text-zinc-600 hover:text-brand", children: [_jsx(Plus, { className: "h-3 w-3" }), "Connect another account"] })] }))] })] }), _jsx("main", { className: "flex-1 overflow-auto", children: emails.length === 0 ? (_jsx(EmptyState, { icon: Inbox, title: "No emails", description: accounts.length === 0
                                ? "Connect your Gmail account to sync emails."
                                : category !== "all"
                                    ? `No ${category.replace("_", " ")} emails.`
                                    : "Your inbox is empty.", action: accounts.length === 0 ? (_jsx("a", { href: "https://api.sheetzlabs.com/email/auth/gmail", className: "inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark", children: "Connect Gmail" })) : undefined })) : (_jsx("div", { className: "divide-y divide-surface-2/30", children: emails.map((email) => (_jsxs(Link, { to: `/dashboard/inbox/${email.id}`, className: `flex items-start gap-3 px-6 py-4 transition-colors hover:bg-surface-1/30 ${!email.is_read ? "bg-surface-1/20" : ""}`, children: [_jsx("div", { className: "mt-1.5 flex w-2 shrink-0 justify-center", children: !email.is_read && (_jsx("span", { className: "h-2 w-2 rounded-full bg-brand" })) }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsx("span", { className: `text-sm font-medium ${!email.is_read ? "text-zinc-100" : "text-zinc-400"}`, children: email.from_name || email.from_email }), _jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [email.ai_priority === "high" && (_jsx("span", { className: "rounded border border-red-500/30 bg-red-500/10 px-1.5 py-0.5 text-xs text-red-400", children: "High" })), email.is_starred && (_jsx(Star, { className: "h-3.5 w-3.5 fill-amber-400 text-amber-400" })), _jsx("span", { className: "text-xs text-zinc-600", children: formatDate(email.received_at) })] })] }), _jsx("div", { className: `mt-0.5 text-sm ${!email.is_read ? "text-zinc-300" : "text-zinc-500"}`, children: email.subject ?? "(no subject)" }), _jsx("div", { className: "mt-0.5 truncate text-xs text-zinc-600", children: email.snippet })] })] }, email.id))) })) })] })] }));
}
