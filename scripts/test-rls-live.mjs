// End-to-end security test against YOUR real Supabase project, with real accounts.
// Run it with:  npm run test:rls-live
//
// It signs in as two (or three) test users through the normal public API (the
// same way the website will) and checks that user B cannot read, change, delete
// or create anything in user A's CVs. It cleans up the one row it creates.
//
// Needs a file named .env.test.local (ignored by Git), see docs/DATABASE.md:
//   TEST_USER_A_EMAIL=...   TEST_USER_A_PASSWORD=...
//   TEST_USER_B_EMAIL=...   TEST_USER_B_PASSWORD=...
//   TEST_USER_C_EMAIL=...   TEST_USER_C_PASSWORD=...   (optional: UNCONFIRMED user)

import { createClient } from "@supabase/supabase-js";

const env = process.env;
const url = (env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim().replace(/\/+$/, "");
const key = (env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "").trim();

let passed = 0;
let failed = 0;
const pass = (name) => { passed++; console.log(`[OK] ${name}`); };
const fail = (name, detail) => { failed++; console.log(`[XX] ${name}${detail ? `\n     ${detail}` : ""}`); };
const check = (name, condition, detail) => (condition ? pass(name) : fail(name, detail));

function need(name) {
  const value = (env[name] ?? "").trim();
  if (!value) { console.log(`Missing ${name}. See docs/DATABASE.md (section "Test avec de vrais comptes").`); process.exit(2); }
  return value;
}

if (!url || !key) {
  console.log("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local");
  process.exit(2);
}
if (key.startsWith("sb_secret_")) {
  console.log("Refusing to run: the key is a SECRET key. Use the publishable key.");
  process.exit(2);
}

const credentials = {
  A: { email: need("TEST_USER_A_EMAIL"), password: need("TEST_USER_A_PASSWORD") },
  B: { email: need("TEST_USER_B_EMAIL"), password: need("TEST_USER_B_PASSWORD") },
};
const unverified = env.TEST_USER_C_EMAIL && env.TEST_USER_C_PASSWORD
  ? { email: env.TEST_USER_C_EMAIL.trim(), password: env.TEST_USER_C_PASSWORD }
  : null;

// One independent client per user: no session is shared or saved.
const newClient = () =>
  createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });

async function signIn(label, { email, password }) {
  const client = newClient();
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    console.log(`Could not sign in as user ${label}: ${error?.message ?? "no user returned"}`);
    console.log("Check the email/password in .env.test.local and that the user was created with 'Auto Confirm User'.");
    process.exit(2);
  }
  return { client, id: data.user.id };
}

console.log("CV Pro: live security test (real Supabase project)\n");

const a = await signIn("A", credentials.A);
const b = await signIn("B", credentials.B);
check("A and B are two different accounts", a.id !== b.id, "Use two different users.");

const content = { version: 1, personal: { fullName: "RLS live test" } };
let rowId = null;

try {
  // --- A creates and reads their own CV
  const created = await a.client
    .from("resumes")
    .insert({ user_id: a.id, title: "RLS live test", template: "classic", content })
    .select("id, user_id")
    .single();
  rowId = created.data?.id ?? null;
  check("A can create a CV", !created.error && created.data?.user_id === a.id, created.error?.message);

  if (!rowId) {
    console.log("\nCannot continue without the test row.");
  } else {
    const own = await a.client.from("resumes").select("id").eq("id", rowId);
    check("A can read their own CV", !own.error && own.data?.length === 1, own.error?.message);

    // --- B tries everything on A's CV
    const bList = await b.client.from("resumes").select("id");
    check("B does not see A's CV in the list", !bList.error && !bList.data?.some((r) => r.id === rowId), bList.error?.message);

    const bGet = await b.client.from("resumes").select("id").eq("id", rowId);
    check("B cannot read A's CV by id", !bGet.error && bGet.data?.length === 0, bGet.error?.message);

    const bUpdate = await b.client.from("resumes").update({ title: "hacked" }).eq("id", rowId).select("id");
    check("B cannot update A's CV", !bUpdate.error && bUpdate.data?.length === 0, bUpdate.error?.message ?? "rows changed: " + bUpdate.data?.length);

    const bDelete = await b.client.from("resumes").delete().eq("id", rowId).select("id");
    check("B cannot delete A's CV", !bDelete.error && bDelete.data?.length === 0, bDelete.error?.message ?? "rows deleted: " + bDelete.data?.length);

    const bForge = await b.client.from("resumes").insert({ user_id: a.id, title: "forged", content }).select("id");
    check("B cannot create a CV in A's name", Boolean(bForge.error) && !bForge.data?.length, "a forged row was accepted");
    if (bForge.data?.length) await a.client.from("resumes").delete().in("id", bForge.data.map((r) => r.id));

    // --- A cannot hand a CV to someone else or forge timestamps
    const steal = await a.client.from("resumes").update({ user_id: b.id }).eq("id", rowId).select("id");
    check("A cannot change the owner of a CV", Boolean(steal.error) || steal.data?.length === 0, "owner change was accepted");

    const stamp = await a.client.from("resumes").update({ updated_at: "2000-01-01T00:00:00Z" }).eq("id", rowId).select("id");
    check("A cannot forge updated_at", Boolean(stamp.error), "updated_at change was accepted");

    // --- A's data is intact
    const after = await a.client.from("resumes").select("title, user_id").eq("id", rowId).single();
    check("A's CV is unchanged after B's attempts", after.data?.title === "RLS live test" && after.data?.user_id === a.id, after.error?.message);

    // --- profiles
    const bProfiles = await b.client.from("profiles").select("id");
    check("B sees only their own profile", !bProfiles.error && bProfiles.data?.length === 1 && bProfiles.data[0].id === b.id, bProfiles.error?.message ?? `rows: ${bProfiles.data?.length}`);
    const rename = await b.client.from("profiles").update({ full_name: "pwned" }).eq("id", a.id).select("id");
    check("B cannot rename A", !rename.error && rename.data?.length === 0, rename.error?.message);
  }

  // --- visitors who are not signed in
  const anon = newClient();
  const anonRead = await anon.from("resumes").select("id");
  check("A visitor who is not signed in cannot read CVs", Boolean(anonRead.error) || anonRead.data?.length === 0, "anonymous read returned rows");
  const anonWrite = await anon.from("resumes").insert({ user_id: a.id, title: "anon", content }).select("id");
  check("A visitor who is not signed in cannot create CVs", Boolean(anonWrite.error), "anonymous insert was accepted");

  // --- unconfirmed e-mail
  if (unverified) {
    const c = newClient();
    const { data, error } = await c.auth.signInWithPassword(unverified);
    check("A user with an unconfirmed e-mail cannot sign in", Boolean(error) && !data?.session,
      "Sign-in succeeded: 'Confirm email' may be OFF or 'Allow unverified email sign-ins' may be ON in Supabase.");
    if (error) console.log(`     (Supabase says: ${error.code ?? error.name}: ${error.message})`);
  } else {
    console.log("[--] Unconfirmed-user check skipped (no TEST_USER_C_* in .env.test.local)");
  }
} finally {
  // --- cleanup
  if (rowId) {
    const cleanup = await a.client.from("resumes").delete().eq("id", rowId).select("id");
    check("Test CV cleaned up", !cleanup.error && cleanup.data?.length === 1, cleanup.error?.message);
  }
}

console.log(`\n${passed} passed, ${failed} failed.`);
process.exit(failed > 0 ? 1 : 0);
