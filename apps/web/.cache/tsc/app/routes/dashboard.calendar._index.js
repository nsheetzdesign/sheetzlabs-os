import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useLoaderData, Link, Form, useFetcher, useRevalidator, redirect } from "react-router";
import { useState, useEffect, useRef, useMemo } from "react";
import { RefreshCw, Plus, X, Eye, EyeOff, Video, Clock, MapPin, Users, ExternalLink, Zap, CheckSquare, Edit2, Settings, Check, Link2, Calendar, AlertTriangle, } from "lucide-react";
import { getSupabaseClient } from "~/lib/supabase.server";
import { apiFetch } from "~/lib/api";
import { DEFAULT_TZ, getWeekBounds, getDayBounds, dayStartUtc, weekdayLabel, formatTimeInTz, formatDateTimeInTz, localInputToUtcIso, utcIsoToLocalInput, } from "~/lib/tz";
export const meta = () => [{ title: "Calendar — Sheetz Labs OS" }];
// ── Constants ────────────────────────────────────────────────────────────────
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
const DEFAULT_CAL_COLOR = "#2FE8B6";
const pad2 = (n) => String(n).padStart(2, "0");
function formatHour(hour) {
    if (hour === 0 || hour === 24)
        return "12am";
    if (hour === 12)
        return "12pm";
    return hour > 12 ? `${hour - 12}pm` : `${hour}am`;
}
/**
 * Single source of truth for an event/swatch color (CS-10). Priority:
 * session override → sub-calendar DB color → account color → default. Sub-cal
 * first because that's what the sidebar picker persists.
 */
