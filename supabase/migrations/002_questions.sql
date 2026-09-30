create table if not exists public.questions (
  id integer primary key,
  topic text not null,
  type text not null,
  prompt text not null,
  options jsonb not null,
  current_answer text not null,
  reasoning text not null,
  complexity integer,
  bloom_level text,
  critical boolean not null default false
);

alter table public.questions enable row level security;

revoke all on public.questions from anon, authenticated;
