import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLoaderData, useFetcher, Link } from "react-router";
import { useState } from "react";
import { Plus, Copy, ExternalLink, Pencil, Trash2, Check, Clock, X } from "lucide-react";
import { apiFetch } from "~/lib/api";
export const meta = () => [{ title: "Booking Links — Sheetz Labs OS" }];
const DEFAULT_AVAILABILITY = {
    timezone: "America/Chicago",
    days: {
        monday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
        tuesday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
        wednesday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
        thursday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
        friday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
        saturday: { enabled: false, slots: [] },
        sunday: { enabled: false, slots: [] },
    },
    buffer_before_minutes: 0,
    buffer_after_minutes: 15,
    minimum_notice_hours: 24,
    date_range_days: 14,
};
export async function loader({ request, context }) {
    const env = context.cloudflare.env;
    const [linksRes, accountsRes] = await Promise.all([
        apiFetch(request, env, `/booking/links`),
        apiFetch(request, env, `/calendar/accounts`),
    ]);
    const linksData = (await linksRes.json());
    const accountsData = (await accountsRes.json());
    return {
        links: linksData.links ?? [],
        accounts: accountsData.accounts ?? [],
        appUrl: env.APP_URL ?? "https://app.sheetzlabs.com",
    };
}
export async function action({ request, context }) {
    const env = context.cloudflare.env;
    const fd = await request.formData();
    const intent = fd.get("intent");
    if (intent === "create") {
        await apiFetch(request, env, `/booking/links`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                calendar_account_id: fd.get("calendar_account_id"),
                slug: fd.get("slug"),
                title: fd.get("title"),
                description: fd.get("description") || undefined,
                duration_minutes: parseInt(fd.get("duration_minutes"), 10),
                availability_rules: DEFAULT_AVAILABILITY,
            }),
        });
    }
    if (intent === "toggle") {
        await apiFetch(request, env, `/booking/links/${fd.get("id")}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ is_active: fd.get("is_active") === "true" }),
        });
    }
    if (intent === "delete") {
        await apiFetch(request, env, `/booking/links/${fd.get("id")}`, { method: "DELETE" });
    }
    return null;
}
// ── Create Modal ─────────────────────────────────────────────────────────────
function CreateModal({ accounts, onClose }) {
    const fetcher = useFetcher();
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm", onClick: onClose, children: _jsxs("div", { className: "w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-xl p-6 shadow-xl", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between mb-5", children: [_jsx("h2", { className: "text-base font-semibold text-zinc-100", children: "New Booking Link" }), _jsx("button", { onClick: onClose, className: "text-zinc-500 hover:text-zinc-200", children: _jsx(X, { className: "w-4 h-4" }) })] }), _jsxs(fetcher.Form, { method: "post", onSubmit: () => setTimeout(onClose, 100), className: "space-y-4", children: [_jsx("input", { type: "hidden", name: "intent", value: "create" }), accounts.length > 1 && (_jsxs("div", { children: [_jsx("label", { className: "block text-xs text-zinc-500 mb-1", children: "Calendar Account" }), _jsx("select", { name: "calendar_account_id", className: "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500", children: accounts.map((a) => (_jsx("option", { value: a.id, children: a.display_name || a.email }, a.id))) })] })), accounts.length === 1 && (_jsx("input", { type: "hidden", name: "calendar_account_id", value: accounts[0].id })), _jsxs("div", { children: [_jsx("label", { className: "block text-xs text-zinc-500 mb-1", children: "Title *" }), _jsx("input", { name: "title", required: true, autoFocus: true, placeholder: "30 Minute Meeting", className: "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs text-zinc-500 mb-1", children: "URL Slug *" }), _jsxs("div", { className: "flex items-center", children: [_jsx("span", { className: "px-3 py-2 bg-zinc-800/50 border border-zinc-700 border-r-0 rounded-l-lg text-xs text-zinc-500", children: "sheetzlabs.com/book/" }), _jsx("input", { name: "slug", required: true, placeholder: "30min", className: "flex-1 bg-zinc-800 border border-zinc-700 rounded-r-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs text-zinc-500 mb-1", children: "Duration" }), _jsx("select", { name: "duration_minutes", defaultValue: "30", className: "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500", children: [15, 30, 45, 60, 90].map((m) => (_jsxs("option", { value: m, children: [m, " minutes"] }, m))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs text-zinc-500 mb-1", children: "Description (optional)" }), _jsx("textarea", { name: "description", rows: 2, placeholder: "What this meeting is about", className: "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 resize-none" })] }), _jsxs("div", { className: "flex gap-3 pt-1", children: [_jsx("button", { type: "button", onClick: onClose, className: "flex-1 py-2 text-sm text-zinc-400 hover:text-zinc-200 border border-zinc-700 rounded-lg", children: "Cancel" }), _jsx("button", { type: "submit", disabled: fetcher.state !== "idle", className: "flex-1 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg disabled:opacity-50", children: fetcher.state !== "idle" ? "Creating…" : "Create Link" })] })] })] }) }));
}
// ── Main Page ─────────────────────────────────────────────────────────────────
export default function BookingLinksPage() {
    const { links, accounts, appUrl } = useLoaderData();
    const bookHost = appUrl.replace(/^https?:\/\//, "");
    const fetcher = useFetcher();
    const [copiedId, setCopiedId] = useState(null);
    const [showCreate, setShowCreate] = useState(false);
    function copyLink(slug, id) {
        navigator.clipboard.writeText(`${appUrl}/book/${slug}`);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    }
    return (_jsxs("div", { className: "p-6 max-w-3xl", children: [showCreate && accounts.length > 0 && (_jsx(CreateModal, { accounts: accounts, onClose: () => setShowCreate(false) })), _jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-lg font-semibold text-zinc-100", children: "Booking Links" }), _jsx("p", { className: "text-xs text-zinc-500 mt-0.5", children: "Share a link so people can book time on your calendar" })] }), accounts.length === 0 ? (_jsx(Link, { to: "/dashboard/calendar", className: "flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-400 border border-zinc-700 rounded-lg hover:border-zinc-500", children: "Connect Calendar First" })) : (_jsxs("button", { onClick: () => setShowCreate(true), className: "flex items-center gap-1.5 px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors", children: [_jsx(Plus, { className: "w-3.5 h-3.5" }), " New Link"] }))] }), links.length === 0 ? (_jsxs("div", { className: "text-center py-16 border border-zinc-800 rounded-xl", children: [_jsx(Clock, { className: "w-8 h-8 text-zinc-600 mx-auto mb-3" }), _jsx("p", { className: "text-zinc-400 mb-1", children: "No booking links yet" }), _jsx("p", { className: "text-xs text-zinc-600 mb-4", children: "Create a link so others can schedule time with you" }), accounts.length > 0 && (_jsx("button", { onClick: () => setShowCreate(true), className: "text-emerald-400 hover:text-emerald-300 text-sm", children: "Create your first booking link \u2192" }))] })) : (_jsx("div", { className: "space-y-3", children: links.map((link) => (_jsx("div", { className: "bg-zinc-900 border border-zinc-800 rounded-xl p-4", children: _jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { className: "min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 mb-0.5", children: [_jsx("h3", { className: "text-sm font-medium text-zinc-100", children: link.title }), !link.is_active && (_jsx("span", { className: "px-1.5 py-0.5 text-[10px] bg-zinc-800 text-zinc-500 rounded", children: "Inactive" }))] }), _jsxs("p", { className: "text-xs text-zinc-500", children: [_jsxs("span", { className: "text-zinc-400", children: [link.duration_minutes, " min"] }), " · ", bookHost, "/book/", link.slug] }), link.description && (_jsx("p", { className: "text-xs text-zinc-600 mt-1 truncate", children: link.description }))] }), _jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [_jsx("button", { onClick: () => copyLink(link.slug, link.id), className: "p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors", title: "Copy link", children: copiedId === link.id ? _jsx(Check, { className: "w-3.5 h-3.5 text-emerald-500" }) : _jsx(Copy, { className: "w-3.5 h-3.5" }) }), _jsx("a", { href: `/book/${link.slug}`, target: "_blank", rel: "noopener noreferrer", className: "p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors", title: "Preview", children: _jsx(ExternalLink, { className: "w-3.5 h-3.5" }) }), _jsxs(fetcher.Form, { method: "post", children: [_jsx("input", { type: "hidden", name: "intent", value: "toggle" }), _jsx("input", { type: "hidden", name: "id", value: link.id }), _jsx("input", { type: "hidden", name: "is_active", value: String(!link.is_active) }), _jsx("button", { type: "submit", className: "p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors", title: link.is_active ? "Deactivate" : "Activate", children: _jsx(Pencil, { className: "w-3.5 h-3.5" }) })] }), _jsxs(fetcher.Form, { method: "post", children: [_jsx("input", { type: "hidden", name: "intent", value: "delete" }), _jsx("input", { type: "hidden", name: "id", value: link.id }), _jsx("button", { type: "submit", className: "p-1.5 text-zinc-600 hover:text-red-400 hover:bg-zinc-800 rounded transition-colors", title: "Delete", onClick: (e) => { if (!confirm("Delete this booking link?"))
                                                    e.preventDefault(); }, children: _jsx(Trash2, { className: "w-3.5 h-3.5" }) })] })] })] }) }, link.id))) }))] }));
}
