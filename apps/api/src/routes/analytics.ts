import { Hono } from "hono";
import { createClient } from "@supabase/supabase-js";

type Bindings = {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
};

const analytics = new Hono<{ Bindings: Bindings }>();

// ============================================
// SNAPSHOT GENERATION
// ============================================

// Generate daily snapshot (called by cron)
analytics.post("/snapshot", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const today = new Date().toISOString().split("T")[0];

  // Check if already generated today
  const { data: existing } = await supabase
    .from("analytics_snapshots")
    .select("id")
    .eq("snapshot_date", today)
    .single();

  if (existing) {
    return c.json({ message: "Snapshot already exists for today" });
  }

  // Gather all metrics
  const snapshot = await generateSnapshot(supabase);

  const { data } = await supabase
    .from("analytics_snapshots")
    .insert({ snapshot_date: today, ...snapshot })
    .select()
    .single();

  return c.json({ snapshot: data });
});

// ============================================
// DASHBOARD DATA
// ============================================

// Main dashboard endpoint
analytics.get("/dashboard", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  // Get latest snapshot
  const { data: latest } = await supabase
    .from("analytics_snapshots")
    .select("*")
    .order("snapshot_date", { ascending: false })
    .limit(1)
    .single();

  // Get trend data (last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  const { data: trend } = await supabase
    .from("analytics_snapshots")
    .select(
      "snapshot_date, total_mrr, total_monthly_expenses, agent_cost_24h, pipeline_count"
    )
    .gte("snapshot_date", thirtyDaysAgo)
    .order("snapshot_date");

  // Get real-time metrics (not from snapshot)
  const realtime = await getRealTimeMetrics(supabase);

  return c.json({ latest, trend, realtime });
});

// Revenue breakdown
analytics.get("/revenue", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  const { data: revenue } = await supabase
    .from("revenue")
    .select("*, ventures(name, slug)")
    .gte("date", twelveMonthsAgo.toISOString())
    .order("date");

  const byVenture: Record<string, number> = {};
  const byMonth: Record<string, number> = {};

  for (const r of revenue || []) {
    const ventureKey = (r.ventures as any)?.slug || "unknown";
    const monthKey = r.date.substring(0, 7);

    byVenture[ventureKey] = (byVenture[ventureKey] || 0) + Number(r.amount);
    byMonth[monthKey] = (byMonth[monthKey] || 0) + Number(r.amount);
  }

  return c.json({ revenue, byVenture, byMonth });
});

// Expense breakdown
analytics.get("/expenses", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: expenses } = await supabase
    .from("expenses")
    .select("*")
    .order("date", { ascending: false })
    .limit(100);

  const byCategory: Record<string, number> = {};
  const byProvider: Record<string, number> = {};

  for (const e of expenses || []) {
    byCategory[e.category || "other"] =
      (byCategory[e.category || "other"] || 0) + Number(e.amount);
    byProvider[e.provider || "unknown"] =
      (byProvider[e.provider || "unknown"] || 0) + Number(e.amount);
  }

  return c.json({ expenses, byCategory, byProvider });
});

// Agent performance
analytics.get("/agents", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: agents } = await supabase
    .from("agents")
    .select("id, name, slug, department, enabled");

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data: runs } = await supabase
    .from("agent_runs")
    .select("agent_id, status, tokens_input, tokens_output, cost_cents, duration_ms")
    .gte("created_at", sevenDaysAgo);

  const agentStats: Record<string, any> = {};

  for (const agent of agents || []) {
    const agentRuns = runs?.filter((r) => r.agent_id === agent.id) || [];
    const successRuns = agentRuns.filter((r) => r.status === "completed");
    const failedRuns = agentRuns.filter((r) => r.status === "failed");

    agentStats[agent.id] = {
      ...agent,
      runs_total: agentRuns.length,
      runs_success: successRuns.length,
      runs_failed: failedRuns.length,
      success_rate:
        agentRuns.length > 0
          ? ((successRuns.length / agentRuns.length) * 100).toFixed(1)
          : 0,
      total_cost:
        agentRuns.reduce((sum, r) => sum + Number(r.cost_cents || 0), 0) / 100,
      avg_duration:
        agentRuns.length > 0
          ? Math.round(
              agentRuns.reduce((sum, r) => sum + Number(r.duration_ms || 0), 0) /
                agentRuns.length
            )
          : 0,
    };
  }

  const byDepartment: Record<string, any> = {};
  for (const stats of Object.values(agentStats)) {
    const dept = stats.department;
    if (!byDepartment[dept]) {
      byDepartment[dept] = { runs: 0, cost: 0, success: 0, failed: 0 };
    }
    byDepartment[dept].runs += stats.runs_total;
    byDepartment[dept].cost += stats.total_cost;
    byDepartment[dept].success += stats.runs_success;
    byDepartment[dept].failed += stats.runs_failed;
  }

  return c.json({ agents: Object.values(agentStats), byDepartment });
});

