import type { LoaderFunctionArgs, ActionFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData, Link, useFetcher } from "react-router";
import { useState } from "react";
import { RefreshCw, Plus, X, Eye, EyeOff, Video } from "lucide-react";
import { getSupabaseClient } from "~/lib/supabase.server";

export const meta: MetaFunction = () => [{ title: "Calendar — Sheetz Labs OS" }];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const START_HOUR = 7;
const HOUR_HEIGHT = 64; // px per hour
const VISIBLE_HOURS = 13; // 7am–7pm
const HOURS = Array.from({ length: VISIBLE_HOURS }, (_, i) => i + START_HOUR);

function formatHour(hour: number) {
  if (hour === 12) return "12pm";
  return hour > 12 ? `${hour - 12}pm` : `${hour}am`;
}

function getWeekStart(date: Date) {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
}

function toLocalDateTimeInput(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

type CalendarEvent = {
  id: string;
  title: string;
  start_at: string;
  end_at: string;
  is_time_block: boolean;
  all_day: boolean;
  account_id: string;
  task_id: string | null;
};

type CalendarAccount = {
  id: string;
  email: string;
  color: string | null;
  sync_enabled: boolean;
  last_sync_at: string | null;
};

function getEventsForDay(
  dayIndex: number,
  weekStartDate: Date,
  events: CalendarEvent[]
): CalendarEvent[] {
  const cellDate = new Date(weekStartDate);
  cellDate.setDate(weekStartDate.getDate() + dayIndex);
  return events.filter((e) => {
    if (e.all_day) return false;
    const start = new Date(e.start_at);
    return (
      start.getFullYear() === cellDate.getFullYear() &&
      start.getMonth() === cellDate.getMonth() &&
      start.getDate() === cellDate.getDate()
    );
  });
}

function eventPosition(event: CalendarEvent): { top: number; height: number } {
  const start = new Date(event.start_at);
  const end = new Date(event.end_at);
  const startFrac = Math.max(0, start.getHours() - START_HOUR + start.getMinutes() / 60);
  const endFrac = Math.min(
    VISIBLE_HOURS,
    end.getHours() - START_HOUR + end.getMinutes() / 60
  );
  return {
    top: startFrac * HOUR_HEIGHT,
    height: Math.max(22, (endFrac - startFrac) * HOUR_HEIGHT),
  };
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const supabase = getSupabaseClient(context.cloudflare.env);
  const url = new URL(request.url);
  const view = url.searchParams.get("view") || "week";
  const weekOffset = parseInt(url.searchParams.get("offset") || "0", 10);

  const now = new Date();
  now.setDate(now.getDate() + weekOffset * 7);

  let start: Date;
  let end: Date;

  if (view === "day") {
    start = new Date(now);
    start.setHours(0, 0, 0, 0);
    end = new Date(now);
    end.setHours(23, 59, 59, 999);
  } else {
    start = getWeekStart(now);
    end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
  }

  const [eventsRes, accountsRes, tasksRes] = await Promise.all([
    supabase
      .from("calendar_events")
      .select("id, title, start_at, end_at, is_time_block, all_day, account_id, task_id")
      .gte("start_at", start.toISOString())
      .lte("start_at", end.toISOString())
      .order("start_at"),
    supabase
      .from("calendar_accounts")
      .select("id, email, color, sync_enabled, last_sync_at")
      .order("email"),
    supabase
      .from("tasks")
      .select("id, title, due_date, priority, status")
      .in("status", ["todo", "in_progress"])
      .order("due_date", { nullsFirst: false }),
  ]);

  const { data: blockedTasks } = await supabase
    .from("calendar_events")
    .select("task_id")
    .eq("is_time_block", true)
    .not("task_id", "is", null);

  const blockedIds = new Set((blockedTasks ?? []).map((e) => e.task_id as string));
  const unscheduled = (tasksRes.data ?? []).filter((t) => !blockedIds.has(t.id));

  return {
    events: eventsRes.data ?? [],
    accounts: accountsRes.data ?? [],
    tasks: unscheduled,
    view,
    weekOffset,
    weekStart: start.toISOString(),
  };
}

export async function action({ request, context }: ActionFunctionArgs) {
  const apiUrl =
    (context.cloudflare.env as Record<string, string>).INTERNAL_API_URL ??
    "https://api.sheetzlabs.com";

  const fd = await request.formData();
  const intent = fd.get("intent") as string;

  if (intent === "sync") {
    const accountId = fd.get("account_id") as string;
    await fetch(`${apiUrl}/calendar/accounts/${accountId}/sync`, { method: "POST" });
  }

  if (intent === "create_time_block") {
    await fetch(`${apiUrl}/calendar/time-blocks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        task_id: fd.get("task_id"),
        account_id: fd.get("account_id"),
        start_at: fd.get("start_at"),
        end_at: fd.get("end_at"),
      }),
    });
  }

  if (intent === "create_event") {
    const startLocal = fd.get("start_at") as string;
    const endLocal = fd.get("end_at") as string;
    const attendeesRaw = (fd.get("attendees") as string) || "";

    const attendees = attendeesRaw
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean)
      .map((email) => ({ email }));

    await fetch(`${apiUrl}/calendar/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        account_id: fd.get("account_id"),
        title: fd.get("title"),
        description: fd.get("description") || undefined,
        location: fd.get("location") || undefined,
        start_at: new Date(startLocal).toISOString(),
        end_at: new Date(endLocal).toISOString(),
        attendees,
        add_google_meet: fd.get("add_google_meet") === "true",
        meeting_link: fd.get("meeting_link") || undefined,
      }),
    });
  }

  return null;
}

