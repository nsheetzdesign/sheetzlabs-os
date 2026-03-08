create table venture_connections (
  id uuid primary key default gen_random_uuid(),
  venture_id uuid references ventures(id) on delete cascade,
  provider text not null, -- 'supabase', 'stripe', 'posthog'
  config jsonb default '{}', -- { project_ref, tables, etc. }
  credentials_key text, -- Reference to secret name, e.g., 'BOHP_SUPABASE'
  is_active boolean default true,
  last_sync_at timestamptz,
  created_at timestamptz default now(),
  unique(venture_id, provider)
);

alter table venture_connections enable row level security;
create policy "Allow all for authenticated" on venture_connections for all using (auth.role() = 'authenticated');

-- Add parent_venture_id for hierarchy
alter table ventures add column parent_venture_id uuid references ventures(id);

-- Add CoLab Studios as parent venture
insert into ventures (name, slug, tagline, status, stage) values
  ('CoLab Studios', 'colab', 'Consulting practice and product incubator', 'active', 'early-revenue');

-- Add Telosi and HoliX under CoLab
insert into ventures (name, slug, domain, tagline, status, stage, parent_venture_id) values
  ('Telosi', 'telosi', 'telosi.com', 'Website creation and hosting for SMBs', 'building', 'pre-revenue',
    (select id from ventures where slug = 'colab')),
  ('HoliX', 'holix', 'holixos.com', 'Fitness intelligence platform', 'building', 'pre-revenue',
    (select id from ventures where slug = 'colab'));

-- Update consulting to be under CoLab
update ventures set parent_venture_id = (select id from ventures where slug = 'colab') where slug = 'consulting';

-- Seed venture_connections for products with Supabase backends
insert into venture_connections (venture_id, provider, config, credentials_key) values
  ((select id from ventures where slug = 'bohp'), 'supabase',
    '{"project_ref": "ayclupjvpalbcagakasp", "region": "us-east-1"}', 'BOHP_SUPABASE'),
  ((select id from ventures where slug = 'telosi'), 'supabase',
    '{"project_ref": "tzrlbykhnzskqjyaqqxq", "region": "us-east-1"}', 'TELOSI_SUPABASE'),
  ((select id from ventures where slug = 'holix'), 'supabase',
    '{"project_ref": "sofjotbxnfumpydwfgsb", "region": "us-east-1"}', 'HOLIX_SUPABASE');
