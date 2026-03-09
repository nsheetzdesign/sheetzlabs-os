-- 017_content_system.sql
-- Content pieces (the core table)
CREATE TABLE content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Core fields
  title TEXT NOT NULL,
  body TEXT,
  excerpt TEXT, -- short summary for previews

  -- Type and status
  type TEXT NOT NULL, -- 'blog', 'newsletter', 'linkedin', 'twitter', 'thread', 'idea'
  status TEXT DEFAULT 'idea', -- 'idea', 'draft', 'review', 'scheduled', 'published', 'archived'

  -- Scheduling
  scheduled_for TIMESTAMPTZ,
  published_at TIMESTAMPTZ,

  -- Platform-specific
  platform_id TEXT, -- external ID after publishing (LinkedIn post ID, blog slug, etc.)
  platform_url TEXT, -- URL to published content

  -- Relationships
  venture_id UUID REFERENCES ventures(id),
  parent_id UUID REFERENCES content(id), -- for repurposed content (links to original idea)
  knowledge_id UUID REFERENCES knowledge(id), -- source knowledge item
  agent_run_id UUID REFERENCES agent_runs(id), -- if AI-generated

  -- Metadata
  tags TEXT[],
  word_count INTEGER,
  reading_time INTEGER,

  -- Performance (updated after publishing)
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Content calendar view helper
CREATE TABLE content_calendar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES content(id) ON DELETE CASCADE,
  calendar_date DATE NOT NULL,
  time_slot TEXT, -- 'morning', 'afternoon', 'evening'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Newsletter subscribers (for Resend)
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  status TEXT DEFAULT 'active', -- 'active', 'unsubscribed', 'bounced'
  source TEXT, -- 'website', 'manual', 'import'
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ
);

-- Newsletter sends (tracking)
CREATE TABLE newsletter_sends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES content(id),
  subject TEXT NOT NULL,
  preview_text TEXT,
  recipient_count INTEGER,
  sent_at TIMESTAMPTZ,
  opens INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  unsubscribes INTEGER DEFAULT 0,
  resend_id TEXT, -- Resend batch ID
  status TEXT DEFAULT 'draft', -- 'draft', 'sending', 'sent', 'failed'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Content templates
CREATE TABLE content_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'blog', 'newsletter', 'linkedin'
  structure TEXT NOT NULL, -- template content with placeholders
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_content_type ON content(type);
CREATE INDEX idx_content_status ON content(status);
CREATE INDEX idx_content_scheduled ON content(scheduled_for) WHERE status = 'scheduled';
CREATE INDEX idx_content_parent ON content(parent_id);
CREATE INDEX idx_content_calendar_date ON content_calendar(calendar_date);
CREATE INDEX idx_newsletter_subscribers_status ON newsletter_subscribers(status);

-- RLS
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_sends ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for service role" ON content FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON content_calendar FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON newsletter_subscribers FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON newsletter_sends FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON content_templates FOR ALL USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_content_updated_at
  BEFORE UPDATE ON content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Seed templates
INSERT INTO content_templates (name, type, structure, description) VALUES
('Weekly Learnings', 'blog',
'# {{topic}}

This week I learned something interesting about {{topic}}.

## The Problem

{{problem_description}}

## What I Tried

{{attempts}}

## What Worked

{{solution}}

## Key Takeaways

1. {{takeaway_1}}
2. {{takeaway_2}}
3. {{takeaway_3}}

---
*What are you learning this week? Drop a comment below.*',
'Weekly reflection blog post template');

INSERT INTO content_templates (name, type, structure, description) VALUES
('Insight Post', 'linkedin',
'{{hook_line}}

Most people think {{common_belief}}.

But here''s what I''ve learned after {{experience}}:

{{insight}}

The result?

{{outcome}}

{{cta_question}}',
'LinkedIn insight/contrarian post template');

INSERT INTO content_templates (name, type, structure, description) VALUES
('Weekly Update', 'newsletter',
'Hey there,

{{personal_opener}}

## This Week

{{main_update}}

## Quick Wins

- {{win_1}}
- {{win_2}}
- {{win_3}}

## Resource of the Week

{{resource_description}}

Link: {{resource_url}}

## One Question

{{question}}

Hit reply and let me know.

Until next week,
Nick',
'Weekly newsletter template');
