-- Supabase notes table bootstrap
create table if not exists public.notes (
  id bigint primary key generated always as identity,
  title text not null
);

insert into public.notes (title)
values
  ('Today I created a Supabase project.'),
  ('I added some data and queried it from Next.js.'),
  ('It was awesome!')
on conflict do nothing;

alter table public.notes enable row level security;

drop policy if exists "public can read countries" on public.notes;

create policy "public can read countries"
  on public.notes
  for select
  to anon
  using (true);
