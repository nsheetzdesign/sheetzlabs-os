-- 009_pipeline_evaluation.sql
-- Evaluation results stored per pipeline item

CREATE TABLE pipeline_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_id UUID REFERENCES pipeline(id) ON DELETE CASCADE,
  agent_run_id UUID REFERENCES agent_runs(id),

  -- Scores (1-10)
  market_clarity_score INTEGER CHECK (market_clarity_score BETWEEN 1 AND 10),
  operational_fit_score INTEGER CHECK (operational_fit_score BETWEEN 1 AND 10),
  ai_leverage_score INTEGER CHECK (ai_leverage_score BETWEEN 1 AND 10),
  revenue_speed_score INTEGER CHECK (revenue_speed_score BETWEEN 1 AND 10),
  competition_score INTEGER CHECK (competition_score BETWEEN 1 AND 10),
  personal_energy_score INTEGER CHECK (personal_energy_score BETWEEN 1 AND 10),

  -- Weighted total (auto-calculated)
  total_score NUMERIC(4,1) GENERATED ALWAYS AS (
    (market_clarity_score * 0.25) +
    (operational_fit_score * 0.20) +
    (ai_leverage_score * 0.20) +
    (revenue_speed_score * 0.15) +
    (competition_score * 0.10) +
    (personal_energy_score * 0.10)
  ) STORED,

  -- Estimates
  estimated_mrr_low INTEGER,        -- monthly, year 1
  estimated_mrr_high INTEGER,
  estimated_startup_cost INTEGER,   -- one-time
  estimated_monthly_cost INTEGER,   -- ongoing
  estimated_time_to_revenue TEXT,   -- "30 days", "90 days", etc.

  -- Research data
  web_research JSONB,               -- raw research results from web search
  competitors JSONB,                -- structured competitor data
  market_size_estimate TEXT,

  -- Analysis
  market_analysis TEXT,
  competitor_summary TEXT,
  risk_factors TEXT[],
  success_factors TEXT[],
  recommendation TEXT,              -- 'strong_yes', 'yes', 'maybe', 'no', 'strong_no'
  recommendation_rationale TEXT,

  -- Next steps if approved
  suggested_next_steps TEXT[],
  suggested_mvp_scope TEXT,

  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add evaluation columns to pipeline
ALTER TABLE pipeline ADD COLUMN IF NOT EXISTS last_evaluation_id UUID REFERENCES pipeline_evaluations(id);
ALTER TABLE pipeline ADD COLUMN IF NOT EXISTS evaluation_requested_at TIMESTAMPTZ;

-- Indexes
CREATE INDEX idx_pipeline_evaluations_pipeline ON pipeline_evaluations(pipeline_id);
CREATE INDEX idx_pipeline_evaluations_score ON pipeline_evaluations(total_score DESC);

-- RLS
ALTER TABLE pipeline_evaluations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for service role" ON pipeline_evaluations FOR ALL USING (true);
