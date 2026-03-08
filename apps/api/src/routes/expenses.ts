import { Hono } from "hono";
import { getSupabaseClient } from "../lib/supabase";

type Bindings = {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
};

const expensesRouter = new Hono<{ Bindings: Bindings }>();

/**
 * POST /expenses/sync/:provider
 *
 * Stub endpoint for future expense auto-sync integrations.
 * Supported providers: cloudflare, supabase, anthropic, openai
 *
 * Real sync logic will be implemented per-provider (e.g., via n8n or
 * direct API calls to pull usage/billing data and create expense rows).
 */
expensesRouter.post("/sync/:provider", async (c) => {
  const provider = c.req.param("provider");
  const supabase = getSupabaseClient(c.env);

  const validProviders = ["cloudflare", "supabase", "anthropic", "openai"];
  if (!validProviders.includes(provider)) {
    return c.json({ error: `Unknown provider: ${provider}` }, 400);
  }

  // Look up the expense connection
  const { data: connection, error: connErr } = await supabase
    .from("expense_connections")
    .select("id, is_active")
    .eq("provider", provider)
    .single();

  if (connErr || !connection) {
    return c.json({ error: `No connection found for provider: ${provider}` }, 404);
  }

  if (!connection.is_active) {
    return c.json({ error: `Connection for ${provider} is disabled` }, 400);
  }

  // Update last_sync_at timestamp
  await supabase
    .from("expense_connections")
    .update({ last_sync_at: new Date().toISOString() })
    .eq("id", connection.id);

  // Stub — actual sync will be implemented per-provider
  console.log(`[expenses/sync] ${provider} sync triggered (stub)`);

  return c.json({
    provider,
    message: `Sync for ${provider} is not yet implemented. Will be handled by n8n or direct API integration.`,
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
