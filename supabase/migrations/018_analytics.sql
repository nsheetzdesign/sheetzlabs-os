-- 018_analytics.sql
-- Daily snapshots for trend data
CREATE TABLE analytics_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date DATE NOT NULL UNIQUE,

  -- Revenue metrics
  total_mrr NUMERIC(12,2),
  total_arr NUMERIC(12,2),
  mrr_growth NUMERIC(8,2), -- % change from previous snapshot

  -- Expense metrics
  total_monthly_expenses NUMERIC(12,2),
  runway_months NUMERIC(6,1),

  -- Venture metrics
  active_ventures INTEGER,
  total_revenue_30d NUMERIC(12,2),

  -- Pipeline metrics
  pipeline_count INTEGER,
  pipeline_by_stage JSONB, -- {"idea": 5, "researching": 3, ...}
  conversions_30d INTEGER, -- pipeline → venture

  -- Relationship metrics
  total_relationships INTEGER,
  relationships_healthy INTEGER, -- contacted < 14 days
  relationships_warning INTEGER, -- 14-30 days
  relationships_critical INTEGER, -- > 30 days

  -- Agent metrics
  agent_runs_24h INTEGER,
  agent_runs_success INTEGER,
  agent_runs_failed INTEGER,
  agent_cost_24h NUMERIC(10,4),
  agent_cost_30d NUMERIC(10,4),

  -- Content metrics
  content_published_30d INTEGER,
  content_scheduled INTEGER,
  newsletter_subscribers INTEGER,

  -- Email metrics
  emails_received_24h INTEGER,
  emails_sent_24h INTEGER,
  emails_action_required INTEGER,

  created_at TIMESTAMPTZ DEFAULT now()
);

-- Agent performance tracking (detailed)
CREATE TABLE agent_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,

  runs_total INTEGER DEFAULT 0,
  runs_success INTEGER DEFAULT 0,
  runs_failed INTEGER DEFAULT 0,

  avg_duration_ms INTEGER,
  avg_tokens_input INTEGER,
  avg_tokens_output INTEGER,

  total_cost NUMERIC(10,4),
  actions_created INTEGER, -- tasks, knowledge, etc.

  UNIQUE(agent_id, period_start)
);

-- Indexes
CREATE INDEX idx_analytics_snapshots_date ON analytics_snapshots(snapshot_date DESC);
CREATE INDEX idx_agent_performance_agent ON agent_performance(agent_id);
CREATE INDEX idx_agent_performance_period ON agent_performance(period_start);

-- RLS
ALTER TABLE analytics_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_performance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for service role" ON analytics_snapshots FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON agent_performance FOR ALL USING (true);
