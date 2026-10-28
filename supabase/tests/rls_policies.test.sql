-- =============================================================================
-- CV Pro: self-test of the database security (RLS), run entirely in SQL.
--
-- How to run: Supabase dashboard > SQL Editor > New query > paste this whole
-- file > Run (after running the migration).
--
-- What it does: creates 3 throw-away users INSIDE the script (A and B with a
-- confirmed e-mail, C without), then pretends to be each of them and checks
-- what they can and cannot do. At the very end it deliberately raises an error
-- so that EVERYTHING it created is rolled back: no test data is left behind.
--
-- Expected result: an error whose message starts with  RLS_TESTS_OK
-- Any message starting with  FAILED  means a policy is wrong: send it to me.
-- =============================================================================

create function pg_temp.act_as(p_uid uuid, p_role text)
returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claims',
    json_build_object('sub', p_uid, 'role', p_role)::text, true);
  perform set_config('request.jwt.claim.sub', coalesce(p_uid::text, ''), true);
  perform set_config('request.jwt.claim.role', p_role, true);
  execute format('set local role %I', p_role);
end $$;

create function pg_temp.act_as_admin()
returns void language plpgsql as $$
begin
  reset role;
  perform set_config('request.jwt.claims', '', true);
  perform set_config('request.jwt.claim.sub', '', true);
  perform set_config('request.jwt.claim.role', '', true);
end $$;

-- The statement must fail with this SQLSTATE (and, if given, this message part).
create function pg_temp.expect_error(p_sql text, p_state text, p_msg text default null)
returns int language plpgsql as $$
declare v_state text; v_msg text;
begin
  begin
    execute p_sql;
  exception when others then
    get stacked diagnostics v_state = returned_sqlstate, v_msg = message_text;
    if v_state <> p_state then
      raise exception 'FAILED: expected SQLSTATE % but got % (%) for: %', p_state, v_state, v_msg, p_sql;
    end if;
    if p_msg is not null and position(p_msg in v_msg) = 0 then
      raise exception 'FAILED: message "%" does not contain "%"', v_msg, p_msg;
    end if;
    return 1;
  end;
  raise exception 'FAILED: expected error % but the statement succeeded: %', p_state, p_sql;
end $$;

-- The statement must touch exactly p_expected rows.
create function pg_temp.expect_rows(p_sql text, p_expected int, p_what text)
returns int language plpgsql as $$
declare v int;
begin
  execute p_sql;
  get diagnostics v = row_count;
  if v <> p_expected then
    raise exception 'FAILED: % (expected % rows, got %): %', p_what, p_expected, v, p_sql;
  end if;
  return 1;
end $$;

do $$
declare
  a uuid := gen_random_uuid();   -- confirmed user
  b uuid := gen_random_uuid();   -- another confirmed user
  c uuid := gen_random_uuid();   -- user WITHOUT confirmed e-mail
  d uuid := gen_random_uuid();   -- user with a very long name
  r_a uuid;
  r_c uuid;
  v boolean;
  n int := 0;
  i int;
