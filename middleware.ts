import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

// Only the account-related routes go through the middleware: the public pages
// ("/" and "/builder") stay fully static and are never touched.
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/account/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/check-email",
    "/auth/:path*",
  ],
};
