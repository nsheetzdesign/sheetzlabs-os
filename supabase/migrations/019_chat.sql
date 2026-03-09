-- 019_chat.sql
-- Chat conversations
CREATE TABLE chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  department TEXT, -- null for general, or 'executive', 'marketing', etc.
  agent_id UUID REFERENCES agents(id), -- specific agent if chatting with one

  -- Metadata
  message_count INTEGER DEFAULT 0,
  last_message_at TIMESTAMPTZ,
  is_archived BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Chat messages
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES chat_conversations(id) ON DELETE CASCADE,

  role TEXT NOT NULL, -- 'user', 'assistant', 'system'
  content TEXT NOT NULL,

  -- AI metadata
  model TEXT,
  tokens_input INTEGER,
  tokens_output INTEGER,
  cost_cents NUMERIC(10,4),

  -- Tool calls
  tool_calls JSONB, -- [{name, input, output}]

  created_at TIMESTAMPTZ DEFAULT now()
);

-- Quick actions (for command palette)
CREATE TABLE quick_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  shortcut TEXT, -- e.g., 'c' for create, 'g' for go to
  action_type TEXT NOT NULL, -- 'navigate', 'create', 'search', 'run_agent', 'command'
  action_data JSONB, -- {route: '/dashboard/ventures'} or {agent_id: '...'} etc.
  category TEXT, -- 'navigation', 'create', 'agents', 'search'
  icon TEXT,
  enabled BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_chat_conversations_dept ON chat_conversations(department);
CREATE INDEX idx_chat_conversations_archived ON chat_conversations(is_archived);
CREATE INDEX idx_chat_messages_conversation ON chat_messages(conversation_id);
CREATE INDEX idx_quick_actions_category ON quick_actions(category);
CREATE INDEX idx_quick_actions_enabled ON quick_actions(enabled) WHERE enabled = true;

-- RLS
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE quick_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for service role" ON chat_conversations FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON chat_messages FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON quick_actions FOR ALL USING (true);

-- Seed quick actions
INSERT INTO quick_actions (name, description, shortcut, action_type, action_data, category, icon) VALUES
-- Navigation
('Go to Dashboard', 'Open command center', 'g d', 'navigate', '{"route": "/dashboard"}', 'navigation', 'LayoutDashboard'),
('Go to Ventures', 'View all ventures', 'g v', 'navigate', '{"route": "/dashboard/ventures"}', 'navigation', 'Rocket'),
('Go to Pipeline', 'View idea pipeline', 'g p', 'navigate', '{"route": "/dashboard/pipeline"}', 'navigation', 'GitBranch'),
('Go to Relationships', 'View CRM', 'g r', 'navigate', '{"route": "/dashboard/relationships"}', 'navigation', 'Users'),
('Go to Tasks', 'View all tasks', 'g t', 'navigate', '{"route": "/dashboard/tasks"}', 'navigation', 'CheckSquare'),
('Go to Inbox', 'Open email inbox', 'g i', 'navigate', '{"route": "/dashboard/inbox"}', 'navigation', 'Mail'),
('Go to Calendar', 'Open calendar', 'g c', 'navigate', '{"route": "/dashboard/calendar"}', 'navigation', 'Calendar'),
('Go to Knowledge', 'Open knowledge base', 'g k', 'navigate', '{"route": "/dashboard/knowledge"}', 'navigation', 'BookOpen'),
('Go to Content', 'Content management', 'g o', 'navigate', '{"route": "/dashboard/content"}', 'navigation', 'PenSquare'),
('Go to Agents', 'AI agents dashboard', 'g a', 'navigate', '{"route": "/dashboard/agents"}', 'navigation', 'Bot'),
('Go to Analytics', 'View analytics', 'g n', 'navigate', '{"route": "/dashboard/analytics"}', 'navigation', 'BarChart3'),
-- Create
('New Venture', 'Create a new venture', 'c v', 'create', '{"route": "/dashboard/ventures/new"}', 'create', 'Plus'),
('New Pipeline Idea', 'Add idea to pipeline', 'c p', 'create', '{"route": "/dashboard/pipeline/new"}', 'create', 'Lightbulb'),
('New Relationship', 'Add a contact', 'c r', 'create', '{"route": "/dashboard/relationships/new"}', 'create', 'UserPlus'),
('New Task', 'Create a task', 'c t', 'create', '{"route": "/dashboard/tasks/new"}', 'create', 'ListPlus'),
('New Knowledge', 'Create knowledge item', 'c k', 'create', '{"route": "/dashboard/knowledge/new"}', 'create', 'FilePlus'),
('New Content', 'Create content', 'c o', 'create', '{"route": "/dashboard/content/new"}', 'create', 'FileText'),
('Quick Capture', 'Capture a thought', 'c c', 'create', '{"route": "/dashboard/knowledge/captures"}', 'create', 'Zap'),
-- Chat
('Chat with Chief of Staff', 'General assistant', null, 'command', '{"action": "open_chat", "department": null}', 'chat', 'MessageSquare'),
('Chat with Marketing', 'Marketing department', null, 'command', '{"action": "open_chat", "department": "marketing"}', 'chat', 'Megaphone'),
('Chat with Product', 'Product department', null, 'command', '{"action": "open_chat", "department": "product"}', 'chat', 'Package'),
('Chat with Finance', 'Finance department', null, 'command', '{"action": "open_chat", "department": "finance"}', 'chat', 'DollarSign'),
('Chat with Research', 'Research department', null, 'command', '{"action": "open_chat", "department": "research"}', 'chat', 'Search'),
('Chat with Operations', 'Operations department', null, 'command', '{"action": "open_chat", "department": "operations"}', 'chat', 'Settings'),
-- Agents
('Run Finance Analyst', 'Analyze finances now', null, 'run_agent', '{"agent_slug": "finance-analyst"}', 'agents', 'TrendingUp'),
('Run LinkedIn Scheduler', 'Check content queue', null, 'run_agent', '{"agent_slug": "linkedin-scheduler"}', 'agents', 'Linkedin'),
('Run Chief of Staff', 'Weekly digest', null, 'run_agent', '{"agent_slug": "chief-of-staff"}', 'agents', 'Crown');

-- RPC for usage counting
CREATE OR REPLACE FUNCTION increment_action_usage(action_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE quick_actions
  SET usage_count = usage_count + 1, last_used_at = now()
  WHERE id = action_id;
END;
$$ LANGUAGE plpgsql;

-- updated_at helper function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER update_chat_conversations_updated_at
  BEFORE UPDATE ON chat_conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
