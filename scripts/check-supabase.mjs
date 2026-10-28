// Checks your Supabase configuration. Run it with:  npm run check:supabase
// (it reads .env.local). It sends ONE request to your project's public
// "settings" endpoint, with the publishable key only.

const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim().replace(/\/+$/, "");
const key = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "").trim();

let failures = 0;
let warnings = 0;
const ok = (msg) => console.log(`[OK] ${msg}`);
const warn = (msg) => { warnings++; console.log(`[!!] ${msg}`); };
const fail = (msg) => { failures++; console.log(`[XX] ${msg}`); };

function jwtRole(token) {
  try {
    const part = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(Buffer.from(part, "base64").toString("utf8")).role ?? null;
  } catch {
    return null;
  }
}

console.log("CV Pro: Supabase configuration check\n");

if (!url) fail("NEXT_PUBLIC_SUPABASE_URL is missing (see .env.example).");
if (!key) fail("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is missing (see .env.example).");

if (key.startsWith("sb_secret_") || (key.startsWith("eyJ") && jwtRole(key) === "service_role")) {
  fail("The key in NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is a SECRET key. Replace it with the publishable key and rotate (regenerate) the exposed secret key in the Supabase dashboard.");
  process.exit(1);
}

if (url) {
  try {
    const parsed = new URL(url);
    if (!["https:", "http:"].includes(parsed.protocol)) throw new Error("protocol");
    ok(`Project URL looks valid (${parsed.host})`);
  } catch {
    fail("NEXT_PUBLIC_SUPABASE_URL is not a valid URL (expected https://xxxx.supabase.co).");
  }
}

if (key) {
  if (key.startsWith("sb_publishable_")) ok("Key format: publishable key");
  else if (key.startsWith("eyJ")) warn("Key format: legacy 'anon' key. It still works for now, but switch to the publishable key (sb_publishable_...).");
  else fail("The key does not look like a Supabase publishable key (sb_publishable_...).");
}

if (failures === 0) {
  try {
    const res = await fetch(`${url}/auth/v1/settings`, {
      headers: { apikey: key },
      signal: AbortSignal.timeout(10_000),
    });

    if (res.status === 401 || res.status === 403) {
      fail(`Supabase answered ${res.status}: the key is not accepted by this project.`);
    } else if (!res.ok) {
      fail(`Supabase answered HTTP ${res.status}. Is the project paused or the URL wrong?`);
    } else {
      ok(`Project reachable (HTTP ${res.status})`);
      const s = await res.json();

      if (s?.external?.email === true) ok("Email/password sign-in is enabled");
      else if (s?.external?.email === false) fail("Email sign-in is DISABLED (Authentication > Sign In / Providers > Email).");
      else warn("Could not read the email provider setting.");

      if (s?.disable_signup === false) ok("New sign-ups are allowed");
      else if (s?.disable_signup === true) fail("New sign-ups are DISABLED in Supabase.");

      if (s?.mailer_autoconfirm === false) ok("Email confirmation is REQUIRED (good)");
      else if (s?.mailer_autoconfirm === true) warn("'Confirm email' is OFF: users would be able to sign in without verifying their address. Turn it ON (Authentication > Sign In / Providers > Email).");
      else warn("Could not read the 'confirm email' setting.");

      console.log("\nNot checkable from here (verify in the dashboard):");
      console.log(" - 'Allow unverified email sign-ins' must be OFF");
      console.log(" - Redirect URLs and Site URL (Authentication > URL Configuration)");
      console.log(" - Custom SMTP for real users (the built-in email service only reaches your team)");
    }
  } catch (error) {
    fail(`Could not reach ${url}: ${error instanceof Error ? error.message : error}`);
  }
}

console.log(`\n${failures} error(s), ${warnings} warning(s).`);
process.exit(failures > 0 ? 1 : 0);
