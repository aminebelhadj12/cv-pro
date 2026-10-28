import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseConfig } from "./config";

/**
 * Supabase client for Client Components (runs in the browser).
 * Uses only the publishable key: what it can do is limited by Row Level Security.
 */
export function createClient() {
  const config = getSupabaseConfig();
  if (!config) {
    throw new Error("Supabase is not configured. See .env.example.");
  }
  return createBrowserClient(config.url, config.publishableKey);
}
