-- Expense categories
create type expense_category as enum (
  'software',
  'hosting',
  'ai_usage',
  'contractor',
  'hardware',
  'office',
  'marketing',
  'legal',
  'banking',
  'travel',
  'subscriptions',
  'other'
);

-- Expenses table
create table expenses (
  id uuid primary key default gen_random_uuid(),
  venture_id uuid references ventures(id),
  amount_cents integer not null,
  category expense_category not null,
  vendor text not null,
  description text,
  expense_date date not null,
  is_recurring boolean default false,
  receipt_url text,
  receipt_filename text,
  external_id text unique,
  source text default 'manual',
  created_at timestamptz default now()
);

-- Expense provider connections (for future auto-sync)
create table expense_connections (
  id uuid primary key default gen_random_uuid(),
  provider text not null unique,
  venture_id uuid references ventures(id),
  is_active boolean default true,
  last_sync_at timestamptz,
  created_at timestamptz default now()
);

-- RLS
alter table expenses enable row level security;
alter table expense_connections enable row level security;

create policy "Allow all for authenticated" on expenses
  for all using (auth.role() = 'authenticated');

create policy "Allow all for authenticated" on expense_connections
  for all using (auth.role() = 'authenticated');

-- Supabase Storage policies for the 'receipts' bucket
-- (bucket was created via API as public=true)
insert into storage.buckets (id, name, public, file_size_limit)
  values ('receipts', 'receipts', true, 10485760)
  on conflict (id) do nothing;

create policy "Authenticated users can upload receipts"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'receipts');

create policy "Anyone can read receipts"
  on storage.objects for select
  using (bucket_id = 'receipts');

create policy "Authenticated users can delete receipts"
  on storage.objects for delete to authenticated
  using (bucket_id = 'receipts');

-- Seed provider connections
insert into expense_connections (provider) values
  ('cloudflare'),
  ('supabase'),
  ('anthropic'),
  ('openai');
