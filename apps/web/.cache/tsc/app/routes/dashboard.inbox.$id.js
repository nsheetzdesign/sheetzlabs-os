import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLoaderData, Link, useFetcher } from "react-router";
import { ArrowLeft, Star, Reply, Wand2 } from "lucide-react";
import { getSupabaseClient } from "~/lib/supabase.server";
export const meta = ({ data }) => [
    { title: `${data?.email?.subject ?? "Email"} — Inbox — Sheetz Labs OS` },
];
export async function loader({ params, context }) {
    const { id } = params;
    const env = context.cloudflare.env;
    const supabase = getSupabaseClient(env);
    const { data: email } = await supabase
        .from("emails")
        .select("*, email_accounts(email), relationships(id, name, company)")
        .eq("id", id)
        .single();
    if (!email)
        throw new Response("Not found", { status: 404 });
    let thread = [];
    if (email.thread_id) {
        const { data } = await supabase
            .from("emails")
            .select("id, subject, from_email, from_name, snippet, received_at")
            .eq("thread_id", email.thread_id)
            .order("received_at");
        thread = data ?? [];
    }
    // Mark as read
    if (!email.is_read) {
        await supabase.from("emails").update({ is_read: true }).eq("id", id);
    }
    return { email, thread };
}
export default function EmailDetail() {
    const { email, thread } = useLoaderData();
    const starFetcher = useFetcher();
    const aiFetcher = useFetcher();
    const rel = email.relationships;
    const isStarred = starFetcher.formData
        ? starFetcher.formData.get("is_starred") === "true"
        : email.is_starred;
    return (_jsxs("div", { className: "flex flex-1 flex-col", children: [_jsxs("div", { className: "flex items-center gap-3 border-b border-surface-2/50 px-6 py-3", children: [_jsxs(Link, { to: "/dashboard/inbox", className: "flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-300", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), "Inbox"] }), _jsxs("div", { className: "ml-auto flex items-center gap-2", children: [_jsxs(starFetcher.Form, { method: "patch", action: `/dashboard/inbox/${email.id}/star`, children: [_jsx("input", { type: "hidden", name: "is_starred", value: isStarred ? "false" : "true" }), _jsx("button", { type: "submit", className: `p-1.5 transition-colors hover:text-amber-400 ${isStarred ? "text-amber-400" : "text-zinc-600"}`, children: _jsx(Star, { className: `h-4 w-4 ${isStarred ? "fill-current" : ""}` }) })] }), _jsxs(Link, { to: `/dashboard/inbox/compose?reply_to=${email.id}`, className: "flex items-center gap-1.5 rounded-lg border border-surface-2/50 px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:border-surface-3 hover:text-zinc-200", children: [_jsx(Reply, { className: "h-4 w-4" }), "Reply"] }), _jsxs(aiFetcher.Form, { method: "post", action: "/dashboard/inbox/draft-ai", children: [_jsx("input", { type: "hidden", name: "email_type", value: "response" }), _jsx("input", { type: "hidden", name: "recipient_email", value: email.from_email ?? "" }), _jsx("input", { type: "hidden", name: "recipient_name", value: email.from_name ?? "" }), _jsx("input", { type: "hidden", name: "context", value: email.subject ?? "" }), _jsx("input", { type: "hidden", name: "goal", value: "respond helpfully" }), _jsxs("button", { type: "submit", disabled: aiFetcher.state === "submitting", className: "flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50", children: [_jsx(Wand2, { className: "h-4 w-4" }), aiFetcher.state === "submitting" ? "Drafting..." : "Draft with AI"] })] })] })] }), _jsxs("div", { className: "mx-auto w-full max-w-3xl flex-1 overflow-auto p-6", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h1", { className: "mb-3 text-xl font-semibold", children: email.subject ?? "(no subject)" }), _jsxs("div", { className: "flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-500", children: [_jsxs("span", { children: [_jsx("span", { className: "text-zinc-400", children: email.from_name }), email.from_name && email.from_email && " ", email.from_email && _jsxs("span", { className: "text-zinc-600", children: ["<", email.from_email, ">"] })] }), email.received_at && (_jsx("span", { children: new Date(email.received_at).toLocaleString() }))] }), rel && (_jsxs(Link, { to: `/dashboard/relationships/${rel.id}`, className: "mt-2 inline-flex items-center gap-1 text-sm text-brand transition-colors hover:text-brand-light", children: ["Relationship: ", rel.name, rel.company && ` · ${rel.company}`] }))] }), email.ai_summary && (_jsxs("div", { className: "mb-6 rounded-lg border border-surface-2/50 bg-surface-1/40 p-4", children: [_jsx("div", { className: "mb-1 text-xs font-medium uppercase tracking-wide text-zinc-600", children: "AI Summary" }), _jsx("p", { className: "text-sm text-zinc-300", children: email.ai_summary })] })), _jsx("div", { className: "rounded-lg border border-surface-2/50 bg-surface-1/20 p-6", children: _jsx("pre", { className: "whitespace-pre-wrap font-sans text-sm leading-relaxed text-zinc-300", children: email.body_text || email.snippet || "(empty)" }) }), aiFetcher.data && (_jsxs("div", { className: "mt-4 rounded-lg border border-brand/30 bg-brand/5 p-4", children: [_jsx("div", { className: "mb-2 text-xs font-medium uppercase tracking-wide text-brand", children: "Draft Created" }), _jsxs("p", { className: "text-sm text-zinc-400", children: ["AI draft saved.", " ", _jsx(Link, { to: "/dashboard/inbox/compose", className: "text-brand hover:text-brand-light", children: "View drafts" })] })] })), thread.length > 1 && (_jsxs("div", { className: "mt-8", children: [_jsxs("h2", { className: "mb-4 text-sm font-medium text-zinc-500", children: ["Thread (", thread.length, " messages)"] }), _jsx("div", { className: "space-y-3", children: thread.map((msg) => (_jsxs(Link, { to: `/dashboard/inbox/${msg.id}`, className: `block rounded-lg border p-4 transition-colors hover:border-surface-3 ${msg.id === email.id
                                        ? "border-surface-3 bg-surface-2/30"
                                        : "border-surface-2/50 bg-surface-1/20 hover:bg-surface-1/40"}`, children: [_jsxs("div", { className: "mb-1 text-sm text-zinc-400", children: [msg.from_name || msg.from_email, msg.received_at && (_jsxs("span", { className: "ml-2 text-xs text-zinc-600", children: ["\u00B7 ", new Date(msg.received_at).toLocaleString()] }))] }), _jsx("div", { className: "truncate text-xs text-zinc-600", children: msg.snippet })] }, msg.id))) })] }))] })] }));
}
