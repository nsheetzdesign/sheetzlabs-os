import type { LoaderFunctionArgs, ActionFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData, Link, useFetcher } from "react-router";
import { useState, useEffect, useRef } from "react";
import {
  RefreshCw, Plus, X, Eye, EyeOff, Video, Clock, MapPin,
  Users, ExternalLink, Zap, CheckSquare, Edit2, Settings, Check, Link2,
} from "lucide-react";
import { getSupabaseClient } from "~/lib/supabase.server";

export const meta: MetaFunction = () => [{ title: "Calendar — Sheetz Labs OS" }];

// ── Constants ────────────────────────────────────────────────────────────────

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const START_HOUR = 4;      // 4 am
const HOUR_HEIGHT = 56;    // px per hour
const VISIBLE_HOURS = 21;  // 4 am → midnight (hour indices 4..24)
const HOURS = Array.from({ length: VISIBLE_HOURS }, (_, i) => i + START_HOUR);

const COLOR_SWATCHES = [
  "#ef4444", "#f97316", "#f59e0b", "#22c55e", "#06b6d4",
  "#3b82f6", "#8b5cf6", "#ec4899", "#2FE8B6", "#6b7280",
];

const STATUS_COLORS: Record<string, string> = {
  accepted: "bg-emerald-500",
  declined: "bg-red-500",
  tentative: "bg-amber-500",
  needsAction: "bg-zinc-500",
};

// ── Types ────────────────────────────────────────────────────────────────────

type CalendarEvent = {
  id: string;
  title: string;
  start_at: string;
  end_at: string;
  is_time_block: boolean;
  all_day: boolean;
  account_id: string;
  task_id: string | null;
  google_calendar_id: string | null;
};

type CalendarAccount = {
  id: string;
  email: string;
  color: string | null;
  sync_enabled: boolean;
  last_sync_at: string | null;
};

type SubCalendar = {
  id: string;          // DB UUID
  external_id: string; // Google Calendar ID (e.g. "primary")
  name: string;
  color: string;
  is_visible: boolean;
};

type SubCalendarEntry = { accountId: string; calendars: SubCalendar[] };

