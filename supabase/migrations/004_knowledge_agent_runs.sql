-- Knowledge Base
create table knowledge (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  type text not null default 'note',
  tags text[],
  venture_id uuid references ventures(id),
  content text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table knowledge enable row level security;
create policy "Allow all for authenticated" on knowledge for all using (auth.role() = 'authenticated');
create trigger knowledge_updated_at before update on knowledge for each row execute function update_updated_at();

-- Agent Runs
create table if not exists agent_runs (
  id uuid primary key default gen_random_uuid(),
  agent_name text not null,
  trigger_type text,
  started_at timestamptz default now(),
  completed_at timestamptz,
  status text default 'running',
  input_data jsonb,
  output_data jsonb,
  error_message text,
  tokens_used integer,
  duration_ms integer,
  created_at timestamptz default now()
);

alter table agent_runs enable row level security;
create policy "Allow all for authenticated" on agent_runs for all using (auth.role() = 'authenticated');
