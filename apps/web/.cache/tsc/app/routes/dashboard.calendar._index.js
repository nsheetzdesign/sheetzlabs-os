import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useLoaderData, Link, useFetcher } from "react-router";
import { useState, useEffect, useRef } from "react";
import { RefreshCw, Plus, X, Eye, EyeOff, Video, Clock, MapPin, Users, ExternalLink, Zap, CheckSquare, Edit2, } from "lucide-react";
import { getSupabaseClient } from "~/lib/supabase.server";
export const meta = () => [{ title: "Calendar — Sheetz Labs OS" }];
// ── Constants ────────────────────────────────────────────────────────────────
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const START_HOUR = 4; // 4 am
const HOUR_HEIGHT = 56; // px per hour
const VISIBLE_HOURS = 21; // 4 am → midnight (hour indices 4..24)
const HOURS = Array.from({ length: VISIBLE_HOURS }, (_, i) => i + START_HOUR);
const COLOR_SWATCHES = [
    "#ef4444", "#f97316", "#f59e0b", "#22c55e", "#06b6d4",
    "#3b82f6", "#8b5cf6", "#ec4899", "#2FE8B6", "#6b7280",
];
const STATUS_COLORS = {
    accepted: "bg-emerald-500",
    declined: "bg-red-500",
    tentative: "bg-amber-500",
    needsAction: "bg-zinc-500",
};
// ── Helpers ──────────────────────────────────────────────────────────────────
function formatHour(hour) {
    if (hour === 0 || hour === 24)
        return "12am";
    if (hour === 12)
        return "12pm";
    return hour > 12 ? `${hour - 12}pm` : `${hour}am`;
}
function formatDateTime(iso) {
    return new Date(iso).toLocaleString(undefined, {
        weekday: "short", month: "short", day: "numeric",
        hour: "numeric", minute: "2-digit",
    });
}
function formatTime(iso) {
    return new Date(iso).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}
function getWeekStart(date) {
    const d = new Date(date);
    d.setDate(d.getDate() - d.getDay());
    d.setHours(0, 0, 0, 0);
    return d;
}
function toLocalDateTimeInput(iso) {
    const d = new Date(iso);
    const p = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}
