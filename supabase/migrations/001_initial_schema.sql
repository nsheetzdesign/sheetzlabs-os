-- Enums
create type venture_status as enum ('idea', 'validating', 'building', 'active', 'maintenance', 'sunset', 'sold');
create type venture_stage as enum ('pre-revenue', 'early-revenue', 'growing', 'profitable', 'scaled');
create type pipeline_stage as enum ('idea', 'researching', 'validating', 'speccing', 'building', 'beta', 'launched', 'parked');
create type relationship_type as enum ('client', 'partner', 'investor', 'advisor', 'vendor', 'prospect', 'friend');
create type revenue_type as enum ('recurring', 'one-time', 'retainer', 'project');
create type task_priority as enum ('urgent', 'high', 'medium', 'low');
create type task_status as enum ('backlog', 'todo', 'in-progress', 'review', 'done', 'blocked');

-- Ventures
create table ventures (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  domain text,
  tagline text,
  status venture_status default 'idea',
  stage venture_stage default 'pre-revenue',
  mrr_cents integer default 0,
  customer_count integer default 0,
  churn_rate numeric(5,2) default 0,
  health_score integer default 50,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Pipeline
create table pipeline (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  problem_statement text,
  target_market text,
  stage pipeline_stage default 'idea',
  score_operator_insight integer default 0,
  score_ai_leverage integer default 0,
  score_market_size integer default 0,
  score_revenue_speed integer default 0,
  score_portfolio_fit integer default 0,
  score_personal_energy integer default 0,
  total_score integer generated always as (
    score_operator_insight + score_ai_leverage + score_market_size +
    score_revenue_speed + score_portfolio_fit + score_personal_energy
  ) stored,
  notes text,
  venture_id uuid references ventures(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Revenue
create table revenue (
  id uuid primary key default gen_random_uuid(),
  venture_id uuid references ventures(id) on delete cascade,
  amount_cents integer not null,
  type revenue_type not null,
  period_start date,
  period_end date,
  client_name text,
  description text,
  recorded_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Relationships
create table relationships (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  company text,
  role text,
  type relationship_type default 'prospect',
  strength integer default 50,
  last_contact timestamptz,
  notes text,
  venture_ids uuid[],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tasks
create table tasks (
  id uuid primary key default gen_random_uuid(),
  venture_id uuid references ventures(id),
  title text not null,
  description text,
  priority task_priority default 'medium',
  status task_status default 'backlog',
  due_date date,
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger ventures_updated_at before update on ventures for each row execute function update_updated_at();
create trigger pipeline_updated_at before update on pipeline for each row execute function update_updated_at();
create trigger relationships_updated_at before update on relationships for each row execute function update_updated_at();
create trigger tasks_updated_at before update on tasks for each row execute function update_updated_at();

-- RLS
alter table ventures enable row level security;
alter table pipeline enable row level security;
alter table revenue enable row level security;
alter table relationships enable row level security;
alter table tasks enable row level security;

create policy "Allow all for authenticated" on ventures for all using (auth.role() = 'authenticated');
create policy "Allow all for authenticated" on pipeline for all using (auth.role() = 'authenticated');
create policy "Allow all for authenticated" on revenue for all using (auth.role() = 'authenticated');
create policy "Allow all for authenticated" on relationships for all using (auth.role() = 'authenticated');
create policy "Allow all for authenticated" on tasks for all using (auth.role() = 'authenticated');

-- Seed data
insert into ventures (name, slug, domain, tagline, status, stage) values
  ('Back of House Pro', 'bohp', 'backofhousepro.com', 'Operations platform for church production teams', 'building', 'pre-revenue'),
  ('nicksheetz.com', 'consulting', 'nicksheetz.com', 'Ops consulting and automation services', 'active', 'early-revenue'),
  ('Sheetz Labs OS', 'os', null, 'Operating system for solo founders', 'building', 'pre-revenue');

insert into pipeline (name, problem_statement, target_market, stage, notes) values
  ('Brian Product', 'TBD - from consulting engagement', 'TBD', 'validating', 'Active consulting → product opportunity');
