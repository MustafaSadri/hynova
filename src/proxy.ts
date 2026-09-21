import { NextRequest, NextResponse } from "next/server";

// Gates everything under /admin behind HTTP Basic Auth. Credentials come
// from env vars so they're never in source — set ADMIN_USERNAME and
// ADMIN_PASSWORD wherever this app is deployed (and in .env.local for
// local dev). Missing either one locks the whole section down rather than
// falling back to something guessable.
export function proxy(request: NextRequest) {
  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPass = process.env.ADMIN_PASSWORD;

  if (!expectedUser || !expectedPass) {
    return new NextResponse("Admin access is not configured.", { status: 503 });
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Basic ")) {
    const decoded = atob(authHeader.slice(6));
    const separatorIndex = decoded.indexOf(":");
    const user = decoded.slice(0, separatorIndex);
    const pass = decoded.slice(separatorIndex + 1);
    if (user === expectedUser && pass === expectedPass) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Cynapept Admin"' },
  });
}

export const config = {
  matcher: ["/admin/:path*"],
};