// ── New Event Modal ──────────────────────────────────────────────────────────

interface NewEventModalProps {
  accounts: CalendarAccount[];
  defaultStart: string;
  defaultEnd: string;
  onClose: () => void;
}

function NewEventModal({ accounts, defaultStart, defaultEnd, onClose }: NewEventModalProps) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state !== "idle";
  const [videoType, setVideoType] = useState<"none" | "meet" | "teams">("none");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-zinc-700 bg-zinc-900 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-zinc-100">New Event</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-200 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <fetcher.Form
          method="post"
          onSubmit={() => setTimeout(onClose, 100)}
          className="space-y-4"
        >
          <input type="hidden" name="intent" value="create_event" />
          {videoType === "meet" && <input type="hidden" name="add_google_meet" value="true" />}

          {/* Calendar account */}
          {accounts.length > 1 && (
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Calendar Account</label>
              <select
                name="account_id"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500"
              >
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.email}
                  </option>
                ))}
              </select>
            </div>
          )}
          {accounts.length === 1 && (
            <input type="hidden" name="account_id" value={accounts[0].id} />
          )}

          {/* Title */}
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Title *</label>
            <input
              name="title"
              required
              autoFocus
              placeholder="Event title"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Start / End */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Start</label>
              <input
                name="start_at"
                type="datetime-local"
                defaultValue={defaultStart}
                required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">End</label>
              <input
                name="end_at"
                type="datetime-local"
                defaultValue={defaultEnd}
                required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Location</label>
            <input
              name="location"
              placeholder="Office, address, etc."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Video conferencing */}
          <div>
            <label className="block text-xs text-zinc-500 mb-1.5">
              <Video className="inline h-3 w-3 mr-1" />
              Video Conferencing
            </label>
            <div className="flex gap-2 mb-2">
              {(["none", "meet", "teams"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setVideoType(type)}
                  className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                    videoType === type
                      ? "bg-emerald-600 border-emerald-500 text-white"
                      : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"
                  }`}
                >
                  {type === "none" ? "None" : type === "meet" ? "Google Meet" : "Teams / Zoom"}
                </button>
              ))}
            </div>
            {videoType === "teams" && (
              <input
                name="meeting_link"
                placeholder="Paste Teams or Zoom meeting URL"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
              />
            )}
            {videoType === "meet" && (
              <p className="text-xs text-zinc-500">A Google Meet link will be generated automatically.</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Description</label>
            <textarea
              name="description"
              rows={2}
              placeholder="Agenda, notes..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          {/* Attendees */}
          <div>
            <label className="block text-xs text-zinc-500 mb-1">
              Attendees <span className="text-zinc-600">(emails, comma-separated)</span>
            </label>
            <input
              name="attendees"
              placeholder="john@example.com, jane@example.com"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 text-sm text-zinc-400 hover:text-zinc-200 border border-zinc-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? "Creating..." : "Create Event"}
            </button>
          </div>
        </fetcher.Form>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function Calendar() {
  const { events, accounts, tasks, view, weekOffset, weekStart } =
    useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [draggedTask, setDraggedTask] = useState<{ id: string; title: string } | null>(null);
  const [newEventModal, setNewEventModal] = useState<{ start: string; end: string } | null>(null);
  const [hiddenAccounts, setHiddenAccounts] = useState<Set<string>>(new Set());

  const weekStartDate = new Date(weekStart);

  // Build color map: accountId -> color
  const accountColorMap = Object.fromEntries(
    accounts.map((a) => [a.id, a.color ?? "#2FE8B6"])
  );

  // Filter events by hidden accounts
  const visibleEvents = (events as CalendarEvent[]).filter(
    (e) => !hiddenAccounts.has(e.account_id)
  );

  function toggleAccount(accountId: string) {
    setHiddenAccounts((prev) => {
      const next = new Set(prev);
      if (next.has(accountId)) next.delete(accountId);
      else next.add(accountId);
      return next;
    });
  }

  function getEventStyle(event: CalendarEvent) {
    const { top, height } = eventPosition(event);
    const color = accountColorMap[event.account_id] ?? "#2FE8B6";
    return {
      position: "absolute" as const,
      top,
      height,
      left: 2,
      right: 2,
      backgroundColor: `${color}22`,
      borderLeft: `3px solid ${color}88`,
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
    endDate.setHours(hour + 1, 0, 0, 0);

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
    endDate.setHours(hour + 1, 0, 0, 0);
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
    setNewEventModal({
      start: toLocalDateTimeInput(now.toISOString()),
      end: toLocalDateTimeInput(end.toISOString()),
    });
  }

  const prevOffset = weekOffset - 1;
  const nextOffset = weekOffset + 1;

  return (
    <div className="flex h-full overflow-hidden">
      {newEventModal && accounts.length > 0 && (
        <NewEventModal
          accounts={accounts as CalendarAccount[]}
          defaultStart={newEventModal.start}
          defaultEnd={newEventModal.end}
          onClose={() => setNewEventModal(null)}
        />
      )}

      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-zinc-800 flex flex-col overflow-hidden">
        {/* Unscheduled tasks */}
        <div className="p-4 border-b border-zinc-800">
          <h2 className="text-xs font-semibold text-zinc-300 mb-0.5">Unscheduled Tasks</h2>
          <p className="text-xs text-zinc-500">Drag onto calendar to block time</p>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 min-h-0">
          {tasks.length === 0 && (
            <p className="text-xs text-zinc-500 italic">All tasks scheduled</p>
          )}
          {tasks.map((task) => (
            <div
              key={task.id}
              draggable
              onDragStart={() => setDraggedTask({ id: task.id, title: task.title })}
              onDragEnd={() => setDraggedTask(null)}
              className="p-2 bg-zinc-900 border border-zinc-800 rounded cursor-grab hover:border-zinc-600 transition-colors select-none"
            >
              <div className="text-xs font-medium truncate text-zinc-200">{task.title}</div>
              {task.due_date && (
                <div className="text-xs text-zinc-500 mt-0.5">
                  Due{" "}
                  {new Date(task.due_date).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Connected Calendars */}
        <div className="p-3 border-t border-zinc-800 shrink-0">
          <div className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Calendars</div>
          {accounts.length === 0 ? (
            <a
              href="https://api.sheetzlabs.com/calendar/auth/google"
              className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300"
            >
              <Plus className="h-3 w-3" />
              Connect Google Calendar
            </a>
          ) : (
            <div className="space-y-1.5">
              {(accounts as CalendarAccount[]).map((account) => {
                const isHidden = hiddenAccounts.has(account.id);
                const color = account.color ?? "#2FE8B6";
                return (
                  <div key={account.id} className="flex items-center gap-1.5">
                    {/* Toggle visibility */}
                    <button
                      onClick={() => toggleAccount(account.id)}
                      className="flex items-center gap-1.5 flex-1 min-w-0 text-left group"
                      title={isHidden ? "Show calendar" : "Hide calendar"}
                    >
                      <span
                        className="w-3 h-3 rounded-sm shrink-0 border transition-opacity"
                        style={{
                          backgroundColor: isHidden ? "transparent" : color,
                          borderColor: color,
                          opacity: isHidden ? 0.5 : 1,
                        }}
                      />
                      <span
                        className={`text-xs truncate flex-1 transition-colors ${
                          isHidden ? "text-zinc-600" : "text-zinc-400 group-hover:text-zinc-200"
                        }`}
                      >
                        {account.email}
                      </span>
                      {isHidden ? (
                        <EyeOff className="h-3 w-3 text-zinc-600 shrink-0" />
                      ) : (
                        <Eye className="h-3 w-3 text-zinc-600 opacity-0 group-hover:opacity-100 shrink-0 transition-opacity" />
                      )}
                    </button>

                    {/* Sync button */}
                    <fetcher.Form method="post">
                      <input type="hidden" name="intent" value="sync" />
                      <input type="hidden" name="account_id" value={account.id} />
                      <button
                        type="submit"
                        title="Sync calendar"
                        className="text-zinc-600 hover:text-zinc-300 transition-colors shrink-0"
                      >
                        <RefreshCw className="h-3 w-3" />
                      </button>
                    </fetcher.Form>
                  </div>
                );
              })}
              <a
                href="https://api.sheetzlabs.com/calendar/auth/google"
                className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 mt-2"
              >
                <Plus className="h-3 w-3" />
                Add account
              </a>
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
              <Link
                to={`/dashboard/calendar?view=${view}&offset=${prevOffset}`}
                className="px-2 py-1 text-xs text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded"
              >
                ‹
              </Link>
              <Link
                to={`/dashboard/calendar?view=${view}&offset=0`}
                className="px-2 py-1 text-xs text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded"
              >
                Today
              </Link>
              <Link
                to={`/dashboard/calendar?view=${view}&offset=${nextOffset}`}
                className="px-2 py-1 text-xs text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded"
              >
                ›
              </Link>
            </div>
            <h1 className="text-sm font-semibold text-zinc-200">
              {weekStartDate.toLocaleDateString(undefined, {
                month: "long",
                year: "numeric",
              })}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/dashboard/calendar?view=day&offset=${weekOffset}`}
              className={`px-3 py-1.5 text-xs rounded transition-colors ${
                view === "day"
                  ? "bg-zinc-800 text-zinc-200"
                  : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50"
              }`}
            >
              Day
            </Link>
            <Link
              to={`/dashboard/calendar?view=week&offset=${weekOffset}`}
              className={`px-3 py-1.5 text-xs rounded transition-colors ${
                view === "week"
                  ? "bg-zinc-800 text-zinc-200"
                  : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50"
              }`}
            >
              Week
            </Link>
            <button
              onClick={openNewEventDefault}
              disabled={accounts.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus className="h-3 w-3" />
              New Event
            </button>
          </div>
        </div>

        {/* Scrollable grid */}
        <div className="flex-1 overflow-auto">
          {/* Sticky day headers */}
          <div
            className="grid border-b border-zinc-800 sticky top-0 bg-zinc-950 z-10"
            style={{ gridTemplateColumns: "48px repeat(7, 1fr)" }}
          >
            <div className="border-r border-zinc-800" />
            {DAYS.map((day, i) => {
              const d = new Date(weekStartDate);
              d.setDate(weekStartDate.getDate() + i);
              const isToday = d.toDateString() === new Date().toDateString();
              return (
                <div
                  key={day}
                  className="px-2 py-2 text-center border-r border-zinc-800 last:border-r-0"
                >
                  <div className="text-xs text-zinc-500">{day}</div>
                  <div
                    className={`text-sm font-medium mt-0.5 ${
                      isToday ? "text-emerald-400" : "text-zinc-300"
                    }`}
                  >
                    {d.getDate()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Grid body: time labels + day columns */}
          <div
            className="flex"
            style={{ height: VISIBLE_HOURS * HOUR_HEIGHT }}
          >
            {/* Time labels */}
            <div
              className="w-12 shrink-0 relative border-r border-zinc-800"
              style={{ height: VISIBLE_HOURS * HOUR_HEIGHT }}
            >
              {HOURS.map((hour, i) => (
                <div
                  key={hour}
                  style={{
                    position: "absolute",
                    top: i * HOUR_HEIGHT - 9,
                    height: HOUR_HEIGHT,
                    right: 0,
                    left: 0,
                  }}
                  className="pr-2 text-right text-xs text-zinc-600"
                >
                  {formatHour(hour)}
                </div>
              ))}
            </div>

            {/* Day columns */}
            {DAYS.map((_, dayIndex) => {
              const dayEvents = getEventsForDay(dayIndex, weekStartDate, visibleEvents);
              return (
                <div
                  key={dayIndex}
                  className="flex-1 relative border-r border-zinc-800/40 last:border-r-0"
                  style={{ height: VISIBLE_HOURS * HOUR_HEIGHT }}
                >
                  {/* Hour slots — background + click/drop */}
                  {HOURS.map((hour, i) => (
                    <div
                      key={hour}
                      style={{
                        position: "absolute",
                        top: i * HOUR_HEIGHT,
                        height: HOUR_HEIGHT,
                        left: 0,
                        right: 0,
                      }}
                      className="border-b border-zinc-800/30 hover:bg-zinc-800/15 transition-colors cursor-pointer group"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDrop(e, dayIndex, hour)}
                      onClick={() => handleCellClick(dayIndex, hour)}
                    >
                      {accounts.length > 0 && !draggedTask && (
                        <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-zinc-600 text-xs pointer-events-none">
                          +
                        </span>
                      )}
                    </div>
                  ))}

                  {/* Events — absolutely positioned by actual start/end times */}
                  {dayEvents.map((event) => (
                    <Link
                      key={event.id}
                      to={`/dashboard/calendar/${event.id}`}
                      onClick={(e) => e.stopPropagation()}
                      style={getEventStyle(event)}
                      className="overflow-hidden rounded-sm px-1.5 py-0.5 text-xs font-medium text-zinc-200 hover:brightness-110 transition-all"
                    >
                      <div className="truncate leading-tight">
                        {event.is_time_block ? "⏱ " : ""}{event.title}
                      </div>
                      <div className="text-zinc-400 text-[10px] leading-tight">
                        {new Date(event.start_at).toLocaleTimeString(undefined, {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </div>
                    </Link>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 px-4 py-2 border-t border-zinc-800 text-xs text-zinc-500 shrink-0">
          {accounts.map((a) => (
            <span key={a.id} className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-sm"
                style={{ backgroundColor: a.color ?? "#2FE8B6", opacity: hiddenAccounts.has(a.id) ? 0.3 : 1 }}
              />
              {a.email.split("@")[0]}
            </span>
          ))}
          {draggedTask ? (
            <span className="ml-auto text-emerald-400">
              Drop &ldquo;{draggedTask.title}&rdquo; onto a time slot
            </span>
          ) : (
            accounts.length > 0 && (
              <span className="ml-auto text-zinc-600">Click any slot to create an event</span>
            )
          )}
        </div>
      </div>
    </div>
  );
}
