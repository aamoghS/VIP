create table if not exists public.players (
  id text primary key,
  name text not null,
  name_key text not null unique,
  password_hash text not null,
  session_token text unique,
  progress jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.players enable row level security;

revoke all on public.players from anon, authenticated;
