-- 008_agent_infrastructure.sql

-- Department enum
CREATE TYPE department AS ENUM (
  'executive',
  'marketing',
  'product',
  'finance',
  'research',
  'operations'
);

-- Agent definitions
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department department NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  system_prompt TEXT NOT NULL,
  user_prompt_template TEXT,
  input_sources JSONB DEFAULT '[]',
  output_actions JSONB DEFAULT '[]',
  model TEXT DEFAULT 'claude-sonnet-4-20250514',
  max_tokens INTEGER DEFAULT 4096,
  schedule TEXT,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Extend existing agent_runs table
ALTER TABLE agent_runs ADD COLUMN IF NOT EXISTS agent_id UUID REFERENCES agents(id);
ALTER TABLE agent_runs ADD COLUMN IF NOT EXISTS input_context JSONB;
ALTER TABLE agent_runs ADD COLUMN IF NOT EXISTS tokens_input INTEGER;
ALTER TABLE agent_runs ADD COLUMN IF NOT EXISTS tokens_output INTEGER;
ALTER TABLE agent_runs ADD COLUMN IF NOT EXISTS cost_cents NUMERIC(10,4);
ALTER TABLE agent_runs ADD COLUMN IF NOT EXISTS duration_ms INTEGER;
ALTER TABLE agent_runs ADD COLUMN IF NOT EXISTS trigger_type TEXT;

-- Agent action log
CREATE TABLE agent_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID REFERENCES agent_runs(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  target_table TEXT,
  target_id UUID,
  payload JSONB,
  external_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Social/content queue
CREATE TABLE content_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  content TEXT NOT NULL,
  media_urls TEXT[],
  scheduled_for TIMESTAMPTZ,
  posted_at TIMESTAMPTZ,
  external_id TEXT,
  agent_run_id UUID REFERENCES agent_runs(id),
  venture_id UUID REFERENCES ventures(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_agents_department ON agents(department);
CREATE INDEX idx_agents_enabled ON agents(enabled) WHERE enabled = true;
CREATE INDEX idx_agent_runs_agent ON agent_runs(agent_id);
CREATE INDEX idx_agent_actions_run ON agent_actions(run_id);
CREATE INDEX idx_content_queue_status ON content_queue(status);
CREATE INDEX idx_content_queue_scheduled ON content_queue(scheduled_for) WHERE status = 'scheduled';

-- RLS
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for service role" ON agents FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON agent_actions FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON content_queue FOR ALL USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON agents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
