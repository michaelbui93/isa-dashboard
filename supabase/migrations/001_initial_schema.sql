-- Enable pgcrypto for encryption
create extension if not exists pgcrypto;

-- T212 credentials per user
create table if not exists t212_credentials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  api_key_encrypted text not null,
  environment text not null default 'live' check (environment in ('live', 'demo')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Daily portfolio snapshots for performance history
create table if not exists portfolio_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  snapshot_date date not null,
  total_value numeric(15,2) not null,
  cash_balance numeric(15,2),
  invested_value numeric(15,2),
  ppl numeric(15,2),
  created_at timestamptz default now(),
  unique(user_id, snapshot_date)
);

-- Row Level Security
alter table t212_credentials enable row level security;
alter table portfolio_snapshots enable row level security;

create policy "Users manage own credentials"
  on t212_credentials for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own snapshots"
  on portfolio_snapshots for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger t212_credentials_updated_at
  before update on t212_credentials
  for each row execute function update_updated_at();
