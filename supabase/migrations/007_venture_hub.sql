-- Stack items per venture
create table venture_stack (
  id uuid primary key default gen_random_uuid(),
  venture_id uuid references ventures(id) on delete cascade,
  tool_name text not null,
  category text not null, -- 'database', 'hosting', 'payments', 'auth', 'analytics', 'ai', 'email', 'other'
  config jsonb default '{}',
  secrets_required text[],
  setup_commands text,
  docs_url text,
  dashboard_url text,
  created_at timestamptz default now()
);

-- Links per venture
create table venture_links (
  id uuid primary key default gen_random_uuid(),
  venture_id uuid references ventures(id) on delete cascade,
  label text not null,
  url text not null,
  type text default 'other', -- 'repo', 'live', 'docs', 'figma', 'dashboard', 'other'
  created_at timestamptz default now()
);

-- Roadmap milestones
create table milestones (
  id uuid primary key default gen_random_uuid(),
  venture_id uuid references ventures(id) on delete cascade,
  title text not null,
  description text,
  target_date date,
  completed_at timestamptz,
  status text default 'planned', -- 'planned', 'in-progress', 'completed', 'delayed'
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Add milestone_id to tasks for roadmap → task linking
alter table tasks add column if not exists milestone_id uuid references milestones(id) on delete set null;

-- Tickets aggregated from ventures
create table tickets (
  id uuid primary key default gen_random_uuid(),
  venture_id uuid references ventures(id) on delete cascade,
  external_id text,
  source text not null, -- 'bohp', 'telosi', 'holix', 'manual'
  type text not null, -- 'bug', 'feature', 'support'
  title text not null,
  description text,
  status text default 'open', -- 'open', 'in-progress', 'resolved', 'closed'
  priority text default 'medium',
  submitter_email text,
  submitter_name text,
  converted_task_id uuid references tasks(id),
  converted_milestone_id uuid references milestones(id),
  synced_at timestamptz default now(),
  created_at timestamptz default now(),
  unique(source, external_id)
);

-- Venture docs for Claude context (CLAUDE.md, skills, ADRs)
create table venture_docs (
  id uuid primary key default gen_random_uuid(),
  venture_id uuid references ventures(id) on delete cascade,
  path text not null, -- 'CLAUDE.md', '.claude/skills/deploy.md', 'docs/decisions/001-auth.md'
  content text,
  type text not null, -- 'claude_md', 'skill', 'hook', 'adr', 'runbook', 'architecture'
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(venture_id, path)
);

-- Stack templates for scaffold generator
create table stack_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  venture_type text not null, -- 'saas', 'internal', 'marketing'
  stack_items jsonb not null, -- array of default stack items
  claude_md_template text,
  skills jsonb, -- array of skill definitions
  hooks jsonb, -- array of hook definitions
  created_at timestamptz default now()
);

-- RLS
alter table venture_stack enable row level security;
alter table venture_links enable row level security;
alter table milestones enable row level security;
alter table tickets enable row level security;
alter table venture_docs enable row level security;
alter table stack_templates enable row level security;

create policy "Allow all for authenticated" on venture_stack for all using (auth.role() = 'authenticated');
create policy "Allow all for authenticated" on venture_links for all using (auth.role() = 'authenticated');
create policy "Allow all for authenticated" on milestones for all using (auth.role() = 'authenticated');
create policy "Allow all for authenticated" on tickets for all using (auth.role() = 'authenticated');
create policy "Allow all for authenticated" on venture_docs for all using (auth.role() = 'authenticated');
create policy "Allow all for authenticated" on stack_templates for all using (auth.role() = 'authenticated');

-- updated_at trigger for venture_docs
create trigger venture_docs_updated_at before update on venture_docs
  for each row execute function update_updated_at();

-- Seed SaaS stack template
insert into stack_templates (name, description, venture_type, stack_items, claude_md_template, skills, hooks)
values (
  'SaaS Starter',
  'Standard SaaS stack with Supabase, Cloudflare, Stripe',
  'saas',
  '[
    {"tool_name": "Supabase", "category": "database", "secrets_required": ["SUPABASE_URL", "SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY"]},
    {"tool_name": "Cloudflare Workers", "category": "hosting", "secrets_required": ["CLOUDFLARE_API_TOKEN", "CLOUDFLARE_ACCOUNT_ID"]},
    {"tool_name": "Stripe", "category": "payments", "secrets_required": ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"]},
    {"tool_name": "Resend", "category": "email", "secrets_required": ["RESEND_API_KEY"]}
  ]',
  '# {{VENTURE_NAME}}

## Purpose
{{TAGLINE}}

## Stack
- Database: Supabase (PostgreSQL)
- Hosting: Cloudflare Workers + Pages
- Payments: Stripe
- Email: Resend

## Repository Structure
```
apps/
├── web/        # React Router v7 frontend
└── api/        # Hono API
packages/
└── shared/     # Types, utils
```

## Key Commands
- `pnpm dev` — Run locally
- `pnpm build` — Build all
- `pnpm deploy` — Deploy to Cloudflare

## Rules
- Always run `supabase gen types` after migrations
- Use RLS on all tables
- Validate all inputs at API layer
',
  '[
    {"name": "deploy", "content": "# Deploy\n1. Run tests\n2. Build: pnpm build\n3. Deploy: pnpm deploy\n4. Verify health endpoint"},
    {"name": "db-migrate", "content": "# Database Migration\n1. Create migration: supabase migration new <name>\n2. Write SQL\n3. Push: supabase db push\n4. Regen types: supabase gen types typescript"},
    {"name": "api-endpoint", "content": "# API Endpoint\n1. Create route in apps/api/src/routes/\n2. Add validation with zod\n3. Add to index.ts\n4. Test with curl"},
    {"name": "component", "content": "# React Component\n1. Create in apps/web/app/components/\n2. Use Tailwind for styling\n3. Export from index.ts"},
    {"name": "code-review", "content": "# Code Review Checklist\n- [ ] Types correct\n- [ ] RLS policies\n- [ ] Error handling\n- [ ] No secrets in code\n- [ ] Tests pass"}
  ]',
  '[
    {"name": "pre-commit", "trigger": "pnpm typecheck && pnpm lint"},
    {"name": "post-migrate", "trigger": "supabase gen types typescript"}
  ]'
);
