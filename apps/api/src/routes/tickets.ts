import { Hono } from "hono";
import { getSupabaseClient } from "../lib/supabase";
import { timingSafeEqual } from "../lib/timing-safe";

type Bindings = {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  N8N_API_KEY: string;
};

interface TicketRecord {
  external_id?: string;
  source: string;
  type: "bug" | "feature" | "support";
  title: string;
  description?: string;
  status?: "open" | "in-progress" | "resolved" | "closed";
  priority?: "urgent" | "high" | "medium" | "low";
  submitter_email?: string;
  submitter_name?: string;
}

const ticketsRouter = new Hono<{ Bindings: Bindings }>();

/**
 * Auth model (Prompt 63 — untangle).
 *
 * This router used to install its OWN `Bearer N8N_API_KEY` middleware on `*`,
 * which sat *after* the global Supabase-JWT `authMiddleware` (index.ts). The two
 * were mutually exclusive — the founder's JWT failed the local N8N check and the
 * N8N key failed the global JWT check — so EVERY ticket endpoint was unreachable.
 *
 * Resolution: two access tiers, no router-wide middleware.
 *  - The founder-facing convert endpoints inherit the global JWT chokepoint
 *    (Supabase JWT + single-tenant allowlist). Nothing extra needed here.
 *  - `POST /sync/:venture` is N8N automation: it is on the global PUBLIC_PREFIXES
 *    allowlist (so the JWT gate is skipped) and instead validates the N8N key
 *    *inside the handler*, constant-time and fail-closed — exactly how the Stripe
 *    webhook is public-at-the-chokepoint then signature-verified internally.
 */

