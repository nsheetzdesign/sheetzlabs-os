/**
 * Work-mode (Prompt 67) shared client types + the browser→API helper.
 *
 * Every mutation goes through the same-origin `/api/*` proxy (routes/api.$.tsx),
 * which injects the founder's Supabase JWT server-side — so no token ever reaches
 * client JS and we never bypass the auth chokepoint (rule 14 / CRITICAL: API auth).
 */

export interface WorkTask {
  id: string;
  title: string;
  description: string | null;
  status: string | null;
  priority: string | null;
  estimated_minutes: number | null;
  actual_minutes: number | null;
  planned_date: string | null;
  sort_order: number | null;
  venture_id: string | null;
  ticket_id: string | null;
  ventures?: { id: string; name: string; slug: string } | null;
}

export interface WorkEvent {
  id: string;
  title: string;
  start_at: string;
  end_at: string;
  is_time_block: boolean | null;
  all_day?: boolean | null;
  task_id: string | null;
}

export interface FocusSession {
  id: string;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number;
  kind: "work" | "short_break" | "long_break";
  status: "running" | "completed" | "abandoned";
  task_id: string | null;
  time_block_id: string | null;
  pomodoro_index: number;
  tasks?: { id: string; title: string; status: string | null } | null;
}

export interface DailyPlan {
  id: string;
  plan_date: string;
  intention: string | null;
  shutdown_at: string | null;
  reflection: string | null;
}

export interface Capture {
  id: string;
  content: string;
  capture_type: string | null;
  converted_task_id: string | null;
  created_at: string;
}

export interface ApiResult<T> {
  ok: boolean;
  status: number;
  data: T | null;
}

/** Fetch the API through the same-origin proxy. Never throws on non-2xx. */
export async function workApi<T = unknown>(
  path: string,
  init: RequestInit = {}
): Promise<ApiResult<T>> {
  let res: Response;
  try {
    res = await fetch(`/api${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init.headers ?? {}) },
    });
  } catch {
    return { ok: false, status: 0, data: null };
  }
  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }
  return { ok: res.ok, status: res.status, data: data as T };
}

// ── Pomodoro cycle ──────────────────────────────────────────────────────────

export const POMODORO = {
  work: 25 * 60,
  short_break: 5 * 60,
  long_break: 15 * 60,
  /** Long break after every Nth work interval. */
  longEvery: 4,
} as const;

export type FocusKind = "work" | "short_break" | "long_break";

/** Given the just-completed work interval index (1-based count of works done), the
 *  next interval is a long break every `longEvery`, else a short break. */
export function nextBreakKind(worksCompleted: number): FocusKind {
  return worksCompleted > 0 && worksCompleted % POMODORO.longEvery === 0
    ? "long_break"
    : "short_break";
}

export function kindLabel(kind: FocusKind): string {
  return kind === "work" ? "Focus" : kind === "short_break" ? "Short break" : "Long break";
}

export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export function minutesLabel(mins: number): string {
  if (mins <= 0) return "0m";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
