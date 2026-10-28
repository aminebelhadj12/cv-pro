import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseConfig } from "./config";

/** Pages that need a signed-in user. */
const PROTECTED_PREFIXES = ["/dashboard", "/account"];

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/**
 * Runs before the pages listed in the matcher of /middleware.ts.
 * 1. Refreshes the Supabase session cookies when the access token has expired.
 * 2. Redirects visitors who are not signed in away from private pages.
 *
 * This is a convenience layer, NOT the security boundary: Server Components,
 * Server Actions and Row Level Security re-check the user on their own.
 */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  const config = getSupabaseConfig();
  const { pathname, search } = request.nextUrl;
  const isProtected = isProtectedPath(pathname);

  if (!config) {
    // Accounts are not configured: private pages do not exist for visitors.
    return isProtected
      ? NextResponse.redirect(new URL("/", request.url))
      : NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(config.url, config.publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
        // Responses that set auth cookies must never be cached by a CDN.
        Object.entries(headers).forEach(([key, value]) =>
          response.headers.set(key, value),
        );
      },
    },
  });

  // getClaims() verifies the JWT signature, so it is safe to base decisions on it.
  // (getSession() reads the cookie without verifying it: never use it for this.)
  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims);

  if (!signedIn && isProtected) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = "";
    loginUrl.searchParams.set("next", `${pathname}${search}`);

    const redirect = NextResponse.redirect(loginUrl);
    // Keep any cookie changes (for example cleared tokens) and the no-cache headers.
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    const cacheControl = response.headers.get("cache-control");
    if (cacheControl) redirect.headers.set("cache-control", cacheControl);
    return redirect;
  }

  return response;
}
