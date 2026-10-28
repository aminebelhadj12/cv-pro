import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseConfig } from "./config";

/**
 * Supabase client for Server Components, Server Actions and Route Handlers.
 * Create a NEW client for every request (never share one between requests).
 */
export async function createClient() {
  const config = getSupabaseConfig();
  if (!config) {
    throw new Error("Supabase is not configured. See .env.example.");
  }

  const cookieStore = await cookies();

  return createServerClient(config.url, config.publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component, which cannot write cookies.
          // The middleware refreshes the session, so this is safe to ignore.
        }
      },
    },
  });
}
