import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useLoaderData, Link, useFetcher, useNavigate } from "react-router";
import { ArrowLeft, Star, Reply, Wand2, Archive, Trash2, Clock } from "lucide-react";
import { getSupabaseClient } from "~/lib/supabase.server";
import { apiFetch } from "~/lib/api";
import { EmailHtmlFrame } from "~/components/inbox/EmailHtmlFrame";
import { SnoozePicker } from "~/components/inbox/SnoozePicker";
export const meta = ({ data }) => [
    { title: `${data?.email?.subject ?? "Email"} — Inbox — Sheetz Labs OS` },
];
export async function loader({ params, request, context }) {
    const { id } = params;
    const env = context.cloudflare.env;
    const supabase = getSupabaseClient(env);
    const { data: email } = await supabase
        .from("emails")
        .select("*, email_accounts(email), relationships(id, name, company)")
        .eq("id", id)
        .eq("is_deleted", false)
        .single();
    if (!email)
        throw new Response("Not found", { status: 404 });
    let thread = [];
    if (email.thread_id) {
        const { data } = await supabase
            .from("emails")
            .select("id, subject, from_email, from_name, snippet, received_at")
            .eq("thread_id", email.thread_id)
            .eq("is_deleted", false)
            .order("received_at");
        thread = data ?? [];
    }
    // Mark as read — via the API so it writes back to Gmail (ES-1), not Supabase only.
    if (!email.is_read) {
        await apiFetch(request, env, `/email/messages/${id}/read`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ is_read: true }),
        }).catch((err) => console.error("[inbox] mark-read failed", err));
    }
    return { email, thread };
}
export async function action({ request, params, context }) {
    const { id } = params;
    const env = context.cloudflare.env;
    const formData = await request.formData();
    const intent = formData.get("intent");
    if (intent !== "archive" && intent !== "trash") {
        return Response.json({ error: "Unknown intent" }, { status: 400 });
    }
    // Route through the API bulk endpoint so the action reaches Gmail (ES-1).
    const res = await apiFetch(request, env, "/email/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: intent, email_ids: [id] }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Action failed" }));
        return Response.json(err, { status: res.status });
    }
    return Response.json({ success: true, action: intent === "archive" ? "archived" : "trashed" });
}
export default function EmailDetail() {
    const { email, thread } = useLoaderData();
    const starFetcher = useFetcher();
    const actionFetcher = useFetcher();
    const aiFetcher = useFetcher();
    const navigate = useNavigate();
    const [snoozeOpen, setSnoozeOpen] = useState(false);
    const rel = email.relationships;
    const isStarred = starFetcher.formData
        ? starFetcher.formData.get("is_starred") === "true"
        : email.is_starred;
    // Navigate to inbox after archive/trash completes
    useEffect(() => {
        if (actionFetcher.state === "idle" && actionFetcher.data) {
            const data = actionFetcher.data;
            if (data.success && (data.action === "archived" || data.action === "trashed")) {
                navigate("/dashboard/inbox");
            }
        }
    }, [actionFetcher.state, actionFetcher.data, navigate]);
    const isActioning = actionFetcher.state !== "idle";
    const bodyHtml = email.body_html;
    const bodyText = email.body_text;
    return (_jsxs("div", { className: "flex flex-1 flex-col", children: [_jsxs("div", { className: "flex items-center gap-3 border-b border-surface-2/50 px-6 py-3", children: [_jsxs(Link, { to: "/dashboard/inbox", className: "flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-300", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), "Inbox"] }), _jsxs("div", { className: "ml-auto flex items-center gap-2", children: [_jsxs(actionFetcher.Form, { method: "post", children: [_jsx("input", { type: "hidden", name: "intent", value: "archive" }), _jsx("button", { type: "submit", disabled: isActioning, className: "p-1.5 text-zinc-500 transition-colors hover:text-zinc-200 hover:bg-zinc-800 rounded disabled:opacity-50", title: "Archive", children: _jsx(Archive, { className: "h-4 w-4" }) })] }), _jsxs(actionFetcher.Form, { method: "post", children: [_jsx("input", { type: "hidden", name: "intent", value: "trash" }), _jsx("button", { type: "submit", disabled: isActioning, className: "p-1.5 text-zinc-500 transition-colors hover:text-red-400 hover:bg-zinc-800 rounded disabled:opacity-50", title: "Delete", children: _jsx(Trash2, { className: "h-4 w-4" }) })] }), _jsxs("div", { className: "relative", children: [_jsx("button", { onClick: () => setSnoozeOpen(!snoozeOpen), className: "p-1.5 text-zinc-500 transition-colors hover:text-zinc-200 hover:bg-zinc-800 rounded", title: "Snooze", children: _jsx(Clock, { className: "h-4 w-4" }) }), _jsx(SnoozePicker, { emailId: email.id, isOpen: snoozeOpen, onClose: () => setSnoozeOpen(false), onSuccess: () => navigate("/dashboard/inbox") })] }), _jsx("div", { className: "w-px h-5 bg-zinc-800" }), _jsxs(starFetcher.Form, { method: "patch", action: `/dashboard/inbox/${email.id}/star`, children: [_jsx("input", { type: "hidden", name: "is_starred", value: isStarred ? "false" : "true" }), _jsx("button", { type: "submit", className: `p-1.5 transition-colors hover:text-amber-400 ${isStarred ? "text-amber-400" : "text-zinc-600"}`, children: _jsx(Star, { className: `h-4 w-4 ${isStarred ? "fill-current" : ""}` }) })] }), _jsxs(Link, { to: `/dashboard/inbox?reply=${email.id}`, className: "flex items-center gap-1.5 rounded-lg border border-surface-2/50 px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:border-surface-3 hover:text-zinc-200", children: [_jsx(Reply, { className: "h-4 w-4" }), "Reply"] }), _jsxs(aiFetcher.Form, { method: "post", action: "/dashboard/inbox/draft-ai", children: [_jsx("input", { type: "hidden", name: "email_type", value: "response" }), _jsx("input", { type: "hidden", name: "recipient_email", value: email.from_email ?? "" }), _jsx("input", { type: "hidden", name: "recipient_name", value: email.from_name ?? "" }), _jsx("input", { type: "hidden", name: "context", value: email.subject ?? "" }), _jsx("input", { type: "hidden", name: "goal", value: "respond helpfully" }), _jsxs("button", { type: "submit", disabled: aiFetcher.state === "submitting", className: "flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50", children: [_jsx(Wand2, { className: "h-4 w-4" }), aiFetcher.state === "submitting" ? "Drafting..." : "Draft with AI"] })] })] })] }), _jsxs("div", { className: "mx-auto w-full max-w-3xl flex-1 overflow-auto p-6", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h1", { className: "mb-3 text-xl font-semibold", children: email.subject ?? "(no subject)" }), _jsxs("div", { className: "flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-500", children: [_jsxs("span", { children: [_jsx("span", { className: "text-zinc-400", children: email.from_name }), email.from_name && email.from_email && " ", email.from_email && _jsxs("span", { className: "text-zinc-600", children: ["<", email.from_email, ">"] })] }), email.received_at && (_jsx("span", { children: new Date(email.received_at).toLocaleString() }))] }), rel && (_jsxs(Link, { to: `/dashboard/relationships/${rel.id}`, className: "mt-2 inline-flex items-center gap-1 text-sm text-brand transition-colors hover:text-brand-light", children: ["Relationship: ", rel.name, rel.company && ` · ${rel.company}`] }))] }), email.ai_summary && (_jsxs("div", { className: "mb-6 rounded-lg border border-surface-2/50 bg-surface-1/40 p-4", children: [_jsx("div", { className: "mb-1 text-xs font-medium uppercase tracking-wide text-zinc-600", children: "AI Summary" }), _jsx("p", { className: "text-sm text-zinc-300", children: email.ai_summary })] })), _jsx("div", { className: "rounded-lg border border-surface-2/50 bg-surface-1/20 p-6", children: bodyHtml ? (_jsx(EmailHtmlFrame, { html: bodyHtml })) : (_jsx("pre", { className: "whitespace-pre-wrap font-sans text-sm leading-relaxed text-zinc-300", children: bodyText || email.snippet || "(empty)" })) }), aiFetcher.data && (_jsxs("div", { className: "mt-4 rounded-lg border border-brand/30 bg-brand/5 p-4", children: [_jsx("div", { className: "mb-2 text-xs font-medium uppercase tracking-wide text-brand", children: "Draft Created" }), _jsxs("p", { className: "text-sm text-zinc-400", children: ["AI draft saved.", " ", _jsx(Link, { to: `/dashboard/inbox?reply=${email.id}`, className: "text-brand hover:text-brand-light", children: "Open reply" })] })] })), thread.length > 1 && (_jsxs("div", { className: "mt-8", children: [_jsxs("h2", { className: "mb-4 text-sm font-medium text-zinc-500", children: ["Thread (", thread.length, " messages)"] }), _jsx("div", { className: "space-y-3", children: thread.map((msg) => (_jsxs(Link, { to: `/dashboard/inbox/${msg.id}`, className: `block rounded-lg border p-4 transition-colors hover:border-surface-3 ${msg.id === email.id
                                        ? "border-surface-3 bg-surface-2/30"
                                        : "border-surface-2/50 bg-surface-1/20 hover:bg-surface-1/40"}`, children: [_jsxs("div", { className: "mb-1 text-sm text-zinc-400", children: [msg.from_name || msg.from_email, msg.received_at && (_jsxs("span", { className: "ml-2 text-xs text-zinc-600", children: ["\u00B7 ", new Date(msg.received_at).toLocaleString()] }))] }), _jsx("div", { className: "truncate text-xs text-zinc-600", children: msg.snippet })] }, msg.id))) })] }))] })] }));
}