// Pipeline funnel
analytics.get("/pipeline", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: pipeline } = await supabase
    .from("pipeline")
    .select("id, name, stage, score, created_at");

  const stages = ["idea", "researching", "validating", "building", "launched", "archived"];
  const funnel: Record<string, number> = {};

  for (const stage of stages) {
    funnel[stage] = pipeline?.filter((p) => p.stage === stage).length || 0;
  }

  const total = pipeline?.length || 1;
  const conversions = {
    idea_to_research:
      funnel.idea > 0
        ? (
            ((funnel.researching +
              funnel.validating +
              funnel.building +
              funnel.launched) /
              total) *
            100
          ).toFixed(1)
        : "0",
    research_to_build:
      funnel.researching + funnel.validating > 0
        ? (
            ((funnel.building + funnel.launched) /
              Math.max(
                1,
                funnel.researching + funnel.validating + funnel.building + funnel.launched
              )) *
            100
          ).toFixed(1)
        : "0",
    build_to_launch:
      funnel.building > 0
        ? (
            (funnel.launched / Math.max(1, funnel.building + funnel.launched)) *
            100
          ).toFixed(1)
        : "0",
  };

  return c.json({ pipeline, funnel, conversions });
});

// Relationship health
analytics.get("/relationships", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: relationships } = await supabase
    .from("relationships")
    .select("id, name, company, type, last_contact, strength");

  const now = new Date();
  const daysSince = (date: string) =>
    Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));

  const healthy: any[] = [];
  const warning: any[] = [];
  const critical: any[] = [];

  for (const r of relationships || []) {
    const days = r.last_contact ? daysSince(r.last_contact) : 999;
    const item = { ...r, days_since_contact: days };

    if (days <= 14) {
      healthy.push(item);
    } else if (days <= 30) {
      warning.push(item);
    } else {
      critical.push(item);
    }
  }

  const byType: Record<string, number> = {};
  for (const r of relationships || []) {
    byType[r.type || "other"] = (byType[r.type || "other"] || 0) + 1;
  }

  return c.json({
    total: relationships?.length || 0,
    healthy: healthy.length,
    warning: warning.length,
    critical: critical.length,
    byType,
    needsAttention: [...critical, ...warning].slice(0, 10),
  });
});

// System health
analytics.get("/system", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data: runs, count: runsCount } = await supabase
    .from("agent_runs")
    .select("status", { count: "exact" })
    .gte("created_at", oneDayAgo);

  const successRuns = runs?.filter((r) => r.status === "completed").length || 0;
  const failedRuns = runs?.filter((r) => r.status === "failed").length || 0;

  const { data: emailAccounts } = await supabase
    .from("email_accounts")
    .select("email, last_sync_at, sync_enabled");

  const { data: calendarAccounts } = await supabase
    .from("calendar_accounts")
    .select("email, last_sync_at, sync_enabled");

  const { data: contentQueue } = await supabase
    .from("content")
    .select("id")
    .eq("status", "scheduled");

  const { data: captures } = await supabase
    .from("captures")
    .select("id")
    .eq("processed", false);

  return c.json({
    agents: {
      runs_24h: runsCount || 0,
      success: successRuns,
      failed: failedRuns,
      success_rate: runsCount ? ((successRuns / runsCount) * 100).toFixed(1) : "100",
    },
    email: {
      accounts: emailAccounts?.length || 0,
      syncing: emailAccounts?.filter((a) => a.sync_enabled).length || 0,
      last_sync: emailAccounts?.[0]?.last_sync_at,
    },
    calendar: {
      accounts: calendarAccounts?.length || 0,
      syncing: calendarAccounts?.filter((a) => a.sync_enabled).length || 0,
      last_sync: calendarAccounts?.[0]?.last_sync_at,
    },
    queues: {
      content_scheduled: contentQueue?.length || 0,
      captures_pending: captures?.length || 0,
    },
  });
});

export default analytics;

// ============================================
// HELPER FUNCTIONS
// ============================================

