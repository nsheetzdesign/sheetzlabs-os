-- 045_email_search_indexes.sql — Prompt 53 Part 3 (EU-6)
-- The API /email/search uses ILIKE '%term%' against subject / from_email /
-- from_name (operator + free-text) and body_text (free-text). Plain B-tree
-- indexes can't serve leading-wildcard ILIKE, so these were sequential scans on
-- a 6,000+-row table. pg_trgm GIN trigram indexes make substring ILIKE indexable.
--
-- Choice: GIN trigram (not a tsvector FTS column) because the search path is
-- substring ILIKE with operators (from:/to:/subject:/is:), not lexeme/stemmed
-- full-text matching — trigram indexes accelerate exactly those ILIKE queries.
-- body_text gets its own index since it's large and only hit by free-text terms.

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_emails_subject_trgm    ON emails USING gin (subject gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_emails_from_email_trgm ON emails USING gin (from_email gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_emails_from_name_trgm  ON emails USING gin (from_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_emails_body_text_trgm  ON emails USING gin (body_text gin_trgm_ops);
