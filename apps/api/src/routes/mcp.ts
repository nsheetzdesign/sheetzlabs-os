import { Hono } from "hono";
import { getSupabaseClient } from "../lib/supabase";

type Bindings = {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  N8N_API_KEY: string;
};

const mcpRouter = new Hono<{ Bindings: Bindings }>();

/**
 * GET /mcp/ventures/:slug/context
 *
 * Returns a rich context bundle for a venture — ideal for Claude MCP or any
 * AI agent that needs to understand a project before taking action.
 *
 * Response includes:
 * - venture metadata (name, status, stage, MRR, tagline)
 * - stack items grouped by category
 * - links grouped by type
 * - venture_docs (CLAUDE.md, skills, hooks, ADRs, runbooks)
 * - open milestones with task counts
 * - recent open/in-progress tickets
 */
mcpRouter.get("/ventures/:slug/context", async (c) => {
  const slug = c.req.param("slug");
  const supabase = getSupabaseClient(c.env);

  // First fetch the venture to get its UUID
  const { data: venture } = await supabase.from("ventures").select("*").eq("slug", slug).single();

  if (!venture) {
    return c.json({ error: `Venture not found: ${slug}` }, 404);
  }

  const vid = venture.id;

  const [
    { data: stack },
    { data: links },
    { data: docs },
    { data: milestones },
    { data: tickets },
    { data: tasks },
  ] = await Promise.all([
    supabase.from("venture_stack").select("*").eq("venture_id", vid).order("category"),
    supabase.from("venture_links").select("*").eq("venture_id", vid).order("type"),
    supabase.from("venture_docs").select("*").eq("venture_id", vid).order("type"),
    supabase
      .from("milestones")
      .select("*, tasks(id, status)")
      .eq("venture_id", vid)
      .neq("status", "completed")
      .order("sort_order"),
    supabase
      .from("tickets")
      .select("id, type, title, priority, status, created_at")
      .eq("venture_id", vid)
      .in("status", ["open", "in-progress"])
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("tasks")
      .select("id, title, status, priority, due_date")
      .eq("venture_id", vid)
      .not("status", "eq", "done")
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  // Group stack by category
  const stackByCategory: Record<string, typeof stack> = {};
  for (const item of stack ?? []) {
    const cat = item.category ?? "other";
    if (!stackByCategory[cat]) stackByCategory[cat] = [];
    stackByCategory[cat]!.push(item);
  }

  // Group links by type
  const linksByType: Record<string, typeof links> = {};
  for (const item of links ?? []) {
    const type = item.type ?? "other";
    if (!linksByType[type]) linksByType[type] = [];
    linksByType[type]!.push(item);
  }

  // Separate docs by type
  const claudeMd = docs?.find((d) => d.type === "claude_md");
  const skills = docs?.filter((d) => d.type === "skill") ?? [];
  const hooks = docs?.filter((d) => d.type === "hook") ?? [];
  const adrs = docs?.filter((d) => d.type === "adr") ?? [];
  const runbooks = docs?.filter((d) => d.type === "runbook") ?? [];

  // Enrich milestones with task progress
  const enrichedMilestones = (milestones ?? []).map((m) => {
    const allTasks = (m.tasks as { id: string; status: string }[] | null) ?? [];
    const completedCount = allTasks.filter((t) => t.status === "done").length;
    return {
      id: m.id,
      title: m.title,
      description: m.description,
      target_date: m.target_date,
      status: m.status,
      tasks_total: allTasks.length,
      tasks_completed: completedCount,
    };
  });

  return c.json({
    venture: {
      id: venture.id,
      name: venture.name,
      slug: venture.slug,
      tagline: venture.tagline,
      status: venture.status,
      stage: venture.stage,
      mrr_cents: venture.mrr_cents,
      mrr: `$${((venture.mrr_cents ?? 0) / 100).toLocaleString()}`,
      customer_count: venture.customer_count,
      health_score: venture.health_score,
    },
    stack: stackByCategory,
    links: linksByType,
    docs: {
      claude_md: claudeMd?.content ?? null,
      skills: skills.map((s) => ({ path: s.path, content: s.content })),
      hooks: hooks.map((h) => ({ path: h.path, content: h.content })),
      adrs: adrs.map((a) => ({ path: a.path, content: a.content })),
      runbooks: runbooks.map((r) => ({ path: r.path, content: r.content })),
    },
    milestones: enrichedMilestones,
    open_tickets: tickets ?? [],
    active_tasks: tasks ?? [],
    generated_at: new Date().toISOString(),
  });
});

/**
 * GET /mcp/ventures/:slug/health
 *
 * Pings each venture's registered dashboard URLs and returns status per tool.
 * Useful for a quick "is everything up?" overview.
 */
mcpRouter.get("/ventures/:slug/health", async (c) => {
  const slug = c.req.param("slug");
  const supabase = getSupabaseClient(c.env);

  const { data: venture } = await supabase
    .from("ventures")
    .select("id, name, slug, health_score")
    .eq("slug", slug)
    .single();

  if (!venture) {
    return c.json({ error: `Venture not found: ${slug}` }, 404);
  }

  const { data: stack } = await supabase
    .from("venture_stack")
    .select("tool_name, category, dashboard_url")
    .eq("venture_id", venture.id)
    .not("dashboard_url", "is", null);

  const results: {
    tool: string;
    category: string;
    url: string;
    status: "ok" | "error" | "timeout";
    latency_ms: number | null;
  }[] = [];

  // Ping each dashboard URL with a 5-second timeout
  await Promise.allSettled(
    (stack ?? []).map(async (item) => {
      if (!item.dashboard_url) return;
      const start = Date.now();
      try {
        const res = await fetch(item.dashboard_url, {
          method: "HEAD",
          signal: AbortSignal.timeout(5000),
        });
        results.push({
          tool: item.tool_name,
          category: item.category,
          url: item.dashboard_url,
          status: res.ok ? "ok" : "error",
          latency_ms: Date.now() - start,
        });
      } catch {
        results.push({
          tool: item.tool_name,
          category: item.category,
          url: item.dashboard_url,
          status: "timeout",
          latency_ms: null,
        });
      }
    }),
  );

  const allOk = results.every((r) => r.status === "ok");
  const overallStatus = results.length === 0 ? "unknown" : allOk ? "healthy" : "degraded";

  return c.json({
    venture: { id: venture.id, name: venture.name, slug: venture.slug },
    health_score: venture.health_score,
    overall_status: overallStatus,
    checks: results,
    checked_at: new Date().toISOString(),
  });
});

export default mcpRouter;