function resolveCalendarColor(sub, account, override) {
    if (override)
        return override;
    if (sub?.color)
        return sub.color;
    if (account?.color)
        return account.color;
    return DEFAULT_CAL_COLOR;
}
function timedEventInDay(e, dayStart) {
    const dayEnd = dayStart + 86_400_000;
    const evStart = new Date(e.start_at).getTime();
    const evEnd = Math.max(new Date(e.end_at).getTime(), evStart + 60_000);
    if (evStart >= dayEnd || evEnd <= dayStart)
        return null; // no overlap with this day
    const segStartMin = Math.max(0, (Math.max(evStart, dayStart) - dayStart) / 60_000);
    const segEndMin = Math.min(1440, (Math.min(evEnd, dayEnd) - dayStart) / 60_000);
    const visibleStart = Math.max(segStartMin, START_HOUR * 60);
    const visibleEnd = Math.min(segEndMin, 24 * 60);
    if (visibleEnd <= visibleStart)
        return null;
    const top = ((visibleStart - START_HOUR * 60) / 60) * HOUR_HEIGHT;
    const height = Math.max(22, ((visibleEnd - visibleStart) / 60) * HOUR_HEIGHT);
    return { top, height };
}
// Standard interval column-packing: events in the same overlap cluster get the
// lowest free column; width = 1/clusterColumns (CS-7).
function packDayColumns(items) {
    const sorted = [...items].sort((a, b) => a.top - b.top || a.top + a.height - (b.top + b.height));
    const result = [];
    let cluster = [];
    let clusterEnd = -Infinity;
    const colEnds = [];
    const flush = () => {
        const colCount = colEnds.length || 1;
        for (const { item, col } of cluster) {
            result.push({ event: item.event, top: item.top, height: item.height, col, colCount });
        }
        cluster = [];
        colEnds.length = 0;
    };
    for (const item of sorted) {
        const start = item.top;
        const end = item.top + item.height;
        if (start >= clusterEnd && cluster.length)
            flush();
        let col = colEnds.findIndex((e) => start >= e);
        if (col === -1) {
            col = colEnds.length;
            colEnds.push(end);
        }
        else {
            colEnds[col] = end;
        }
        cluster.push({ item, col });
        clusterEnd = Math.max(clusterEnd, end);
    }
    if (cluster.length)
        flush();
    return result;
}
// All-day events overlapping a given day (uses all_day_end_date, inclusive — 52B).
function allDayEventOnDay(e, day) {
    if (!e.all_day)
        return false;
    const startDate = new Date(e.start_at);
    const startY = startDate.getUTCFullYear();
    const startKey = Date.UTC(startY, startDate.getUTCMonth(), startDate.getUTCDate());
    const endKey = e.all_day_end_date
        ? Date.UTC(+e.all_day_end_date.slice(0, 4), +e.all_day_end_date.slice(5, 7) - 1, +e.all_day_end_date.slice(8, 10))
        : startKey;
    const dayKey = Date.UTC(day.year, day.month - 1, day.day);
    return dayKey >= startKey && dayKey <= endKey;
}
// ── Loader ───────────────────────────────────────────────────────────────────
function readTzCookie(request) {
    const cookie = request.headers.get("cookie") ?? "";
    const m = cookie.match(/(?:^|;\s*)tz=([^;]+)/);
    if (!m)
        return null;
    try {
        return decodeURIComponent(m[1]);
    }
    catch {
        return m[1];
    }
}
export async function loader({ request, context }) {
    const env = context.cloudflare.env;
    const supabase = getSupabaseClient(env);
    const url = new URL(request.url);
    const view = url.searchParams.get("view") || "week";
    const offset = parseInt(url.searchParams.get("offset") || "0", 10);
    // IANA tz from the cookie (set client-side); default until the client reports it.
    const tzCookie = readTzCookie(request);
    const tz = tzCookie || DEFAULT_TZ;
    const tzKnown = !!tzCookie;
    const now = new Date();
    const { days, startUtc, windowEnd } = view === "day" ? getDayBounds(now, tz, offset) : getWeekBounds(now, tz, offset);
    const [eventsRes, accountsRes, tasksRes] = await Promise.all([
        supabase
            .from("calendar_events")
            // Window filter is overlap-based (start < windowEnd AND end > windowStart) so
            // multi-day and still-ongoing events that started earlier still load (CS-12).
            .select("id, title, start_at, end_at, is_time_block, all_day, all_day_end_date, account_id, task_id, google_calendar_id, sub_account_id")
            .lt("start_at", windowEnd.toISOString())
            .gt("end_at", startUtc.toISOString())
            .order("start_at"),
        supabase.from("calendar_accounts").select("id, email, color, display_name, sync_enabled, last_sync_at, needs_reauth").order("email"),
        supabase.from("tasks").select("id, title, due_date, priority, status").in("status", ["todo", "in_progress"]).order("due_date", { nullsFirst: false }),
    ]);
    const { data: blockedTasks } = await supabase
        .from("calendar_events").select("task_id").eq("is_time_block", true).not("task_id", "is", null);
    const blockedIds = new Set((blockedTasks ?? []).map((e) => e.task_id));
    const unscheduled = (tasksRes.data ?? []).filter((t) => !blockedIds.has(t.id));
    // Fetch sub-calendars for each account (DB-backed, synced from Google)
    const subCalendars = await Promise.all((accountsRes.data ?? []).map(async (account) => {
        try {
            const res = await apiFetch(request, env, `/calendar/accounts/${account.id}/calendars`);
            const json = (await res.json());
            return { accountId: account.id, calendars: json.calendars ?? [] };
        }
        catch {
            return { accountId: account.id, calendars: [] };
        }
    }));
    const reauthAccounts = (accountsRes.data ?? [])
        .filter((a) => a.needs_reauth)
        .map((a) => ({ id: a.id, email: a.email }));
    // Server-side visibility filter (CS-11): drop events whose sub-calendar is
    // hidden. Events with a null sub_account_id (pre-52B rows) stay visible.
    const hiddenSubIds = new Set(subCalendars.flatMap((entry) => entry.calendars.filter((cal) => cal.is_visible === false).map((cal) => cal.id)));
    const events = (eventsRes.data ?? []).filter((e) => !e.sub_account_id || !hiddenSubIds.has(e.sub_account_id));
    return {
        events,
        accounts: accountsRes.data ?? [],
        reauthAccounts,
        tasks: unscheduled,
        subCalendars,
        view,
        offset,
        days,
        tz,
        tzKnown,
    };
}
// ── Action ───────────────────────────────────────────────────────────────────
export async function action({ request, context }) {
    const env = context.cloudflare.env;
    const fd = await request.formData();
    const intent = fd.get("intent");
    // Authenticated Google Calendar OAuth initiation (Prompt 51B). Call the API's
    // authenticated start endpoint (user-bound `state` nonce) and redirect to Google.
    if (intent === "connect") {
        const res = await apiFetch(request, env, "/calendar/auth/google/start", { method: "POST" });
        if (!res.ok) {
            return redirect(`/dashboard/calendar?connected=false&error=${encodeURIComponent("Could not start Calendar connection")}`);
        }
        const { url } = (await res.json());
        return redirect(url);
    }
    if (intent === "sync") {
        await apiFetch(request, env, `/calendar/accounts/${fd.get("account_id")}/sync`, { method: "POST" });
    }
    if (intent === "create_time_block") {
        await apiFetch(request, env, `/calendar/time-blocks`, {
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
        // start_at/end_at already arrive as UTC ISO (converted client-side, CS-6).
        const res = await apiFetch(request, env, `/calendar/events`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                account_id: fd.get("account_id"),
                title: fd.get("title"),
                description: fd.get("description") || undefined,
                location: fd.get("location") || undefined,
                start_at: fd.get("start_at"),
                end_at: fd.get("end_at"),
                attendees,
                add_google_meet: fd.get("add_google_meet") === "true",
                meeting_link: fd.get("meeting_link") || undefined,
            }),
        });
        if (!res.ok) {
            const data = (await res.json().catch(() => ({})));
            return Response.json({ ok: false, error: data.error ?? "Failed to create event" }, { status: res.status });
        }
        return Response.json({ ok: true });
    }
    // Delete time block called from the event modal on the index page
    if (intent === "delete_time_block") {
        const eventId = fd.get("event_id");
        await apiFetch(request, env, `/calendar/time-blocks/${eventId}`, { method: "DELETE" });
    }
    if (intent === "update_sub_cal") {
        const subCalId = fd.get("sub_cal_id");
        const updates = {};
        const color = fd.get("color");
        const isVisible = fd.get("is_visible");
        if (color)
            updates.color = color;
        if (isVisible !== null)
            updates.is_visible = isVisible === "true";
        await apiFetch(request, env, `/calendar/sub-accounts/${subCalId}`, {
            method: "PATCH", headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
        });
    }
    if (intent === "update_account") {
        const accountId = fd.get("account_id");
        const updates = {};
        const color = fd.get("color");
        const displayName = fd.get("display_name");
        if (color)
            updates.color = color;
        if (displayName !== null)
            updates.display_name = displayName || null;
        await apiFetch(request, env, `/calendar/accounts/${accountId}`, {
            method: "PATCH", headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
        });
    }
    return null;
}
// ── New Event Modal ───────────────────────────────────────────────────────────
function NewEventModal({ accounts, defaultStart, defaultEnd, tz, onClose, }) {
    const fetcher = useFetcher();
    const [videoType, setVideoType] = useState("none");
    const [error, setError] = useState(null);
    const submittingRef = useRef(false);
    useEffect(() => {
        const h = (e) => { if (e.key === "Escape")
            onClose(); };
        document.addEventListener("keydown", h);
        return () => document.removeEventListener("keydown", h);
    }, [onClose]);
    // Close only on confirmed success; otherwise show an inline error.
    useEffect(() => {
        if (fetcher.state === "idle" && submittingRef.current && fetcher.data) {
            submittingRef.current = false;
            if (fetcher.data.ok)
                onClose();
            else
                setError(fetcher.data.error ?? "Failed to create event");
        }
    }, [fetcher.state, fetcher.data, onClose]);
    // Convert naive datetime-local values to UTC ISO client-side before submit (CS-6).
    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        const fd = new FormData(e.currentTarget);
        const startLocal = fd.get("start_at");
        const endLocal = fd.get("end_at");
        if (new Date(endLocal) <= new Date(startLocal)) {
            setError("End time must be after start time");
            return;
        }
        fd.set("start_at", localInputToUtcIso(startLocal, tz));
        fd.set("end_at", localInputToUtcIso(endLocal, tz));
        submittingRef.current = true;
        fetcher.submit(fd, { method: "post" });
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm", onClick: onClose, children: _jsxs("div", { className: "w-full max-w-md rounded-xl border border-zinc-700 bg-zinc-900 p-6 shadow-xl", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between mb-5", children: [_jsx("h2", { className: "text-base font-semibold text-zinc-100", children: "New Event" }), _jsx("button", { onClick: onClose, className: "text-zinc-500 hover:text-zinc-200 transition-colors", children: _jsx(X, { className: "h-4 w-4" }) })] }), _jsxs(fetcher.Form, { method: "post", onSubmit: handleSubmit, className: "space-y-4", children: [_jsx("input", { type: "hidden", name: "intent", value: "create_event" }), videoType === "meet" && _jsx("input", { type: "hidden", name: "add_google_meet", value: "true" }), accounts.length > 1 ? (_jsxs("div", { children: [_jsx("label", { className: "block text-xs text-zinc-500 mb-1", children: "Calendar Account" }), _jsx("select", { name: "account_id", className: "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500", children: accounts.map((a) => _jsx("option", { value: a.id, children: a.email }, a.id)) })] })) : (_jsx("input", { type: "hidden", name: "account_id", value: accounts[0]?.id })), _jsxs("div", { children: [_jsx("label", { className: "block text-xs text-zinc-500 mb-1", children: "Title *" }), _jsx("input", { name: "title", required: true, autoFocus: true, placeholder: "Event title", className: "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs text-zinc-500 mb-1", children: "Start" }), _jsx("input", { name: "start_at", type: "datetime-local", defaultValue: defaultStart, required: true, className: "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs text-zinc-500 mb-1", children: "End" }), _jsx("input", { name: "end_at", type: "datetime-local", defaultValue: defaultEnd, required: true, className: "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs text-zinc-500 mb-1", children: "Location" }), _jsx("input", { name: "location", placeholder: "Office, address, etc.", className: "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs text-zinc-500 mb-1.5", children: "Video Conferencing" }), _jsx("div", { className: "flex gap-2 mb-2", children: ["none", "meet", "teams"].map((t) => (_jsx("button", { type: "button", onClick: () => setVideoType(t), className: `px-2.5 py-1 text-xs rounded border transition-colors ${videoType === t ? "bg-emerald-600 border-emerald-500 text-white" : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"}`, children: t === "none" ? "None" : t === "meet" ? "Google Meet" : "Teams / Zoom" }, t))) }), videoType === "teams" && (_jsx("input", { name: "meeting_link", placeholder: "Paste Teams or Zoom URL", className: "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500" })), videoType === "meet" && _jsx("p", { className: "text-xs text-zinc-500", children: "Meet link generated automatically." })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs text-zinc-500 mb-1", children: "Description" }), _jsx("textarea", { name: "description", rows: 2, placeholder: "Agenda, notes...", className: "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 resize-none" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-xs text-zinc-500 mb-1", children: ["Attendees ", _jsx("span", { className: "text-zinc-600", children: "(comma-separated emails)" })] }), _jsx("input", { name: "attendees", placeholder: "john@example.com, jane@example.com", className: "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500" })] }), error && _jsx("p", { className: "text-xs text-red-400", children: error }), _jsxs("div", { className: "flex gap-3 pt-1", children: [_jsx("button", { type: "button", onClick: onClose, className: "flex-1 py-2 text-sm text-zinc-400 hover:text-zinc-200 border border-zinc-700 rounded-lg transition-colors", children: "Cancel" }), _jsx("button", { type: "submit", disabled: fetcher.state !== "idle", className: "flex-1 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg disabled:opacity-50 transition-colors", children: fetcher.state !== "idle" ? "Creating..." : "Create Event" })] })] })] }) }));
}
// ── Event Detail Modal ────────────────────────────────────────────────────────
function EventDetailModal({ event, tz, onClose }) {
    const detailFetcher = useFetcher();
    const editFetcher = useFetcher();
    const actionFetcher = useFetcher();
    const [isEditing, setIsEditing] = useState(false);
    const [videoType, setVideoType] = useState("none");
    const [editError, setEditError] = useState(null);
    const didLoad = useRef(false);
    const editingRef = useRef(false);
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
    // Close the edit form only on a confirmed successful save; inline error otherwise.
    useEffect(() => {
        if (editFetcher.state === "idle" && editingRef.current && editFetcher.data) {
            editingRef.current = false;
            if (editFetcher.data.ok) {
                setIsEditing(false);
                setVideoType("none");
                setEditError(null);
                detailFetcher.load(`/dashboard/calendar/${event.id}`);
            }
            else {
                setEditError(editFetcher.data.error ?? "Failed to save changes");
            }
        }
    }, [editFetcher.state, editFetcher.data]); // eslint-disable-line react-hooks/exhaustive-deps
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
        editFetcher.submit(fd, { method: "post", action: `/dashboard/calendar/${event.id}` });
    };
    const full = detailFetcher.data?.event;
    const isLoading = detailFetcher.state === "loading";
    const loadFailed = !isLoading && didLoad.current && detailFetcher.state === "idle" && !full;
    const hasAttendees = Array.isArray(full?.attendees) && full.attendees.length > 0;
    const actionUrl = `/dashboard/calendar/${event.id}`;
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm", onClick: onClose, children: _jsxs("div", { className: "w-full max-w-lg max-h-[85vh] flex flex-col rounded-xl border border-zinc-700 bg-zinc-900 shadow-xl overflow-hidden", onClick: (e) => e.stopPropagation(), children: [_jsx("div", { className: "px-6 pt-5 pb-4 border-b border-zinc-800 shrink-0", children: _jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("h2", { className: "text-base font-semibold text-zinc-100 break-words", children: event.title }), _jsxs("div", { className: "flex items-center gap-2 mt-1 text-xs text-zinc-400", children: [_jsx(Clock, { className: "h-3 w-3 shrink-0" }), _jsxs("span", { children: [formatDateTimeInTz(event.start_at, tz), " \u2014 ", formatTimeInTz(event.end_at, tz)] })] })] }), _jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [event.is_time_block && (_jsx("span", { className: "px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs rounded-md", children: "Time Block" })), !isEditing && full && (_jsx("button", { onClick: () => setIsEditing(true), className: "p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors", title: "Edit", children: _jsx(Edit2, { className: "h-3.5 w-3.5" }) })), _jsx("button", { onClick: onClose, className: "p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors", children: _jsx(X, { className: "h-4 w-4" }) })] })] }) }), _jsx("div", { className: "flex-1 overflow-y-auto", children: isLoading && !full ? (_jsx("div", { className: "flex items-center justify-center py-10 text-xs text-zinc-500", children: "Loading\u2026" })) : loadFailed ? (_jsxs("div", { className: "flex flex-col items-center justify-center gap-2 py-10 text-xs text-zinc-500", children: [_jsx(AlertTriangle, { className: "h-5 w-5 text-amber-500" }), _jsx("span", { children: "Couldn\u2019t load this event." }), _jsx("button", { onClick: () => { didLoad.current = true; detailFetcher.load(actionUrl); }, className: "text-emerald-400 hover:text-emerald-300", children: "Retry" })] })) : full ? (_jsxs("div", { className: "px-6 py-5 space-y-4", children: [isEditing && (_jsxs(editFetcher.Form, { method: "post", action: actionUrl, onSubmit: handleEditSubmit, className: "space-y-3", children: [_jsx("input", { type: "hidden", name: "intent", value: "edit" }), videoType === "meet" && _jsx("input", { type: "hidden", name: "add_google_meet", value: "true" }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs text-zinc-500 mb-1", children: "Title" }), _jsx("input", { name: "title", defaultValue: full.title, className: "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs text-zinc-500 mb-1", children: "Start" }), _jsx("input", { name: "start_at", type: "datetime-local", defaultValue: utcIsoToLocalInput(full.start_at, tz), className: "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs text-zinc-500 mb-1", children: "End" }), _jsx("input", { name: "end_at", type: "datetime-local", defaultValue: utcIsoToLocalInput(full.end_at, tz), className: "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs text-zinc-500 mb-1", children: "Location" }), _jsx("input", { name: "location", defaultValue: full.location ?? "", placeholder: "Location", className: "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs text-zinc-500 mb-1.5", children: "Video" }), _jsx("div", { className: "flex gap-2 mb-1.5", children: ["none", "meet", "teams"].map((t) => (_jsx("button", { type: "button", onClick: () => setVideoType(t), className: `px-2 py-1 text-xs rounded border transition-colors ${videoType === t ? "bg-emerald-600 border-emerald-500 text-white" : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"}`, children: t === "none" ? "Keep" : t === "meet" ? "Google Meet" : "Teams/Zoom" }, t))) }), videoType === "teams" && (_jsx("input", { name: "meeting_link", defaultValue: full.meeting_link ?? "", placeholder: "Paste meeting URL", className: "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500" }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs text-zinc-500 mb-1", children: "Description" }), _jsx("textarea", { name: "description", defaultValue: full.description ?? "", rows: 2, className: "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500 resize-none" })] }), editError && _jsx("p", { className: "text-xs text-red-400", children: editError }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { type: "button", onClick: () => { setIsEditing(false); setEditError(null); }, className: "flex-1 py-2 text-sm text-zinc-400 hover:text-zinc-200 border border-zinc-700 rounded-lg transition-colors", children: "Cancel" }), _jsx("button", { type: "submit", disabled: editFetcher.state !== "idle", className: "flex-1 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg disabled:opacity-50 transition-colors", children: editFetcher.state !== "idle" ? "Saving…" : "Save Changes" })] })] })), !isEditing && (_jsxs(_Fragment, { children: [full.location && (_jsxs("div", { className: "flex items-start gap-3", children: [_jsx(MapPin, { className: "h-4 w-4 text-zinc-500 shrink-0 mt-0.5" }), _jsx("span", { className: "text-sm text-zinc-300", children: full.location })] })), full.meeting_link && (_jsxs("div", { className: "flex items-start gap-3", children: [_jsx(Video, { className: "h-4 w-4 text-zinc-500 shrink-0 mt-0.5" }), _jsxs("a", { href: full.meeting_link, target: "_blank", rel: "noopener noreferrer", className: "text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1", children: ["Join Meeting ", _jsx(ExternalLink, { className: "h-3 w-3" })] })] })), full.description && (_jsxs("div", { children: [_jsx("div", { className: "text-xs text-zinc-500 uppercase tracking-wide mb-1.5", children: "Description" }), _jsx("div", { className: "text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed", children: full.description })] })), hasAttendees && (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(Users, { className: "h-3.5 w-3.5 text-zinc-500" }), _jsxs("span", { className: "text-xs text-zinc-500 uppercase tracking-wide", children: ["Attendees (", full.attendees.length, ")"] })] }), _jsx("div", { className: "space-y-1.5", children: full.attendees.map((a, i) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: `w-2 h-2 rounded-full shrink-0 ${STATUS_COLORS[a.status ?? "needsAction"] ?? "bg-zinc-500"}` }), _jsx("span", { className: "text-sm text-zinc-300", children: a.name || a.email }), a.name && _jsx("span", { className: "text-xs text-zinc-600", children: a.email })] }, i))) })] })), hasAttendees && (_jsx("div", { className: "border border-zinc-800 rounded-lg px-4 py-3", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("div", { className: "text-sm font-medium text-zinc-200 flex items-center gap-2", children: [_jsx(Zap, { className: "h-3.5 w-3.5 text-emerald-400" }), "AI Meeting Prep"] }), _jsx("div", { className: "text-xs text-zinc-500 mt-0.5", children: "Research attendees & generate briefing" })] }), full.knowledge ? (_jsxs(Link, { to: `/dashboard/knowledge/${full.knowledge.id}`, onClick: onClose, className: "text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1", children: ["View ", _jsx(ExternalLink, { className: "h-3 w-3" })] })) : (_jsxs(actionFetcher.Form, { method: "post", action: actionUrl, children: [_jsx("input", { type: "hidden", name: "intent", value: "prep" }), _jsx("button", { type: "submit", disabled: actionFetcher.state !== "idle" || full.ai_prep_generated, className: "px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded-md disabled:opacity-50 transition-colors", children: full.ai_prep_generated ? "Generating…" : "Generate Brief" })] }))] }) })), full.tasks && (_jsxs("div", { children: [_jsx("div", { className: "text-xs text-zinc-500 uppercase tracking-wide mb-1.5", children: "Linked Task" }), _jsxs(Link, { to: `/dashboard/tasks/${full.tasks.id}`, onClick: onClose, className: "flex items-center gap-2 text-sm text-zinc-300 hover:text-emerald-400 transition-colors", children: [_jsx(CheckSquare, { className: "h-3.5 w-3.5 text-zinc-500" }), full.tasks.title] })] })), full.is_time_block && (_jsxs(actionFetcher.Form, { method: "post", onSubmit: onClose, children: [_jsx("input", { type: "hidden", name: "intent", value: "delete_time_block" }), _jsx("input", { type: "hidden", name: "event_id", value: event.id }), _jsx("button", { type: "submit", className: "text-xs text-red-500 hover:text-red-400 transition-colors", children: "Remove time block" })] }))] }))] })) : null })] }) }));
}
// ── Calendar Account Settings Modal ──────────────────────────────────────────
function CalendarSettingsModal({ account, onClose, }) {
    const fetcher = useFetcher();
    const [color, setColor] = useState(account.color ?? "#2FE8B6");
    const [displayName, setDisplayName] = useState(account.display_name ?? "");
    function handleSave() {
        const fd = new FormData();
        fd.set("intent", "update_account");
        fd.set("account_id", account.id);
        fd.set("color", color);
        fd.set("display_name", displayName);
        fetcher.submit(fd, { method: "post" });
        onClose();
    }
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm", onClick: onClose, children: _jsxs("div", { className: "w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-xl p-6 shadow-xl", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-sm font-semibold text-zinc-100", children: "Calendar Settings" }), _jsx("button", { onClick: onClose, className: "text-zinc-500 hover:text-zinc-200", children: _jsx(X, { className: "h-4 w-4" }) })] }), _jsx("p", { className: "text-xs text-zinc-500 mb-4", children: account.email }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-xs text-zinc-400 mb-1.5", children: "Display Name (optional)" }), _jsx("input", { type: "text", value: displayName, onChange: (e) => setDisplayName(e.target.value), placeholder: account.email.split("@")[0], className: "w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm placeholder-zinc-500 focus:outline-none focus:border-emerald-500" })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-xs text-zinc-400 mb-2", children: "Account Color" }), _jsx("div", { className: "grid grid-cols-5 gap-3", children: COLOR_SWATCHES.map((c) => (_jsx("button", { type: "button", onClick: () => setColor(c), className: `w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:scale-110 hover:ring-2 hover:ring-white/50 ${color === c ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-900 scale-110" : ""}`, style: { backgroundColor: c }, title: c, children: color === c && _jsx(Check, { className: "h-5 w-5 text-white drop-shadow" }) }, c))) })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: onClose, className: "flex-1 py-2 text-xs text-zinc-400 hover:text-zinc-200 border border-zinc-700 rounded-lg", children: "Cancel" }), _jsx("button", { onClick: handleSave, className: "flex-1 py-2 text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg", children: "Save" })] })] }) }));
}
// ── Main Calendar Component ───────────────────────────────────────────────────
export default function CalendarPage() {
    const { events, accounts, reauthAccounts, tasks, subCalendars, view, offset, days, tz, tzKnown } = useLoaderData();
    const revalidator = useRevalidator();
    const [dismissedReauth, setDismissedReauth] = useState(new Set());
    const visibleReauth = reauthAccounts.filter((a) => !dismissedReauth.has(a.id));
    const fetcher = useFetcher();
    const [draggedTask, setDraggedTask] = useState(null);
    const [newEventModal, setNewEventModal] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [settingsAccount, setSettingsAccount] = useState(null);
    // Sub-calendar color overrides for this session (visibility persists server-side).
    const [subCalColors, setSubCalColors] = useState({});
    const [colorPickerFor, setColorPickerFor] = useState(null);
    // Report the browser's IANA tz to the server (cookie) so the loader computes the
    // week/day window in the user's timezone. Revalidates once when it changes (CS-5).
    useEffect(() => {
        const resolved = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (resolved && (!tzKnown || resolved !== tz)) {
            document.cookie = `tz=${encodeURIComponent(resolved)};path=/;max-age=31536000;samesite=lax`;
            revalidator.revalidate();
        }
    }, [tz, tzKnown, revalidator]);
    const dayList = days;
    // Precompute each column's local-midnight UTC instant for placement.
    const dayBoundaries = useMemo(() => dayList.map((d) => dayStartUtc(d, tz).getTime()), [dayList, tz]);
    // Look up DB sub-cal by Google calendar ID (external_id)
    function findSubCal(googleCalId, accountId) {
        if (!googleCalId)
            return undefined;
        const entry = subCalendars.find((s) => s.accountId === accountId);
        return entry?.calendars.find((c) => c.external_id === googleCalId);
    }
    // One color chain everywhere (CS-10): session override → sub-cal DB color →
    // account color → default. Sub-cal first — it's what the picker persists.
    function eventColor(event) {
        const sub = findSubCal(event.google_calendar_id, event.account_id);
        const account = accounts.find((a) => a.id === event.account_id);
        return resolveCalendarColor(sub, account ?? null, sub ? subCalColors[sub.id] : undefined);
    }
    const visibleEvents = events;
    function toggleSubCal(cal) {
        // Persist visibility through the existing is_visible action path (CS-11).
        const fd = new FormData();
        fd.set("intent", "update_sub_cal");
        fd.set("sub_cal_id", cal.id);
        fd.set("is_visible", String(!cal.is_visible));
        fetcher.submit(fd, { method: "post" });
    }
    function chipStyle(top, height, color, col, colCount) {
        const gapPct = 1.5;
        const widthPct = (100 - gapPct * (colCount - 1)) / colCount;
        const leftPct = col * (widthPct + gapPct);
        return {
            position: "absolute",
            top,
            height,
            left: `calc(${leftPct}% + 1px)`,
            width: `calc(${widthPct}% - 2px)`,
            backgroundColor: `${color}22`,
            borderLeft: `3px solid ${color}aa`,
            zIndex: 2,
        };
    }
    // Build placed (column-packed) timed events for a given day column.
    function placedTimedEventsForDay(dayStart) {
        const items = [];
        for (const e of visibleEvents) {
            if (e.all_day)
                continue;
            const pos = timedEventInDay(e, dayStart);
            if (pos)
                items.push({ event: e, top: pos.top, height: pos.height });
        }
        return packDayColumns(items);
    }
    function handleDrop(e, dayIndex, hour) {
        e.preventDefault();
        if (!draggedTask || accounts.length === 0)
            return;
        const d = dayList[dayIndex];
        const localStart = `${d.year}-${pad2(d.month)}-${pad2(d.day)}T${pad2(hour)}:00`;
        const localEnd = `${d.year}-${pad2(d.month)}-${pad2(d.day)}T${pad2(hour + 1)}:00`;
        const fd = new FormData();
        fd.set("intent", "create_time_block");
        fd.set("task_id", draggedTask.id);
        fd.set("account_id", accounts[0].id);
        fd.set("start_at", localInputToUtcIso(localStart, tz));
        fd.set("end_at", localInputToUtcIso(localEnd, tz));
        fetcher.submit(fd, { method: "post" });
        setDraggedTask(null);
    }
    function handleCellClick(dayIndex, hour) {
        if (draggedTask || accounts.length === 0)
            return;
        const d = dayList[dayIndex];
        setNewEventModal({
            start: `${d.year}-${pad2(d.month)}-${pad2(d.day)}T${pad2(hour)}:00`,
            end: `${d.year}-${pad2(d.month)}-${pad2(d.day)}T${pad2(hour + 1)}:00`,
        });
    }
    function openNewEventDefault() {
        const now = new Date();
        now.setMinutes(0, 0, 0);
        now.setHours(now.getHours() + 1);
        const end = new Date(now.getTime() + 3_600_000);
        setNewEventModal({
            start: utcIsoToLocalInput(now.toISOString(), tz),
            end: utcIsoToLocalInput(end.toISOString(), tz),
        });
    }
    const prevOffset = offset - 1;
    const nextOffset = offset + 1;
    return (_jsxs("div", { className: "flex flex-col h-full overflow-hidden", onClick: () => setColorPickerFor(null), children: [visibleReauth.map((acct) => (_jsxs("div", { className: "flex items-center gap-3 px-4 py-2 bg-amber-950/40 border-b border-amber-800/50 text-sm text-amber-200", children: [_jsx(AlertTriangle, { size: 16, className: "shrink-0 text-amber-400" }), _jsxs("span", { className: "flex-1", children: ["Google Calendar access for ", _jsx("strong", { children: acct.email }), " was revoked \u2014 sync is paused until you reconnect."] }), _jsxs(Form, { method: "post", children: [_jsx("input", { type: "hidden", name: "intent", value: "connect" }), _jsxs("button", { type: "submit", className: "px-3 py-1 rounded bg-amber-500 text-amber-950 font-medium hover:bg-amber-400 transition-colors", children: ["Reconnect ", acct.email] })] }), _jsx("button", { type: "button", onClick: () => setDismissedReauth((prev) => new Set(prev).add(acct.id)), title: "Dismiss", className: "text-amber-400 hover:text-amber-200", children: _jsx(X, { size: 16 }) })] }, acct.id))), _jsxs("div", { className: "flex flex-1 overflow-hidden", children: [newEventModal && accounts.length > 0 && (_jsx(NewEventModal, { accounts: accounts, defaultStart: newEventModal.start, defaultEnd: newEventModal.end, tz: tz, onClose: () => setNewEventModal(null) })), selectedEvent && (_jsx(EventDetailModal, { event: selectedEvent, tz: tz, onClose: () => setSelectedEvent(null) })), settingsAccount && (_jsx(CalendarSettingsModal, { account: settingsAccount, onClose: () => setSettingsAccount(null) })), _jsxs("aside", { className: "w-56 shrink-0 border-r border-zinc-800 flex flex-col overflow-hidden", children: [_jsxs("div", { className: "p-4 border-b border-zinc-800 shrink-0", children: [_jsx("h2", { className: "text-xs font-semibold text-zinc-300 mb-0.5", children: "Unscheduled Tasks" }), _jsx("p", { className: "text-xs text-zinc-500", children: "Drag onto calendar to block time" })] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-3 space-y-1.5 min-h-0", children: [tasks.length === 0 && _jsx("p", { className: "text-xs text-zinc-500 italic", children: "All tasks scheduled" }), tasks.map((task) => (_jsxs("div", { draggable: true, onDragStart: () => setDraggedTask({ id: task.id, title: task.title }), onDragEnd: () => setDraggedTask(null), className: "p-2 bg-zinc-900 border border-zinc-800 rounded cursor-grab hover:border-zinc-600 transition-colors select-none", children: [_jsx("div", { className: "text-xs font-medium truncate text-zinc-200", children: task.title }), task.due_date && (_jsxs("div", { className: "text-xs text-zinc-500 mt-0.5", children: ["Due ", new Date(task.due_date).toLocaleDateString(undefined, { month: "short", day: "numeric" })] }))] }, task.id)))] }), _jsxs("div", { className: "p-3 border-t border-zinc-800 shrink-0", children: [_jsx("div", { className: "text-xs text-zinc-500 uppercase tracking-wide mb-2", children: "Calendars" }), accounts.length === 0 ? (_jsxs(Form, { method: "post", children: [_jsx("input", { type: "hidden", name: "intent", value: "connect" }), _jsxs("button", { type: "submit", className: "flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300", children: [_jsx(Plus, { className: "h-3 w-3" }), "Connect Google Calendar"] })] })) : (_jsxs("div", { className: "space-y-3", children: [accounts.map((account) => {
                                                const entry = subCalendars.find((s) => s.accountId === account.id);
                                                const cals = entry?.calendars ?? [];
                                                return (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-1.5 mb-1 group/acct", children: [_jsx("span", { className: "text-xs font-medium text-zinc-400 truncate flex-1", children: account.display_name || account.email.split("@")[0] }), _jsx("button", { type: "button", onClick: (e) => { e.stopPropagation(); setSettingsAccount(account); }, title: "Settings", className: "text-zinc-600 hover:text-zinc-300 transition-colors opacity-0 group-hover/acct:opacity-100", children: _jsx(Settings, { className: "h-3 w-3" }) }), _jsxs(fetcher.Form, { method: "post", children: [_jsx("input", { type: "hidden", name: "intent", value: "sync" }), _jsx("input", { type: "hidden", name: "account_id", value: account.id }), _jsx("button", { type: "submit", title: "Sync", className: "text-zinc-600 hover:text-zinc-300 transition-colors", children: _jsx(RefreshCw, { className: "h-3 w-3" }) })] })] }), cals.length > 0 ? (_jsx("div", { className: "space-y-1 pl-1", children: cals.map((cal) => {
                                                                const color = resolveCalendarColor(cal, account, subCalColors[cal.id]);
                                                                const isHidden = cal.is_visible === false;
                                                                return (_jsxs("div", { className: "flex items-center gap-1.5 group/cal", children: [_jsxs("div", { className: "relative", children: [_jsx("button", { type: "button", onClick: (e) => {
                                                                                        e.stopPropagation();
                                                                                        setColorPickerFor(colorPickerFor === cal.id ? null : cal.id);
                                                                                    }, className: "w-3 h-3 rounded-sm shrink-0 border border-black/20 hover:scale-110 transition-transform", style: { backgroundColor: isHidden ? "transparent" : color, borderColor: color, opacity: isHidden ? 0.4 : 1 }, title: "Change color" }), colorPickerFor === cal.id && (_jsxs("div", { className: "absolute left-0 top-full mt-1 z-30 bg-zinc-800 border border-zinc-700 rounded-lg p-2 shadow-xl", onClick: (e) => e.stopPropagation(), children: [_jsx("div", { className: "grid grid-cols-5 gap-1", children: COLOR_SWATCHES.map((c) => (_jsx("button", { type: "button", onClick: () => {
                                                                                                    setSubCalColors((prev) => ({ ...prev, [cal.id]: c }));
                                                                                                    setColorPickerFor(null);
                                                                                                    // Persist to API
                                                                                                    const fd = new FormData();
                                                                                                    fd.set("intent", "update_sub_cal");
                                                                                                    fd.set("sub_cal_id", cal.id);
                                                                                                    fd.set("color", c);
                                                                                                    fetcher.submit(fd, { method: "post" });
                                                                                                }, className: "w-4 h-4 rounded-sm hover:scale-110 transition-transform border border-black/20", style: { backgroundColor: c } }, c))) }), subCalColors[cal.id] && (_jsx("button", { type: "button", onClick: () => { setSubCalColors((prev) => { const n = { ...prev }; delete n[cal.id]; return n; }); setColorPickerFor(null); }, className: "w-full mt-1.5 text-[10px] text-zinc-500 hover:text-zinc-300 text-center", children: "Reset" }))] }))] }), _jsx("span", { className: `text-xs truncate flex-1 ${isHidden ? "text-zinc-600" : "text-zinc-400"}`, children: cal.name }), _jsx("button", { type: "button", onClick: () => toggleSubCal(cal), className: "shrink-0 text-zinc-600 opacity-0 group-hover/cal:opacity-100 hover:text-zinc-300 transition-all", title: isHidden ? "Show" : "Hide", children: isHidden ? _jsx(EyeOff, { className: "h-3 w-3" }) : _jsx(Eye, { className: "h-3 w-3" }) })] }, cal.id));
                                                            }) })) : (
                                                        /* Fallback: account-level toggle when no sub-cals loaded */
                                                        _jsx("div", { className: "pl-1 text-xs text-zinc-600 italic", children: "No calendars loaded" }))] }, account.id));
                                            }), _jsxs(Form, { method: "post", className: "mt-1", children: [_jsx("input", { type: "hidden", name: "intent", value: "connect" }), _jsxs("button", { type: "submit", className: "flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300", children: [_jsx(Plus, { className: "h-3 w-3" }), "Add account"] })] }), _jsxs(Link, { to: "/dashboard/calendar/booking-links", className: "flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 mt-1", children: [_jsx(Link2, { className: "h-3 w-3" }), "Booking Links"] }), _jsxs(Link, { to: "/dashboard/calendar/bookings", className: "flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 mt-1", children: [_jsx(Calendar, { className: "h-3 w-3" }), "Bookings"] })] }))] })] }), _jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [_jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b border-zinc-800 shrink-0", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Link, { to: `/dashboard/calendar?view=${view}&offset=${prevOffset}`, className: "px-2 py-1 text-xs text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded", children: "\u2039" }), _jsx(Link, { to: `/dashboard/calendar?view=${view}&offset=0`, className: "px-2 py-1 text-xs text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded", children: "Today" }), _jsx(Link, { to: `/dashboard/calendar?view=${view}&offset=${nextOffset}`, className: "px-2 py-1 text-xs text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded", children: "\u203A" })] }), _jsx("h1", { className: "text-sm font-semibold text-zinc-200", children: view === "day"
                                                    ? new Date(dayBoundaries[0]).toLocaleDateString("en-US", { timeZone: tz, weekday: "long", month: "long", day: "numeric", year: "numeric" })
                                                    : new Date(dayBoundaries[0]).toLocaleDateString("en-US", { timeZone: tz, month: "long", year: "numeric" }) })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Link, { to: `/dashboard/calendar?view=day&offset=0`, className: `px-3 py-1.5 text-xs rounded transition-colors ${view === "day" ? "bg-zinc-800 text-zinc-200" : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50"}`, children: "Day" }), _jsx(Link, { to: `/dashboard/calendar?view=week&offset=0`, className: `px-3 py-1.5 text-xs rounded transition-colors ${view === "week" ? "bg-zinc-800 text-zinc-200" : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50"}`, children: "Week" }), _jsxs("button", { onClick: openNewEventDefault, disabled: accounts.length === 0, className: "flex items-center gap-1.5 px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed", children: [_jsx(Plus, { className: "h-3 w-3" }), "New Event"] })] })] }), _jsxs("div", { className: "flex-1 overflow-auto", children: [_jsxs("div", { className: "grid border-b border-zinc-800 sticky top-0 bg-zinc-950 z-10", style: { gridTemplateColumns: `44px repeat(${dayList.length}, 1fr)` }, children: [_jsx("div", { className: "border-r border-zinc-800" }), dayList.map((d, i) => {
                                                const dayStart = dayBoundaries[i];
                                                const nowMs = Date.now();
                                                const isToday = nowMs >= dayStart && nowMs < dayStart + 86_400_000;
                                                return (_jsxs("div", { className: "px-2 py-2 text-center border-r border-zinc-800 last:border-r-0", children: [_jsx("div", { className: "text-xs text-zinc-500", children: weekdayLabel(d.weekday) }), _jsx("div", { className: `text-sm font-medium mt-0.5 ${isToday ? "text-emerald-400" : "text-zinc-300"}`, children: d.day })] }, `${d.year}-${d.month}-${d.day}`));
                                            })] }), (() => {
                                        const allDay = visibleEvents.filter((e) => e.all_day);
                                        if (allDay.length === 0)
                                            return null;
                                        return (_jsxs("div", { className: "grid border-b border-zinc-800 bg-zinc-950/80", style: { gridTemplateColumns: `44px repeat(${dayList.length}, 1fr)` }, children: [_jsx("div", { className: "pr-1.5 py-1 text-right text-[10px] text-zinc-600 border-r border-zinc-800", children: "all-day" }), _jsx("div", { style: { gridColumn: `2 / span ${dayList.length}` }, className: "py-1 px-0.5", children: _jsx("div", { className: "grid gap-0.5", style: { gridTemplateColumns: `repeat(${dayList.length}, 1fr)` }, children: allDay.map((ev, idx) => {
                                                            let startIdx = -1, endIdx = -1;
                                                            for (let i = 0; i < dayList.length; i++) {
                                                                if (allDayEventOnDay(ev, dayList[i])) {
                                                                    if (startIdx === -1)
                                                                        startIdx = i;
                                                                    endIdx = i;
                                                                }
                                                            }
                                                            if (startIdx === -1)
                                                                return null;
                                                            const color = eventColor(ev);
                                                            return (_jsx("button", { type: "button", onClick: (e) => { e.stopPropagation(); setSelectedEvent(ev); }, style: { gridColumn: `${startIdx + 1} / ${endIdx + 2}`, gridRow: idx + 1, backgroundColor: `${color}22`, borderLeft: `3px solid ${color}aa` }, className: "overflow-hidden truncate rounded-sm px-1.5 py-0.5 text-left text-xs text-zinc-200 hover:brightness-110 transition-all", children: ev.title }, ev.id));
                                                        }) }) })] }));
                                    })(), _jsxs("div", { className: "flex", style: { height: VISIBLE_HOURS * HOUR_HEIGHT }, children: [_jsx("div", { className: "w-11 shrink-0 relative border-r border-zinc-800", style: { height: VISIBLE_HOURS * HOUR_HEIGHT }, children: HOURS.map((hour, i) => (_jsx("div", { style: { position: "absolute", top: i * HOUR_HEIGHT - 9, height: HOUR_HEIGHT, right: 0, left: 0 }, className: "pr-1.5 text-right text-[10px] text-zinc-600", children: formatHour(hour) }, hour))) }), dayList.map((d, dayIndex) => {
                                                const dayStart = dayBoundaries[dayIndex];
                                                const placed = placedTimedEventsForDay(dayStart);
                                                return (_jsxs("div", { className: "flex-1 relative border-r border-zinc-800/40 last:border-r-0", style: { height: VISIBLE_HOURS * HOUR_HEIGHT }, children: [HOURS.map((hour, i) => (_jsx("div", { style: { position: "absolute", top: i * HOUR_HEIGHT, height: HOUR_HEIGHT, left: 0, right: 0 }, className: "border-b border-zinc-800/30 hover:bg-zinc-800/15 transition-colors cursor-pointer group", onDragOver: (e) => e.preventDefault(), onDrop: (e) => handleDrop(e, dayIndex, hour), onClick: () => handleCellClick(dayIndex, hour), children: accounts.length > 0 && !draggedTask && (_jsx("span", { className: "absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-zinc-600 text-xs pointer-events-none", children: "+" })) }, hour))), placed.map(({ event, top, height, col, colCount }) => (_jsxs("button", { type: "button", onClick: (e) => { e.stopPropagation(); setSelectedEvent(event); }, style: chipStyle(top, height, eventColor(event), col, colCount), className: "overflow-hidden rounded-sm px-1.5 py-0.5 text-left hover:brightness-110 transition-all", children: [_jsxs("div", { className: "truncate text-xs font-medium text-zinc-200 leading-tight", children: [event.is_time_block ? "⏱ " : "", event.title] }), _jsx("div", { className: "text-[10px] text-zinc-400 leading-tight", children: formatTimeInTz(event.start_at, tz) })] }, event.id)))] }, `${d.year}-${d.month}-${d.day}`));
                                            })] })] }), _jsx("div", { className: "flex items-center gap-3 px-4 py-2 border-t border-zinc-800 text-xs text-zinc-500 shrink-0", children: draggedTask ? (_jsxs("span", { className: "text-emerald-400", children: ["Drop \u201C", draggedTask.title, "\u201D onto a time slot"] })) : (accounts.length > 0 && _jsx("span", { className: "text-zinc-600", children: "Click a slot to create an event \u00B7 Click an event to open it" })) })] })] })] }));
}