begin
  -- ---- setup, as the database owner ----------------------------------------
  insert into auth.users (id, email, email_confirmed_at, raw_user_meta_data) values
    (a, 'a@test.invalid', now(),  '{"full_name":"  Alice  "}'),
    (b, 'b@test.invalid', now(),  '{"full_name":"Bob"}'),
    (c, 'c@test.invalid', null,   '{"full_name":"Carol"}'),
    (d, 'd@test.invalid', now(),  jsonb_build_object('full_name', repeat('x', 300)));

  if not exists (select 1 from public.profiles where id = a and full_name = 'Alice') then
    raise exception 'FAILED: profile for A was not created (or the name was not trimmed)';
  end if;
  if (select count(*) from public.profiles where id in (a, b, c, d)) <> 4 then
    raise exception 'FAILED: profiles were not created for all users';
  end if;
  if (select char_length(full_name) from public.profiles where id = d) <> 120 then
    raise exception 'FAILED: a very long name was not shortened to 120 characters';
  end if;
  n := n + 3;

  -- ---- user A: owner -------------------------------------------------------
  perform pg_temp.act_as(a, 'authenticated');
  insert into public.resumes (user_id, title, template, content)
  values (a, 'CV A', 'modern', '{"version":1}') returning id into r_a;
  n := n + pg_temp.expect_rows('select 1 from public.resumes', 1, 'A sees their own resume');
  n := n + pg_temp.expect_rows('select 1 from public.profiles', 1, 'A sees only their own profile');
  select public.is_email_verified() into v;
  if v is not true then raise exception 'FAILED: is_email_verified() should be true for A'; end if;
  n := n + 1;

  -- ---- user B: another user, must not touch A's data -----------------------
  perform pg_temp.act_as(b, 'authenticated');
  n := n + pg_temp.expect_rows('select 1 from public.resumes', 0, 'B must not read A''s resume');
  n := n + pg_temp.expect_rows(format('update public.resumes set title = ''hacked'' where id = %L', r_a), 0, 'B must not update A''s resume');
  n := n + pg_temp.expect_rows(format('delete from public.resumes where id = %L', r_a), 0, 'B must not delete A''s resume');
  -- Without a WHERE clause the SELECT policy is not consulted, so the DELETE/UPDATE policies must hold on their own.
  n := n + pg_temp.expect_rows('delete from public.resumes', 0, 'B: DELETE without WHERE must remove nothing');
  n := n + pg_temp.expect_rows('update public.resumes set title = ''x''', 0, 'B: UPDATE without WHERE must change nothing');
  n := n + pg_temp.expect_error(format('insert into public.resumes (user_id, title, content) values (%L, ''x'', ''{}'')', a), '42501');
  n := n + pg_temp.expect_error(format('update public.resumes set user_id = %L where id = %L', b, r_a), '42501');
  n := n + pg_temp.expect_rows('select 1 from public.profiles', 1, 'B sees only their own profile');
  n := n + pg_temp.expect_rows(format('update public.profiles set full_name = ''pwned'' where id = %L', a), 0, 'B must not rename A');
  n := n + pg_temp.expect_error('insert into public.profiles (id, full_name) values (gen_random_uuid(), ''x'')', '42501');
  n := n + pg_temp.expect_error('delete from public.profiles', '42501');

  perform pg_temp.act_as_admin();
  if (select title from public.resumes where id = r_a) <> 'CV A' then
    raise exception 'FAILED: A''s resume was modified by B';
  end if;
  if (select full_name from public.profiles where id = a) <> 'Alice' then
    raise exception 'FAILED: A''s profile was modified by B';
  end if;
  n := n + 2;

  -- the trigger overwrites a forged updated_at (checked as owner, who is allowed to try)
  update public.resumes set updated_at = '2000-01-01' where id = r_a;
  if (select updated_at from public.resumes where id = r_a) = '2000-01-01' then
    raise exception 'FAILED: updated_at trigger did not run';
  end if;
  n := n + 1;

  -- ---- user A again: allowed and forbidden changes ----------------------------
  perform pg_temp.act_as(a, 'authenticated');
  n := n + pg_temp.expect_rows(format('update public.resumes set title = ''CV A v2'', template = ''creative'', content = ''{"version":1,"x":1}'' where id = %L', r_a), 1, 'A updates their own resume');
  n := n + pg_temp.expect_error(format('update public.resumes set user_id = %L where id = %L', b, r_a), '42501', 'permission denied');
  n := n + pg_temp.expect_error(format('update public.resumes set updated_at = ''2000-01-01'' where id = %L', r_a), '42501', 'permission denied');
  n := n + pg_temp.expect_error(format('update public.resumes set created_at = ''2000-01-01'' where id = %L', r_a), '42501', 'permission denied');
  n := n + pg_temp.expect_error(format('update public.resumes set id = gen_random_uuid() where id = %L', r_a), '42501', 'permission denied');
  n := n + pg_temp.expect_error(format('update public.resumes set template = ''evil'' where id = %L', r_a), '23514');
  n := n + pg_temp.expect_error(format('update public.resumes set content = ''[]''::jsonb where id = %L', r_a), '23514');
  n := n + pg_temp.expect_error(format('update public.resumes set content = jsonb_build_object(''x'', repeat(''a'', 1600000)) where id = %L', r_a), '23514');
  n := n + pg_temp.expect_error(format('update public.resumes set title = repeat(''t'', 121) where id = %L', r_a), '23514');
  n := n + pg_temp.expect_rows(format('update public.profiles set full_name = ''Alice B'' where id = %L', a), 1, 'A renames themselves');
  n := n + pg_temp.expect_error(format('update public.profiles set full_name = repeat(''n'', 121) where id = %L', a), '23514');
  n := n + pg_temp.expect_error(format('update public.profiles set id = gen_random_uuid() where id = %L', a), '42501', 'permission denied');

  -- limit of 20 resumes per user
  for i in 2..20 loop
    insert into public.resumes (user_id, title, content) values (a, 'CV ' || i, '{"version":1}');
  end loop;
  n := n + pg_temp.expect_rows('select 1 from public.resumes', 20, 'A has 20 resumes');
  n := n + pg_temp.expect_error(format('insert into public.resumes (user_id, title, content) values (%L, ''21st'', ''{"version":1}'')', a), 'P0001', 'resume_limit_reached');
  n := n + pg_temp.expect_rows(format('delete from public.resumes where id = %L', r_a), 1, 'A deletes their own resume');
  insert into public.resumes (user_id, title, content) values (a, 'CV again', '{"version":1}');
  n := n + 1;

  -- ---- user C: e-mail NOT confirmed ------------------------------------------
  perform pg_temp.act_as_admin();
  insert into public.resumes (user_id, title, content) values (c, 'CV C', '{"version":1}') returning id into r_c;
  perform pg_temp.act_as(c, 'authenticated');
  select public.is_email_verified() into v;
  if v is not false then raise exception 'FAILED: is_email_verified() should be false for C'; end if;
  n := n + 1;
  n := n + pg_temp.expect_rows('select 1 from public.resumes', 0, 'unverified C must not read even their own resume');
  n := n + pg_temp.expect_error(format('insert into public.resumes (user_id, title, content) values (%L, ''x'', ''{"version":1}'')', c), '42501');
  n := n + pg_temp.expect_rows(format('update public.resumes set title = ''x'' where id = %L', r_c), 0, 'unverified C must not update');
  n := n + pg_temp.expect_rows(format('delete from public.resumes where id = %L', r_c), 0, 'unverified C must not delete');
  n := n + pg_temp.expect_rows('delete from public.resumes', 0, 'unverified C: DELETE without WHERE must remove nothing');
  n := n + pg_temp.expect_rows('update public.resumes set title = ''x''', 0, 'unverified C: UPDATE without WHERE must change nothing');
  n := n + pg_temp.expect_rows('select 1 from public.profiles', 1, 'C can still read their own profile');
  perform pg_temp.act_as_admin();
  if not exists (select 1 from public.resumes where id = r_c and title = 'CV C') then
    raise exception 'FAILED: C''s resume was changed by C';
  end if;
  n := n + 1;

  -- ---- anonymous visitors (not signed in) ---------------------------------------
  perform pg_temp.act_as(null, 'anon');
  n := n + pg_temp.expect_error('select 1 from public.resumes', '42501');
  n := n + pg_temp.expect_error('select 1 from public.profiles', '42501');
  n := n + pg_temp.expect_error('insert into public.resumes (user_id, content) values (gen_random_uuid(), ''{}'')', '42501');
  n := n + pg_temp.expect_error('select public.is_email_verified()', '42501');

  -- ---- deleting an account removes its data -------------------------------------
  perform pg_temp.act_as_admin();
  delete from auth.users where id = a;
  if exists (select 1 from public.resumes where user_id = a)
     or exists (select 1 from public.profiles where id = a) then
    raise exception 'FAILED: data of a deleted account was not removed';
  end if;
  n := n + 1;

  -- Roll everything back on purpose: nothing is left in your database.
  raise exception 'RLS_TESTS_OK: % checks passed. (This "error" is intentional: it rolls back the test users.)', n;
end $$;
