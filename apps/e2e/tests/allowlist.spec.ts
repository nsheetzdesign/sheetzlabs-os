/**
 * Part 0 (Prompt 54A): single-tenant allowlist.
 *
 * A valid Supabase JWT is not sufficient — the user's email must be on
 * ALLOWED_USER_EMAILS or the API rejects the request with 403. We prove this by
 * minting a real, fully-valid session for a throwaway non-allowlisted user via the
 * service-role admin API, then calling the API exactly as the web app does.
 *
 * The allowlisted founder reaching the API is already exercised by every other
 * spec; here we add the negative case plus one positive sanity assertion.
 */
import { test, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import { admin } from "../lib/supabase";
import { api } from "../lib/api";
import { ENV } from "../lib/env";

const INTRUDER_EMAIL = "e2e-not-allowed@example.com";
const INTRUDER_PASSWORD = "Not-Allowed-12345!";

// This suite manages its own (intruder) session, never the shared founder one.
test.use({ storageState: { cookies: [], origins: [] } });

async function deleteIntruderIfExists() {
  const { data } = await admin().auth.admin.listUsers();
  const existing = data?.users.find((u) => u.email === INTRUDER_EMAIL);
  if (existing) await admin().auth.admin.deleteUser(existing.id);
}

test.describe("single-tenant allowlist (54A Part 0)", () => {
  let intruderId: string;

  test.beforeAll(async () => {
    await deleteIntruderIfExists();
    const { data, error } = await admin().auth.admin.createUser({
      email: INTRUDER_EMAIL,
      password: INTRUDER_PASSWORD,
      email_confirm: true,
    });
    if (error || !data.user) {
      throw new Error(`createUser failed: ${error?.message ?? "no user"}`);
    }
    intruderId = data.user.id;
  });

  test.afterAll(async () => {
    if (intruderId) await admin().auth.admin.deleteUser(intruderId);
  });

  test("non-allowlisted user with a valid JWT gets 403 from the API", async () => {
    const anon = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data, error } = await anon.auth.signInWithPassword({
      email: INTRUDER_EMAIL,
      password: INTRUDER_PASSWORD,
    });
    expect(error, "intruder should be able to sign in (valid account)").toBeNull();
    const jwt = data.session!.access_token;

    const res = await fetch(`${ENV.API_URL}/email/accounts`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    expect(res.status).toBe(403);
  });

  test("allowlisted founder is NOT blocked by the gate", async () => {
    const res = await api("/email/accounts");
    expect(res.status).not.toBe(403);
    expect(res.status).not.toBe(401);
  });
});
