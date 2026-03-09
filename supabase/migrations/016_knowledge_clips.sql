-- 016_knowledge_clips.sql
-- Extend knowledge table with richer metadata
ALTER TABLE knowledge ADD COLUMN IF NOT EXISTS summary TEXT;
ALTER TABLE knowledge ADD COLUMN IF NOT EXISTS source_url TEXT;
ALTER TABLE knowledge ADD COLUMN IF NOT EXISTS source_type TEXT; -- 'manual', 'clip', 'rss', 'agent', 'email'
ALTER TABLE knowledge ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false;
ALTER TABLE knowledge ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES knowledge(id);
ALTER TABLE knowledge ADD COLUMN IF NOT EXISTS venture_id_new UUID REFERENCES ventures(id); -- rename handled below
ALTER TABLE knowledge ADD COLUMN IF NOT EXISTS word_count INTEGER;
ALTER TABLE knowledge ADD COLUMN IF NOT EXISTS reading_time INTEGER; -- minutes

-- New knowledge types: 'doc', 'clip', 'playbook', 'note', 'spec', 'research', 'draft', 'insight', 'meeting_prep', 'daily_plan', 'report', 'digest', 'nudge'
-- (venture_id already exists on knowledge from migration 004)

-- Tags table (normalized)
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#2FE8B6',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Knowledge-tag junction
CREATE TABLE IF NOT EXISTS knowledge_tags (
  knowledge_id UUID REFERENCES knowledge(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (knowledge_id, tag_id)
);

-- RSS/Feed sources
CREATE TABLE IF NOT EXISTS feed_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  feed_type TEXT DEFAULT 'rss', -- 'rss', 'atom', 'json'
  category TEXT, -- 'ai', 'saas', 'indie', 'church_tech', 'news'
  last_fetched_at TIMESTAMPTZ,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Feed items (before they become clips)
CREATE TABLE IF NOT EXISTS feed_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES feed_sources(id) ON DELETE CASCADE,
  external_id TEXT NOT NULL, -- guid/link from feed
  title TEXT NOT NULL,
  url TEXT,
  content TEXT,
  summary TEXT,
  published_at TIMESTAMPTZ,
  is_read BOOLEAN DEFAULT false,
  is_saved BOOLEAN DEFAULT false,
  knowledge_id UUID REFERENCES knowledge(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(source_id, external_id)
);

-- Quick capture (before processing into knowledge)
CREATE TABLE IF NOT EXISTS captures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  source_url TEXT,
  source_title TEXT,
  capture_type TEXT DEFAULT 'text', -- 'text', 'url', 'image', 'selection'
  processed BOOLEAN DEFAULT false,
  knowledge_id UUID REFERENCES knowledge(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_knowledge_type ON knowledge(type);
CREATE INDEX IF NOT EXISTS idx_knowledge_pinned ON knowledge(is_pinned) WHERE is_pinned = true;
CREATE INDEX IF NOT EXISTS idx_knowledge_parent ON knowledge(parent_id);
CREATE INDEX IF NOT EXISTS idx_feed_items_source ON feed_items(source_id);
CREATE INDEX IF NOT EXISTS idx_feed_items_saved ON feed_items(is_saved) WHERE is_saved = true;
CREATE INDEX IF NOT EXISTS idx_captures_processed ON captures(processed) WHERE processed = false;

-- Full-text search on knowledge
CREATE INDEX IF NOT EXISTS idx_knowledge_fts ON knowledge USING gin(
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, ''))
);

-- RLS
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE captures ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all for service role" ON tags;
DROP POLICY IF EXISTS "Allow all for service role" ON knowledge_tags;
DROP POLICY IF EXISTS "Allow all for service role" ON feed_sources;
DROP POLICY IF EXISTS "Allow all for service role" ON feed_items;
DROP POLICY IF EXISTS "Allow all for service role" ON captures;

CREATE POLICY "Allow all for service role" ON tags FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON knowledge_tags FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON feed_sources FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON feed_items FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON captures FOR ALL USING (true);
