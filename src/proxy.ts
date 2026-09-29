import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, isValidAdminSession } from "@/lib/admin-session";

// Gates everything under /admin (and its API routes) behind a login
// session. The login page itself and its two API routes are excluded here
// (rather than via the matcher) so they stay reachable without a session —
// otherwise nobody could ever log in.
const PUBLIC_PATHS = new Set(["/admin/login", "/api/admin/login", "/api/admin/logout"]);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPass = process.env.ADMIN_PASSWORD;
  if (!expectedUser || !expectedPass) {
    return new NextResponse("Admin access is not configured.", { status: 503 });
  }

  const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (isValidAdminSession(session)) {
    return NextResponse.next();
  }

  // API calls (from client components already on an admin page) get a
  // plain 401 to handle in-place; full page loads get redirected to a
  // real login page that can show a specific "wrong password" message —
  // something a browser's native Basic Auth prompt can never do.
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("redirect", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
