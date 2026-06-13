/**
 * Work-mode API (Prompt 67) — persisted focus sessions + the daily plan ritual.
 *
 * Two routers live here (mounted at /focus and /daily-plan in index.ts). Both ride
 * the global JWT chokepoint, so auth is handled at the gate; here we enforce column
 * allowlists and the timer/rollover invariants.
 *
 * Source-of-truth for the pomodoro timer is the DB row, never a client countdown:
 * `GET /focus/active` lets any device resume the running session by recomputing
 * remaining = duration_seconds − (now − started_at). One running session at a time.
 */
import { Hono } from "hono";
import { createClient } from "@supabase/supabase-js";

type Bindings = {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
};

function db(env: Bindings) {
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
}

// ── Pure helpers (unit-tested in work.test.ts) ──────────────────────────────

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Next calendar day for a YYYY-MM-DD string, UTC-safe (no local-tz drift). */
export function nextDay(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + 1);
  return dt.toISOString().slice(0, 10);
}

/** Statuses that mean a task is finished and should NOT roll over. */
const FINISHED_STATUSES = new Set(["done", "cancelled"]);

export function isUnfinished(status: string | null | undefined): boolean {
  return !FINISHED_STATUSES.has((status ?? "").toLowerCase());
}

/** Tasks that roll to the next day on shutdown — only unfinished ones. */
export function selectRolloverTasks<T extends { status: string | null }>(tasks: T[]): T[] {
  return tasks.filter((t) => isUnfinished(t.status));
}

/**
 * Minutes a completing WORK session contributes to its task's actual_minutes.
 * Real elapsed wall-clock, clamped to the planned duration so an abandoned-then-
 * completed-much-later timer can't inject a runaway value, and floored to whole
 * minutes. Never negative.
 */
export function elapsedWorkMinutes(
  startedAtIso: string,
  endedAtIso: string,
  durationSeconds: number
): number {
  const started = Date.parse(startedAtIso);
  const ended = Date.parse(endedAtIso);
  if (!Number.isFinite(started) || !Number.isFinite(ended)) return 0;
  const elapsedSec = Math.max(0, Math.floor((ended - started) / 1000));
  const cappedSec = Math.min(elapsedSec, Math.max(0, durationSeconds));
  return Math.floor(cappedSec / 60);
}

const VALID_KIND = new Set(["work", "short_break", "long_break"]);

// ════════════════════════════════════════════════════════════════════════════
// FOCUS SESSIONS
// ════════════════════════════════════════════════════════════════════════════

const focus = new Hono<{ Bindings: Bindings }>();

// POST /focus/start — create a running session. Rejects if one is already running
// (one active timer, enforced at the data layer). Optionally linked to a task/block.
focus.post("/start", async (c) => {
  let body: {
    kind?: string;
    duration_seconds?: number;
    task_id?: string | null;
    time_block_id?: string | null;
    pomodoro_index?: number;
  };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "invalid JSON body" }, 400);
  }

  const kind = body.kind ?? "work";
  if (!VALID_KIND.has(kind)) return c.json({ error: `invalid kind "${kind}"` }, 400);

  const duration = Number(body.duration_seconds);
  if (!Number.isFinite(duration) || duration <= 0) {
    return c.json({ error: "duration_seconds must be a positive number" }, 400);
  }

  const supabase = db(c.env);

  // One active timer: reject if any session is still running.
  const { data: running } = await supabase
    .from("focus_sessions")
    .select("id")
    .eq("status", "running")
    .limit(1)
    .maybeSingle();
  if (running) {
    return c.json({ error: "a focus session is already running", session_id: running.id }, 409);
  }

  // Column allowlist — server controls id/created_at/started_at/ended_at/status.
  const payload = {
    kind,
    duration_seconds: Math.trunc(duration),
    status: "running",
    task_id: typeof body.task_id === "string" ? body.task_id : null,
    time_block_id: typeof body.time_block_id === "string" ? body.time_block_id : null,
    pomodoro_index: Number.isFinite(Number(body.pomodoro_index))
      ? Math.trunc(Number(body.pomodoro_index))
      : 0,
  };

  const { data, error } = await supabase
    .from("focus_sessions")
    .insert(payload as never)
    .select("*")
    .single();
  if (error) return c.json({ error: error.message }, 500);
  return c.json({ session: data }, 201);
});

// GET /focus/active — the running session (for cross-device resume). null if none.
focus.get("/active", async (c) => {
  const supabase = db(c.env);
  const { data } = await supabase
    .from("focus_sessions")
    .select("*, tasks(id, title, status, estimated_minutes, actual_minutes)")
    .eq("status", "running")
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return c.json({ session: data ?? null });
});

// GET /focus/today — today's sessions for the rollup. Accepts start/end ISO bounds
// (tz-correct, computed client-side); defaults to the last 24h.
focus.get("/today", async (c) => {
  const supabase = db(c.env);
  const url = new URL(c.req.url);
  const start = url.searchParams.get("start") || new Date(Date.now() - 24 * 3600_000).toISOString();
  const end = url.searchParams.get("end") || new Date().toISOString();

  const { data, error } = await supabase
    .from("focus_sessions")
    .select("*")
    .gte("started_at", start)
    .lte("started_at", end)
    .order("started_at", { ascending: true });
  if (error) return c.json({ error: error.message }, 500);
  return c.json({ sessions: data ?? [] });
});

