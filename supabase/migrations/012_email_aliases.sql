-- Email aliases: additional "send from" addresses per account
create table email_aliases (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references email_accounts(id) on delete cascade not null,
  email text not null,
  name text,
  source text not null default 'manual', -- 'gmail_sendas' | 'manual'
  created_at timestamptz default now(),
  unique(account_id, email)
);

alter table email_aliases enable row level security;
create policy "Service role full access" on email_aliases for all using (true);