/** Constant-time `Bearer N8N_API_KEY` check; fails closed when the key is unset. */
function isAuthorizedN8n(c: { req: { header: (k: string) => string | undefined }; env: Bindings }): boolean {
  const key = c.env.N8N_API_KEY;
  if (!key) return false; // fail closed — no key configured ⇒ no access
  const auth = c.req.header("Authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!token) return false;
  return timingSafeEqual(token, key);
}

/**
 * POST /tickets/sync/:venture
 *
 * n8n calls this to sync tickets from a venture's external source into Supabase.
 * Resolves the venture by slug, upserts tickets via (source, external_id).
 *
 * Body:
 * { "records": [...TicketRecord[]] }
 * or bare single TicketRecord
 */
ticketsRouter.post("/sync/:venture", async (c) => {
  if (!isAuthorizedN8n(c)) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const slug = c.req.param("venture");
  const supabase = getSupabaseClient(c.env);

  // Resolve venture
  const { data: venture, error: ventureErr } = await supabase
    .from("ventures")
    .select("id, name")
    .eq("slug", slug)
    .single();

  if (ventureErr || !venture) {
    return c.json({ error: `Venture not found: ${slug}` }, 404);
  }

  // Parse body
  let records: TicketRecord[] = [];
  try {
    const body = await c.req.json<{ records?: TicketRecord[] } | TicketRecord>();
    if ("records" in body && Array.isArray(body.records)) {
      records = body.records;
    } else if ("title" in body) {
      records = [body as TicketRecord];
    }
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  if (records.length === 0) {
    return c.json({ venture: slug, synced: 0, synced_at: new Date().toISOString() });
  }

  // Column allowlist — never spread the raw record (mass-assignment guard).
  const rows = records.map((r) => ({
    venture_id: venture.id,
    external_id: r.external_id ?? null,
    source: r.source,
    type: r.type,
    title: r.title,
    description: r.description ?? null,
    status: r.status ?? "open",
    priority: r.priority ?? "medium",
    submitter_email: r.submitter_email ?? null,
    submitter_name: r.submitter_name ?? null,
    synced_at: new Date().toISOString(),
  }));

  // Upsert — if external_id is null, always insert (manual tickets have no external_id)
  const rowsWithExternalId = rows.filter((r) => r.external_id);
  const rowsWithoutExternalId = rows.filter((r) => !r.external_id);

  let synced = 0;

  if (rowsWithExternalId.length > 0) {
    const { data, error } = await supabase
      .from("tickets")
      .upsert(rowsWithExternalId, { onConflict: "source,external_id", ignoreDuplicates: false })
      .select("id");

    if (error) {
      console.error(`[tickets/sync/${slug}] upsert error:`, error.message);
      return c.json({ error: error.message }, 500);
    }
    synced += data?.length ?? 0;
  }

  if (rowsWithoutExternalId.length > 0) {
    const { data, error } = await supabase
      .from("tickets")
      .insert(rowsWithoutExternalId)
      .select("id");

    if (error) {
      console.error(`[tickets/sync/${slug}] insert error:`, error.message);
      return c.json({ error: error.message }, 500);
    }
    synced += data?.length ?? 0;
  }

  console.log(`[tickets/sync/${slug}] synced ${synced} tickets`);

  return c.json({
    venture: slug,
    venture_id: venture.id,
    synced,
    synced_at: new Date().toISOString(),
  });
});

/**
 * POST /tickets/:id/convert-to-task
 *
 * Creates a task from the ticket and links back converted_task_id.
 *
 * Race-safe (Prompt 63): the back-link write is a conditional claim
 * (`UPDATE … WHERE converted_task_id IS NULL`) which Postgres serializes on the
 * row, so two concurrent converts can never both win. The loser deletes the
 * orphan task it created and returns the winner's task id. No double-convert.
 */
ticketsRouter.post("/:id/convert-to-task", async (c) => {
  const id = c.req.param("id");
  const supabase = getSupabaseClient(c.env);

  const { data: ticket, error: ticketErr } = await supabase
    .from("tickets")
    .select("id, venture_id, type, title, description, priority, converted_task_id")
    .eq("id", id)
    .single();

  if (ticketErr || !ticket) {
    return c.json({ error: "Ticket not found" }, 404);
  }

  if (ticket.converted_task_id) {
    return c.json({ error: "Already converted to a task", task_id: ticket.converted_task_id }, 409);
  }

  const { data: task, error: taskErr } = await supabase
    .from("tasks")
    .insert({
      venture_id: ticket.venture_id,
      title: `[${(ticket.type ?? "ticket").toUpperCase()}] ${ticket.title}`,
      description: ticket.description,
      priority: (ticket.priority as never) ?? "medium",
      status: "backlog",
    })
    .select("id")
    .single();

  if (taskErr || !task) {
    return c.json({ error: taskErr?.message ?? "Failed to create task" }, 500);
  }

  // Atomic claim — only the first concurrent caller matches `IS NULL`.
  const { data: claimed } = await supabase
    .from("tickets")
    .update({ converted_task_id: task.id, status: "in-progress" })
    .eq("id", id)
    .is("converted_task_id", null)
    .select("id");

  if (!claimed || claimed.length === 0) {
    // Lost the race: roll back our orphan task and report the winner.
    await supabase.from("tasks").delete().eq("id", task.id);
    const { data: current } = await supabase
      .from("tickets")
      .select("converted_task_id")
      .eq("id", id)
      .single();
    return c.json(
      { error: "Already converted to a task", task_id: current?.converted_task_id ?? null },
      409,
    );
  }

  return c.json({ ticket_id: id, task_id: task.id, converted: true });
});

/**
 * POST /tickets/:id/convert-to-milestone
 *
 * Creates (or attaches an existing) milestone from the ticket and links back
 * converted_milestone_id. Optional body `{ milestone_id }` attaches an existing
 * milestone (must belong to the ticket's venture); omitted ⇒ a new milestone is
 * created from the ticket. Race-safe via the same conditional-claim pattern.
 */
ticketsRouter.post("/:id/convert-to-milestone", async (c) => {
  const id = c.req.param("id");
  const supabase = getSupabaseClient(c.env);

  let providedMilestoneId: string | null = null;
  try {
    const body = (await c.req.json()) as { milestone_id?: string } | null;
    providedMilestoneId = body?.milestone_id?.trim() || null;
  } catch {
    providedMilestoneId = null;
  }

  const { data: ticket, error: ticketErr } = await supabase
    .from("tickets")
    .select("id, venture_id, title, description, converted_milestone_id")
    .eq("id", id)
    .single();

  if (ticketErr || !ticket) {
    return c.json({ error: "Ticket not found" }, 404);
  }

  if (ticket.converted_milestone_id) {
    return c.json(
      { error: "Already converted to a milestone", milestone_id: ticket.converted_milestone_id },
      409,
    );
  }

  if (!ticket.venture_id) {
    return c.json({ error: "Ticket has no venture to attach a milestone to" }, 422);
  }
  const ventureId = ticket.venture_id;

  let milestoneId: string;
  let createdMilestoneId: string | null = null;

  if (providedMilestoneId) {
    // Attaching an existing milestone — it must belong to the ticket's venture.
    const { data: ms } = await supabase
      .from("milestones")
      .select("id")
      .eq("id", providedMilestoneId)
      .eq("venture_id", ventureId)
      .single();
    if (!ms) {
      return c.json({ error: "Milestone not found for this venture" }, 422);
    }
    milestoneId = providedMilestoneId;
  } else {
    const { data: newMs, error: msErr } = await supabase
      .from("milestones")
      .insert({
        venture_id: ventureId,
        title: ticket.title,
        description: ticket.description,
        status: "planned",
      })
      .select("id")
      .single();
    if (msErr || !newMs) {
      return c.json({ error: msErr?.message ?? "Failed to create milestone" }, 500);
    }
    milestoneId = newMs.id;
    createdMilestoneId = newMs.id;
  }

  // Atomic claim.
  const { data: claimed } = await supabase
    .from("tickets")
    .update({ converted_milestone_id: milestoneId, status: "in-progress" })
    .eq("id", id)
    .is("converted_milestone_id", null)
    .select("id");

  if (!claimed || claimed.length === 0) {
    // Lost the race: only roll back a milestone WE created (never a pre-existing one).
    if (createdMilestoneId) {
      await supabase.from("milestones").delete().eq("id", createdMilestoneId);
    }
    const { data: current } = await supabase
      .from("tickets")
      .select("converted_milestone_id")
      .eq("id", id)
      .single();
    return c.json(
      { error: "Already converted to a milestone", milestone_id: current?.converted_milestone_id ?? null },
      409,
    );
  }

  return c.json({ ticket_id: id, milestone_id: milestoneId, converted: true });
});

export default ticketsRouter;
