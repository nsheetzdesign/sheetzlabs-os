import type { Context } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";

/**
 * CSRF protection for OAuth flows (XC-2). The start route generates a random
 * nonce, stashes it in a short-lived HttpOnly cookie, and forwards it to Google
 * as the `state` param. The callback verifies the returned `state` against the
 * cookie before trusting the code, then clears the cookie.
 */

export function generateStateNonce(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function setStateCookie(c: Context, cookieName: string, nonce: string): void {
  setCookie(c, cookieName, nonce, {
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    path: "/",
    maxAge: 600, // 10 minutes
  });
}

/**
 * Returns true if the received state matches the cookie. Always clears the cookie.
 */
export function verifyAndClearState(
  c: Context,
  cookieName: string,
  received: string | undefined
): boolean {
  const expected = getCookie(c, cookieName);
  deleteCookie(c, cookieName, { path: "/" });
  return Boolean(expected) && Boolean(received) && expected === received;
}
