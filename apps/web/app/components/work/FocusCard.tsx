import { useCallback, useEffect, useRef, useState } from "react";
import { Play, Square, SkipForward, Coffee, Target as TargetIcon } from "lucide-react";
import {
  workApi,
  POMODORO,
  nextBreakKind,
  kindLabel,
  formatClock,
  type FocusSession,
  type FocusKind,
} from "~/lib/work-client";

/**
 * The pomodoro focus card (Work view, Prompt 67). The timer's source of truth is
 * the server `focus_sessions` row: remaining is recomputed from started_at +
 * duration_seconds on every tick, so a reload or another device resumes the SAME
 * session (cross-device). One running session at a time (enforced API-side).
 *
 * Controls: Start (work/break) · Finish (complete early → rolls work minutes into
 * the task's actual_minutes) · Skip (abandon, no minutes). True pause is deferred —
 * a server-truth timer can't freeze elapsed without extra state; resume-anywhere is
 * the deliberate tradeoff.
 */
export function FocusCard({
  active,
  targetTaskId,
  targetTaskTitle,
  targetBlockId,
  worksCompletedToday,
  onChanged,
  onToast,
}: {
  active: FocusSession | null;
  targetTaskId: string | null;
  targetTaskTitle: string | null;
  targetBlockId: string | null;
  worksCompletedToday: number;
  onChanged: () => void;
  onToast: (message: string, variant?: "default" | "error") => void;
}) {
  const [remaining, setRemaining] = useState<number>(active ? active.duration_seconds : 0);
  const [busy, setBusy] = useState(false);
  const firedRef = useRef<string | null>(null);

  const complete = useCallback(
    async (id: string, silent = false) => {
      const res = await workApi<{ task_actual_minutes: number | null }>(`/focus/${id}/complete`, {
        method: "POST",
      });
      if (res.ok) {
        if (!silent) onToast("Session complete.");
        onChanged();
      } else if (!silent) {
        onToast("Couldn't complete the session.", "error");
      }
    },
    [onChanged, onToast]
  );

  // Server-truth countdown. Recompute remaining from started_at each second; when it
  // hits 0, auto-complete exactly once (firedRef guards double-fire across renders).
  useEffect(() => {
    if (!active) {
      setRemaining(0);
      return;
    }
    const startedMs = Date.parse(active.started_at);
    const tick = () => {
      const elapsed = (Date.now() - startedMs) / 1000;
      const rem = Math.max(0, active.duration_seconds - elapsed);
      setRemaining(rem);
      if (rem <= 0 && firedRef.current !== active.id) {
        firedRef.current = active.id;
        void complete(active.id, true);
      }
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [active, complete]);

  async function start(kind: FocusKind) {
    if (busy) return;
    setBusy(true);
    const duration = POMODORO[kind];
    const res = await workApi<{ session: FocusSession }>("/focus/start", {
      method: "POST",
      body: JSON.stringify({
        kind,
        duration_seconds: duration,
        task_id: kind === "work" ? targetTaskId : null,
        time_block_id: kind === "work" ? targetBlockId : null,
        pomodoro_index: worksCompletedToday,
      }),
    });
    setBusy(false);
    if (res.ok) {
      firedRef.current = null;
      onChanged();
    } else if (res.status === 409) {
      onToast("A session is already running.", "error");
    } else {
      onToast("Couldn't start the session.", "error");
    }
  }

  async function skip() {
    if (!active || busy) return;
    setBusy(true);
    const res = await workApi(`/focus/${active.id}/abandon`, { method: "POST" });
    setBusy(false);
    if (res.ok) onChanged();
    else onToast("Couldn't skip the session.", "error");
  }

  async function finish() {
    if (!active || busy) return;
    setBusy(true);
    await complete(active.id);
    setBusy(false);
  }

  const suggestedBreak = nextBreakKind(worksCompletedToday);

  // ── Running session ──────────────────────────────────────────────────────
  if (active) {
    const isWork = active.kind === "work";
    return (
      <div
        className="flex flex-col items-center rounded-2xl border border-surface-2/50 bg-surface-1/40 p-8"
        data-testid="focus-card"
        data-session-id={active.id}
        data-session-kind={active.kind}
      >
        <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
          {isWork ? <TargetIcon className="h-3.5 w-3.5" /> : <Coffee className="h-3.5 w-3.5" />}
          {kindLabel(active.kind)}
        </div>
        {isWork && (active.tasks?.title || targetTaskTitle) && (
          <div className="mb-3 max-w-xs truncate text-center text-sm text-zinc-300">
            {active.tasks?.title ?? targetTaskTitle}
          </div>
        )}
        <div
          className="mb-6 font-mono text-6xl font-bold tabular-nums text-zinc-100"
          data-testid="focus-clock"
        >
          {formatClock(remaining)}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={finish}
            disabled={busy}
            className="flex items-center gap-2 rounded-lg border border-brand/40 bg-brand/10 px-4 py-2 text-sm font-medium text-brand transition-colors hover:bg-brand/20 disabled:opacity-50"
          >
            <Square className="h-4 w-4" />
            Finish
          </button>
          <button
            type="button"
            onClick={skip}
            disabled={busy}
            className="flex items-center gap-2 rounded-lg border border-surface-2 px-4 py-2 text-sm text-zinc-400 transition-colors hover:text-zinc-200 disabled:opacity-50"
          >
            <SkipForward className="h-4 w-4" />
            Skip
          </button>
        </div>
      </div>
    );
  }

  // ── Idle — pick what to start ──────────────────────────────────────────────
  return (
    <div
      className="flex flex-col items-center rounded-2xl border border-surface-2/50 bg-surface-1/40 p-8"
      data-testid="focus-card"
      data-session-kind="idle"
    >
      <div className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-500">Ready</div>
      <div className="mb-3 max-w-xs truncate text-center text-sm text-zinc-300">
        {targetTaskTitle ?? "No task selected — pick one from the agenda"}
      </div>
      <div className="mb-6 font-mono text-6xl font-bold tabular-nums text-zinc-600">
        {formatClock(POMODORO.work)}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => start("work")}
          disabled={busy}
          data-testid="focus-start"
          className="flex items-center gap-2 rounded-lg border border-brand/40 bg-brand/10 px-4 py-2 text-sm font-medium text-brand transition-colors hover:bg-brand/20 disabled:opacity-50"
        >
          <Play className="h-4 w-4" />
          Start focus
        </button>
        <button
          type="button"
          onClick={() => start(suggestedBreak)}
          disabled={busy}
          className="flex items-center gap-2 rounded-lg border border-surface-2 px-4 py-2 text-sm text-zinc-400 transition-colors hover:text-zinc-200 disabled:opacity-50"
        >
          <Coffee className="h-4 w-4" />
          {kindLabel(suggestedBreak)}
        </button>
      </div>
    </div>
  );
}
