import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLoaderData, Link, useFetcher, useRevalidator } from "react-router";
import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Clock, MapPin, Video, Users, ExternalLink, Zap, CheckSquare, Edit2, X, } from "lucide-react";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import { apiFetch } from "~/lib/api";
import { DEFAULT_TZ, formatDateTimeInTz, formatTimeInTz, utcIsoToLocalInput, localInputToUtcIso } from "~/lib/tz";
export const meta = ({ data }) => [
    { title: `${data?.event?.title ?? "Event"} — Calendar — Sheetz Labs OS` },
];
function readTzCookie(request) {
    const cookie = request.headers.get("cookie") ?? "";
    const m = cookie.match(/(?:^|;\s*)tz=([^;]+)/);
    if (!m)
        return DEFAULT_TZ;
    try {
        return decodeURIComponent(m[1]);
    }
    catch {
        return m[1];
    }
}
export async function loader({ params, request, context }) {
    const supabase = getSupabaseClient(context.cloudflare.env);
    const { data: event } = await supabase
        .from("calendar_events")
        .select(`
      *,
      calendar_accounts(email, color),
      tasks(id, title, status),
      knowledge:ai_prep_doc_id(id, title)
    `)
        .eq("id", params.id)
        .single();
    if (!event)
        throw new Response("Not found", { status: 404 });
    return { event, tz: readTzCookie(request) };
}
export async function action({ params, request, context }) {
    const env = context.cloudflare.env;
    const fd = await request.formData();
    const intent = fd.get("intent");
    if (intent === "prep") {
        await apiFetch(request, env, `/calendar/events/${params.id}/prep`, { method: "POST" });
    }
    if (intent === "edit") {
        // start_at/end_at already arrive as UTC ISO (converted client-side, CS-6).
        const res = await apiFetch(request, env, `/calendar/events/${params.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: fd.get("title") || undefined,
                description: fd.get("description") || undefined,
                location: fd.get("location") || undefined,
                start_at: fd.get("start_at") || undefined,
                end_at: fd.get("end_at") || undefined,
                meeting_link: fd.get("meeting_link") || undefined,
                add_google_meet: fd.get("add_google_meet") === "true",
            }),
        });
        if (!res.ok) {
            const data = (await res.json().catch(() => ({})));
            return Response.json({ ok: false, error: data.error ?? "Failed to save changes" }, { status: res.status });
        }
        return Response.json({ ok: true });
    }
    if (intent === "delete_time_block") {
        await apiFetch(request, env, `/calendar/time-blocks/${params.id}`, { method: "DELETE" });
        return new Response(null, {
            status: 302,
            headers: { Location: "/dashboard/calendar" },
        });
    }
    return null;
}
const STATUS_COLORS = {
    accepted: "bg-emerald-500",
    declined: "bg-red-500",
    tentative: "bg-amber-500",
    needsAction: "bg-zinc-500",
};
export default function CalendarEventDetail() {
    const { event, tz } = useLoaderData();
    const fetcher = useFetcher();
    const revalidator = useRevalidator();
    const [isEditing, setIsEditing] = useState(false);
    const [videoType, setVideoType] = useState("none");
    const [editError, setEditError] = useState(null);
    const editingRef = useRef(false);
    const isGenerating = fetcher.state !== "idle";
    const hasAttendees = Array.isArray(event.attendees) && event.attendees.length > 0;
    const prepPending = fetcher.formData?.get("intent") === "prep";
    const isEditSubmitting = fetcher.state !== "idle" && fetcher.formData?.get("intent") === "edit";
    // Close edit form on confirmed success only (CS-13: was a render-phase setState
    // that fired on ANY fetcher completion). Inline error otherwise.
    useEffect(() => {
        if (editingRef.current && fetcher.state === "idle" && fetcher.data) {
            editingRef.current = false;
            if (fetcher.data.ok) {
                setIsEditing(false);
                setEditError(null);
                revalidator.revalidate();
            }
            else {
                setEditError(fetcher.data.error ?? "Failed to save changes");
            }
        }
    }, [fetcher.state, fetcher.data, revalidator]);
    const handleEditSubmit = (e) => {
        e.preventDefault();
        setEditError(null);
        const fd = new FormData(e.currentTarget);
        const startLocal = fd.get("start_at");
        const endLocal = fd.get("end_at");
        if (startLocal && endLocal && new Date(endLocal) <= new Date(startLocal)) {
            setEditError("End time must be after start time");
            return;
        }
        if (startLocal)
            fd.set("start_at", localInputToUtcIso(startLocal, tz));
        if (endLocal)
            fd.set("end_at", localInputToUtcIso(endLocal, tz));
        editingRef.current = true;
        fetcher.submit(fd, { method: "post" });
    };
    return (_jsxs("div", { className: "flex flex-1 flex-col", children: [_jsx(Header, { title: "Event Detail" }), _jsx("main", { className: "flex-1 overflow-auto p-6", children: _jsxs("div", { className: "mx-auto max-w-2xl space-y-6", children: [_jsxs(Link, { to: "/dashboard/calendar", className: "inline-flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-300 transition-colors", children: [_jsx(ArrowLeft, { className: "h-3.5 w-3.5" }), "Calendar"] }), _jsx("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 px-6 py-5", children: _jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("h1", { className: "text-xl font-semibold text-zinc-100 break-words", children: event.title }), _jsxs("div", { className: "flex items-center gap-2 mt-2 text-sm text-zinc-400", children: [_jsx(Clock, { className: "h-3.5 w-3.5 shrink-0" }), _jsxs("span", { children: [formatDateTimeInTz(event.start_at, tz), " \u2014 ", formatTimeInTz(event.end_at, tz)] })] })] }), _jsxs("div", { className: "flex flex-col items-end gap-2 shrink-0", children: [event.is_time_block && (_jsx("span", { className: "px-2 py-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs rounded-md", children: "Time Block" })), event.calendar_accounts && (_jsx("span", { className: "w-3 h-3 rounded-full", style: { backgroundColor: event.calendar_accounts.color ?? "#2FE8B6" }, title: event.calendar_accounts.email })), !isEditing && (_jsxs("button", { onClick: () => setIsEditing(true), className: "flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-200 transition-colors mt-1", children: [_jsx(Edit2, { className: "h-3 w-3" }), "Edit"] }))] })] }) }), isEditing && (_jsxs("div", { className: "rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-5", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-sm font-semibold text-zinc-200", children: "Edit Event" }), _jsx("button", { onClick: () => setIsEditing(false), className: "text-zinc-500 hover:text-zinc-200 transition-colors", children: _jsx(X, { className: "h-4 w-4" }) })] }), _jsxs(fetcher.Form, { method: "post", onSubmit: handleEditSubmit, className: "space-y-4", children: [_jsx("input", { type: "hidden", name: "intent", value: "edit" }), videoType === "meet" && (_jsx("input", { type: "hidden", name: "add_google_meet", value: "true" })), _jsxs("div", { children: [_jsx("label", { className: "block text-xs text-zinc-500 mb-1", children: "Title" }), _jsx("input", { name: "title", defaultValue: event.title, className: "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs text-zinc-500 mb-1", children: "Start" }), _jsx("input", { name: "start_at", type: "datetime-local", defaultValue: utcIsoToLocalInput(event.start_at, tz), className: "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs text-zinc-500 mb-1", children: "End" }), _jsx("input", { name: "end_at", type: "datetime-local", defaultValue: utcIsoToLocalInput(event.end_at, tz), className: "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs text-zinc-500 mb-1", children: "Location" }), _jsx("input", { name: "location", defaultValue: event.location ?? "", placeholder: "Office, address, etc.", className: "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-xs text-zinc-500 mb-1.5", children: [_jsx(Video, { className: "inline h-3 w-3 mr-1" }), "Video Conferencing"] }), event.meeting_link && videoType === "none" && (_jsxs("div", { className: "mb-2 text-xs text-zinc-400 flex items-center gap-1.5", children: [_jsx(Video, { className: "h-3 w-3 text-zinc-500" }), _jsx("a", { href: event.meeting_link, target: "_blank", rel: "noopener noreferrer", className: "text-emerald-400 hover:text-emerald-300 truncate", children: event.meeting_link })] })), _jsx("div", { className: "flex gap-2 mb-2", children: ["none", "meet", "teams"].map((type) => (_jsx("button", { type: "button", onClick: () => setVideoType(type), className: `px-2.5 py-1 text-xs rounded border transition-colors ${videoType === type
                                                            ? "bg-emerald-600 border-emerald-500 text-white"
                                                            : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"}`, children: type === "none"
                                                            ? "Keep existing"
                                                            : type === "meet"
                                                                ? "Add Meet"
                                                                : "Teams / Zoom" }, type))) }), videoType === "teams" && (_jsx("input", { name: "meeting_link", defaultValue: event.meeting_link ?? "", placeholder: "Paste Teams or Zoom meeting URL", className: "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500" })), videoType === "meet" && (_jsx("p", { className: "text-xs text-zinc-500", children: "A new Google Meet link will be generated." }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs text-zinc-500 mb-1", children: "Description" }), _jsx("textarea", { name: "description", defaultValue: event.description ?? "", rows: 3, className: "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 resize-none" })] }), editError && _jsx("p", { className: "text-xs text-red-400", children: editError }), _jsxs("div", { className: "flex gap-3 pt-1", children: [_jsx("button", { type: "button", onClick: () => { setIsEditing(false); setEditError(null); }, className: "flex-1 py-2 text-sm text-zinc-400 hover:text-zinc-200 border border-zinc-700 rounded-lg transition-colors", children: "Cancel" }), _jsx("button", { type: "submit", disabled: isEditSubmitting, className: "flex-1 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg disabled:opacity-50 transition-colors", children: isEditSubmitting ? "Saving..." : "Save Changes" })] })] })] })), _jsxs("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 divide-y divide-zinc-800", children: [event.location && (_jsxs("div", { className: "flex items-start gap-3 px-5 py-4", children: [_jsx(MapPin, { className: "h-4 w-4 text-zinc-500 shrink-0 mt-0.5" }), _jsx("span", { className: "text-sm text-zinc-300", children: event.location })] })), event.meeting_link && (_jsxs("div", { className: "flex items-start gap-3 px-5 py-4", children: [_jsx(Video, { className: "h-4 w-4 text-zinc-500 shrink-0 mt-0.5" }), _jsxs("a", { href: event.meeting_link, target: "_blank", rel: "noopener noreferrer", className: "text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1", children: ["Join Meeting", _jsx(ExternalLink, { className: "h-3 w-3" })] })] })), event.description && (_jsxs("div", { className: "px-5 py-4", children: [_jsx("div", { className: "text-xs text-zinc-500 uppercase tracking-wide mb-2", children: "Description" }), _jsx("div", { className: "text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed", children: event.description })] }))] }), hasAttendees && (_jsxs("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 px-5 py-4", children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx(Users, { className: "h-4 w-4 text-zinc-500" }), _jsxs("span", { className: "text-xs text-zinc-500 uppercase tracking-wide", children: ["Attendees (", event.attendees.length, ")"] })] }), _jsx("div", { className: "space-y-2", children: event.attendees.map((attendee, i) => (_jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx("span", { className: `w-2 h-2 rounded-full shrink-0 ${STATUS_COLORS[attendee.status ?? "needsAction"] ?? "bg-zinc-500"}` }), _jsx("span", { className: "text-sm text-zinc-300", children: attendee.name || attendee.email }), attendee.name && (_jsx("span", { className: "text-xs text-zinc-600", children: attendee.email }))] }, i))) })] })), hasAttendees && (_jsx("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 px-5 py-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("div", { className: "text-sm font-medium text-zinc-200 flex items-center gap-2", children: [_jsx(Zap, { className: "h-4 w-4 text-emerald-400" }), "AI Meeting Prep"] }), _jsx("div", { className: "text-xs text-zinc-500 mt-0.5", children: "Research attendees and generate a briefing doc" })] }), event.knowledge ? (_jsxs(Link, { to: `/dashboard/knowledge/${event.knowledge.id}`, className: "text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1", children: ["View Briefing", _jsx(ExternalLink, { className: "h-3 w-3" })] })) : (_jsxs(fetcher.Form, { method: "post", children: [_jsx("input", { type: "hidden", name: "intent", value: "prep" }), _jsx("button", { type: "submit", disabled: isGenerating || event.ai_prep_generated, className: "px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors", children: prepPending || event.ai_prep_generated
                                                    ? "Generating..."
                                                    : "Generate Brief" })] }))] }) })), event.tasks && (_jsxs("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 px-5 py-4", children: [_jsx("div", { className: "text-xs text-zinc-500 uppercase tracking-wide mb-2", children: "Linked Task" }), _jsxs(Link, { to: `/dashboard/tasks/${event.tasks.id}`, className: "flex items-center gap-2 text-sm text-zinc-300 hover:text-emerald-400 transition-colors", children: [_jsx(CheckSquare, { className: "h-3.5 w-3.5 text-zinc-500" }), event.tasks.title] })] })), event.is_time_block && (_jsxs(fetcher.Form, { method: "post", children: [_jsx("input", { type: "hidden", name: "intent", value: "delete_time_block" }), _jsx("button", { type: "submit", className: "text-xs text-red-500 hover:text-red-400 transition-colors", children: "Remove time block" })] }))] }) })] }));
}
