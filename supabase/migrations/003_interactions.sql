create table interactions (
  id uuid primary key default gen_random_uuid(),
  relationship_id uuid references relationships(id) on delete cascade,
  venture_id uuid references ventures(id),
  type text not null,
  direction text default 'outbound',
  subject text,
  summary text,
  occurred_at timestamptz default now(),
  created_at timestamptz default now()
);

alter table interactions enable row level security;
create policy "Allow all for authenticated" on interactions for all using (auth.role() = 'authenticated');