async function generateSnapshot(supabase: ReturnType<typeof createClient<any>>) {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const [
    { data: revenue },
    { data: expenses },
    { data: ventures },
    { data: pipeline },
    { data: relationships },
    { data: runs },
    { data: runs30d },
    { data: published },
    { data: scheduled },
    { data: subscribers },
    { data: emailsReceived },
    { data: emailsSent },
    { data: emailsAction },
  ] = await Promise.all([
    supabase
      .from("revenue")
      .select("amount")
      .eq("type", "recurring")
      .gte("date", thirtyDaysAgo.toISOString()),
    supabase
      .from("expenses")
      .select("amount")
      .gte("date", thirtyDaysAgo.toISOString()),
    supabase.from("ventures").select("id").eq("status", "active"),
    supabase.from("pipeline").select("stage"),
    supabase.from("relationships").select("last_contact"),
    supabase
      .from("agent_runs")
      .select("status, cost_cents")
      .gte("created_at", oneDayAgo.toISOString()),
    supabase
      .from("agent_runs")
      .select("cost_cents")
      .gte("created_at", thirtyDaysAgo.toISOString()),
    supabase
      .from("content")
      .select("id")
      .eq("status", "published")
      .gte("published_at", thirtyDaysAgo.toISOString()),
    supabase.from("content").select("id").eq("status", "scheduled"),
    supabase.from("newsletter_subscribers").select("id").eq("status", "active"),
    supabase.from("emails").select("id").gte("received_at", oneDayAgo.toISOString()),
    supabase
      .from("email_drafts")
      .select("id")
      .eq("status", "sent")
      .gte("sent_at", oneDayAgo.toISOString()),
    supabase.from("emails").select("id").eq("ai_category", "action_required").eq("is_read", false),
  ]);

  const totalMrr = revenue?.reduce((sum: number, r: any) => sum + Number(r.amount), 0) || 0;
  const totalExpenses =
    expenses?.reduce((sum: number, e: any) => sum + Number(e.amount), 0) || 0;

  const pipelineByStage: Record<string, number> = {};
  for (const p of pipeline || []) {
    pipelineByStage[p.stage] = (pipelineByStage[p.stage] || 0) + 1;
  }

  let healthy = 0,
    warning = 0,
    critical = 0;
  for (const r of relationships || []) {
    const days = r.last_contact
      ? Math.floor(
          (now.getTime() - new Date(r.last_contact).getTime()) / (1000 * 60 * 60 * 24)
        )
      : 999;
    if (days <= 14) healthy++;
    else if (days <= 30) warning++;
    else critical++;
  }

  const agentCost24h =
    (runs?.reduce((sum: number, r: any) => sum + Number(r.cost_cents || 0), 0) || 0) / 100;
  const agentCost30d =
    (runs30d?.reduce((sum: number, r: any) => sum + Number(r.cost_cents || 0), 0) || 0) / 100;

  return {
    total_mrr: totalMrr,
    total_arr: totalMrr * 12,
    total_monthly_expenses: totalExpenses,
    runway_months: totalExpenses > 0 ? totalMrr / totalExpenses : null,
    active_ventures: ventures?.length || 0,
    total_revenue_30d: totalMrr,
    pipeline_count: pipeline?.length || 0,
    pipeline_by_stage: pipelineByStage,
    total_relationships: relationships?.length || 0,
    relationships_healthy: healthy,
    relationships_warning: warning,
    relationships_critical: critical,
    agent_runs_24h: runs?.length || 0,
    agent_runs_success: runs?.filter((r: any) => r.status === "completed").length || 0,
    agent_runs_failed: runs?.filter((r: any) => r.status === "failed").length || 0,
    agent_cost_24h: agentCost24h,
    agent_cost_30d: agentCost30d,
    content_published_30d: published?.length || 0,
    content_scheduled: scheduled?.length || 0,
    newsletter_subscribers: subscribers?.length || 0,
    emails_received_24h: emailsReceived?.length || 0,
    emails_sent_24h: emailsSent?.length || 0,
    emails_action_required: emailsAction?.length || 0,
  };
}

async function getRealTimeMetrics(supabase: ReturnType<typeof createClient<any>>) {
  const [ventures, pipeline, relationships, tasks] = await Promise.all([
    supabase.from("ventures").select("id", { count: "exact" }).eq("status", "active"),
    supabase.from("pipeline").select("id", { count: "exact" }),
    supabase.from("relationships").select("id", { count: "exact" }),
    supabase
      .from("tasks")
      .select("id", { count: "exact" })
      .in("status", ["todo", "in_progress"]),
  ]);

  return {
    ventures: ventures.count || 0,
    pipeline: pipeline.count || 0,
    relationships: relationships.count || 0,
    open_tasks: tasks.count || 0,
  };
}
