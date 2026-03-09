import type { LoaderFunctionArgs, ActionFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData, Link, useFetcher, useSearchParams } from "react-router";
import { useState } from "react";
import { CalendarDays, RefreshCw, Plus, Zap } from "lucide-react";
import { Header } from "~/components/dashboard/Header";
import { getSupabaseClient } from "~/lib/supabase.server";
import { EmptyState } from "~/components/ui/EmptyState";

export const meta: MetaFunction = () => [{ title: "Calendar — Sheetz Labs OS" }];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 7); // 7am–6pm

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

  // Filter out tasks already time-blocked
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

  return null;
}

export default function Calendar() {
  const { events, accounts, tasks, view, weekOffset, weekStart } =
    useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const fetcher = useFetcher();
  const [draggedTask, setDraggedTask] = useState<{ id: string; title: string } | null>(null);

  const weekStartDate = new Date(weekStart);

  function getEventColor(event: { is_time_block: boolean }) {
    if (event.is_time_block) return "bg-emerald-500/20 border-emerald-500/40 text-emerald-300";
    return "bg-blue-500/20 border-blue-500/40 text-blue-300";
  }

  function getEventsForCell(dayIndex: number, hour: number) {
    const cellDate = new Date(weekStartDate);
    cellDate.setDate(weekStartDate.getDate() + dayIndex);

    return events.filter((e) => {
      const start = new Date(e.start_at);
      return start.getDay() === cellDate.getDay() &&
        start.getDate() === cellDate.getDate() &&
        start.getHours() === hour;
    });
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

  const prevOffset = weekOffset - 1;
  const nextOffset = weekOffset + 1;

  return (
    <div className="flex h-full overflow-hidden">
      {/* Task sidebar */}
      <aside className="w-60 shrink-0 border-r border-zinc-800 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-zinc-800">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold">Unscheduled Tasks</h2>
          </div>
          <p className="text-xs text-zinc-500">Drag onto calendar to block time</p>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
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
                  Due {new Date(task.due_date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Connected Calendars */}
        <div className="p-3 border-t border-zinc-800">
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
            <div className="space-y-2">
              {accounts.map((account) => (
                <div key={account.id} className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-sm shrink-0"
                    style={{ backgroundColor: account.color ?? "#2FE8B6" }}
                  />
                  <span className="text-xs text-zinc-400 truncate flex-1">{account.email}</span>
                  <fetcher.Form method="post">
                    <input type="hidden" name="intent" value="sync" />
                    <input type="hidden" name="account_id" value={account.id} />
                    <button
                      type="submit"
                      title="Sync"
                      className="text-zinc-600 hover:text-zinc-300 transition-colors"
                    >
                      <RefreshCw className="h-3 w-3" />
                    </button>
                  </fetcher.Form>
                </div>
              ))}
              <a
                href="https://api.sheetzlabs.com/calendar/auth/google"
                className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 mt-1"
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
              {weekStartDate.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
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
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-auto">
          {/* Day headers */}
          <div className="grid border-b border-zinc-800 sticky top-0 bg-zinc-950 z-10" style={{ gridTemplateColumns: "48px repeat(7, 1fr)" }}>
            <div /> {/* time column */}
            {DAYS.map((day, i) => {
              const d = new Date(weekStartDate);
              d.setDate(weekStartDate.getDate() + i);
              const isToday = d.toDateString() === new Date().toDateString();
              return (
                <div key={day} className="px-2 py-2 text-center border-r border-zinc-800 last:border-r-0">
                  <div className="text-xs text-zinc-500">{day}</div>
                  <div className={`text-sm font-medium mt-0.5 ${isToday ? "text-emerald-400" : "text-zinc-300"}`}>
                    {d.getDate()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Hour rows */}
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="grid border-b border-zinc-800/50"
              style={{ gridTemplateColumns: "48px repeat(7, 1fr)", height: "60px" }}
            >
              {/* Time label */}
              <div className="px-1 pt-1 text-right text-xs text-zinc-600 border-r border-zinc-800">
                {formatHour(hour)}
              </div>

              {/* Day cells */}
              {DAYS.map((_, dayIndex) => (
                <div
                  key={dayIndex}
                  className="border-r border-zinc-800/40 last:border-r-0 relative"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, dayIndex, hour)}
                >
                  {getEventsForCell(dayIndex, hour).map((event) => (
                    <Link
                      key={event.id}
                      to={`/dashboard/calendar/${event.id}`}
                      className={`absolute inset-x-0.5 top-0.5 px-1 py-0.5 rounded text-xs border truncate ${getEventColor(event)}`}
                    >
                      {event.title}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 px-4 py-2 border-t border-zinc-800 text-xs text-zinc-500 shrink-0">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-blue-500/40 border border-blue-500/60" />
            Meeting
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-emerald-500/40 border border-emerald-500/60" />
            Time Block
          </span>
          {draggedTask && (
            <span className="ml-auto text-emerald-400">
              Drop &ldquo;{draggedTask.title}&rdquo; onto a time slot
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
