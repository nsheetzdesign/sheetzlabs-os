-- 013_calendar.sql

-- Calendar accounts (supports multiple Google Calendars)
CREATE TABLE calendar_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  provider TEXT DEFAULT 'google',
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  sync_enabled BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMPTZ,
  color TEXT DEFAULT '#2FE8B6',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Calendar events (cached locally)
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES calendar_accounts(id) ON DELETE CASCADE,
  external_id TEXT NOT NULL,

  title TEXT NOT NULL,
  description TEXT,
  location TEXT,

  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  all_day BOOLEAN DEFAULT false,
  timezone TEXT DEFAULT 'America/Chicago',

  recurring BOOLEAN DEFAULT false,
  recurrence_rule TEXT,

  attendees JSONB DEFAULT '[]',
  organizer_email TEXT,
  meeting_link TEXT,

  is_time_block BOOLEAN DEFAULT false,
  task_id UUID REFERENCES tasks(id),

  ai_prep_generated BOOLEAN DEFAULT false,
  ai_prep_doc_id UUID REFERENCES knowledge(id),

  status TEXT DEFAULT 'confirmed',

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(account_id, external_id)
);

-- Time block templates
CREATE TABLE time_block_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  color TEXT DEFAULT '#2FE8B6',
  default_duration INTEGER DEFAULT 60,
  preferred_times JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_calendar_events_account ON calendar_events(account_id);
CREATE INDEX idx_calendar_events_start ON calendar_events(start_at);
CREATE INDEX idx_calendar_events_task ON calendar_events(task_id);
CREATE INDEX idx_calendar_events_timeblock ON calendar_events(is_time_block) WHERE is_time_block = true;

-- RLS
ALTER TABLE calendar_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_block_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for service role" ON calendar_accounts FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON calendar_events FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON time_block_templates FOR ALL USING (true);

-- ============================================================
-- Agent Seeds
-- ============================================================

-- Meeting Prep Agent (on-demand) — Executive department
INSERT INTO agents (department, name, slug, description, system_prompt, user_prompt_template, input_sources, output_actions, schedule) VALUES
('executive', 'Meeting Prep', 'meeting-prep',
'Creates briefing docs before meetings with attendee research and context',
'You are an executive assistant preparing meeting briefs. For each meeting, provide:
1. **Meeting Overview** — Purpose, expected outcomes
2. **Attendee Profiles** — Who they are, their role, recent news (use web search)
3. **Relationship Context** — Past interactions from CRM
4. **Talking Points** — 3-5 suggested topics based on context
5. **Questions to Ask** — Strategic questions for the meeting
6. **Preparation Tasks** — What to review before the meeting
Keep it scannable. Founder should be able to review in 2 minutes before the meeting.',
'## Meeting Details
**Title:** {{event_title}}
**Time:** {{event_start}} - {{event_end}}
**Location:** {{event_location}}
**Description:** {{event_description}}
**Attendees:**
{{attendees}}

## Relationship Data (if available)
{{relationships}}

## My Ventures (for context)
{{ventures}}

---
Research the attendees and prepare the briefing:
```action:create_knowledge
{
  "title": "Meeting Prep: {{event_title}}",
  "content": "[briefing content]",
  "type": "meeting_prep",
  "tags": ["meeting", "prep"]
}
```

If follow-up needed before meeting:
```action:create_task
{"title": "Before meeting: [action]", "description": "...", "priority": "high", "due_date": "{{event_start}}"}
```',
'["relationships", "ventures", "calendar_events"]'::jsonb,
'["create_knowledge", "create_task", "web_search"]'::jsonb,
NULL)
ON CONFLICT (slug) DO NOTHING;

-- Task Prioritizer Agent (daily) — Operations department
INSERT INTO agents (department, name, slug, description, system_prompt, user_prompt_template, input_sources, output_actions, schedule) VALUES
('operations', 'Task Prioritizer', 'task-prioritizer',
'Morning triage: what to focus on today based on deadlines, energy, and impact',
'You are a productivity coach helping a solo founder prioritize their day. Analyze tasks and calendar to recommend:
1. **Top 3 Priorities** — Must complete today, why
2. **Time Block Suggestions** — When to do each task based on calendar gaps
3. **Delegate/Defer** — Tasks that can wait or be automated
4. **Energy Mapping** — Match high-energy tasks to high-energy times

Consider:
- Hard deadlines (non-negotiable)
- Dependencies (what blocks other work)
- Revenue impact (does this make money?)
- Calendar conflicts (meetings, calls)
- Task age (stale tasks need attention)

Be decisive. The founder needs clarity, not options.',
'## Today Context
**Date:** {{today}}
**Day of Week:** {{day_of_week}}

### Open Tasks
{{tasks}}

### Today Calendar
{{calendar_today}}

### Recent Revenue (for context on priorities)
{{revenue}}

### Active Ventures
{{ventures}}

---
Provide morning prioritization:
1. Top 3 priorities for today (with reasoning)
2. Suggested time blocks
3. Tasks to defer/delegate
4. Any scheduling conflicts to resolve

If tasks should be rescheduled:
```action:update_task
{"id": "[task_id]", "due_date": "[new_date]", "notes": "Rescheduled: [reason]"}
```

Create the daily plan:
```action:create_knowledge
{
  "title": "Daily Plan - {{today}}",
  "content": "[prioritization]",
  "type": "daily_plan",
  "tags": ["planning", "daily"]
}
```',
'["tasks", "calendar_events", "revenue", "ventures"]'::jsonb,
'["create_knowledge", "update_task", "create_calendar_event"]'::jsonb,
'0 6 * * 1-5')
ON CONFLICT (slug) DO NOTHING;
