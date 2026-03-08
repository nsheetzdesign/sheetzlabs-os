-- Stripe connection registry
create table stripe_connections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  account_key text not null unique, -- 'personal', 'colab', etc. (maps to secret name)
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Product-to-venture mapping (so one shared Stripe account can route CoLab → Telosi vs HoliX)
create table stripe_product_mappings (
  id uuid primary key default gen_random_uuid(),
  stripe_connection_id uuid references stripe_connections(id) on delete cascade,
  stripe_product_id text not null,
  venture_id uuid references ventures(id) on delete cascade,
  created_at timestamptz default now(),
  unique(stripe_product_id)
);

-- Extend revenue table for Stripe-synced records
alter table revenue add column if not exists stripe_invoice_id text unique;
alter table revenue add column if not exists stripe_connection_id uuid references stripe_connections(id);

-- RLS
alter table stripe_connections enable row level security;
alter table stripe_product_mappings enable row level security;

create policy "Allow all for authenticated" on stripe_connections
  for all using (auth.role() = 'authenticated');

create policy "Allow all for authenticated" on stripe_product_mappings
  for all using (auth.role() = 'authenticated');

-- Seed the two known accounts
insert into stripe_connections (name, account_key) values
  ('Personal', 'personal'),
  ('CoLab Studios', 'colab');