type FullEvent = {
  id: string;
  title: string;
  start_at: string;
  end_at: string;
  description: string | null;
  location: string | null;
  meeting_link: string | null;
  is_time_block: boolean;
  ai_prep_generated: boolean;
  attendees: unknown;
  tasks: { id: string; title: string } | null;
  knowledge: { id: string; title: string } | null;
  calendar_accounts: { email: string; color: string | null } | null;
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatHour(hour: number) {
  if (hour === 0 || hour === 24) return "12am";
  if (hour === 12) return "12pm";
  return hour > 12 ? `${hour - 12}pm` : `${hour}am`;
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    weekday: "short", month: "short", day: "numeric",
    hour: "numeric", minute: "2-digit",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

function getWeekStart(date: Date) {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
}

function toLocalDateTimeInput(iso: string) {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

function getEventsForDay(dayIndex: number, weekStart: Date, events: CalendarEvent[]) {
  const day = new Date(weekStart);
  day.setDate(weekStart.getDate() + dayIndex);
  return events.filter((e) => {
    if (e.all_day) return false;
    const s = new Date(e.start_at);
    return s.getFullYear() === day.getFullYear()
      && s.getMonth() === day.getMonth()
      && s.getDate() === day.getDate();
  });
}

function eventPosition(e: CalendarEvent) {
  const s = new Date(e.start_at);
  const end = new Date(e.end_at);
  const startFrac = Math.max(0, s.getHours() - START_HOUR + s.getMinutes() / 60);
  const endFrac = Math.min(VISIBLE_HOURS, end.getHours() - START_HOUR + end.getMinutes() / 60);
  return { top: startFrac * HOUR_HEIGHT, height: Math.max(22, (endFrac - startFrac) * HOUR_HEIGHT) };
}

// ── Loader ───────────────────────────────────────────────────────────────────

export async function loader({ request, context }: LoaderFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);
  const apiUrl =
    (context.cloudflare.env as Record<string, string>).INTERNAL_API_URL ??
    "https://api.sheetzlabs.com";

  const url = new URL(request.url);
  const view = url.searchParams.get("view") || "week";
  const weekOffset = parseInt(url.searchParams.get("offset") || "0", 10);

  const now = new Date();
  now.setDate(now.getDate() + weekOffset * 7);

  let start: Date, end: Date;
  if (view === "day") {
    start = new Date(now); start.setHours(0, 0, 0, 0);
    end = new Date(now); end.setHours(23, 59, 59, 999);
  } else {
    start = getWeekStart(now);
    end = new Date(start); end.setDate(start.getDate() + 6); end.setHours(23, 59, 59, 999);
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
  const blockedIds = new Set((blockedTasks ?? []).map((e) => e.task_id as string));
  const unscheduled = (tasksRes.data ?? []).filter((t) => !blockedIds.has(t.id));

  // Fetch sub-calendars for each account (DB-backed, synced from Google)
  const subCalendars: SubCalendarEntry[] = await Promise.all(
    (accountsRes.data ?? []).map(async (account) => {
      try {
        const res = await fetch(`${apiUrl}/calendar/accounts/${account.id}/calendars`);
        const json = (await res.json()) as { calendars?: SubCalendar[] };
        return { accountId: account.id, calendars: json.calendars ?? [] };
      } catch {
        return { accountId: account.id, calendars: [] };
      }
    })
  );

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

export async function action({ request, context }: ActionFunctionArgs) {
  const apiUrl =
    (context.cloudflare.env as Record<string, string>).INTERNAL_API_URL ??
    "https://api.sheetzlabs.com";

  const fd = await request.formData();
  const intent = fd.get("intent") as string;

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
    const attendees = ((fd.get("attendees") as string) || "")
      .split(",").map((e) => e.trim()).filter(Boolean).map((email) => ({ email }));
    await fetch(`${apiUrl}/calendar/events`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        account_id: fd.get("account_id"),
        title: fd.get("title"),
        description: fd.get("description") || undefined,
        location: fd.get("location") || undefined,
        start_at: new Date(fd.get("start_at") as string).toISOString(),
        end_at: new Date(fd.get("end_at") as string).toISOString(),
        attendees,
        add_google_meet: fd.get("add_google_meet") === "true",
        meeting_link: fd.get("meeting_link") || undefined,
      }),
    });
  }

  // Delete time block called from the event modal on the index page
  if (intent === "delete_time_block") {
    const eventId = fd.get("event_id") as string;
    await fetch(`${apiUrl}/calendar/time-blocks/${eventId}`, { method: "DELETE" });
  }

  if (intent === "update_sub_cal") {
    const subCalId = fd.get("sub_cal_id") as string;
    const updates: Record<string, unknown> = {};
    const color = fd.get("color");
    const isVisible = fd.get("is_visible");
    if (color) updates.color = color;
    if (isVisible !== null) updates.is_visible = isVisible === "true";
    await fetch(`${apiUrl}/calendar/sub-accounts/${subCalId}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
  }

  if (intent === "update_account") {
    const accountId = fd.get("account_id") as string;
    const updates: Record<string, unknown> = {};
    const color = fd.get("color");
    const displayName = fd.get("display_name");
    if (color) updates.color = color;
    if (displayName !== null) updates.display_name = displayName || null;
    await fetch(`${apiUrl}/calendar/accounts/${accountId}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
  }

  return null;
}

// ── New Event Modal ───────────────────────────────────────────────────────────

function NewEventModal({
  accounts, defaultStart, defaultEnd, onClose,
}: {
  accounts: CalendarAccount[];
  defaultStart: string;
  defaultEnd: string;
  onClose: () => void;
}) {
  const fetcher = useFetcher();
  const [videoType, setVideoType] = useState<"none" | "meet" | "teams">("none");

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md rounded-xl border border-zinc-700 bg-zinc-900 p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-zinc-100">New Event</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-200 transition-colors"><X className="h-4 w-4" /></button>
        </div>

        <fetcher.Form method="post" onSubmit={() => setTimeout(onClose, 100)} className="space-y-4">
          <input type="hidden" name="intent" value="create_event" />
          {videoType === "meet" && <input type="hidden" name="add_google_meet" value="true" />}

          {accounts.length > 1 ? (
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Calendar Account</label>
              <select name="account_id" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500">
                {accounts.map((a) => <option key={a.id} value={a.id}>{a.email}</option>)}
              </select>
            </div>
          ) : (
            <input type="hidden" name="account_id" value={accounts[0]?.id} />
          )}

          <div>
            <label className="block text-xs text-zinc-500 mb-1">Title *</label>
            <input name="title" required autoFocus placeholder="Event title"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Start</label>
              <input name="start_at" type="datetime-local" defaultValue={defaultStart} required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">End</label>
              <input name="end_at" type="datetime-local" defaultValue={defaultEnd} required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-zinc-500 mb-1">Location</label>
            <input name="location" placeholder="Office, address, etc."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500" />
          </div>

          <div>
            <label className="block text-xs text-zinc-500 mb-1.5">Video Conferencing</label>
            <div className="flex gap-2 mb-2">
              {(["none", "meet", "teams"] as const).map((t) => (
                <button key={t} type="button" onClick={() => setVideoType(t)}
                  className={`px-2.5 py-1 text-xs rounded border transition-colors ${videoType === t ? "bg-emerald-600 border-emerald-500 text-white" : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"}`}>
                  {t === "none" ? "None" : t === "meet" ? "Google Meet" : "Teams / Zoom"}
                </button>
              ))}
            </div>
            {videoType === "teams" && (
              <input name="meeting_link" placeholder="Paste Teams or Zoom URL"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500" />
            )}
            {videoType === "meet" && <p className="text-xs text-zinc-500">Meet link generated automatically.</p>}
          </div>

          <div>
            <label className="block text-xs text-zinc-500 mb-1">Description</label>
            <textarea name="description" rows={2} placeholder="Agenda, notes..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 resize-none" />
          </div>

          <div>
            <label className="block text-xs text-zinc-500 mb-1">Attendees <span className="text-zinc-600">(comma-separated emails)</span></label>
            <input name="attendees" placeholder="john@example.com, jane@example.com"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500" />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2 text-sm text-zinc-400 hover:text-zinc-200 border border-zinc-700 rounded-lg transition-colors">Cancel</button>
            <button type="submit" disabled={fetcher.state !== "idle"}
              className="flex-1 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg disabled:opacity-50 transition-colors">
              {fetcher.state !== "idle" ? "Creating..." : "Create Event"}
            </button>
          </div>
        </fetcher.Form>
      </div>
    </div>
  );
}

