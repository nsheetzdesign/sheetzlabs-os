import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { data, useLoaderData, useRevalidator, useSearchParams, Link } from "react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Sunrise,
  Moon,
  CheckCircle2,
  Circle,
  Lock,
  Loader2,
  X,
} from "lucide-react";
import { requireAuth } from "~/lib/auth.server";
import { apiFetch } from "~/lib/api";
import {
  DEFAULT_TZ,
  getDayBounds,
  dayDescriptorKey,
  formatTimeInTz,
  weekdayLabel,
} from "~/lib/tz";
import { useToasts, ToastContainer } from "~/components/ui/Toast";
import { TaskRail } from "~/components/work/TaskRail";
import { DayTimeline } from "~/components/work/DayTimeline";
import { FocusCard } from "~/components/work/FocusCard";
import { QuickCapture } from "~/components/work/QuickCapture";
import {
  workApi,
  minutesLabel,
  type WorkTask,
  type WorkEvent,
  type FocusSession,
  type DailyPlan,
  type Capture,
} from "~/lib/work-client";

export const meta: MetaFunction = () => [{ title: "Work — Sheetz Labs OS" }];

function readTzCookie(request: Request): string | null {
  const cookie = request.headers.get("cookie") ?? "";
  const m = cookie.match(/(?:^|;\s*)tz=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

async function jsonOf(res: Response): Promise<Record<string, unknown>> {
  const text = await res.text().catch(() => "");
  if (!text) return {};
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const env = context.cloudflare.env;
  const { headers } = await requireAuth(request, env);

  const tzCookie = readTzCookie(request);
  const tz = tzCookie || DEFAULT_TZ;
  const url = new URL(request.url);
  const view = url.searchParams.get("view") === "work" ? "work" : "plan";
  const dayOffset = Number.parseInt(url.searchParams.get("d") ?? "0", 10) || 0;

  const now = new Date();
  const { days, startUtc, windowEnd } = getDayBounds(now, tz, dayOffset);
  const day = days[0];
  const planDate = dayDescriptorKey(day);
  const startIso = startUtc.toISOString();
  const endIso = windowEnd.toISOString();
  const range = `start=${encodeURIComponent(startIso)}&end=${encodeURIComponent(endIso)}`;

  const [unsched, events, plan, activeFocus, todayFocus, captures] = await Promise.all([
    apiFetch(request, env, `/calendar/tasks/unscheduled`).then(jsonOf),
    apiFetch(request, env, `/calendar/events?${range}`).then(jsonOf),
    apiFetch(request, env, `/daily-plan/${planDate}`).then(jsonOf),
    apiFetch(request, env, `/focus/active`).then(jsonOf),
    apiFetch(request, env, `/focus/today?${range}`).then(jsonOf),
    apiFetch(request, env, `/knowledge/captures?processed=false`).then(jsonOf),
  ]);

  const allEvents = (events.events as WorkEvent[] | undefined) ?? [];

  return data(
    {
      tz,
      tzKnown: !!tzCookie,
      view,
      dayOffset,
      planDate,
      dayLabel: `${weekdayLabel(day.weekday)} ${day.month}/${day.day}`,
      isToday: dayOffset === 0,
      dayStartUtcMs: startUtc.getTime(),
      tasks: (unsched.tasks as WorkTask[] | undefined) ?? [],
      meetings: allEvents.filter((e) => !e.is_time_block && !e.all_day),
      blocks: allEvents.filter((e) => e.is_time_block),
      plan: (plan.plan as DailyPlan | null) ?? null,
      activeFocus: (activeFocus.session as FocusSession | null) ?? null,
      todayFocus: (todayFocus.sessions as FocusSession[] | undefined) ?? [],
      captures: (captures.captures as Capture[] | undefined) ?? [],
    },
    { headers }
  );
}

// Completed-work minutes for a session (client mirror of the server's clamp+floor).
function sessionWorkMinutes(s: FocusSession): number {
  if (s.kind !== "work" || !s.ended_at) return 0;
  const elapsed = Math.max(0, (Date.parse(s.ended_at) - Date.parse(s.started_at)) / 1000);
  return Math.floor(Math.min(elapsed, s.duration_seconds) / 60);
}

function blockMinutes(b: WorkEvent): number {
  return Math.max(0, Math.round((Date.parse(b.end_at) - Date.parse(b.start_at)) / 60000));
}

export default function WorkPage() {
  const ld = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const revalidator = useRevalidator();
  const { toasts, push, dismiss } = useToasts();

  const onToast = (message: string, variant?: "default" | "error") =>
    push({ message, variant, duration: variant === "error" ? 6000 : 4000 });
  const onChanged = () => revalidator.revalidate();

  // Report the browser tz to the server (cookie) so planDate/day bounds are correct.
  useEffect(() => {
    const resolved = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (resolved && (!ld.tzKnown || resolved !== ld.tz)) {
      document.cookie = `tz=${encodeURIComponent(resolved)};path=/;max-age=31536000;samesite=lax`;
      revalidator.revalidate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ld.tz, ld.tzKnown]);

  const view = ld.view;

  return (
    <div className="flex h-full min-h-0 flex-col" data-testid="work-page">
      {/* Header + view tabs (view lives in the URL as ?view=plan|work). */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-2/50 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-zinc-100">Work</h1>
        </div>
        <nav className="flex gap-1" data-testid="work-tabs">
          <ViewTab to={`?view=plan${ld.dayOffset ? `&d=${ld.dayOffset}` : ""}`} active={view === "plan"}>
            Plan
          </ViewTab>
          <ViewTab to="?view=work" active={view === "work"}>
            Work
          </ViewTab>
        </nav>
      </header>

      <div className="min-h-0 flex-1 overflow-hidden">
        {view === "plan" ? (
          <PlanView ld={ld} onChanged={onChanged} onToast={onToast} searchParams={searchParams} />
        ) : (
          <WorkView ld={ld} onChanged={onChanged} onToast={onToast} />
        )}
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}

function ViewTab({ to, active, children }: { to: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
        active ? "border-brand text-brand" : "border-transparent text-zinc-400 hover:text-zinc-200"
      }`}
      aria-current={active ? "page" : undefined}
    >
      {children}
    </Link>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// PLAN VIEW
// ════════════════════════════════════════════════════════════════════════════

type LoaderData = ReturnType<typeof useLoaderData<typeof loader>>;

function PlanView({
  ld,
  onChanged,
  onToast,
  searchParams,
}: {
  ld: LoaderData;
  onChanged: () => void;
  onToast: (m: string, v?: "default" | "error") => void;
  searchParams: URLSearchParams;
}) {
  const plannedMin = useMemo(
    () => ld.blocks.reduce((sum, b) => sum + blockMinutes(b), 0),
    [ld.blocks]
  );
  const meetingMin = useMemo(
    () => ld.meetings.reduce((sum, m) => sum + blockMinutes(m), 0),
    [ld.meetings]
  );
  const freeMin = Math.max(0, 24 * 60 - meetingMin);
  const overcommitted = plannedMin > freeMin;

  const dayParam = (offset: number) => {
    const sp = new URLSearchParams(searchParams);
    if (offset === 0) sp.delete("d");
    else sp.set("d", String(offset));
    sp.set("view", "plan");
    return `?${sp.toString()}`;
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 p-4 sm:p-6">
      <IntentionField planDate={ld.planDate} intention={ld.plan?.intention ?? ""} onToast={onToast} />

      {/* Day nav + overcommit hint */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <Link
            to={dayParam(ld.dayOffset - 1)}
            aria-label="Previous day"
            className="rounded-md border border-surface-2 p-1.5 text-zinc-400 hover:text-zinc-200"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <span className="min-w-24 text-center text-sm font-medium text-zinc-300">
            {ld.isToday ? "Today" : ld.dayLabel}
          </span>
          <Link
            to={dayParam(ld.dayOffset + 1)}
            aria-label="Next day"
            className="rounded-md border border-surface-2 p-1.5 text-zinc-400 hover:text-zinc-200"
          >
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div
          className={`text-xs ${overcommitted ? "text-amber-400" : "text-zinc-500"}`}
          data-testid="overcommit-hint"
        >
          {minutesLabel(plannedMin)} planned · {minutesLabel(freeMin)} free
          {overcommitted ? " — overcommitted" : ""}
        </div>
      </div>

      {/* Rail + timeline — stacks below lg (Prompt 60 responsive system). */}
      <div className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row">
        <div className="flex min-h-0 w-full flex-col lg:w-80 lg:shrink-0">
          <TaskRail tasks={ld.tasks} onChanged={onChanged} onToast={onToast} />
        </div>
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <DayTimeline
            tz={ld.tz}
            dayStartUtcMs={ld.dayStartUtcMs}
            planDate={ld.planDate}
            isToday={ld.isToday}
            meetings={ld.meetings}
            blocks={ld.blocks}
            onChanged={onChanged}
            onToast={onToast}
          />
        </div>
      </div>

      <QuickCapture captures={ld.captures} onChanged={onChanged} onToast={onToast} />
    </div>
  );
}

function IntentionField({
  planDate,
  intention,
  onToast,
}: {
  planDate: string;
  intention: string;
  onToast: (m: string, v?: "default" | "error") => void;
}) {
  const [value, setValue] = useState(intention);
  const [saved, setSaved] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset when the day changes.
  useEffect(() => {
    setValue(intention);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planDate]);

  function onChange(next: string) {
    setValue(next);
    setSaved(false);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      const res = await workApi(`/daily-plan/${planDate}`, {
        method: "PUT",
        body: JSON.stringify({ intention: next }),
      });
      if (res.ok) setSaved(true);
      else onToast("Couldn't save your intention.", "error");
    }, 800);
  }

  return (
    <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 p-3">
      <label className="mb-1.5 flex items-center gap-2 text-xs font-medium text-zinc-400">
        <Sunrise className="h-3.5 w-3.5" />
        What would make today a win?
        {saved && <span className="text-[11px] text-emerald-500">saved</span>}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Set your intention…"
        data-testid="intention-input"
        className="w-full rounded-lg border border-surface-2 bg-surface-0 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-brand focus:outline-none"
      />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// WORK VIEW
// ════════════════════════════════════════════════════════════════════════════

function WorkView({
  ld,
  onChanged,
  onToast,
}: {
  ld: LoaderData;
  onChanged: () => void;
  onToast: (m: string, v?: "default" | "error") => void;
}) {
  // Focus target: the active session's task/block, else a user pick from the agenda.
  const [pick, setPick] = useState<{ taskId: string | null; title: string | null; blockId: string | null } | null>(
    null
  );

  const target = ld.activeFocus
    ? {
        taskId: ld.activeFocus.task_id,
        title: ld.activeFocus.tasks?.title ?? null,
        blockId: ld.activeFocus.time_block_id,
      }
    : pick;

  const worksCompletedToday = ld.todayFocus.filter(
    (s) => s.kind === "work" && s.status === "completed"
  ).length;

  const plannedMin = useMemo(() => ld.blocks.reduce((sum, b) => sum + blockMinutes(b), 0), [ld.blocks]);
  const actualMin = useMemo(
    () => ld.todayFocus.reduce((sum, s) => sum + sessionWorkMinutes(s), 0),
    [ld.todayFocus]
  );
  const pct = plannedMin > 0 ? Math.min(100, Math.round((actualMin / plannedMin) * 100)) : 0;

  // Agenda = today's blocks + meetings, time-ordered.
  const agenda = useMemo(
    () =>
      [...ld.blocks, ...ld.meetings].sort((a, b) => Date.parse(a.start_at) - Date.parse(b.start_at)),
    [ld.blocks, ld.meetings]
  );

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 p-4 sm:p-6 lg:flex-row">
      {/* Focus card + capture + rollup */}
      <div className="flex min-h-0 w-full flex-col gap-4 lg:w-[28rem] lg:shrink-0">
        <FocusCard
          active={ld.activeFocus}
          targetTaskId={target?.taskId ?? null}
          targetTaskTitle={target?.title ?? null}
          targetBlockId={target?.blockId ?? null}
          worksCompletedToday={worksCompletedToday}
          onChanged={onChanged}
          onToast={onToast}
        />

        {/* Live planned-vs-actual */}
        <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 p-4" data-testid="rollup">
          <div className="mb-2 flex items-center justify-between text-xs text-zinc-400">
            <span>Planned vs. actual</span>
            <span className="tabular-nums">
              {minutesLabel(actualMin)} / {minutesLabel(plannedMin)}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-2">
            <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-1 text-[11px] text-zinc-600">
            {worksCompletedToday} focus session{worksCompletedToday === 1 ? "" : "s"} completed
          </div>
        </div>

        <QuickCapture captures={ld.captures} onChanged={onChanged} onToast={onToast} />
        <ShutdownButton planDate={ld.planDate} hasShutdown={!!ld.plan?.shutdown_at} onChanged={onChanged} onToast={onToast} />
      </div>

      {/* Today's agenda */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <h2 className="mb-3 text-sm font-semibold text-zinc-200">Today's agenda</h2>
        <ul className="min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1" data-testid="agenda">
          {agenda.length === 0 && (
            <li className="rounded-lg border border-dashed border-surface-2 px-3 py-6 text-center text-sm text-zinc-600">
              Nothing scheduled. Head to Plan to timebox your day.
            </li>
          )}
          {agenda.map((item) => {
            const isMeeting = !item.is_time_block;
            const selected = !isMeeting && target?.blockId === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  disabled={isMeeting}
                  onClick={() =>
                    !isMeeting &&
                    setPick({ taskId: item.task_id, title: item.title.replace(/^⏱️\s*/, ""), blockId: item.id })
                  }
                  data-testid={isMeeting ? "agenda-meeting" : "agenda-block"}
                  className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                    isMeeting
                      ? "cursor-default border-surface-2/50 bg-surface-1/30 text-zinc-400"
                      : selected
                        ? "border-brand bg-brand/10 text-brand"
                        : "border-surface-2/60 bg-surface-0 text-zinc-200 hover:border-surface-3"
                  }`}
                >
                  {isMeeting ? (
                    <Lock className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
                  ) : selected ? (
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-brand" />
                  ) : (
                    <Circle className="h-3.5 w-3.5 shrink-0 text-zinc-600" />
                  )}
                  <span className="w-14 shrink-0 font-mono text-[11px] text-zinc-500">
                    {formatTimeInTz(item.start_at, ld.tz)}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{item.title}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function ShutdownButton({
  planDate,
  hasShutdown,
  onChanged,
  onToast,
}: {
  planDate: string;
  hasShutdown: boolean;
  onChanged: () => void;
  onToast: (m: string, v?: "default" | "error") => void;
}) {
  const [open, setOpen] = useState(false);
  const [reflection, setReflection] = useState("");
  const [busy, setBusy] = useState(false);

  async function shutdown() {
    if (busy) return;
    setBusy(true);
    // 1) Record reflection + shutdown timestamp.
    const planRes = await workApi(`/daily-plan/${planDate}`, {
      method: "PUT",
      body: JSON.stringify({ reflection: reflection.trim() || null, shutdown_at: new Date().toISOString() }),
    });
    // 2) Roll unfinished tasks to tomorrow.
    const rollRes = await workApi<{ moved: WorkTask[] }>(`/daily-plan/${planDate}/rollover`, {
      method: "POST",
    });
    setBusy(false);
    if (planRes.ok && rollRes.ok) {
      const moved = rollRes.data?.moved?.length ?? 0;
      onToast(moved > 0 ? `Shut down. ${moved} task${moved === 1 ? "" : "s"} rolled to tomorrow.` : "Shut down. Nothing to roll over.");
      setOpen(false);
      setReflection("");
      onChanged();
    } else {
      onToast("Couldn't complete shutdown.", "error");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        data-testid="shutdown-button"
        className="flex items-center justify-center gap-2 rounded-xl border border-surface-2 bg-surface-1/40 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-brand hover:text-brand"
      >
        <Moon className="h-4 w-4" />
        {hasShutdown ? "Shut down again" : "Shut down"}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl border border-surface-2 bg-surface-0 p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-base font-semibold text-zinc-100">
                <Moon className="h-4 w-4" /> Shut down the day
              </h3>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="text-zinc-500 hover:text-zinc-300">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mb-2 text-xs text-zinc-500">
              Unfinished tasks planned for today roll to tomorrow.
            </p>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="How did today go? (optional)"
              rows={3}
              data-testid="shutdown-reflection"
              className="mb-3 w-full rounded-lg border border-surface-2 bg-surface-1 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-brand focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-surface-2 px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200">
                Cancel
              </button>
              <button
                type="button"
                onClick={shutdown}
                disabled={busy}
                data-testid="shutdown-confirm"
                className="flex items-center gap-2 rounded-lg border border-brand/40 bg-brand/10 px-4 py-2 text-sm font-medium text-brand hover:bg-brand/20 disabled:opacity-50"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Moon className="h-4 w-4" />}
                Shut down
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