// POST /focus/:id/complete — stamp ended_at + completed; on a WORK session, roll
// elapsed minutes into the linked task's actual_minutes (atomic RPC). Idempotent:
// a non-running session is returned as-is, never double-counted.
focus.post("/:id/complete", async (c) => {
  const id = c.req.param("id");
  const supabase = db(c.env);

  const { data: session } = await supabase
    .from("focus_sessions")
    .select("*")
    .eq("id", id)
    .single();
  if (!session) return c.json({ error: "Focus session not found" }, 404);
  if (session.status !== "running") {
    return c.json({ session, task_actual_minutes: null });
  }

  const endedAt = new Date().toISOString();
  const { data: updated, error } = await supabase
    .from("focus_sessions")
    .update({ status: "completed", ended_at: endedAt })
    .eq("id", id)
    .eq("status", "running") // guard against a concurrent complete double-rolling
    .select("*")
    .maybeSingle();
  if (error) return c.json({ error: error.message }, 500);
  if (!updated) {
    // Lost the race — someone else completed it. Return current state, no roll.
    const { data: current } = await supabase.from("focus_sessions").select("*").eq("id", id).single();
    return c.json({ session: current, task_actual_minutes: null });
  }

  let taskActual: number | null = null;
  if (updated.kind === "work" && updated.task_id) {
    const minutes = elapsedWorkMinutes(updated.started_at, endedAt, updated.duration_seconds);
    if (minutes > 0) {
      const { data: rpc, error: rpcErr } = await supabase.rpc("increment_task_actual_minutes", {
        p_task_id: updated.task_id,
        p_minutes: minutes,
      });
      if (rpcErr) return c.json({ error: rpcErr.message }, 500);
      taskActual = typeof rpc === "number" ? rpc : null;
    }
  }

  return c.json({ session: updated, task_actual_minutes: taskActual });
});

// POST /focus/:id/abandon — stamp ended_at + abandoned. No minutes rolled.
focus.post("/:id/abandon", async (c) => {
  const id = c.req.param("id");
  const supabase = db(c.env);
  const { data, error } = await supabase
    .from("focus_sessions")
    .update({ status: "abandoned", ended_at: new Date().toISOString() })
    .eq("id", id)
    .eq("status", "running")
    .select("*")
    .maybeSingle();
  if (error) return c.json({ error: error.message }, 500);
  if (!data) {
    const { data: current } = await supabase.from("focus_sessions").select("*").eq("id", id).single();
    if (!current) return c.json({ error: "Focus session not found" }, 404);
    return c.json({ session: current });
  }
  return c.json({ session: data });
});

// ════════════════════════════════════════════════════════════════════════════
// DAILY PLANS
// ════════════════════════════════════════════════════════════════════════════

const dailyPlan = new Hono<{ Bindings: Bindings }>();

// GET /daily-plan/:date — the day's plan row (null if not yet created).
dailyPlan.get("/:date", async (c) => {
  const date = c.req.param("date");
  if (!DATE_RE.test(date)) return c.json({ error: "date must be YYYY-MM-DD" }, 400);
  const supabase = db(c.env);
  const { data } = await supabase
    .from("daily_plans")
    .select("*")
    .eq("plan_date", date)
    .maybeSingle();
  return c.json({ plan: data ?? null });
});

// PUT /daily-plan/:date — upsert intention / reflection / shutdown_at. Column
// allowlist; plan_date comes from the path, never the body.
dailyPlan.put("/:date", async (c) => {
  const date = c.req.param("date");
  if (!DATE_RE.test(date)) return c.json({ error: "date must be YYYY-MM-DD" }, 400);

  let body: { intention?: string | null; reflection?: string | null; shutdown_at?: string | null };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "invalid JSON body" }, 400);
  }

  const payload: Record<string, unknown> = { plan_date: date, updated_at: new Date().toISOString() };
  if ("intention" in body) {
    payload.intention =
      body.intention === null || typeof body.intention === "string" ? body.intention : null;
  }
  if ("reflection" in body) {
    payload.reflection =
      body.reflection === null || typeof body.reflection === "string" ? body.reflection : null;
  }
  if ("shutdown_at" in body) {
    payload.shutdown_at =
      body.shutdown_at === null || typeof body.shutdown_at === "string" ? body.shutdown_at : null;
  }

  const supabase = db(c.env);
  const { data, error } = await supabase
    .from("daily_plans")
    .upsert(payload as never, { onConflict: "plan_date" })
    .select("*")
    .single();
  if (error) return c.json({ error: error.message }, 500);
  return c.json({ plan: data });
});

// POST /daily-plan/:date/rollover — move unfinished tasks planned for :date to the
// next day (sort_order preserved — only planned_date changes). Returns the moved set.
dailyPlan.post("/:date/rollover", async (c) => {
  const date = c.req.param("date");
  if (!DATE_RE.test(date)) return c.json({ error: "date must be YYYY-MM-DD" }, 400);
  const supabase = db(c.env);

  const { data: dayTasks, error: fetchErr } = await supabase
    .from("tasks")
    .select("*")
    .eq("planned_date", date);
  if (fetchErr) return c.json({ error: fetchErr.message }, 500);

  const toMove = selectRolloverTasks(dayTasks ?? []);
  if (toMove.length === 0) return c.json({ moved: [], next_date: nextDay(date) });

  const target = nextDay(date);
  const { data: moved, error: updErr } = await supabase
    .from("tasks")
    .update({ planned_date: target, updated_at: new Date().toISOString() })
    .in(
      "id",
      toMove.map((t) => t.id)
    )
    .select("*");
  if (updErr) return c.json({ error: updErr.message }, 500);

  return c.json({ moved: moved ?? [], next_date: target });
});

export { focus, dailyPlan };
