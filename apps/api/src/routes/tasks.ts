/**
 * Tasks API — the unified planning primitive (Prompt 66).
 *
 * Source-agnostic tasks: standalone, venture-linked, or ticket-linked. This is the
 * data layer the time-boxing planning view (Prompt 67) drives. Every route rides
 * the global JWT chokepoint in index.ts (this router is NOT on the public
 * allowlist), so auth is handled at the gate; here we enforce the *column*
 * allowlist so a caller can never mass-assign provenance/identity columns.
 */
import { Hono } from "hono";
import { createClient } from "@supabase/supabase-js";

type Bindings = {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
};

const tasks = new Hono<{ Bindings: Bindings }>();

// ── Column allowlist (mass-assignment defense) ──────────────────────────────
// The same posture as agent-engine's buildSafePayload: model/client JSON is
// filtered to this set, with type coercion. Server-controlled columns (id,
// created_at, updated_at, completed_at) are NEVER client-settable — completed_at
// is derived from status below.

type ColType = "string" | "int" | "date";

const TASK_COLUMNS: Record<string, ColType> = {
  title: "string",
  description: "string",
  status: "string",
  priority: "string",
  estimated_minutes: "int",
  actual_minutes: "int",
  planned_date: "date",
  sort_order: "int",
  due_date: "date",
  venture_id: "string",
  ticket_id: "string",
};

const VALID_STATUS = new Set([
  "backlog",
  "planned",
  "todo",
  "in_progress",
  "in-progress",
  "review",
  "done",
  "blocked",
  "cancelled",
]);

const INVALID = Symbol("invalid");

function coerce(value: unknown, type: ColType): unknown {
  if (value === null) return null;
  switch (type) {
    case "string":
      return typeof value === "string" ? value : INVALID;
    case "int": {
      const n = typeof value === "number" ? value : Number(value);
      if (!Number.isFinite(n)) return INVALID;
      return Math.trunc(n);
    }
    case "date": {
      // Accept YYYY-MM-DD or anything Date can parse (we store the date part).
      if (typeof value !== "string") return INVALID;
      if (Number.isNaN(Date.parse(value))) return INVALID;
      return value;
    }
    default:
      return INVALID;
  }
}

export type TaskPayloadResult =
  | { ok: true; payload: Record<string, unknown> }
  | { ok: false; reason: string };

/**
 * Filter a create/update body to the task column allowlist, coercing types.
 * Unknown columns are dropped (not rejected) so additive client changes don't
 * 400; an invalid value for a *known* column rejects the whole request. On
 * create, `title` is required. `completed_at` is set by the route from status,
 * never by the caller.
 */
export function buildTaskPayload(
  body: unknown,
  opts: { partial: boolean }
): TaskPayloadResult {
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, reason: "body must be a JSON object" };
  }
  const input = body as Record<string, unknown>;
  const payload: Record<string, unknown> = {};

  for (const [col, type] of Object.entries(TASK_COLUMNS)) {
    if (!(col in input)) continue;
    const coerced = coerce(input[col], type);
    if (coerced === INVALID) {
      return { ok: false, reason: `column "${col}" failed ${type} validation` };
    }
    if (col === "status" && coerced !== null && !VALID_STATUS.has(coerced as string)) {
      return { ok: false, reason: `invalid status "${String(coerced)}"` };
    }
    if (col === "title" && (coerced === null || coerced === "")) {
      return { ok: false, reason: `"title" must be a non-empty string` };
    }
    payload[col] = coerced;
  }

  if (!opts.partial && !payload.title) {
    return { ok: false, reason: `missing required column "title"` };
  }
  if (opts.partial && Object.keys(payload).length === 0) {
    return { ok: false, reason: "no editable fields provided" };
  }

  return { ok: true, payload };
}

/** Status values that mark a task complete (drives completed_at). */
const DONE_STATUSES = new Set(["done"]);

function db(env: Bindings) {
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
}

// ── GET /tasks — list, filterable by planned_date / status / venture_id ─────
tasks.get("/", async (c) => {
  const supabase = db(c.env);
  const url = new URL(c.req.url);
  const plannedDate = url.searchParams.get("planned_date");
  const status = url.searchParams.get("status");
  const ventureId = url.searchParams.get("venture_id");

  let query = supabase
    .from("tasks")
    .select("*, ventures(id, name, slug)")
    .order("planned_date", { ascending: true, nullsFirst: false })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (plannedDate) query = query.eq("planned_date", plannedDate);
  if (status) query = query.eq("status", status as never);
  if (ventureId) query = query.eq("venture_id", ventureId);

  const { data, error } = await query;
  if (error) return c.json({ error: error.message }, 500);
  return c.json({ tasks: data ?? [] });
});

// ── GET /tasks/:id ──────────────────────────────────────────────────────────
tasks.get("/:id", async (c) => {
  const supabase = db(c.env);
  const { data, error } = await supabase
    .from("tasks")
    .select("*, ventures(id, name, slug)")
    .eq("id", c.req.param("id"))
    .single();
  if (error || !data) return c.json({ error: "Task not found" }, 404);
  return c.json({ task: data });
});

// ── POST /tasks — create ─────────────────────────────────────────────────────
tasks.post("/", async (c) => {
  const supabase = db(c.env);
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "invalid JSON body" }, 400);
  }

  const result = buildTaskPayload(body, { partial: false });
  if (!result.ok) return c.json({ error: result.reason }, 400);

  const payload = result.payload;
  // Derive completed_at from status — server-controlled, never client-set.
  if (typeof payload.status === "string") {
    payload.completed_at = DONE_STATUSES.has(payload.status)
      ? new Date().toISOString()
      : null;
  }

  const { data, error } = await supabase
    .from("tasks")
    .insert(payload as never)
    .select("*")
    .single();
  if (error) return c.json({ error: error.message }, 500);
  return c.json({ task: data }, 201);
});

// ── PATCH /tasks/:id — update (covers schedule/reorder/status/link) ──────────
tasks.patch("/:id", async (c) => {
  const supabase = db(c.env);
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "invalid JSON body" }, 400);
  }

  const result = buildTaskPayload(body, { partial: true });
  if (!result.ok) return c.json({ error: result.reason }, 400);

  const payload = result.payload;
  payload.updated_at = new Date().toISOString();
  if (typeof payload.status === "string") {
    payload.completed_at = DONE_STATUSES.has(payload.status)
      ? new Date().toISOString()
      : null;
  }

  const { data, error } = await supabase
    .from("tasks")
    .update(payload as never)
    .eq("id", c.req.param("id"))
    .select("*")
    .single();
  if (error) return c.json({ error: error.message }, 500);
  if (!data) return c.json({ error: "Task not found" }, 404);
  return c.json({ task: data });
});

// ── DELETE /tasks/:id ─────────────────────────────────────────────────────────
tasks.delete("/:id", async (c) => {
  const supabase = db(c.env);
  const { error } = await supabase.from("tasks").delete().eq("id", c.req.param("id"));
  if (error) return c.json({ error: error.message }, 500);
  return c.json({ success: true });
});

export default tasks;
