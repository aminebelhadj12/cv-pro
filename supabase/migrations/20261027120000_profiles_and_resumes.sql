-- =============================================================================
-- CV Pro: user profiles and saved resumes, protected by Row Level Security.
--
-- How to run: Supabase dashboard > SQL Editor > New query > paste this whole
-- file > Run. It is safe to read first: nothing here disables RLS.
-- =============================================================================


-- 1. Tables ------------------------------------------------------------------

create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text not null default '' check (char_length(full_name) <= 120),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.profiles is
  'One row per user, created automatically when the account is created. Holds the display name only.';

create table public.resumes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  title       text not null default '' check (char_length(title) <= 120),
  template    text not null default 'classic'
                check (template in ('classic', 'modern', 'creative')),
  -- The structured CV (same shape as the editor's ResumeData, "version": 1).
  content     jsonb not null
                check (jsonb_typeof(content) = 'object'
                       and octet_length(content::text) <= 1500000),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.resumes is 'Saved CVs. Each row belongs to exactly one user.';

create index resumes_user_id_updated_at_idx
  on public.resumes (user_id, updated_at desc);


-- 2. Helper functions and triggers ---------------------------------------------

-- Keeps updated_at accurate, whatever the client sends.
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger resumes_set_updated_at
  before update on public.resumes
  for each row execute function public.set_updated_at();

-- Creates the profile row when an account is created.
-- SECURITY DEFINER: it must be able to write to public.profiles on behalf of
-- the signing-up user. search_path is empty so nothing can be hijacked.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    left(btrim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), 120)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Accounts created before this migration (for example test users you added by
-- hand in the dashboard) get their profile now.
insert into public.profiles (id, full_name)
select u.id, left(btrim(coalesce(u.raw_user_meta_data ->> 'full_name', '')), 120)
from auth.users u
on conflict (id) do nothing;

-- At most 20 saved CVs per user. Runs with the caller's rights, so it only
-- counts rows the caller is allowed to see (their own).
create function public.enforce_resume_limit()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (select count(*) from public.resumes r where r.user_id = new.user_id) >= 20 then
    raise exception 'resume_limit_reached'
      using hint = 'A user can store at most 20 resumes.';
  end if;
  return new;
end;
$$;

create trigger resumes_enforce_limit
  before insert on public.resumes
  for each row execute function public.enforce_resume_limit();

-- True only when Supabase Auth itself recorded the e-mail address as confirmed.
-- It reads auth.users, NOT user_metadata (users can edit their own metadata).
-- Expected to be redundant when "Confirm email" is on (unconfirmed users cannot
-- sign in at all); it is a second lock enforced by the database.
create function public.is_email_verified()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from auth.users u
    where u.id = (select auth.uid())
      and u.email_confirmed_at is not null
  );
$$;

-- These functions are plumbing: nobody should be able to call them through the API.
revoke all on function public.set_updated_at()        from public, anon, authenticated;
revoke all on function public.handle_new_user()       from public, anon, authenticated;
revoke all on function public.enforce_resume_limit()  from public, anon, authenticated;
revoke all on function public.is_email_verified()     from public, anon;
grant execute on function public.is_email_verified()  to authenticated;


-- 3. Row Level Security --------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.resumes  enable row level security;

-- Start from zero privileges, then grant only what the app needs, column by column.
revoke all on public.profiles from anon, authenticated;
revoke all on public.resumes  from anon, authenticated;

grant select on public.profiles to authenticated;
grant update (full_name) on public.profiles to authenticated;

grant select, delete on public.resumes to authenticated;
grant insert (user_id, title, template, content) on public.resumes to authenticated;
grant update (title, template, content)          on public.resumes to authenticated;

-- profiles: a user can read and rename only their own profile.
-- (No insert policy: the trigger creates it. No delete policy: it is removed
-- together with the account.)
create policy profiles_select_own on public.profiles
  for select to authenticated
  using ((select auth.uid()) = id);

create policy profiles_update_own on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- resumes: full access to your own rows, and only with a confirmed e-mail.
create policy resumes_select_own on public.resumes
  for select to authenticated
  using ((select auth.uid()) = user_id and (select public.is_email_verified()));

create policy resumes_insert_own on public.resumes
  for insert to authenticated
  with check ((select auth.uid()) = user_id and (select public.is_email_verified()));

create policy resumes_update_own on public.resumes
  for update to authenticated
  using ((select auth.uid()) = user_id and (select public.is_email_verified()))
  with check ((select auth.uid()) = user_id and (select public.is_email_verified()));

create policy resumes_delete_own on public.resumes
  for delete to authenticated
  using ((select auth.uid()) = user_id and (select public.is_email_verified()));
