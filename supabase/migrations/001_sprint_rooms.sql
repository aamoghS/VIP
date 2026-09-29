create table if not exists public.sprint_rooms (
  id text primary key,
  selected_mission_id text,
  group_a_result jsonb not null default '{}'::jsonb,
  group_b_result jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.sprint_rooms enable row level security;

create policy "sprint rooms are shared"
  on public.sprint_rooms
  for all
  to anon, authenticated
  using (true)
  with check (true);

alter publication supabase_realtime add table public.sprint_rooms;