function getEventsForDay(dayIndex, weekStart, events) {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + dayIndex);
    return events.filter((e) => {
        if (e.all_day)
            return false;
        const s = new Date(e.start_at);
        return s.getFullYear() === day.getFullYear()
            && s.getMonth() === day.getMonth()
            && s.getDate() === day.getDate();
    });
}
function eventPosition(e) {
    const s = new Date(e.start_at);
    const end = new Date(e.end_at);
    const startFrac = Math.max(0, s.getHours() - START_HOUR + s.getMinutes() / 60);
    const endFrac = Math.min(VISIBLE_HOURS, end.getHours() - START_HOUR + end.getMinutes() / 60);
    return { top: startFrac * HOUR_HEIGHT, height: Math.max(22, (endFrac - startFrac) * HOUR_HEIGHT) };
}
// ── Loader ───────────────────────────────────────────────────────────────────
export async function loader({ request, context }) {
    const supabase = getSupabaseClient(context.cloudflare.env);
    const apiUrl = context.cloudflare.env.INTERNAL_API_URL ??
        "https://api.sheetzlabs.com";
    const url = new URL(request.url);
    const view = url.searchParams.get("view") || "week";
    const weekOffset = parseInt(url.searchParams.get("offset") || "0", 10);
    const now = new Date();
    now.setDate(now.getDate() + weekOffset * 7);
    let start, end;
    if (view === "day") {
        start = new Date(now);
        start.setHours(0, 0, 0, 0);
        end = new Date(now);
        end.setHours(23, 59, 59, 999);
    }
    else {
        start = getWeekStart(now);
        end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
    }
    const [eventsRes, accountsRes, tasksRes] = await Promise.all([
        supabase
            .from("calendar_events")
            .select("id, title, start_at, end_at, is_time_block, all_day, account_id, task_id, google_calendar_id")
            .gte("start_at", start.toISOString())
            .lte("start_at", end.toISOString())
            .order("start_at"),
        supabase.from("calendar_accounts").select("id, email, color, sync_enabled, last_sync_at").order("email"),
        supabase.from("tasks").select("id, title, due_date, priority, status").in("status", ["todo", "in_progress"]).order("due_date", { nullsFirst: false }),
    ]);
    const { data: blockedTasks } = await supabase
        .from("calendar_events").select("task_id").eq("is_time_block", true).not("task_id", "is", null);
    const blockedIds = new Set((blockedTasks ?? []).map((e) => e.task_id));
    const unscheduled = (tasksRes.data ?? []).filter((t) => !blockedIds.has(t.id));
    // Fetch sub-calendars for each account (DB-backed, synced from Google)
    const subCalendars = await Promise.all((accountsRes.data ?? []).map(async (account) => {
        try {
            const res = await fetch(`${apiUrl}/calendar/accounts/${account.id}/calendars`);
            const json = (await res.json());
            return { accountId: account.id, calendars: json.calendars ?? [] };
        }
        catch {
            return { accountId: account.id, calendars: [] };
        }
    }));
    return {
        events: eventsRes.data ?? [],
        accounts: accountsRes.data ?? [],
        tasks: unscheduled,
        subCalendars,
        view,
        weekOffset,
        weekStart: start.toISOString(),
    };
}
// ── Action ───────────────────────────────────────────────────────────────────
export async function action({ request, context }) {
    const apiUrl = context.cloudflare.env.INTERNAL_API_URL ??
        "https://api.sheetzlabs.com";
    const fd = await request.formData();
    const intent = fd.get("intent");
    if (intent === "sync") {
        await fetch(`${apiUrl}/calendar/accounts/${fd.get("account_id")}/sync`, { method: "POST" });
    }
    if (intent === "create_time_block") {
        await fetch(`${apiUrl}/calendar/time-blocks`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                task_id: fd.get("task_id"), account_id: fd.get("account_id"),
                start_at: fd.get("start_at"), end_at: fd.get("end_at"),
            }),
        });
    }
    if (intent === "create_event") {
        const attendees = (fd.get("attendees") || "")
            .split(",").map((e) => e.trim()).filter(Boolean).map((email) => ({ email }));
        await fetch(`${apiUrl}/calendar/events`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                account_id: fd.get("account_id"),
                title: fd.get("title"),
                description: fd.get("description") || undefined,
                location: fd.get("location") || undefined,
                start_at: new Date(fd.get("start_at")).toISOString(),
                end_at: new Date(fd.get("end_at")).toISOString(),
                attendees,
                add_google_meet: fd.get("add_google_meet") === "true",
                meeting_link: fd.get("meeting_link") || undefined,
            }),
        });
    }
    // Delete time block called from the event modal on the index page
    if (intent === "delete_time_block") {
        const eventId = fd.get("event_id");
        await fetch(`${apiUrl}/calendar/time-blocks/${eventId}`, { method: "DELETE" });
    }
    return null;
}
// ── New Event Modal ───────────────────────────────────────────────────────────
function NewEventModal({ accounts, defaultStart, defaultEnd, onClose, }) {
    const fetcher = useFetcher();
    const [videoType, setVideoType] = useState("none");
    useEffect(() => {
        const h = (e) => { if (e.key === "Escape")
            onClose(); };
        document.addEventListener("keydown", h);
        return () => document.removeEventListener("keydown", h);
    }, [onClose]);
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm", onClick: onClose, children: _jsxs("div", { className: "w-full max-w-md rounded-xl border border-zinc-700 bg-zinc-900 p-6 shadow-xl", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between mb-5", children: [_jsx("h2", { className: "text-base font-semibold text-zinc-100", children: "New Event" }), _jsx("button", { onClick: onClose, className: "text-zinc-500 hover:text-zinc-200 transition-colors", children: _jsx(X, { className: "h-4 w-4" }) })] }), _jsxs(fetcher.Form, { method: "post", onSubmit: () => setTimeout(onClose, 100), className: "space-y-4", children: [_jsx("input", { type: "hidden", name: "intent", value: "create_event" }), videoType === "meet" && _jsx("input", { type: "hidden", name: "add_google_meet", value: "true" }), accounts.length > 1 ? (_jsxs("div", { children: [_jsx("label", { className: "block text-xs text-zinc-500 mb-1", children: "Calendar Account" }), _jsx("select", { name: "account_id", className: "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500", children: accounts.map((a) => _jsx("option", { value: a.id, children: a.email }, a.id)) })] })) : (_jsx("input", { type: "hidden", name: "account_id", value: accounts[0]?.id })), _jsxs("div", { children: [_jsx("label", { className: "block text-xs text-zinc-500 mb-1", children: "Title *" }), _jsx("input", { name: "title", required: true, autoFocus: true, placeholder: "Event title", className: "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs text-zinc-500 mb-1", children: "Start" }), _jsx("input", { name: "start_at", type: "datetime-local", defaultValue: defaultStart, required: true, className: "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs text-zinc-500 mb-1", children: "End" }), _jsx("input", { name: "end_at", type: "datetime-local", defaultValue: defaultEnd, required: true, className: "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs text-zinc-500 mb-1", children: "Location" }), _jsx("input", { name: "location", placeholder: "Office, address, etc.", className: "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs text-zinc-500 mb-1.5", children: "Video Conferencing" }), _jsx("div", { className: "flex gap-2 mb-2", children: ["none", "meet", "teams"].map((t) => (_jsx("button", { type: "button", onClick: () => setVideoType(t), className: `px-2.5 py-1 text-xs rounded border transition-colors ${videoType === t ? "bg-emerald-600 border-emerald-500 text-white" : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"}`, children: t === "none" ? "None" : t === "meet" ? "Google Meet" : "Teams / Zoom" }, t))) }), videoType === "teams" && (_jsx("input", { name: "meeting_link", placeholder: "Paste Teams or Zoom URL", className: "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500" })), videoType === "meet" && _jsx("p", { className: "text-xs text-zinc-500", children: "Meet link generated automatically." })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs text-zinc-500 mb-1", children: "Description" }), _jsx("textarea", { name: "description", rows: 2, placeholder: "Agenda, notes...", className: "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 resize-none" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-xs text-zinc-500 mb-1", children: ["Attendees ", _jsx("span", { className: "text-zinc-600", children: "(comma-separated emails)" })] }), _jsx("input", { name: "attendees", placeholder: "john@example.com, jane@example.com", className: "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500" })] }), _jsxs("div", { className: "flex gap-3 pt-1", children: [_jsx("button", { type: "button", onClick: onClose, className: "flex-1 py-2 text-sm text-zinc-400 hover:text-zinc-200 border border-zinc-700 rounded-lg transition-colors", children: "Cancel" }), _jsx("button", { type: "submit", disabled: fetcher.state !== "idle", className: "flex-1 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg disabled:opacity-50 transition-colors", children: fetcher.state !== "idle" ? "Creating..." : "Create Event" })] })] })] }) }));
}
// ── Event Detail Modal ────────────────────────────────────────────────────────
function EventDetailModal({ event, onClose }) {
    const detailFetcher = useFetcher();
    const editFetcher = useFetcher();
    const actionFetcher = useFetcher();
    const [isEditing, setIsEditing] = useState(false);
    const [videoType, setVideoType] = useState("none");
    const didLoad = useRef(false);
    useEffect(() => {
        if (!didLoad.current) {
            didLoad.current = true;
            detailFetcher.load(`/dashboard/calendar/${event.id}`);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => {
        const h = (e) => { if (e.key === "Escape")
            onClose(); };
        document.addEventListener("keydown", h);
        return () => document.removeEventListener("keydown", h);
    }, [onClose]);
    // Close edit form after successful edit
    const prevEditState = useRef(editFetcher.state);
    useEffect(() => {
        if (prevEditState.current !== "idle" && editFetcher.state === "idle") {
            setIsEditing(false);
            setVideoType("none");
            detailFetcher.load(`/dashboard/calendar/${event.id}`);
        }
        prevEditState.current = editFetcher.state;
    }, [editFetcher.state]); // eslint-disable-line react-hooks/exhaustive-deps
    const full = detailFetcher.data?.event;
    const isLoading = detailFetcher.state === "loading";
    const hasAttendees = Array.isArray(full?.attendees) && full.attendees.length > 0;
    const actionUrl = `/dashboard/calendar/${event.id}`;
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm", onClick: onClose, children: _jsxs("div", { className: "w-full max-w-lg max-h-[85vh] flex flex-col rounded-xl border border-zinc-700 bg-zinc-900 shadow-xl overflow-hidden", onClick: (e) => e.stopPropagation(), children: [_jsx("div", { className: "px-6 pt-5 pb-4 border-b border-zinc-800 shrink-0", children: _jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("h2", { className: "text-base font-semibold text-zinc-100 break-words", children: event.title }), _jsxs("div", { className: "flex items-center gap-2 mt-1 text-xs text-zinc-400", children: [_jsx(Clock, { className: "h-3 w-3 shrink-0" }), _jsxs("span", { children: [formatDateTime(event.start_at), " \u2014 ", formatTime(event.end_at)] })] })] }), _jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [event.is_time_block && (_jsx("span", { className: "px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs rounded-md", children: "Time Block" })), !isEditing && full && (_jsx("button", { onClick: () => setIsEditing(true), className: "p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors", title: "Edit", children: _jsx(Edit2, { className: "h-3.5 w-3.5" }) })), _jsx("button", { onClick: onClose, className: "p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors", children: _jsx(X, { className: "h-4 w-4" }) })] })] }) }), _jsx("div", { className: "flex-1 overflow-y-auto", children: isLoading && !full ? (_jsx("div", { className: "flex items-center justify-center py-10 text-xs text-zinc-500", children: "Loading\u2026" })) : full ? (_jsxs("div", { className: "px-6 py-5 space-y-4", children: [isEditing && (_jsxs(editFetcher.Form, { method: "post", action: actionUrl, className: "space-y-3", children: [_jsx("input", { type: "hidden", name: "intent", value: "edit" }), videoType === "meet" && _jsx("input", { type: "hidden", name: "add_google_meet", value: "true" }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs text-zinc-500 mb-1", children: "Title" }), _jsx("input", { name: "title", defaultValue: full.title, className: "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs text-zinc-500 mb-1", children: "Start" }), _jsx("input", { name: "start_at", type: "datetime-local", defaultValue: toLocalDateTimeInput(full.start_at), className: "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs text-zinc-500 mb-1", children: "End" }), _jsx("input", { name: "end_at", type: "datetime-local", defaultValue: toLocalDateTimeInput(full.end_at), className: "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs text-zinc-500 mb-1", children: "Location" }), _jsx("input", { name: "location", defaultValue: full.location ?? "", placeholder: "Location", className: "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs text-zinc-500 mb-1.5", children: "Video" }), _jsx("div", { className: "flex gap-2 mb-1.5", children: ["none", "meet", "teams"].map((t) => (_jsx("button", { type: "button", onClick: () => setVideoType(t), className: `px-2 py-1 text-xs rounded border transition-colors ${videoType === t ? "bg-emerald-600 border-emerald-500 text-white" : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"}`, children: t === "none" ? "Keep" : t === "meet" ? "Google Meet" : "Teams/Zoom" }, t))) }), videoType === "teams" && (_jsx("input", { name: "meeting_link", defaultValue: full.meeting_link ?? "", placeholder: "Paste meeting URL", className: "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500" }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs text-zinc-500 mb-1", children: "Description" }), _jsx("textarea", { name: "description", defaultValue: full.description ?? "", rows: 2, className: "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500 resize-none" })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { type: "button", onClick: () => setIsEditing(false), className: "flex-1 py-2 text-sm text-zinc-400 hover:text-zinc-200 border border-zinc-700 rounded-lg transition-colors", children: "Cancel" }), _jsx("button", { type: "submit", disabled: editFetcher.state !== "idle", className: "flex-1 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg disabled:opacity-50 transition-colors", children: editFetcher.state !== "idle" ? "Saving…" : "Save Changes" })] })] })), !isEditing && (_jsxs(_Fragment, { children: [full.location && (_jsxs("div", { className: "flex items-start gap-3", children: [_jsx(MapPin, { className: "h-4 w-4 text-zinc-500 shrink-0 mt-0.5" }), _jsx("span", { className: "text-sm text-zinc-300", children: full.location })] })), full.meeting_link && (_jsxs("div", { className: "flex items-start gap-3", children: [_jsx(Video, { className: "h-4 w-4 text-zinc-500 shrink-0 mt-0.5" }), _jsxs("a", { href: full.meeting_link, target: "_blank", rel: "noopener noreferrer", className: "text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1", children: ["Join Meeting ", _jsx(ExternalLink, { className: "h-3 w-3" })] })] })), full.description && (_jsxs("div", { children: [_jsx("div", { className: "text-xs text-zinc-500 uppercase tracking-wide mb-1.5", children: "Description" }), _jsx("div", { className: "text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed", children: full.description })] })), hasAttendees && (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(Users, { className: "h-3.5 w-3.5 text-zinc-500" }), _jsxs("span", { className: "text-xs text-zinc-500 uppercase tracking-wide", children: ["Attendees (", full.attendees.length, ")"] })] }), _jsx("div", { className: "space-y-1.5", children: full.attendees.map((a, i) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: `w-2 h-2 rounded-full shrink-0 ${STATUS_COLORS[a.status ?? "needsAction"] ?? "bg-zinc-500"}` }), _jsx("span", { className: "text-sm text-zinc-300", children: a.name || a.email }), a.name && _jsx("span", { className: "text-xs text-zinc-600", children: a.email })] }, i))) })] })), hasAttendees && (_jsx("div", { className: "border border-zinc-800 rounded-lg px-4 py-3", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("div", { className: "text-sm font-medium text-zinc-200 flex items-center gap-2", children: [_jsx(Zap, { className: "h-3.5 w-3.5 text-emerald-400" }), "AI Meeting Prep"] }), _jsx("div", { className: "text-xs text-zinc-500 mt-0.5", children: "Research attendees & generate briefing" })] }), full.knowledge ? (_jsxs(Link, { to: `/dashboard/knowledge/${full.knowledge.id}`, onClick: onClose, className: "text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1", children: ["View ", _jsx(ExternalLink, { className: "h-3 w-3" })] })) : (_jsxs(actionFetcher.Form, { method: "post", action: actionUrl, children: [_jsx("input", { type: "hidden", name: "intent", value: "prep" }), _jsx("button", { type: "submit", disabled: actionFetcher.state !== "idle" || full.ai_prep_generated, className: "px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded-md disabled:opacity-50 transition-colors", children: full.ai_prep_generated ? "Generating…" : "Generate Brief" })] }))] }) })), full.tasks && (_jsxs("div", { children: [_jsx("div", { className: "text-xs text-zinc-500 uppercase tracking-wide mb-1.5", children: "Linked Task" }), _jsxs(Link, { to: `/dashboard/tasks/${full.tasks.id}`, onClick: onClose, className: "flex items-center gap-2 text-sm text-zinc-300 hover:text-emerald-400 transition-colors", children: [_jsx(CheckSquare, { className: "h-3.5 w-3.5 text-zinc-500" }), full.tasks.title] })] })), full.is_time_block && (_jsxs(actionFetcher.Form, { method: "post", onSubmit: onClose, children: [_jsx("input", { type: "hidden", name: "intent", value: "delete_time_block" }), _jsx("input", { type: "hidden", name: "event_id", value: event.id }), _jsx("button", { type: "submit", className: "text-xs text-red-500 hover:text-red-400 transition-colors", children: "Remove time block" })] }))] }))] })) : null })] }) }));
}
// ── Main Calendar Component ───────────────────────────────────────────────────
export default function Calendar() {
    const { events, accounts, tasks, subCalendars, view, weekOffset, weekStart } = useLoaderData();
    const fetcher = useFetcher();
    const [draggedTask, setDraggedTask] = useState(null);
    const [newEventModal, setNewEventModal] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    // Sub-calendar visibility + color overrides (local state)
    const [hiddenSubCals, setHiddenSubCals] = useState(new Set());
    const [subCalColors, setSubCalColors] = useState({});
    const [colorPickerFor, setColorPickerFor] = useState(null);
    const weekStartDate = new Date(weekStart);
    // Look up DB sub-cal by Google calendar ID (external_id)
    function findSubCal(googleCalId, accountId) {
        if (!googleCalId)
            return undefined;
        const entry = subCalendars.find((s) => s.accountId === accountId);
        return entry?.calendars.find((c) => c.external_id === googleCalId);
    }
    // Build sub-cal color (user override first, then DB color, then account color)
    function getSubCalColor(googleCalId, accountId) {
        const sub = findSubCal(googleCalId, accountId);
        if (sub)
            return subCalColors[sub.id] ?? sub.color;
        const account = accounts.find((a) => a.id === accountId);
        return account?.color ?? "#2FE8B6";
    }
    // Filter events by hidden sub-cals (hiddenSubCals stores DB UUIDs)
    const visibleEvents = events.filter((e) => {
        const sub = findSubCal(e.google_calendar_id, e.account_id);
        if (sub && hiddenSubCals.has(sub.id))
            return false;
        return true;
    });
    function toggleSubCal(subCalId) {
        setHiddenSubCals((prev) => {
            const next = new Set(prev);
            if (next.has(subCalId))
                next.delete(subCalId);
            else
                next.add(subCalId);
            return next;
        });
    }
    function getEventChipStyle(event) {
        const { top, height } = eventPosition(event);
        const color = getSubCalColor(event.google_calendar_id, event.account_id);
        return {
            position: "absolute",
            top, height, left: 2, right: 2,
            backgroundColor: `${color}22`,
            borderLeft: `3px solid ${color}aa`,
            zIndex: 2,
        };
    }
    function handleDrop(e, dayIndex, hour) {
        e.preventDefault();
        if (!draggedTask || accounts.length === 0)
            return;
        const startDate = new Date(weekStartDate);
        startDate.setDate(weekStartDate.getDate() + dayIndex);
        startDate.setHours(hour, 0, 0, 0);
        const endDate = new Date(startDate);
        endDate.setHours(hour + 1);
        const fd = new FormData();
        fd.set("intent", "create_time_block");
        fd.set("task_id", draggedTask.id);
        fd.set("account_id", accounts[0].id);
        fd.set("start_at", startDate.toISOString());
        fd.set("end_at", endDate.toISOString());
        fetcher.submit(fd, { method: "post" });
        setDraggedTask(null);
    }
    function handleCellClick(dayIndex, hour) {
        if (draggedTask || accounts.length === 0)
            return;
        const startDate = new Date(weekStartDate);
        startDate.setDate(weekStartDate.getDate() + dayIndex);
        startDate.setHours(hour, 0, 0, 0);
        const endDate = new Date(startDate);
        endDate.setHours(hour + 1);
        setNewEventModal({
            start: toLocalDateTimeInput(startDate.toISOString()),
            end: toLocalDateTimeInput(endDate.toISOString()),
        });
    }
    function openNewEventDefault() {
        const now = new Date();
        now.setMinutes(0, 0, 0);
        now.setHours(now.getHours() + 1);
        const end = new Date(now);
        end.setHours(now.getHours() + 1);
        setNewEventModal({ start: toLocalDateTimeInput(now.toISOString()), end: toLocalDateTimeInput(end.toISOString()) });
    }
    const prevOffset = weekOffset - 1;
    const nextOffset = weekOffset + 1;
    return (_jsxs("div", { className: "flex h-full overflow-hidden", onClick: () => setColorPickerFor(null), children: [newEventModal && accounts.length > 0 && (_jsx(NewEventModal, { accounts: accounts, defaultStart: newEventModal.start, defaultEnd: newEventModal.end, onClose: () => setNewEventModal(null) })), selectedEvent && (_jsx(EventDetailModal, { event: selectedEvent, onClose: () => setSelectedEvent(null) })), _jsxs("aside", { className: "w-56 shrink-0 border-r border-zinc-800 flex flex-col overflow-hidden", children: [_jsxs("div", { className: "p-4 border-b border-zinc-800 shrink-0", children: [_jsx("h2", { className: "text-xs font-semibold text-zinc-300 mb-0.5", children: "Unscheduled Tasks" }), _jsx("p", { className: "text-xs text-zinc-500", children: "Drag onto calendar to block time" })] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-3 space-y-1.5 min-h-0", children: [tasks.length === 0 && _jsx("p", { className: "text-xs text-zinc-500 italic", children: "All tasks scheduled" }), tasks.map((task) => (_jsxs("div", { draggable: true, onDragStart: () => setDraggedTask({ id: task.id, title: task.title }), onDragEnd: () => setDraggedTask(null), className: "p-2 bg-zinc-900 border border-zinc-800 rounded cursor-grab hover:border-zinc-600 transition-colors select-none", children: [_jsx("div", { className: "text-xs font-medium truncate text-zinc-200", children: task.title }), task.due_date && (_jsxs("div", { className: "text-xs text-zinc-500 mt-0.5", children: ["Due ", new Date(task.due_date).toLocaleDateString(undefined, { month: "short", day: "numeric" })] }))] }, task.id)))] }), _jsxs("div", { className: "p-3 border-t border-zinc-800 shrink-0", children: [_jsx("div", { className: "text-xs text-zinc-500 uppercase tracking-wide mb-2", children: "Calendars" }), accounts.length === 0 ? (_jsxs("a", { href: "https://api.sheetzlabs.com/calendar/auth/google", className: "flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300", children: [_jsx(Plus, { className: "h-3 w-3" }), "Connect Google Calendar"] })) : (_jsxs("div", { className: "space-y-3", children: [accounts.map((account) => {
                                        const entry = subCalendars.find((s) => s.accountId === account.id);
                                        const cals = entry?.calendars ?? [];
                                        return (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-1.5 mb-1", children: [_jsx("span", { className: "text-xs font-medium text-zinc-400 truncate flex-1", children: account.email.split("@")[0] }), _jsxs(fetcher.Form, { method: "post", children: [_jsx("input", { type: "hidden", name: "intent", value: "sync" }), _jsx("input", { type: "hidden", name: "account_id", value: account.id }), _jsx("button", { type: "submit", title: "Sync", className: "text-zinc-600 hover:text-zinc-300 transition-colors", children: _jsx(RefreshCw, { className: "h-3 w-3" }) })] })] }), cals.length > 0 ? (_jsx("div", { className: "space-y-1 pl-1", children: cals.map((cal) => {
                                                        const color = subCalColors[cal.id] ?? cal.color ?? account.color ?? "#2FE8B6";
                                                        const isHidden = hiddenSubCals.has(cal.id);
                                                        return (_jsxs("div", { className: "flex items-center gap-1.5 group/cal", children: [_jsxs("div", { className: "relative", children: [_jsx("button", { type: "button", onClick: (e) => {
                                                                                e.stopPropagation();
                                                                                setColorPickerFor(colorPickerFor === cal.id ? null : cal.id);
                                                                            }, className: "w-3 h-3 rounded-sm shrink-0 border border-black/20 hover:scale-110 transition-transform", style: { backgroundColor: isHidden ? "transparent" : color, borderColor: color, opacity: isHidden ? 0.4 : 1 }, title: "Change color" }), colorPickerFor === cal.id && (_jsxs("div", { className: "absolute left-0 top-full mt-1 z-30 bg-zinc-800 border border-zinc-700 rounded-lg p-2 shadow-xl", onClick: (e) => e.stopPropagation(), children: [_jsx("div", { className: "grid grid-cols-5 gap-1", children: COLOR_SWATCHES.map((c) => (_jsx("button", { type: "button", onClick: () => { setSubCalColors((prev) => ({ ...prev, [cal.id]: c })); setColorPickerFor(null); }, className: "w-4 h-4 rounded-sm hover:scale-110 transition-transform border border-black/20", style: { backgroundColor: c } }, c))) }), subCalColors[cal.id] && (_jsx("button", { type: "button", onClick: () => { setSubCalColors((prev) => { const n = { ...prev }; delete n[cal.id]; return n; }); setColorPickerFor(null); }, className: "w-full mt-1.5 text-[10px] text-zinc-500 hover:text-zinc-300 text-center", children: "Reset" }))] }))] }), _jsx("span", { className: `text-xs truncate flex-1 ${isHidden ? "text-zinc-600" : "text-zinc-400"}`, children: cal.name }), _jsx("button", { type: "button", onClick: () => toggleSubCal(cal.id), className: "shrink-0 text-zinc-600 opacity-0 group-hover/cal:opacity-100 hover:text-zinc-300 transition-all", title: isHidden ? "Show" : "Hide", children: isHidden ? _jsx(EyeOff, { className: "h-3 w-3" }) : _jsx(Eye, { className: "h-3 w-3" }) })] }, cal.id));
                                                    }) })) : (
                                                /* Fallback: account-level toggle when no sub-cals loaded */
                                                _jsx("div", { className: "pl-1 text-xs text-zinc-600 italic", children: "No calendars loaded" }))] }, account.id));
                                    }), _jsxs("a", { href: "https://api.sheetzlabs.com/calendar/auth/google", className: "flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 mt-1", children: [_jsx(Plus, { className: "h-3 w-3" }), "Add account"] })] }))] })] }), _jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [_jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b border-zinc-800 shrink-0", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Link, { to: `/dashboard/calendar?view=${view}&offset=${prevOffset}`, className: "px-2 py-1 text-xs text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded", children: "\u2039" }), _jsx(Link, { to: `/dashboard/calendar?view=${view}&offset=0`, className: "px-2 py-1 text-xs text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded", children: "Today" }), _jsx(Link, { to: `/dashboard/calendar?view=${view}&offset=${nextOffset}`, className: "px-2 py-1 text-xs text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded", children: "\u203A" })] }), _jsx("h1", { className: "text-sm font-semibold text-zinc-200", children: weekStartDate.toLocaleDateString(undefined, { month: "long", year: "numeric" }) })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Link, { to: `/dashboard/calendar?view=day&offset=${weekOffset}`, className: `px-3 py-1.5 text-xs rounded transition-colors ${view === "day" ? "bg-zinc-800 text-zinc-200" : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50"}`, children: "Day" }), _jsx(Link, { to: `/dashboard/calendar?view=week&offset=${weekOffset}`, className: `px-3 py-1.5 text-xs rounded transition-colors ${view === "week" ? "bg-zinc-800 text-zinc-200" : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50"}`, children: "Week" }), _jsxs("button", { onClick: openNewEventDefault, disabled: accounts.length === 0, className: "flex items-center gap-1.5 px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed", children: [_jsx(Plus, { className: "h-3 w-3" }), "New Event"] })] })] }), _jsxs("div", { className: "flex-1 overflow-auto", children: [_jsxs("div", { className: "grid border-b border-zinc-800 sticky top-0 bg-zinc-950 z-10", style: { gridTemplateColumns: "44px repeat(7, 1fr)" }, children: [_jsx("div", { className: "border-r border-zinc-800" }), DAYS.map((day, i) => {
                                        const d = new Date(weekStartDate);
                                        d.setDate(weekStartDate.getDate() + i);
                                        const isToday = d.toDateString() === new Date().toDateString();
                                        return (_jsxs("div", { className: "px-2 py-2 text-center border-r border-zinc-800 last:border-r-0", children: [_jsx("div", { className: "text-xs text-zinc-500", children: day }), _jsx("div", { className: `text-sm font-medium mt-0.5 ${isToday ? "text-emerald-400" : "text-zinc-300"}`, children: d.getDate() })] }, day));
                                    })] }), _jsxs("div", { className: "flex", style: { height: VISIBLE_HOURS * HOUR_HEIGHT }, children: [_jsx("div", { className: "w-11 shrink-0 relative border-r border-zinc-800", style: { height: VISIBLE_HOURS * HOUR_HEIGHT }, children: HOURS.map((hour, i) => (_jsx("div", { style: { position: "absolute", top: i * HOUR_HEIGHT - 9, height: HOUR_HEIGHT, right: 0, left: 0 }, className: "pr-1.5 text-right text-[10px] text-zinc-600", children: formatHour(hour) }, hour))) }), DAYS.map((_, dayIndex) => {
                                        const dayEvents = getEventsForDay(dayIndex, weekStartDate, visibleEvents);
                                        return (_jsxs("div", { className: "flex-1 relative border-r border-zinc-800/40 last:border-r-0", style: { height: VISIBLE_HOURS * HOUR_HEIGHT }, children: [HOURS.map((hour, i) => (_jsx("div", { style: { position: "absolute", top: i * HOUR_HEIGHT, height: HOUR_HEIGHT, left: 0, right: 0 }, className: "border-b border-zinc-800/30 hover:bg-zinc-800/15 transition-colors cursor-pointer group", onDragOver: (e) => e.preventDefault(), onDrop: (e) => handleDrop(e, dayIndex, hour), onClick: () => handleCellClick(dayIndex, hour), children: accounts.length > 0 && !draggedTask && (_jsx("span", { className: "absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-zinc-600 text-xs pointer-events-none", children: "+" })) }, hour))), dayEvents.map((event) => (_jsxs("button", { type: "button", onClick: (e) => { e.stopPropagation(); setSelectedEvent(event); }, style: getEventChipStyle(event), className: "overflow-hidden rounded-sm px-1.5 py-0.5 text-left w-full hover:brightness-110 transition-all", children: [_jsxs("div", { className: "truncate text-xs font-medium text-zinc-200 leading-tight", children: [event.is_time_block ? "⏱ " : "", event.title] }), _jsx("div", { className: "text-[10px] text-zinc-400 leading-tight", children: formatTime(event.start_at) })] }, event.id)))] }, dayIndex));
                                    })] })] }), _jsx("div", { className: "flex items-center gap-3 px-4 py-2 border-t border-zinc-800 text-xs text-zinc-500 shrink-0", children: draggedTask ? (_jsxs("span", { className: "text-emerald-400", children: ["Drop \u201C", draggedTask.title, "\u201D onto a time slot"] })) : (accounts.length > 0 && _jsx("span", { className: "text-zinc-600", children: "Click a slot to create an event \u00B7 Click an event to open it" })) })] })] }));
}
