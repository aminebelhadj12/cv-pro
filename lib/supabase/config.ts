/**
 * Reads and validates the Supabase settings from the environment.
 *
 * Only PUBLIC values are used here: the project URL and the publishable key
 * (or the legacy "anon" key). Secret / service-role keys must never be read by
 * browser code, so this file refuses them.
 */

export type SupabaseEnvStatus =
  | { status: "ok"; url: string; publishableKey: string }
  | { status: "missing" }
  | { status: "invalid"; reason: "url" | "key" }
  /** A secret or service-role key was put in a public variable. */
  | { status: "unsafe" };

function decodeJwtRole(token: string): string | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const payload: unknown = JSON.parse(atob(padded));
    if (typeof payload === "object" && payload !== null && "role" in payload) {
      const role = (payload as { role: unknown }).role;
      return typeof role === "string" ? role : null;
    }
    return null;
  } catch {
    return null;
  }
}

/** Pure function (easy to test): validates raw values. */
export function inspectSupabaseEnv(
  rawUrl: string | undefined,
  rawKey: string | undefined,
): SupabaseEnvStatus {
  const url = (rawUrl ?? "").trim().replace(/\/+$/, "");
  const key = (rawKey ?? "").trim();
  if (!url && !key) return { status: "missing" };

  // The key check comes first: leaking a secret is worse than a typo in the URL.
  if (key.startsWith("sb_secret_")) return { status: "unsafe" };
  const jwtRole = key.startsWith("eyJ") ? decodeJwtRole(key) : null;
  if (jwtRole === "service_role") return { status: "unsafe" };

  if (!url) return { status: "invalid", reason: "url" };
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return { status: "invalid", reason: "url" };
    }
  } catch {
    return { status: "invalid", reason: "url" };
  }

  // Accepted: a publishable key, or a legacy "anon" key (a JWT whose role is "anon").
  const looksValid = key.startsWith("sb_publishable_") || jwtRole === "anon";
  if (!looksValid) return { status: "invalid", reason: "key" };

  return { status: "ok", url, publishableKey: key };
}

let warned = false;

/** Returns the settings, or null when Supabase is not (correctly) configured. */
export function getSupabaseConfig(): { url: string; publishableKey: string } | null {
  // Written out in full so Next.js can inline the values in the browser bundle.
  const result = inspectSupabaseEnv(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );

  if (result.status === "ok") {
    return { url: result.url, publishableKey: result.publishableKey };
  }

  if ((result.status === "unsafe" || result.status === "invalid") && !warned) {
    warned = true;
    console.error(
      result.status === "unsafe"
        ? "[CV Pro] A secret or service-role Supabase key was found in a NEXT_PUBLIC_ variable. Accounts are disabled. Use the publishable key instead and rotate the exposed key."
        : `[CV Pro] Invalid Supabase ${result.reason}. Accounts are disabled. Check .env.local.`,
    );
  }
  return null;
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseConfig() !== null;
}
