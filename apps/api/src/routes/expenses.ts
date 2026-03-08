import { Hono } from "hono";
import { getSupabaseClient } from "../lib/supabase";
import type { Database } from "@sheetzlabs/shared/types/database.types";

type ExpenseCategory = Database["public"]["Enums"]["expense_category"];

type Bindings = {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  N8N_API_KEY: string;
};

/**
 * Expense record shape accepted from n8n workflows.
 */
interface ExpenseRecord {
  amount_cents: number;
  category: ExpenseCategory;
  vendor: string;
  description?: string;
  expense_date: string; // YYYY-MM-DD
  external_id: string;
  is_recurring?: boolean;
  venture_id?: string | null;
}

const VALID_PROVIDERS = ["cloudflare", "supabase", "anthropic", "openai"] as const;

const expensesRouter = new Hono<{ Bindings: Bindings }>();

/**
 * Auth middleware — all routes require Bearer N8N_API_KEY.
 */
expensesRouter.use("*", async (c, next) => {
  const auth = c.req.header("Authorization");
  if (!auth || auth !== `Bearer ${c.env.N8N_API_KEY}`) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  return next();
});

/**
 * POST /expenses/sync/:provider
 *
 * Accepts one or many expense records from n8n, upserts them via
 * external_id deduplication, and updates the connection's last_sync_at.
 *
 * Body (JSON):
 * {
 *   "records": [
 *     {
 *       "amount_cents": 1500,
 *       "category": "hosting",
 *       "vendor": "Cloudflare",
 *       "description": "Workers - March 2026",
 *       "expense_date": "2026-03-01",
 *       "external_id": "cf_inv_xyz123",
 *       "is_recurring": true,
 *       "venture_id": null          // optional — falls back to connection default
 *     }
 *   ]
 * }
 */
expensesRouter.post("/sync/:provider", async (c) => {
  const provider = c.req.param("provider");
  const supabase = getSupabaseClient(c.env);

  if (!VALID_PROVIDERS.includes(provider as (typeof VALID_PROVIDERS)[number])) {
    return c.json({ error: `Unknown provider: ${provider}` }, 400);
  }

  // Look up the expense connection
  const { data: connection, error: connErr } = await supabase
    .from("expense_connections")
    .select("id, is_active, venture_id")
    .eq("provider", provider)
    .single();

  if (connErr || !connection) {
    return c.json({ error: `No connection found for provider: ${provider}` }, 404);
  }

  if (!connection.is_active) {
    return c.json({ error: `Connection for ${provider} is disabled` }, 400);
  }

  // Parse body
  let records: ExpenseRecord[] = [];
  try {
    const body = await c.req.json<{ records?: ExpenseRecord[] } | ExpenseRecord>();
    // Accept both { records: [...] } and a bare single record
    if ("records" in body && Array.isArray(body.records)) {
      records = body.records;
    } else if ("external_id" in body) {
      records = [body as ExpenseRecord];
    }
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  if (records.length === 0) {
    // No records — still stamp last_sync_at and return OK (useful for "no new invoices" runs)
    await supabase
      .from("expense_connections")
      .update({ last_sync_at: new Date().toISOString() })
      .eq("id", connection.id);

    return c.json({ provider, inserted: 0, updated: 0, synced_at: new Date().toISOString() });
  }

  // Build upsert rows — fall back to connection's venture_id if not specified per-record
  const rows = records.map((r) => ({
    amount_cents: r.amount_cents,
    category: r.category,
    vendor: r.vendor,
    description: r.description ?? null,
    expense_date: r.expense_date,
    external_id: r.external_id,
    is_recurring: r.is_recurring ?? false,
    source: provider,
    venture_id: r.venture_id !== undefined ? r.venture_id : (connection.venture_id ?? null),
  }));

  const { data: upserted, error: upsertErr } = await supabase
    .from("expenses")
    .upsert(rows, { onConflict: "external_id", ignoreDuplicates: false })
    .select("id, external_id");

  if (upsertErr) {
    console.error(`[expenses/sync/${provider}] upsert error:`, upsertErr.message);
    return c.json({ error: upsertErr.message }, 500);
  }

  // Update last_sync_at on the connection
  await supabase
    .from("expense_connections")
    .update({ last_sync_at: new Date().toISOString() })
    .eq("id", connection.id);

  console.log(`[expenses/sync/${provider}] upserted ${upserted?.length ?? 0} records`);

  return c.json({
    provider,
    synced: upserted?.length ?? 0,
    external_ids: upserted?.map((r) => r.external_id),
    synced_at: new Date().toISOString(),
  });
});

/**
 * GET /expenses/connections
 *
 * Returns all expense provider connections with their current status.
 */
expensesRouter.get("/connections", async (c) => {
  const supabase = getSupabaseClient(c.env);

  const { data, error } = await supabase
    .from("expense_connections")
    .select("id, provider, is_active, last_sync_at, venture_id, ventures(name)")
    .order("provider");

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json({ connections: data });
});

export default expensesRouter;
