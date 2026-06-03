-- Fit Together — initial schema
-- Tables derived from src/infrastructure/supabase/repositories/* repositories.

-- =========================================================================
-- Extensions
-- =========================================================================
create extension if not exists "pgcrypto";

-- =========================================================================
-- updated_at trigger function
-- =========================================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =========================================================================
-- Enums (text + check constraints to stay migration-light)
-- =========================================================================

-- users.role
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type user_role as enum ('partner_a', 'partner_b');
  end if;
end$$;

-- habits.frequency
do $$
begin
  if not exists (select 1 from pg_type where typname = 'habit_frequency') then
    create type habit_frequency as enum ('daily', 'weekly', 'custom');
  end if;
end$$;

-- invitations.status
do $$
begin
  if not exists (select 1 from pg_type where typname = 'invitation_status') then
    create type invitation_status as enum ('pending', 'accepted', 'declined', 'expired');
  end if;
end$$;

-- =========================================================================
-- Tables
-- =========================================================================

-- users: profile data, FKs auth.users
create table if not exists public.users (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text not null,
  display_name text not null,
  couple_id    uuid,
  role         user_role,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- couples
create table if not exists public.couples (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  partner_a_id  uuid not null references public.users(id) on delete restrict,
  partner_b_id  uuid references public.users(id) on delete restrict,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- now that couples exists, wire the FK from users.couple_id
do $$
begin
  if not exists (
    select 1 from information_schema.table_constraints
    where constraint_name = 'users_couple_id_fkey'
      and table_name = 'users'
  ) then
    alter table public.users
      add constraint users_couple_id_fkey
      foreign key (couple_id) references public.couples(id) on delete set null;
  end if;
end$$;

-- habits
create table if not exists public.habits (
  id           uuid primary key default gen_random_uuid(),
  couple_id    uuid not null references public.couples(id) on delete cascade,
  name         text not null,
  description  text,
  color        text not null,
  icon         text not null,
  frequency    habit_frequency not null,
  target_days  text[] not null default '{}',
  target_count integer not null default 1,
  created_by   uuid not null references public.users(id) on delete restrict,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists habits_couple_id_idx on public.habits(couple_id);

-- completions
create table if not exists public.completions (
  id           uuid primary key default gen_random_uuid(),
  habit_id     uuid not null references public.habits(id) on delete cascade,
  user_id      uuid not null references public.users(id) on delete cascade,
  date         date not null,
  completed    boolean not null default true,
  completed_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (habit_id, user_id, date)
);

create index if not exists completions_habit_id_idx on public.completions(habit_id);
create index if not exists completions_user_id_idx  on public.completions(user_id);

-- invitations
create table if not exists public.invitations (
  id             uuid primary key default gen_random_uuid(),
  couple_id      uuid not null references public.couples(id) on delete cascade,
  inviter_id     uuid not null references public.users(id) on delete cascade,
  invitee_email  text not null,
  token          text not null unique,
  expires_at     timestamptz not null,
  status         invitation_status not null default 'pending',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists invitations_token_idx          on public.invitations(token);
create index if not exists invitations_invitee_email_idx  on public.invitations(invitee_email);

-- =========================================================================
-- updated_at triggers
-- =========================================================================
drop trigger if exists trg_users_updated_at        on public.users;
drop trigger if exists trg_couples_updated_at      on public.couples;
drop trigger if exists trg_habits_updated_at       on public.habits;
drop trigger if exists trg_completions_updated_at  on public.completions;
drop trigger if exists trg_invitations_updated_at  on public.invitations;

create trigger trg_users_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

create trigger trg_couples_updated_at
  before update on public.couples
  for each row execute function public.set_updated_at();

create trigger trg_habits_updated_at
  before update on public.habits
  for each row execute function public.set_updated_at();

create trigger trg_completions_updated_at
  before update on public.completions
  for each row execute function public.set_updated_at();

create trigger trg_invitations_updated_at
  before update on public.invitations
  for each row execute function public.set_updated_at();

-- =========================================================================
-- Row Level Security
-- =========================================================================
alter table public.users        enable row level security;
alter table public.couples      enable row level security;
alter table public.habits       enable row level security;
alter table public.completions  enable row level security;
alter table public.invitations  enable row level security;

-- Helper: a user is "in" a couple if their couple_id matches
create or replace function public.is_couple_member(couple uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and couple_id = couple
  );
$$;

-- ---------- users ----------
drop policy if exists "users read own + partners"      on public.users;
drop policy if exists "users update own"               on public.users;
drop policy if exists "users insert own on signup"     on public.users;
drop policy if exists "users read couple members"      on public.users;

create policy "users read couple members"
  on public.users for select
  using (public.is_couple_member(couple_id) or id = auth.uid());

create policy "users update own"
  on public.users for update
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "users insert own on signup"
  on public.users for insert
  with check (id = auth.uid());

-- ---------- couples ----------
drop policy if exists "couples read members"           on public.couples;
drop policy if exists "couples insert creator"         on public.couples;
drop policy if exists "couples update members"         on public.couples;

create policy "couples read members"
  on public.couples for select
  using (public.is_couple_member(id));

create policy "couples insert creator"
  on public.couples for insert
  with check (partner_a_id = auth.uid());

create policy "couples update members"
  on public.couples for update
  using (public.is_couple_member(id))
  with check (public.is_couple_member(id));

-- ---------- habits ----------
drop policy if exists "habits read couple"             on public.habits;
drop policy if exists "habits write couple"            on public.habits;

create policy "habits read couple"
  on public.habits for select
  using (public.is_couple_member(couple_id));

create policy "habits write couple"
  on public.habits for all
  using (public.is_couple_member(couple_id))
  with check (public.is_couple_member(couple_id) and created_by = auth.uid());

-- ---------- completions ----------
drop policy if exists "completions read couple"        on public.completions;
drop policy if exists "completions write own"          on public.completions;

create policy "completions read couple"
  on public.completions for select
  using (
    exists (
      select 1 from public.habits h
      where h.id = completions.habit_id
        and public.is_couple_member(h.couple_id)
    )
  );

create policy "completions write own"
  on public.completions for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ---------- invitations ----------
drop policy if exists "invitations read couple"        on public.invitations;
drop policy if exists "invitations write couple"       on public.invitations;

create policy "invitations read couple"
  on public.invitations for select
  using (
    public.is_couple_member(couple_id)
    or invitee_email = (select email from public.users where id = auth.uid())
  );

create policy "invitations write couple"
  on public.invitations for all
  using (public.is_couple_member(couple_id) and inviter_id = auth.uid())
  with check (public.is_couple_member(couple_id) and inviter_id = auth.uid());