// ── Event Detail Modal ────────────────────────────────────────────────────────

function EventDetailModal({ event, onClose }: { event: CalendarEvent; onClose: () => void }) {
  const detailFetcher = useFetcher();
  const editFetcher = useFetcher();
  const actionFetcher = useFetcher();
  const [isEditing, setIsEditing] = useState(false);
  const [videoType, setVideoType] = useState<"none" | "meet" | "teams">("none");
  const didLoad = useRef(false);

  useEffect(() => {
    if (!didLoad.current) {
      didLoad.current = true;
      detailFetcher.load(`/dashboard/calendar/${event.id}`);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
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

  const full = (detailFetcher.data as { event: FullEvent } | undefined)?.event;
  const isLoading = detailFetcher.state === "loading";
  const hasAttendees = Array.isArray(full?.attendees) && (full.attendees as unknown[]).length > 0;
  const actionUrl = `/dashboard/calendar/${event.id}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-lg max-h-[85vh] flex flex-col rounded-xl border border-zinc-700 bg-zinc-900 shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-zinc-800 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-zinc-100 break-words">{event.title}</h2>
              <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
                <Clock className="h-3 w-3 shrink-0" />
                <span>{formatDateTime(event.start_at)} — {formatTime(event.end_at)}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {event.is_time_block && (
                <span className="px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs rounded-md">Time Block</span>
              )}
              {!isEditing && full && (
                <button onClick={() => setIsEditing(true)}
                  className="p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors" title="Edit">
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
              )}
              <button onClick={onClose} className="p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading && !full ? (
            <div className="flex items-center justify-center py-10 text-xs text-zinc-500">Loading…</div>
          ) : full ? (
            <div className="px-6 py-5 space-y-4">

              {/* Edit form */}
              {isEditing && (
                <editFetcher.Form method="post" action={actionUrl} className="space-y-3">
                  <input type="hidden" name="intent" value="edit" />
                  {videoType === "meet" && <input type="hidden" name="add_google_meet" value="true" />}

                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">Title</label>
                    <input name="title" defaultValue={full.title}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">Start</label>
                      <input name="start_at" type="datetime-local" defaultValue={toLocalDateTimeInput(full.start_at)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">End</label>
                      <input name="end_at" type="datetime-local" defaultValue={toLocalDateTimeInput(full.end_at)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">Location</label>
                    <input name="location" defaultValue={full.location ?? ""} placeholder="Location"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1.5">Video</label>
                    <div className="flex gap-2 mb-1.5">
                      {(["none", "meet", "teams"] as const).map((t) => (
                        <button key={t} type="button" onClick={() => setVideoType(t)}
                          className={`px-2 py-1 text-xs rounded border transition-colors ${videoType === t ? "bg-emerald-600 border-emerald-500 text-white" : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"}`}>
                          {t === "none" ? "Keep" : t === "meet" ? "Google Meet" : "Teams/Zoom"}
                        </button>
                      ))}
                    </div>
                    {videoType === "teams" && (
                      <input name="meeting_link" defaultValue={full.meeting_link ?? ""} placeholder="Paste meeting URL"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500" />
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">Description</label>
                    <textarea name="description" defaultValue={full.description ?? ""} rows={2}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500 resize-none" />
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setIsEditing(false)}
                      className="flex-1 py-2 text-sm text-zinc-400 hover:text-zinc-200 border border-zinc-700 rounded-lg transition-colors">Cancel</button>
                    <button type="submit" disabled={editFetcher.state !== "idle"}
                      className="flex-1 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg disabled:opacity-50 transition-colors">
                      {editFetcher.state !== "idle" ? "Saving…" : "Save Changes"}
                    </button>
                  </div>
                </editFetcher.Form>
              )}

              {/* Details view */}
              {!isEditing && (
                <>
                  {full.location && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-zinc-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-zinc-300">{full.location}</span>
                    </div>
                  )}
                  {full.meeting_link && (
                    <div className="flex items-start gap-3">
                      <Video className="h-4 w-4 text-zinc-500 shrink-0 mt-0.5" />
                      <a href={full.meeting_link} target="_blank" rel="noopener noreferrer"
                        className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                        Join Meeting <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                  {full.description && (
                    <div>
                      <div className="text-xs text-zinc-500 uppercase tracking-wide mb-1.5">Description</div>
                      <div className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">{full.description}</div>
                    </div>
                  )}

                  {/* Attendees */}
                  {hasAttendees && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-3.5 w-3.5 text-zinc-500" />
                        <span className="text-xs text-zinc-500 uppercase tracking-wide">
                          Attendees ({(full.attendees as unknown[]).length})
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {(full.attendees as Array<{ email: string; name?: string; status?: string }>).map((a, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${STATUS_COLORS[a.status ?? "needsAction"] ?? "bg-zinc-500"}`} />
                            <span className="text-sm text-zinc-300">{a.name || a.email}</span>
                            {a.name && <span className="text-xs text-zinc-600">{a.email}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Prep */}
                  {hasAttendees && (
                    <div className="border border-zinc-800 rounded-lg px-4 py-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-zinc-200 flex items-center gap-2">
                            <Zap className="h-3.5 w-3.5 text-emerald-400" />
                            AI Meeting Prep
                          </div>
                          <div className="text-xs text-zinc-500 mt-0.5">Research attendees & generate briefing</div>
                        </div>
                        {full.knowledge ? (
                          <Link to={`/dashboard/knowledge/${(full.knowledge as { id: string }).id}`} onClick={onClose}
                            className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                            View <ExternalLink className="h-3 w-3" />
                          </Link>
                        ) : (
                          <actionFetcher.Form method="post" action={actionUrl}>
                            <input type="hidden" name="intent" value="prep" />
                            <button type="submit" disabled={actionFetcher.state !== "idle" || full.ai_prep_generated}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded-md disabled:opacity-50 transition-colors">
                              {full.ai_prep_generated ? "Generating…" : "Generate Brief"}
                            </button>
                          </actionFetcher.Form>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Linked task */}
                  {full.tasks && (
                    <div>
                      <div className="text-xs text-zinc-500 uppercase tracking-wide mb-1.5">Linked Task</div>
                      <Link to={`/dashboard/tasks/${(full.tasks as { id: string }).id}`} onClick={onClose}
                        className="flex items-center gap-2 text-sm text-zinc-300 hover:text-emerald-400 transition-colors">
                        <CheckSquare className="h-3.5 w-3.5 text-zinc-500" />
                        {(full.tasks as { title: string }).title}
                      </Link>
                    </div>
                  )}

                  {/* Delete time block */}
                  {full.is_time_block && (
                    <actionFetcher.Form method="post" onSubmit={onClose}>
                      <input type="hidden" name="intent" value="delete_time_block" />
                      <input type="hidden" name="event_id" value={event.id} />
                      <button type="submit" className="text-xs text-red-500 hover:text-red-400 transition-colors">
                        Remove time block
                      </button>
                    </actionFetcher.Form>
                  )}
                </>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ── Calendar Account Settings Modal ──────────────────────────────────────────

function CalendarSettingsModal({
  account,
  onClose,
}: {
  account: CalendarAccount;
  onClose: () => void;
}) {
  const fetcher = useFetcher();
  const [color, setColor] = useState(account.color ?? "#2FE8B6");
  const [displayName, setDisplayName] = useState((account as CalendarAccount & { display_name?: string }).display_name ?? "");

  function handleSave() {
    const fd = new FormData();
    fd.set("intent", "update_account");
    fd.set("account_id", account.id);
    fd.set("color", color);
    fd.set("display_name", displayName);
    fetcher.submit(fd, { method: "post" });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-700 rounded-xl p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-zinc-100">Calendar Settings</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-200"><X className="h-4 w-4" /></button>
        </div>

        <p className="text-xs text-zinc-500 mb-4">{account.email}</p>

        <div className="mb-4">
          <label className="block text-xs text-zinc-400 mb-1.5">Display Name (optional)</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder={account.email.split("@")[0]}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-xs text-zinc-400 mb-2">Account Color</label>
          <div className="grid grid-cols-5 gap-2">
            {COLOR_SWATCHES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-transform ${color === c ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-900 scale-110" : "hover:scale-105"}`}
                style={{ backgroundColor: c }}
                title={c}
              >
                {color === c && <Check className="h-4 w-4 text-white" />}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 text-xs text-zinc-400 hover:text-zinc-200 border border-zinc-700 rounded-lg">Cancel</button>
          <button onClick={handleSave} className="flex-1 py-2 text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg">Save</button>
        </div>
      </div>
    </div>
  );
}

// ── Main Calendar Component ───────────────────────────────────────────────────

export default function Calendar() {
  const { events, accounts, tasks, subCalendars, view, weekOffset, weekStart } =
    useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const [draggedTask, setDraggedTask] = useState<{ id: string; title: string } | null>(null);
  const [newEventModal, setNewEventModal] = useState<{ start: string; end: string } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [settingsAccount, setSettingsAccount] = useState<CalendarAccount | null>(null);

  // Sub-calendar visibility + color overrides (local state)
  const [hiddenSubCals, setHiddenSubCals] = useState<Set<string>>(new Set());
  const [subCalColors, setSubCalColors] = useState<Record<string, string>>({});
  const [colorPickerFor, setColorPickerFor] = useState<string | null>(null);

  const weekStartDate = new Date(weekStart);

  // Look up DB sub-cal by Google calendar ID (external_id)
  function findSubCal(googleCalId: string | null, accountId: string): SubCalendar | undefined {
    if (!googleCalId) return undefined;
    const entry = (subCalendars as SubCalendarEntry[]).find((s) => s.accountId === accountId);
    return entry?.calendars.find((c) => c.external_id === googleCalId);
  }

  // Build sub-cal color (user override first, then DB color, then account color)
  function getSubCalColor(googleCalId: string | null, accountId: string): string {
    const sub = findSubCal(googleCalId, accountId);
    if (sub) return subCalColors[sub.id] ?? sub.color;
    const account = (accounts as CalendarAccount[]).find((a) => a.id === accountId);
    return account?.color ?? "#2FE8B6";
  }

  // Filter events by hidden sub-cals (hiddenSubCals stores DB UUIDs)
  const visibleEvents = (events as CalendarEvent[]).filter((e) => {
    const sub = findSubCal(e.google_calendar_id, e.account_id);
    if (sub && hiddenSubCals.has(sub.id)) return false;
    return true;
  });

  function toggleSubCal(subCalId: string) {
    setHiddenSubCals((prev) => {
      const next = new Set(prev);
      if (next.has(subCalId)) next.delete(subCalId);
      else next.add(subCalId);
      return next;
    });
  }

  function getEventChipStyle(event: CalendarEvent) {
    const { top, height } = eventPosition(event);
    const color = getSubCalColor(event.google_calendar_id, event.account_id);
    return {
      position: "absolute" as const,
      top, height, left: 2, right: 2,
      backgroundColor: `${color}22`,
      borderLeft: `3px solid ${color}aa`,
      zIndex: 2,
    };
  }

  function handleDrop(e: React.DragEvent, dayIndex: number, hour: number) {
    e.preventDefault();
    if (!draggedTask || accounts.length === 0) return;
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

  function handleCellClick(dayIndex: number, hour: number) {
    if (draggedTask || accounts.length === 0) return;
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

  return (
    <div className="flex h-full overflow-hidden" onClick={() => setColorPickerFor(null)}>
      {/* Modals */}
      {newEventModal && accounts.length > 0 && (
        <NewEventModal
          accounts={accounts as CalendarAccount[]}
          defaultStart={newEventModal.start}
          defaultEnd={newEventModal.end}
          onClose={() => setNewEventModal(null)}
        />
      )}
      {selectedEvent && (
        <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
      {settingsAccount && (
        <CalendarSettingsModal account={settingsAccount} onClose={() => setSettingsAccount(null)} />
      )}

      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-zinc-800 flex flex-col overflow-hidden">
        {/* Unscheduled tasks */}
        <div className="p-4 border-b border-zinc-800 shrink-0">
          <h2 className="text-xs font-semibold text-zinc-300 mb-0.5">Unscheduled Tasks</h2>
          <p className="text-xs text-zinc-500">Drag onto calendar to block time</p>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 min-h-0">
          {tasks.length === 0 && <p className="text-xs text-zinc-500 italic">All tasks scheduled</p>}
          {tasks.map((task) => (
            <div key={task.id} draggable
              onDragStart={() => setDraggedTask({ id: task.id, title: task.title })}
              onDragEnd={() => setDraggedTask(null)}
              className="p-2 bg-zinc-900 border border-zinc-800 rounded cursor-grab hover:border-zinc-600 transition-colors select-none">
              <div className="text-xs font-medium truncate text-zinc-200">{task.title}</div>
              {task.due_date && (
                <div className="text-xs text-zinc-500 mt-0.5">
                  Due {new Date(task.due_date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Calendars section */}
        <div className="p-3 border-t border-zinc-800 shrink-0">
          <div className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Calendars</div>
          {accounts.length === 0 ? (
            <a href="https://api.sheetzlabs.com/calendar/auth/google"
              className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300">
              <Plus className="h-3 w-3" />Connect Google Calendar
            </a>
          ) : (
            <div className="space-y-3">
              {(accounts as CalendarAccount[]).map((account) => {
                const entry = (subCalendars as SubCalendarEntry[]).find((s) => s.accountId === account.id);
                const cals = entry?.calendars ?? [];

                return (
                  <div key={account.id}>
                    {/* Account header */}
                    <div className="flex items-center gap-1.5 mb-1 group/acct">
                      <span className="text-xs font-medium text-zinc-400 truncate flex-1">
                        {(account as CalendarAccount & { display_name?: string }).display_name || account.email.split("@")[0]}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setSettingsAccount(account as CalendarAccount); }}
                        title="Settings"
                        className="text-zinc-600 hover:text-zinc-300 transition-colors opacity-0 group-hover/acct:opacity-100"
                      >
                        <Settings className="h-3 w-3" />
                      </button>
                      <fetcher.Form method="post">
                        <input type="hidden" name="intent" value="sync" />
                        <input type="hidden" name="account_id" value={account.id} />
                        <button type="submit" title="Sync" className="text-zinc-600 hover:text-zinc-300 transition-colors">
                          <RefreshCw className="h-3 w-3" />
                        </button>
                      </fetcher.Form>
                    </div>

                    {/* Sub-calendars */}
                    {cals.length > 0 ? (
                      <div className="space-y-1 pl-1">
                        {cals.map((cal) => {
                          const color = subCalColors[cal.id] ?? cal.color ?? account.color ?? "#2FE8B6";
                          const isHidden = hiddenSubCals.has(cal.id);
                          return (
                            <div key={cal.id} className="flex items-center gap-1.5 group/cal">
                              {/* Color swatch (click to pick color) */}
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setColorPickerFor(colorPickerFor === cal.id ? null : cal.id);
                                  }}
                                  className="w-3 h-3 rounded-sm shrink-0 border border-black/20 hover:scale-110 transition-transform"
                                  style={{ backgroundColor: isHidden ? "transparent" : color, borderColor: color, opacity: isHidden ? 0.4 : 1 }}
                                  title="Change color"
                                />
                                {/* Color picker popover */}
                                {colorPickerFor === cal.id && (
                                  <div
                                    className="absolute left-0 top-full mt-1 z-30 bg-zinc-800 border border-zinc-700 rounded-lg p-2 shadow-xl"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <div className="grid grid-cols-5 gap-1">
                                      {COLOR_SWATCHES.map((c) => (
                                        <button key={c} type="button"
                                          onClick={() => {
                                            setSubCalColors((prev) => ({ ...prev, [cal.id]: c }));
                                            setColorPickerFor(null);
                                            // Persist to API
                                            const fd = new FormData();
                                            fd.set("intent", "update_sub_cal");
                                            fd.set("sub_cal_id", cal.id);
                                            fd.set("color", c);
                                            fetcher.submit(fd, { method: "post" });
                                          }}
                                          className="w-4 h-4 rounded-sm hover:scale-110 transition-transform border border-black/20"
                                          style={{ backgroundColor: c }} />
                                      ))}
                                    </div>
                                    {subCalColors[cal.id] && (
                                      <button type="button"
                                        onClick={() => { setSubCalColors((prev) => { const n = { ...prev }; delete n[cal.id]; return n; }); setColorPickerFor(null); }}
                                        className="w-full mt-1.5 text-[10px] text-zinc-500 hover:text-zinc-300 text-center">
                                        Reset
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>

                              {/* Sub-cal name */}
                              <span className={`text-xs truncate flex-1 ${isHidden ? "text-zinc-600" : "text-zinc-400"}`}>
                                {cal.name}
                              </span>

                              {/* Toggle visibility */}
                              <button type="button" onClick={() => toggleSubCal(cal.id)}
                                className="shrink-0 text-zinc-600 opacity-0 group-hover/cal:opacity-100 hover:text-zinc-300 transition-all"
                                title={isHidden ? "Show" : "Hide"}>
                                {isHidden ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      /* Fallback: account-level toggle when no sub-cals loaded */
                      <div className="pl-1 text-xs text-zinc-600 italic">No calendars loaded</div>
                    )}
                  </div>
                );
              })}

              <a href="https://api.sheetzlabs.com/calendar/auth/google"
                className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 mt-1">
                <Plus className="h-3 w-3" />Add account
              </a>
              <Link to="/dashboard/calendar/booking-links"
                className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 mt-1">
                <Link2 className="h-3 w-3" />Booking Links
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Calendar grid */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Link to={`/dashboard/calendar?view=${view}&offset=${prevOffset}`}
                className="px-2 py-1 text-xs text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded">‹</Link>
              <Link to={`/dashboard/calendar?view=${view}&offset=0`}
                className="px-2 py-1 text-xs text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded">Today</Link>
              <Link to={`/dashboard/calendar?view=${view}&offset=${nextOffset}`}
                className="px-2 py-1 text-xs text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded">›</Link>
            </div>
            <h1 className="text-sm font-semibold text-zinc-200">
              {weekStartDate.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link to={`/dashboard/calendar?view=day&offset=${weekOffset}`}
              className={`px-3 py-1.5 text-xs rounded transition-colors ${view === "day" ? "bg-zinc-800 text-zinc-200" : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50"}`}>Day</Link>
            <Link to={`/dashboard/calendar?view=week&offset=${weekOffset}`}
              className={`px-3 py-1.5 text-xs rounded transition-colors ${view === "week" ? "bg-zinc-800 text-zinc-200" : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50"}`}>Week</Link>
            <button onClick={openNewEventDefault} disabled={accounts.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              <Plus className="h-3 w-3" />New Event
            </button>
          </div>
        </div>

        {/* Scrollable grid */}
        <div className="flex-1 overflow-auto">
          {/* Day headers — sticky */}
          <div className="grid border-b border-zinc-800 sticky top-0 bg-zinc-950 z-10"
            style={{ gridTemplateColumns: "44px repeat(7, 1fr)" }}>
            <div className="border-r border-zinc-800" />
            {DAYS.map((day, i) => {
              const d = new Date(weekStartDate);
              d.setDate(weekStartDate.getDate() + i);
              const isToday = d.toDateString() === new Date().toDateString();
              return (
                <div key={day} className="px-2 py-2 text-center border-r border-zinc-800 last:border-r-0">
                  <div className="text-xs text-zinc-500">{day}</div>
                  <div className={`text-sm font-medium mt-0.5 ${isToday ? "text-emerald-400" : "text-zinc-300"}`}>{d.getDate()}</div>
                </div>
              );
            })}
          </div>

          {/* Grid body */}
          <div className="flex" style={{ height: VISIBLE_HOURS * HOUR_HEIGHT }}>
            {/* Time labels */}
            <div className="w-11 shrink-0 relative border-r border-zinc-800" style={{ height: VISIBLE_HOURS * HOUR_HEIGHT }}>
              {HOURS.map((hour, i) => (
                <div key={hour}
                  style={{ position: "absolute", top: i * HOUR_HEIGHT - 9, height: HOUR_HEIGHT, right: 0, left: 0 }}
                  className="pr-1.5 text-right text-[10px] text-zinc-600">
                  {formatHour(hour)}
                </div>
              ))}
            </div>

            {/* Day columns */}
            {DAYS.map((_, dayIndex) => {
              const dayEvents = getEventsForDay(dayIndex, weekStartDate, visibleEvents);
              return (
                <div key={dayIndex} className="flex-1 relative border-r border-zinc-800/40 last:border-r-0"
                  style={{ height: VISIBLE_HOURS * HOUR_HEIGHT }}>
                  {/* Hour background slots */}
                  {HOURS.map((hour, i) => (
                    <div key={hour}
                      style={{ position: "absolute", top: i * HOUR_HEIGHT, height: HOUR_HEIGHT, left: 0, right: 0 }}
                      className="border-b border-zinc-800/30 hover:bg-zinc-800/15 transition-colors cursor-pointer group"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDrop(e, dayIndex, hour)}
                      onClick={() => handleCellClick(dayIndex, hour)}>
                      {accounts.length > 0 && !draggedTask && (
                        <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-zinc-600 text-xs pointer-events-none">+</span>
                      )}
                    </div>
                  ))}

                  {/* Events */}
                  {dayEvents.map((event) => (
                    <button
                      key={event.id}
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); }}
                      style={getEventChipStyle(event)}
                      className="overflow-hidden rounded-sm px-1.5 py-0.5 text-left w-full hover:brightness-110 transition-all"
                    >
                      <div className="truncate text-xs font-medium text-zinc-200 leading-tight">
                        {event.is_time_block ? "⏱ " : ""}{event.title}
                      </div>
                      <div className="text-[10px] text-zinc-400 leading-tight">
                        {formatTime(event.start_at)}
                      </div>
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer legend */}
        <div className="flex items-center gap-3 px-4 py-2 border-t border-zinc-800 text-xs text-zinc-500 shrink-0">
          {draggedTask ? (
            <span className="text-emerald-400">Drop &ldquo;{draggedTask.title}&rdquo; onto a time slot</span>
          ) : (
            accounts.length > 0 && <span className="text-zinc-600">Click a slot to create an event · Click an event to open it</span>
          )}
        </div>
      </div>
    </div>
  );
}
