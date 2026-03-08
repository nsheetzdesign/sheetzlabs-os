import { Hono } from "hono";
import { getSupabaseClient } from "../lib/supabase";

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
 * Auth middleware — all routes require Bearer N8N_API_KEY.
 */
ticketsRouter.use("*", async (c, next) => {
  const auth = c.req.header("Authorization");
  if (!auth || auth !== `Bearer ${c.env.N8N_API_KEY}`) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  return next();
});

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
 */
ticketsRouter.post("/:id/convert-to-task", async (c) => {
  const id = c.req.param("id");
  const supabase = getSupabaseClient(c.env);

  const { data: ticket, error: ticketErr } = await supabase
    .from("tickets")
    .select("*")
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

  await supabase
    .from("tickets")
    .update({ converted_task_id: task.id, status: "in-progress" })
    .eq("id", id);

  return c.json({ ticket_id: id, task_id: task.id, converted: true });
});

/**
 * POST /tickets/:id/convert-to-milestone
 *
 * Creates a milestone from the ticket and links back converted_milestone_id.
 */
ticketsRouter.post("/:id/convert-to-milestone", async (c) => {
  const id = c.req.param("id");
  const supabase = getSupabaseClient(c.env);

  const { data: ticket, error: ticketErr } = await supabase
    .from("tickets")
    .select("*")
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

  const { data: milestone, error: msErr } = await supabase
    .from("milestones")
    .insert({
      venture_id: ticket.venture_id,
      title: ticket.title,
      description: ticket.description,
      status: "planned",
    })
    .select("id")
    .single();

  if (msErr || !milestone) {
    return c.json({ error: msErr?.message ?? "Failed to create milestone" }, 500);
  }

  await supabase
    .from("tickets")
    .update({ converted_milestone_id: milestone.id, status: "in-progress" })
    .eq("id", id);

  return c.json({ ticket_id: id, milestone_id: milestone.id, converted: true });
});

export default ticketsRouter;
