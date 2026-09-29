import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_SESSION_COOKIE = "cynapept_admin_session";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

// Stateless session token: an HMAC of the username, keyed by the admin
// password. Only someone who knows ADMIN_PASSWORD (i.e. the login route,
// after checking credentials) can produce it, and any request holding it
// can be verified by recomputing the same HMAC — no session store needed.
export function computeAdminSessionToken(username: string, password: string): string {
  return createHmac("sha256", password).update(username).digest("hex");
}

export function isValidAdminSession(cookieValue: string | undefined): boolean {
  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPass = process.env.ADMIN_PASSWORD;
  if (!expectedUser || !expectedPass || !cookieValue) return false;

  const expected = computeAdminSessionToken(expectedUser, expectedPass);
  const expectedBuf = Buffer.from(expected, "hex");
  const actualBuf = Buffer.from(cookieValue, "hex");
  if (expectedBuf.length !== actualBuf.length) return false;
  return timingSafeEqual(expectedBuf, actualBuf);
}
