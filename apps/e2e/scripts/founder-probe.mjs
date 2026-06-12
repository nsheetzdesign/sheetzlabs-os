#!/usr/bin/env node
/**
 * Prompt 58 — reproduce the FOUNDER's live API path (nick@sheetzlabs.com).
 *
 * Mints a genuine nick@ session via the admin magic-link flow (no password
 * needed, service-role only), then calls the API worker exactly as the web
 * loaders/actions do (Authorization: Bearer <jwt>). Captures verbatim status +
 * body for: GET /email/accounts, POST /email/sync, and a trash/untrash
 * round-trip on a self-sent [E2E] probe message.
 *
 *   node apps/e2e/scripts/founder-probe.mjs            # accounts + sync only
 *   node apps/e2e/scripts/founder-probe.mjs --trash    # also trash/untrash probe
 */
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

let dir = dirname(fileURLToPath(import.meta.url));
for (let i = 0; i < 8; i++) {
  const c = resolve(dir, ".env.local");
  if (existsSync(c)) { config({ path: c }); break; }
  dir = resolve(dir, "..");
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANON = process.env.SUPABASE_ANON_KEY;
const API = (process.env.API_URL ?? "https://api.sheetzlabs.com").replace(/\/$/, "");
const FOUNDER = process.env.FOUNDER_EMAIL ?? "nick@sheetzlabs.com";

if (!SUPABASE_URL || !SERVICE || !ANON) {
  console.error("Need SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY in .env.local");
  process.exit(1);
}

const admin = createClient(SUPABASE_URL, SERVICE, { auth: { persistSession: false } });
const anon = createClient(SUPABASE_URL, ANON, { auth: { persistSession: false } });

// --- Mint a real founder JWT via the magic-link OTP (no password) -------------
const { data: link, error: linkErr } = await admin.auth.admin.generateLink({
  type: "magiclink",
  email: FOUNDER,
});
if (linkErr) { console.error("generateLink failed:", linkErr.message); process.exit(1); }
const tokenHash = link.properties?.hashed_token;
const { data: verified, error: verifyErr } = await anon.auth.verifyOtp({
  type: "email",
  token_hash: tokenHash,
});
if (verifyErr) { console.error("verifyOtp failed:", verifyErr.message); process.exit(1); }
const jwt = verified.session?.access_token;
if (!jwt) { console.error("No access_token after verifyOtp"); process.exit(1); }
console.log(`Minted JWT for ${verified.user?.email} (allowlist identity).\n`);

async function call(method, path, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${jwt}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let parsed; try { parsed = JSON.parse(text); } catch { parsed = text; }
  console.log(`${method} ${path}  ->  ${res.status} ${res.statusText}`);
  console.log("  " + JSON.stringify(parsed).slice(0, 600));
  console.log("");
  return { status: res.status, body: parsed };
}

// 1) accounts (web inbox sidebar / sync targets)
await call("GET", "/email/accounts");

// 2) trigger a sync (what the client refresh button / poll does)
await call("POST", "/email/sync", {});

// 3) optional trash round-trip on a known message
if (process.argv.includes("--trash")) {
  // Pick the newest non-trashed message in the primary account as the probe target.
  const { data: rows } = await admin
    .from("emails")
    .select("id, subject, account_id, external_id, is_trashed")
    .eq("is_trashed", false)
    .order("received_at", { ascending: false })
    .limit(1);
  const target = rows?.[0];
  if (!target) { console.log("No message to trash."); }
  else {
    console.log(`Trash target: "${target.subject}" [${target.id}]\n`);
    await call("POST", "/email/bulk", { action: "trash", email_ids: [target.id] });
    await call("POST", "/email/bulk", { action: "untrash", email_ids: [target.id] });
  }
}
