import { Hono } from "hono";
import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";
import { executeAgent } from "../lib/agent-engine";
import { createOAuthState, consumeOAuthState } from "../lib/oauth-state";
import {
  getValidAccessToken as getGoogleAccessToken,
  ReauthRequiredError,
} from "../lib/google-auth";

type Bindings = {
  ENVIRONMENT: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  ANTHROPIC_API_KEY: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  API_URL: string;
  APP_URL: string;
};

type HonoEnv = { Bindings: Bindings; Variables: { userId: string } };

const email = new Hono<HonoEnv>();

// ============================================
// ACCOUNT MANAGEMENT
// ============================================
email.get("/accounts", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data } = await supabase
    .from("email_accounts")
    .select("id, email, provider, sync_enabled, last_sync_at, needs_reauth, sync_error")
    .order("email");
  return c.json({ accounts: data ?? [] });
});

// Start Gmail OAuth flow — authenticated (behind the auth middleware). Binds a
// single-use `state` nonce to the founder's user id and returns the Google auth
// URL for the app to redirect to. Replaces the old public `<a href>` start route.
email.post("/auth/gmail/start", async (c) => {
  const scopes = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/gmail.modify",
    "https://www.googleapis.com/auth/userinfo.email",
  ].join(" ");

  const apiUrl = c.env.API_URL ?? "https://api.sheetzlabs.com";
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const state = await createOAuthState(supabase, c.get("userId"), "gmail");

  const authUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${c.env.GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(apiUrl + "/email/auth/gmail/callback")}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent(scopes)}` +
    `&access_type=offline` +
    `&prompt=consent` +
    `&state=${state}`;

  return c.json({ url: authUrl });
});

// OAuth callback (public — Google redirects here with no auth header). The state
// nonce binds this back to the user who started the flow.
email.get("/auth/gmail/callback", async (c) => {
  const code = c.req.query("code");
  if (!code) return c.json({ error: "No code provided" }, 400);

  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  // Validate + consume the single-use state row before trusting the code.
  const { valid } = await consumeOAuthState(supabase, c.req.query("state"), "gmail");
  if (!valid) {
    return c.json({ error: "Invalid OAuth state" }, 403);
  }

  const apiUrl = c.env.API_URL ?? "https://api.sheetzlabs.com";
  const appUrl = c.env.APP_URL ?? "https://app.sheetzlabs.com";

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: c.env.GOOGLE_CLIENT_ID,
      client_secret: c.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${apiUrl}/email/auth/gmail/callback`,
      grant_type: "authorization_code",
    }),
  });

  const tokens = (await tokenResponse.json()) as Record<string, unknown>;

  if (!tokens.access_token) {
    return c.json({ error: "Failed to get tokens", details: tokens }, 400);
  }

  const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  const user = (await userResponse.json()) as { email: string };

  const { data: newAccount, error: upsertError } = await supabase
    .from("email_accounts")
    .upsert(
      {
        email: user.email,
        provider: "gmail",
        access_token: tokens.access_token as string,
        refresh_token: tokens.refresh_token as string,
        token_expires_at: new Date(
          Date.now() + (tokens.expires_in as number) * 1000
        ).toISOString(),
        // A successful (re)link clears any prior reauth flag (ES-3 Part 1).
        needs_reauth: false,
        sync_error: null,
      },
      { onConflict: "email" }
    )
    .select("id")
    .single();

  if (upsertError || !newAccount?.id) {
    return c.redirect(
      `${appUrl}/dashboard/inbox?connected=false&error=${encodeURIComponent(
        upsertError?.message ?? "Failed to link account"
      )}`
    );
  }

  const accessToken = tokens.access_token as string;
  await syncLabelsForAccount(newAccount.id, accessToken, supabase);

  return c.redirect(`${appUrl}/dashboard/inbox?connected=true`);
});

// Disconnect account
email.delete("/accounts/:id", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  await supabase.from("emails").delete().eq("account_id", id);
  await supabase.from("email_drafts").delete().eq("account_id", id);
  await supabase.from("email_accounts").delete().eq("id", id);

  return c.json({ success: true });
});

// ============================================
// ALIAS MANAGEMENT
// ============================================

// Fetch sendAs aliases from Gmail and upsert
email.post("/accounts/:id/sync-aliases", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: account } = await supabase
    .from("email_accounts")
    .select("*")
    .eq("id", id)
    .single();

  if (!account) return c.json({ error: "Account not found" }, 404);

  const accessToken = await getValidAccessToken(account, c.env, supabase);

  const res = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/settings/sendAs",
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const data = (await res.json()) as { sendAs?: Array<{ sendAsEmail: string; displayName?: string; isPrimary?: boolean }> };

  const aliases = (data.sendAs ?? []).filter((a) => !a.isPrimary);

  for (const alias of aliases) {
    await supabase.from("email_aliases").upsert(
      { account_id: id, email: alias.sendAsEmail, name: alias.displayName ?? null, source: "gmail_sendas" },
      { onConflict: "account_id,email" }
    );
  }

  return c.json({ synced: aliases.length });
});

// Manually add an alias
email.post("/aliases", async (c) => {
  const body = await c.req.json<{ account_id: string; email: string; name?: string }>();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data, error } = await supabase
    .from("email_aliases")
    .insert({ account_id: body.account_id, email: body.email, name: body.name ?? null, source: "manual" })
    .select()
    .single();

  if (error) return c.json({ error: error.message }, 400);
  return c.json({ alias: data });
});

// Delete an alias
email.delete("/aliases/:id", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  await supabase.from("email_aliases").delete().eq("id", id);
  return c.json({ success: true });
});

// ============================================
// EMAIL SYNC
// ============================================
// Legacy `POST /accounts/:id/sync` (parseGmailMessage + inline per-message triage)
// removed in Prompt 52A (ES-7): it imported every message as INBOX and wrote wrong
// folder/trash/spam state. Use `POST /sync` (runEmailSync) instead.

// ============================================
// EMAIL OPERATIONS
// ============================================
email.get("/messages", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const category = c.req.query("category");
  const account_id = c.req.query("account_id");
  const unread_only = c.req.query("unread_only") === "true";

  // Default list excludes deleted/trashed/spam (ES-5).
  let query = baseEmailQuery(supabase, account_id, "*, email_accounts(email)")
    .eq("is_trashed", false)
    .eq("is_spam", false)
    .order("received_at", { ascending: false })
    .limit(50);

  if (category && category !== "all") query = query.eq("ai_category", category);
  if (unread_only) query = query.eq("is_read", false);

  const { data, error } = await query;
  if (error) return c.json({ error: error.message }, 500);
  return c.json({ emails: data ?? [] });
});

email.get("/messages/:id", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: emailData } = await baseEmailQuery(
    supabase,
    null,
    "*, email_accounts(*), relationships(id, name, company)"
  )
    .eq("id", id)
    .single();

  if (!emailData) return c.json({ error: "Email not found" }, 404);

  let thread: unknown[] = [];
  if (emailData.thread_id) {
    const { data } = await baseEmailQuery(supabase, null, "*")
      .eq("thread_id", emailData.thread_id)
      .order("received_at");
    thread = data ?? [];
  }

  // Opening an email marks it read — write back to Gmail too (ES-1).
  if (!emailData.is_read) {
    try {
      const token = await getValidAccessToken(emailData.email_accounts, c.env, supabase);
      await gmailModify(token, emailData.external_id, { removeLabelIds: ["UNREAD"] });
      await supabase.from("emails").update({ is_read: true }).eq("id", id);
    } catch (err) {
      if (err instanceof ReauthRequiredError) {
        console.warn(`[email] mark-read skipped, ${err.email} needs reauth`);
      } else {
        console.error(`[email] mark-read write-back failed for ${id}:`, err);
      }
    }
  }

  return c.json({ email: emailData, thread });
});

email.patch("/messages/:id/read", async (c) => {
  const { id } = c.req.param();
  const { is_read } = await c.req.json<{ is_read: boolean }>();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const em = await loadEmailWithAccount(supabase, id);
  if (!em) return c.json({ error: "Email not found" }, 404);

  // Gmail FIRST, then DB (ES-1). UNREAD is the inverse of is_read.
  try {
    const token = await getValidAccessToken(em.account, c.env, supabase);
    await gmailModify(token, em.external_id, is_read ? { removeLabelIds: ["UNREAD"] } : { addLabelIds: ["UNREAD"] });
  } catch (err) {
    if (err instanceof ReauthRequiredError) return c.json({ error: "Account needs reconnection", needs_reauth: true }, 409);
    return c.json({ error: err instanceof Error ? err.message : "Gmail write failed" }, 502);
  }

  const { error } = await supabase.from("emails").update({ is_read }).eq("id", id);
  if (error) return c.json({ error: error.message }, 500);
  return c.json({ success: true });
});

email.patch("/messages/:id/star", async (c) => {
  const { id } = c.req.param();
  const { is_starred } = await c.req.json<{ is_starred: boolean }>();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const em = await loadEmailWithAccount(supabase, id);
  if (!em) return c.json({ error: "Email not found" }, 404);

  try {
    const token = await getValidAccessToken(em.account, c.env, supabase);
    await gmailModify(token, em.external_id, is_starred ? { addLabelIds: ["STARRED"] } : { removeLabelIds: ["STARRED"] });
  } catch (err) {
    if (err instanceof ReauthRequiredError) return c.json({ error: "Account needs reconnection", needs_reauth: true }, 409);
    return c.json({ error: err instanceof Error ? err.message : "Gmail write failed" }, 502);
  }

  const { error } = await supabase.from("emails").update({ is_starred }).eq("id", id);
  if (error) return c.json({ error: error.message }, 500);
  return c.json({ success: true });
});

// ============================================
// DRAFTS & SENDING
// ============================================
email.get("/drafts", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data } = await supabase
    .from("email_drafts")
    .select("*, email_accounts(email)")
    .eq("status", "draft")
    .order("created_at", { ascending: false });
  return c.json({ drafts: data ?? [] });
});

email.post("/drafts", async (c) => {
  const body = await c.req.json();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data } = await supabase.from("email_drafts").insert(body).select().single();
  return c.json({ draft: data });
});

email.patch("/drafts/:id", async (c) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data } = await supabase
    .from("email_drafts")
    .update(body)
    .eq("id", id)
    .select()
    .single();
  return c.json({ draft: data });
});

email.delete("/drafts/:id", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  await supabase.from("email_drafts").delete().eq("id", id);
  return c.json({ success: true });
});

// ── MIME / threading helpers (EC-1, EC-8) ────────────────────────────────────

/** RFC 2047 "B" encode a header value only if it contains non-ASCII bytes. */
function encodeHeaderWord(value: string): string {
  // eslint-disable-next-line no-control-regex
  if (/^[\x00-\x7F]*$/.test(value)) return value;
  return `=?UTF-8?B?${btoa(unescape(encodeURIComponent(value)))}?=`;
}

/** Encode an address list, RFC 2047-encoding non-ASCII display names only. */
function encodeAddressList(value: string): string {
  return value
    .split(",")
    .map((raw) => raw.trim())
    .filter(Boolean)
    .map((part) => {
      const m = part.match(/^(.*)<([^>]+)>$/);
      if (m && m[1].trim()) return `${encodeHeaderWord(m[1].trim())} <${m[2].trim()}>`;
      return part;
    })
    .join(", ");
}

function base64UrlEncode(str: string): string {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Live-fetch the RFC Message-ID/References headers for a synced message that was
 * imported before rfc_message_id existed (Part 2 — no backfill migration).
 */
async function fetchRfcHeaders(
  externalId: string,
  accessToken: string
): Promise<{ messageId: string; references: string } | null> {
  const res = await fetch(
    `${GMAIL_API}/messages/${externalId}?format=metadata&metadataHeaders=Message-ID&metadataHeaders=References`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok) return null;
  const data = (await res.json()) as {
    payload?: { headers?: Array<{ name: string; value: string }> };
  };
  const headers = data.payload?.headers ?? [];
  const get = (n: string) =>
    headers.find((h) => h.name.toLowerCase() === n.toLowerCase())?.value ?? "";
  return { messageId: get("Message-ID"), references: get("References") };
}

email.post("/drafts/:id/send", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: draft } = await supabase
    .from("email_drafts")
    .select("*, email_accounts(*)")
    .eq("id", id)
    .single();

  if (!draft) return c.json({ error: "Draft not found" }, 404);

  if (!(draft.to_emails ?? []).length) {
    return c.json({ error: "At least one recipient is required" }, 400);
  }

  await supabase.from("email_drafts").update({ status: "sending" }).eq("id", id);

  const draftWithAccount = draft as typeof draft & { email_accounts: Record<string, unknown> };
  const account = draftWithAccount.email_accounts;

  let accessToken: string;
  try {
    accessToken = await getValidAccessToken(account, c.env, supabase);
  } catch (err) {
    // Leave the draft recoverable rather than stuck "sending" (EC-7).
    await supabase.from("email_drafts").update({ status: "draft" }).eq("id", id);
    if (err instanceof ReauthRequiredError)
      return c.json({ error: "Account needs reconnection", needs_reauth: true }, 409);
    return c.json({ error: err instanceof Error ? err.message : "Authentication failed" }, 502);
  }

  // ── Reply threading (EC-1) ──────────────────────────────────────────────
  let inReplyTo = "";
  let references = "";
  let threadId: string | undefined;
  let subject = draft.subject ?? "";

  if (draft.reply_to_email_id) {
    const { data: original } = await supabase
      .from("emails")
      .select("id, external_id, thread_id, rfc_message_id, rfc_references")
      .eq("id", draft.reply_to_email_id)
      .single();
    if (original) {
      threadId = (original.thread_id as string) ?? undefined;
      let messageId = original.rfc_message_id as string | null;
      let origRefs = original.rfc_references as string | null;
      // On-demand capture for messages synced before rfc_message_id existed.
      if (!messageId && original.external_id) {
        const fetched = await fetchRfcHeaders(original.external_id as string, accessToken);
        if (fetched?.messageId) {
          messageId = fetched.messageId;
          origRefs = fetched.references || origRefs;
          await supabase
            .from("emails")
            .update({ rfc_message_id: messageId, rfc_references: origRefs })
            .eq("id", original.id);
        }
      }
      if (messageId) {
        inReplyTo = messageId;
        references = [origRefs, messageId].filter(Boolean).join(" ");
      }
      // Idempotent Re: prefix.
      if (subject && !/^re:\s/i.test(subject.trim())) subject = `Re: ${subject}`;
    }
  }

  // ── Build MIME message ──────────────────────────────────────────────────
  const to = (draft.to_emails ?? []).join(", ");
  const cc = (draft.cc_emails ?? []).join(", ");
  const bodyText = (draft.body_text as string) ?? "";
  const bodyHtml = draft.body_html as string | null;

  const headerLines = [
    `From: ${account.email as string}`,
    `To: ${encodeAddressList(to)}`,
    cc ? `Cc: ${encodeAddressList(cc)}` : "",
    `Subject: ${encodeHeaderWord(subject)}`,
    "MIME-Version: 1.0",
    inReplyTo ? `In-Reply-To: ${inReplyTo}` : "",
    references ? `References: ${references}` : "",
  ].filter(Boolean);

  let rawMessage: string;
  if (bodyHtml && bodyHtml.trim()) {
    // HTML multipart/alternative (EC-6). Body parts carry raw UTF-8; the whole
    // message is base64url-encoded for transport, so no inner CTE is needed.
    const boundary = `sl_boundary_${id.replace(/[^a-z0-9]/gi, "")}`;
    rawMessage = [
      ...headerLines,
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      "",
      `--${boundary}`,
      "Content-Type: text/plain; charset=utf-8",
      "",
      bodyText,
      `--${boundary}`,
      "Content-Type: text/html; charset=utf-8",
      "",
      bodyHtml,
      `--${boundary}--`,
      "",
    ].join("\r\n");
  } else {
    rawMessage = [
      ...headerLines,
      "Content-Type: text/plain; charset=utf-8",
      "",
      bodyText,
    ].join("\r\n");
  }

  const encoded = base64UrlEncode(rawMessage);

  const response = await fetch(`${GMAIL_API}/messages/send`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(threadId ? { raw: encoded, threadId } : { raw: encoded }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    await supabase.from("email_drafts").update({ status: "failed" }).eq("id", id);
    return c.json({ error: `Failed to send (${response.status})`, detail }, 502);
  }

  const sent = (await response.json()) as { id?: string; threadId?: string };

  await supabase
    .from("email_drafts")
    .update({ status: "sent", sent_at: new Date().toISOString() })
    .eq("id", id);

  // Insert the sent message immediately so Sent updates without waiting for sync (EC-9).
  if (sent.id) {
    await supabase.from("emails").upsert(
      {
        account_id: account.id as string,
        external_id: sent.id,
        thread_id: sent.threadId ?? threadId ?? null,
        subject,
        from_email: account.email as string,
        from_name: "",
        to_emails: draft.to_emails ?? [],
        cc_emails: draft.cc_emails ?? [],
        body_text: bodyText,
        body_html: bodyHtml ?? null,
        snippet: bodyText.slice(0, 200),
        folder: "SENT",
        is_read: true,
        is_deleted: false,
        received_at: new Date().toISOString(),
      },
      { onConflict: "account_id,external_id" }
    );
  }

  if (draft.to_emails?.[0]) {
    const relationshipId = await findRelationship(draft.to_emails[0], supabase);
    if (relationshipId) {
      await supabase.from("interactions").insert({
        relationship_id: relationshipId,
        type: "email",
        direction: "outgoing",
        summary: `Sent: ${draft.subject}`,
      });
      await supabase
        .from("relationships")
        .update({ last_contact: new Date().toISOString() })
        .eq("id", relationshipId);
    }
  }

  return c.json({ success: true, id: sent.id, threadId: sent.threadId });
});

// ============================================
// AI FEATURES
// ============================================
email.post("/draft-with-ai", async (c) => {
  const body = await c.req.json<Record<string, unknown>>();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: agent } = await supabase
    .from("agents")
    .select("*")
    .eq("slug", "email-drafter")
    .single();

  if (!agent) return c.json({ error: "Email drafter agent not found" }, 404);

  const { data: run } = await supabase
    .from("agent_runs")
    .insert({
      agent_id: agent.id,
      status: "running",
      trigger_type: "manual",
    })
    .select()
    .single();

  if (!run) return c.json({ error: "Failed to create agent run" }, 500);

  c.executionCtx.waitUntil(executeAgent(agent, run, body, c.env, supabase));

  return c.json({ message: "Drafting email", run_id: run.id });
});

// ============================================
// RESYNC BODIES (for emails synced before body extraction was fixed)
// ============================================
email.post("/resync-bodies", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  // Fetch up to 100 (non-deleted) emails with missing body (ES-5)
  const { data: missing } = await supabase
    .from("emails")
    .select("id, external_id, account_id")
    .eq("is_deleted", false)
    .is("body_text", null)
    .is("body_html", null)
    .limit(100);

  if (!missing?.length) return c.json({ resynced: 0 });

  let resynced = 0;
  for (const row of missing) {
    const { data: account } = await supabase
      .from("email_accounts")
      .select("*")
      .eq("id", row.account_id)
      .single();
    if (!account) continue;

    try {
      const accessToken = await getValidAccessToken(account, c.env, supabase);
      const res = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${row.external_id}?format=full`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const fullMsg = await res.json() as Record<string, unknown>;
      const bodyText = extractBody(fullMsg.payload as Record<string, unknown>, "text/plain");
      const bodyHtml = extractBody(fullMsg.payload as Record<string, unknown>, "text/html");
      if (bodyText || bodyHtml) {
        await supabase.from("emails").update({ body_text: bodyText || null, body_html: bodyHtml || null }).eq("id", row.id);
        resynced++;
      }
    } catch (err) {
      console.error(`[resync-bodies] row ${row.id} failed:`, err);
    }
  }

  return c.json({ resynced, total_missing: missing.length });
});

// ============================================
// LABEL SYNC (from Gmail)
// ============================================
email.get("/accounts/:id/sync-labels", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: account } = await supabase
    .from("email_accounts")
    .select("*")
    .eq("id", id)
    .single();

  if (!account) return c.json({ error: "Account not found" }, 404);

  const accessToken = await getValidAccessToken(account, c.env, supabase);
  const result = await syncLabelsForAccount(id, accessToken, supabase);

  return c.json({ labels: result.labels });
});

// ============================================
// LABELS CRUD
// ============================================
email.get("/labels", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const account_id = c.req.query("account_id");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = supabase.from("email_labels").select("*").order("sort_order");
  if (account_id) query = query.eq("account_id", account_id);

  const { data } = await query;
  return c.json({ labels: data ?? [] });
});

email.post("/labels", async (c) => {
  const body = await c.req.json<{ account_id: string; name: string; color?: string; sort_order?: number }>();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  if (!body.account_id || !body.name) return c.json({ error: "account_id and name required" }, 400);

  // Create in Gmail FIRST so the label is real and applyable Gmail-side (ES-8).
  const { data: account } = await supabase.from("email_accounts").select("*").eq("id", body.account_id).single();
  if (!account) return c.json({ error: "Account not found" }, 404);

  let externalId: string;
  try {
    const token = await getValidAccessToken(account, c.env, supabase);
    const res = await fetch(`${GMAIL_API}/labels`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        name: body.name,
        labelListVisibility: "labelShow",
        messageListVisibility: "show",
      }),
    });
    if (res.status === 409) return c.json({ error: `A label named "${body.name}" already exists` }, 409);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return c.json({ error: `Gmail label create failed (${res.status}): ${text}` }, 502);
    }
    const created = (await res.json()) as { id: string };
    externalId = created.id;
  } catch (err) {
    if (err instanceof ReauthRequiredError) return c.json({ error: "Account needs reconnection", needs_reauth: true }, 409);
    return c.json({ error: err instanceof Error ? err.message : "Gmail label create failed" }, 502);
  }

  const { data, error } = await supabase
    .from("email_labels")
    .insert({
      account_id: body.account_id,
      name: body.name,
      color: body.color ?? "#2FE8B6",
      type: "user",
      sort_order: body.sort_order ?? 100,
      external_id: externalId,
    })
    .select()
    .single();

  if (error) return c.json({ error: error.message }, 500);
  return c.json({ label: data });
});

email.patch("/labels/:id", async (c) => {
  const { id } = c.req.param();
  const body = await c.req.json<Record<string, unknown>>();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: existing } = await supabase.from("email_labels").select("type").eq("id", id).single();
  if (existing?.type === "system" && body.name) {
    return c.json({ error: "Cannot rename system labels" }, 400);
  }

  const { data } = await supabase.from("email_labels").update(body).eq("id", id).select().single();
  return c.json({ label: data });
});

email.delete("/labels/:id", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: existing } = await supabase.from("email_labels").select("type").eq("id", id).single();
  if (existing?.type === "system") {
    return c.json({ error: "Cannot delete system labels" }, 400);
  }

  await supabase.from("email_labels").delete().eq("id", id);
  return c.json({ success: true });
});

// ============================================
// LABEL ASSIGNMENTS
// ============================================
email.post("/:id/labels/:labelId", async (c) => {
  const { id, labelId } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const reauth = await writeBackLabel(supabase, c.env, id, labelId, true);
  if (reauth) return c.json(reauth.body, reauth.status);

  const { data, error } = await supabase
    .from("email_label_assignments")
    .upsert({ email_id: id, label_id: labelId })
    .select()
    .single();

  if (error) return c.json({ error: error.message }, 500);
  return c.json({ assignment: data });
});

email.delete("/:id/labels/:labelId", async (c) => {
  const { id, labelId } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const reauth = await writeBackLabel(supabase, c.env, id, labelId, false);
  if (reauth) return c.json(reauth.body, reauth.status);

  const { error } = await supabase
    .from("email_label_assignments")
    .delete()
    .eq("email_id", id)
    .eq("label_id", labelId);

  if (error) return c.json({ error: error.message }, 500);
  return c.json({ success: true });
});

// ============================================
// BULK ACTIONS
// ============================================
// Map each flag/folder bulk action to the Gmail label delta + local DB patch.
// `delete` is intentionally folded into `trash` (ES-4): no hard delete remains.
const BULK_LABEL_OPS: Record<
  string,
  { add?: string[]; remove?: string[]; patch: Record<string, unknown> } | "trash" | "untrash"
> = {
  archive:   { remove: ["INBOX"], patch: { is_archived: true, folder: "INBOX" } },
  unarchive: { add: ["INBOX"], patch: { is_archived: false, folder: "INBOX" } },
  spam:      { add: ["SPAM"], remove: ["INBOX"], patch: { is_spam: true, folder: "SPAM" } },
  not_spam:  { remove: ["SPAM"], add: ["INBOX"], patch: { is_spam: false, folder: "INBOX" } },
  read:      { remove: ["UNREAD"], patch: { is_read: true } },
  unread:    { add: ["UNREAD"], patch: { is_read: false } },
  star:      { add: ["STARRED"], patch: { is_starred: true } },
  unstar:    { remove: ["STARRED"], patch: { is_starred: false } },
  trash:     "trash",
  delete:    "trash",
  untrash:   "untrash",
};

email.post("/bulk", async (c) => {
  const { action, email_ids, label_id } = await c.req.json<{ action: string; email_ids: string[]; label_id?: string }>();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  if (!email_ids?.length) return c.json({ error: "No emails specified" }, 400);

  // Resolve every target's Gmail id + owning account.
  const { data: targets, error: loadErr } = await supabase
    .from("emails")
    .select("id, external_id, account_id, folder")
    .in("id", email_ids);
  if (loadErr) return c.json({ error: loadErr.message }, 500);
  if (!targets?.length) return c.json({ success: true, succeeded: 0, failed: [] });

  type Target = { id: string; external_id: string; account_id: string; folder: string | null };
  const byAccount = new Map<string, Target[]>();
  for (const t of targets as Target[]) {
    if (!byAccount.has(t.account_id)) byAccount.set(t.account_id, []);
    byAccount.get(t.account_id)!.push(t);
  }

  const failed: Array<{ id: string; error: string }> = [];

  // --- Label actions (single account-scoped label across the selection) -----
  if (action === "add_label" || action === "remove_label") {
    if (!label_id) return c.json({ error: "label_id required" }, 400);
    const add = action === "add_label";
    const { data: label } = await supabase
      .from("email_labels")
      .select("external_id, account_id")
      .eq("id", label_id)
      .single();
    if (!label) return c.json({ error: "Label not found" }, 404);

    if (label.external_id) {
      const sameAcct = (targets as Target[]).filter((t) => t.account_id === label.account_id);
      if (sameAcct.length) {
        try {
          const { data: acct } = await supabase.from("email_accounts").select("*").eq("id", label.account_id).single();
          const token = await getValidAccessToken(acct, c.env, supabase);
          await gmailBatchModify(token, sameAcct.map((t) => t.external_id), add ? { addLabelIds: [label.external_id] } : { removeLabelIds: [label.external_id] });
        } catch (err) {
          const msg = err instanceof ReauthRequiredError ? "Account needs reconnection" : err instanceof Error ? err.message : "Gmail label write failed";
          return c.json({ success: false, succeeded: 0, failed: sameAcct.map((t) => ({ id: t.id, error: msg })) }, err instanceof ReauthRequiredError ? 409 : 502);
        }
      }
    }

    if (add) {
      const { error } = await supabase.from("email_label_assignments").upsert(email_ids.map((eid) => ({ email_id: eid, label_id })));
      if (error) return c.json({ error: error.message }, 500);
    } else {
      const { error } = await supabase.from("email_label_assignments").delete().in("email_id", email_ids).eq("label_id", label_id);
      if (error) return c.json({ error: error.message }, 500);
    }
    return c.json({ success: true, succeeded: email_ids.length, failed: [] });
  }

  const op = BULK_LABEL_OPS[action];
  if (!op) return c.json({ error: "Unknown action" }, 400);

  // --- Flag/folder actions: Gmail FIRST (per account), then DB for survivors --
  const okIds: string[] = [];
  for (const [accountId, items] of byAccount) {
    let token: string;
    try {
      const { data: acct } = await supabase.from("email_accounts").select("*").eq("id", accountId).single();
      token = await getValidAccessToken(acct, c.env, supabase);
    } catch (err) {
      const msg = err instanceof ReauthRequiredError ? "Account needs reconnection" : err instanceof Error ? err.message : "Token error";
      for (const it of items) failed.push({ id: it.id, error: msg });
      continue;
    }

    if (op === "trash" || op === "untrash") {
      // No batch endpoint for trash — loop with per-item error collection (ES-1).
      for (const it of items) {
        try {
          await gmailTrash(token, it.external_id, op === "untrash");
          okIds.push(it.id);
        } catch (err) {
          failed.push({ id: it.id, error: err instanceof Error ? err.message : "Gmail trash failed" });
        }
      }
    } else {
      try {
        await gmailBatchModify(token, items.map((i) => i.external_id), { addLabelIds: op.add, removeLabelIds: op.remove });
        for (const it of items) okIds.push(it.id);
      } catch (err) {
        for (const it of items) failed.push({ id: it.id, error: err instanceof Error ? err.message : "Gmail batch failed" });
      }
    }
  }

  if (okIds.length) {
    const patch = op === "trash" ? { is_trashed: true, folder: "TRASH" }
      : op === "untrash" ? { is_trashed: false, is_archived: false, folder: "INBOX" }
      : op.patch;
    const { error } = await supabase.from("emails").update(patch).in("id", okIds);
    if (error) return c.json({ error: error.message }, 500);
  }

  return c.json({ success: failed.length === 0, succeeded: okIds.length, failed });
});

// ============================================
// SNOOZE
// ============================================
email.post("/:id/snooze", async (c) => {
  const { id } = c.req.param();
  const { until } = await c.req.json<{ until: string }>();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  // Validate `until`: must be a parseable, future timestamp (ES-9).
  const ts = until ? new Date(until).getTime() : NaN;
  if (!Number.isFinite(ts) || ts <= Date.now()) {
    return c.json({ error: "`until` must be a valid future timestamp" }, 422);
  }

  const em = await loadEmailWithAccount(supabase, id);
  if (!em) return c.json({ error: "Email not found" }, 404);

  // Remove from Gmail inbox so it's hidden on other devices too (ES-1/ES-9).
  try {
    const token = await getValidAccessToken(em.account, c.env, supabase);
    await gmailModify(token, em.external_id, { removeLabelIds: ["INBOX"] });
  } catch (err) {
    if (err instanceof ReauthRequiredError) return c.json({ error: "Account needs reconnection", needs_reauth: true }, 409);
    return c.json({ error: err instanceof Error ? err.message : "Gmail write failed" }, 502);
  }

  const { data, error } = await supabase
    .from("emails")
    .update({ snoozed_until: until, folder: "SNOOZED", snooze_return_folder: em.folder ?? "INBOX" })
    .eq("id", id)
    .select()
    .single();
  if (error) return c.json({ error: error.message }, 500);

  return c.json({ email: data });
});

email.delete("/:id/snooze", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: row } = await supabase
    .from("emails")
    .select("external_id, snooze_return_folder, email_accounts(*)")
    .eq("id", id)
    .single();
  if (!row) return c.json({ error: "Email not found" }, 404);

  const returnFolder = (row.snooze_return_folder as string) || "INBOX";

  // Re-add to Gmail inbox only if the message originated there (ES-9).
  if (returnFolder === "INBOX") {
    try {
      const token = await getValidAccessToken(
        row.email_accounts as unknown as Record<string, unknown>,
        c.env,
        supabase
      );
      await gmailModify(token, row.external_id, { addLabelIds: ["INBOX"] });
    } catch (err) {
      if (err instanceof ReauthRequiredError) return c.json({ error: "Account needs reconnection", needs_reauth: true }, 409);
      return c.json({ error: err instanceof Error ? err.message : "Gmail write failed" }, 502);
    }
  }

  const { data, error } = await supabase
    .from("emails")
    .update({ snoozed_until: null, folder: returnFolder, snooze_return_folder: null })
    .eq("id", id)
    .select()
    .single();
  if (error) return c.json({ error: error.message }, 500);

  return c.json({ email: data });
});

// ============================================
// THREAD VIEW
// ============================================
email.get("/thread/:threadId", async (c) => {
  const { threadId } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data } = await baseEmailQuery(
    supabase,
    null,
    "*, email_label_assignments(label_id, email_labels(*))"
  )
    .eq("thread_id", threadId)
    .order("received_at", { ascending: true });

  return c.json({ thread: data ?? [] });
});

// ============================================
// SEARCH
// ============================================
email.get("/search", async (c) => {
  const q = c.req.query("q") ?? "";
  const account_id = c.req.query("account_id");
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const filters: Record<string, string> = {};
  let textQuery = q;

  const operators = ["from:", "to:", "subject:", "has:", "is:", "in:", "label:", "after:", "before:"];
  for (const op of operators) {
    const regex = new RegExp(`${op}(\\S+)`, "gi");
    let match;
    while ((match = regex.exec(q)) !== null) {
      filters[op.replace(":", "")] = match[1];
      textQuery = textQuery.replace(match[0], "").trim();
    }
  }

  // Escape LIKE wildcards so `%`/`_` in user input are literal (ported from the
  // now-deleted duplicate handler — XC-6 / Part 3).
  const esc = (s: string) => s.replace(/[%_\\]/g, "\\$&");

  // Exclude deleted (ES-5); trash/spam shown only when explicitly requested.
  let query = baseEmailQuery(supabase, account_id, "*, email_label_assignments(label_id, email_labels(*))")
    .order("received_at", { ascending: false })
    .limit(50);
  if (filters.in !== "trash") query = query.eq("is_trashed", false);
  if (filters.in !== "spam") query = query.eq("is_spam", false);

  if (filters.from) query = query.ilike("from_email", `%${esc(filters.from)}%`);
  // to_emails is TEXT[] — use array containment, not ilike (EU-6).
  if (filters.to) query = query.contains("to_emails", [filters.to]);
  if (filters.subject) query = query.ilike("subject", `%${esc(filters.subject)}%`);
  if (filters.has === "attachment") query = query.eq("has_attachments", true);
  if (filters.is === "unread") query = query.eq("is_read", false);
  if (filters.is === "read") query = query.eq("is_read", true);
  if (filters.is === "starred") query = query.eq("is_starred", true);
  if (filters.in === "inbox") query = query.eq("folder", "INBOX").eq("is_archived", false);
  if (filters.in === "sent") query = query.eq("folder", "SENT");
  if (filters.in === "trash") query = query.eq("is_trashed", true);
  if (filters.in === "spam") query = query.eq("is_spam", true);
  if (filters.after) query = query.gte("received_at", filters.after);
  if (filters.before) query = query.lte("received_at", filters.before);
  if (textQuery) {
    const t = esc(textQuery);
    query = query.or(`subject.ilike.%${t}%,body_text.ilike.%${t}%,from_name.ilike.%${t}%`);
  }

  const { data, error } = await query;
  if (error) return c.json({ error: error.message }, 500);
  return c.json({ emails: data ?? [], query: q, filters });
});

// ============================================
// SYNC (Background + Manual)
// ============================================
/**
 * Core email-sync orchestration. Exported so both the `/sync` route handler and
 * the scheduled (cron) worker can call it directly — the cron no longer makes an
 * HTTP request to its own public endpoint (which is now authenticated anyway).
 *
 * Lives here rather than in a separate `lib/email-sync.ts` because it depends on
 * a cluster of module-private helpers (getValidAccessToken, syncLabelsForAccount,
 * fullSync, syncViaHistory); moving those out would be a large refactor beyond the
 * scope of this security pass.
 */
export interface AccountSyncResult {
  account_id: string;
  email: string;
  new_messages?: number;
  labelSync?: LabelSyncResult;
  needs_reauth?: boolean;
  skipped?: string;
  error?: string;
}

/**
 * Sync exactly one account: flip status → syncing, refresh labels, run the
 * history-delta or full-sync path, then status → idle. Returns a structured
 * result (never throws) so callers can aggregate. Shared by `runEmailSync`
 * (the loop) and the per-account `POST /accounts/:id/sync` route — the latter
 * needs `labelSync` for the inbox debug panel, which is why this returns the
 * label counts rather than discarding them (Prompt 55: the route the web has
 * always called was dropped in the 52A `runEmailSync` refactor, leaving every
 * manual "Sync All Inboxes" to 404 → "completed with errors").
 */
export async function syncOneAccount(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  account: any,
  env: Bindings,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any
): Promise<AccountSyncResult> {
  // Skip accounts already flagged for reconnection — don't burn a refresh attempt.
  if (account.needs_reauth) {
    return { account_id: account.id, email: account.email, skipped: "needs_reauth", needs_reauth: true };
  }
  try {
    await supabase
      .from("email_accounts")
      .update({ sync_status: "syncing", sync_error: null })
      .eq("id", account.id);

    const accessToken = await getValidAccessToken(account, env, supabase);

    // Sync labels first so email-label assignments can be created.
    const labelSync = await syncLabelsForAccount(account.id, accessToken, supabase);

    // fullSync now manages full_sync_completed (it may span multiple cron runs
    // via sync_page_token), so we no longer force it true here (ES-7).
    let newMessages = 0;
    if (account.last_history_id && account.full_sync_completed) {
      newMessages = await syncViaHistory(account, accessToken, supabase);
    } else {
      newMessages = await fullSync(account, accessToken, supabase);
    }

    await supabase
      .from("email_accounts")
      .update({ sync_status: "idle", last_sync_at: new Date().toISOString() })
      .eq("id", account.id);

    return { account_id: account.id, email: account.email, new_messages: newMessages, labelSync };
  } catch (error: unknown) {
    // ReauthRequiredError already flagged the account row (needs_reauth + sync_error).
    if (error instanceof ReauthRequiredError) {
      await supabase.from("email_accounts").update({ sync_status: "error" }).eq("id", account.id);
      return { account_id: account.id, email: account.email, needs_reauth: true };
    }
    const msg = error instanceof Error ? error.message : "Unknown error";
    await supabase
      .from("email_accounts")
      .update({ sync_status: "error", sync_error: msg })
      .eq("id", account.id);
    return { account_id: account.id, email: account.email, error: msg };
  }
}

export async function runEmailSync(
  env: Bindings,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  accountId?: string
): Promise<AccountSyncResult[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = supabase.from("email_accounts").select("*").eq("sync_enabled", true);
  if (accountId) query = query.eq("id", accountId);

  const { data: accounts } = await query;
  const results: AccountSyncResult[] = [];

  // Sequential — never abort the loop on a single account's failure.
  for (const account of accounts ?? []) {
    results.push(await syncOneAccount(account, env, supabase));
  }

  return results;
}

email.post("/sync", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const account_id = c.req.query("account_id") || undefined;
  const results = await runEmailSync(c.env, supabase, account_id);
  return c.json({ synced: results });
});

/**
 * Per-account sync (the inbox sidebar's "Sync All Inboxes" calls this once per
 * account). Restored in Prompt 55 — the 52A refactor deleted it in favour of the
 * bulk `/sync` but the web action was never repointed, so it had been 404-ing.
 * Returns the rich `{ labelSync, emailSync }` shape the debug panel renders.
 */
email.post("/accounts/:id/sync", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: account } = await supabase
    .from("email_accounts")
    .select("*")
    .eq("id", id)
    .single();

  if (!account) return c.json({ error: "Account not found" }, 404);

  const result = await syncOneAccount(account, c.env, supabase);

  if (result.needs_reauth) {
    return c.json({ error: "Account needs reconnection", needs_reauth: true }, 409);
  }
  if (result.error) {
    return c.json({ error: result.error }, 500);
  }

  return c.json({
    success: true,
    labelSync: result.labelSync
      ? {
          total: result.labelSync.total,
          system: result.labelSync.system,
          user: result.labelSync.user,
          userLabelNames: result.labelSync.userLabelNames,
        }
      : { total: 0, system: 0, user: 0, userLabelNames: [] },
    emailSync: { synced: result.new_messages ?? 0 },
  });
});

// ============================================
// FULL INBOX DOWNLOAD (paginate all messages)
// ============================================
email.post("/accounts/:id/full-sync", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: account } = await supabase
    .from("email_accounts")
    .select("*")
    .eq("id", id)
    .single();

  if (!account) return c.json({ error: "Account not found" }, 404);

  const accessToken = await getValidAccessToken(account, c.env, supabase);

  // Sync labels first so assignments resolve.
  await syncLabelsForAccount(id, accessToken, supabase);

  let pageToken: string | undefined = account.sync_page_token || undefined;

  // Capture the history anchor BEFORE listing — only when starting fresh (no
  // continuation token) so a resumed run doesn't advance past unprocessed mail (ES-7).
  const anchorHistoryId = pageToken ? null : await fetchProfileHistoryId(accessToken);
  let totalSynced = 0;
  let pageCount = 0;
  // One manual "kickstart" pass imports up to ~1,000 messages to stay within the
  // Workers subrequest budget; the 5-minute cron `fullSync` continues the long
  // tail via sync_page_token.
  const maxPages = 10;

  try {
    do {
      const listUrl = new URL(`${GMAIL_API}/messages`);
      listUrl.searchParams.set("maxResults", "100");
      if (pageToken) listUrl.searchParams.set("pageToken", pageToken);

      const listResponse = await fetch(listUrl.toString(), {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!listResponse.ok) {
        throw new Error(`Gmail API error: ${listResponse.status}`);
      }

      const listData = (await listResponse.json()) as { messages?: Array<{ id: string }>; nextPageToken?: string };
      const ids = (listData.messages ?? []).map((m) => m.id);
      pageToken = listData.nextPageToken;

      // Batched upsert (onConflict account_id,external_id) — new + existing rows
      // alike get correct folder/flag/label state via applyLabelStateToEmail.
      totalSynced += await importMessages(ids, id, accessToken, supabase);

      pageCount++;
    } while (pageToken && pageCount < maxPages);

    const complete = !pageToken;
    await supabase
      .from("email_accounts")
      .update({
        last_sync_at: new Date().toISOString(),
        full_sync_completed: complete,
        sync_page_token: complete ? null : pageToken,
        ...(anchorHistoryId ? { last_history_id: anchorHistoryId } : {}),
      })
      .eq("id", id);

    return c.json({ success: true, totalSynced, pages: pageCount, complete });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      totalSynced,
    }, 500);
  }
});

// ============================================
// UNREAD COUNTS (for sidebar badges)
// ============================================
email.get("/counts", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const account_id = c.req.query("account_id");

  // Single round-trip via get_email_counts() (ES-10/ES-11). Excludes deleted rows
  // everywhere and excludes trashed/deleted/expired from the snoozed count (ES-9).
  const { data, error } = await supabase
    .rpc("get_email_counts", { p_account_id: account_id ?? null })
    .single();

  if (error) return c.json({ error: error.message }, 500);

  const row = (data ?? {}) as Record<string, number>;
  return c.json({
    counts: {
      inbox: Number(row.inbox ?? 0),
      starred: Number(row.starred ?? 0),
      snoozed: Number(row.snoozed ?? 0),
      drafts: Number(row.drafts ?? 0),
      spam: Number(row.spam ?? 0),
      trash: Number(row.trash ?? 0),
    },
  });
});

// ============================================
// CHECK FOR UPDATES (lightweight client polling)
// ============================================
email.get("/check-updates", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const since = c.req.query("since"); // ISO timestamp from client

  if (!since) {
    return c.json({ hasUpdates: false });
  }

  // Check if any inbox email arrived after the client's last known timestamp
  const { count } = await supabase
    .from("emails")
    .select("id", { count: "exact", head: true })
    .gt("received_at", since)
    .eq("folder", "INBOX")
    .eq("is_archived", false)
    .eq("is_trashed", false)
    .eq("is_deleted", false);

  const hasUpdates = (count ?? 0) > 0;

  // Return the newest INBOX received_at so the cursor can't skip past unseen mail
  // because of a newer SENT/SPAM row (ES-11).
  let newestAt = since;
  if (hasUpdates) {
    const { data: newest } = await supabase
      .from("emails")
      .select("received_at")
      .eq("folder", "INBOX")
      .eq("is_archived", false)
      .eq("is_trashed", false)
      .eq("is_deleted", false)
      .order("received_at", { ascending: false })
      .limit(1)
      .single();
    if (newest?.received_at) newestAt = newest.received_at;
  }

  return c.json({ hasUpdates, newestAt });
});

// NOTE: a second `GET /search` used to live here — unreachable, since Hono's first
// registration (above) wins. Removed in Prompt 52A (XC-6); its `%`/`_` wildcard
// escaping was ported into the live handler.

// ============================================
// SNIPPETS
// ============================================
email.get("/snippets", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  // Use a system user id fallback — snippets are per-install for now
  const { data: snippets, error } = await supabase
    .from("email_snippets")
    .select("*")
    .order("trigger");

  if (error) return c.json({ error: error.message }, 500);
  return c.json({ snippets: snippets ?? [] });
});

email.post("/snippets", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const body = await c.req.json() as { trigger?: string; title?: string; content?: string };
  const { trigger, title, content } = body;

  if (!trigger || !content) {
    return c.json({ error: "trigger and content required" }, 400);
  }

  const cleanTrigger = trigger.toLowerCase().replace(/[^a-z0-9]/g, "");

  const { data, error } = await supabase
    .from("email_snippets")
    .upsert(
      {
        trigger: cleanTrigger,
        title: title || cleanTrigger,
        content,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,trigger" }
    )
    .select()
    .single();

  if (error) return c.json({ error: error.message }, 500);
  return c.json({ snippet: data });
});

email.delete("/snippets/:trigger", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const trigger = c.req.param("trigger");

  const { error } = await supabase
    .from("email_snippets")
    .delete()
    .eq("trigger", trigger);

  if (error) return c.json({ error: error.message }, 500);
  return c.json({ success: true });
});

email.post("/snippets/seed-defaults", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: defaults } = await supabase
    .from("email_snippet_defaults")
    .select("trigger, title, content");

  if (!defaults) return c.json({ seeded: 0 });

  let seeded = 0;
  for (const snippet of defaults) {
    const { error } = await supabase
      .from("email_snippets")
      .insert({ trigger: snippet.trigger, title: snippet.title, content: snippet.content });
    if (!error) seeded++;
  }

  return c.json({ seeded });
});

// ============================================
// EMAIL TEMPLATES
// ============================================
email.get("/templates", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data: templates, error } = await supabase
    .from("email_templates")
    .select("*")
    .order("name");

  if (error) return c.json({ error: error.message }, 500);
  return c.json({ templates: templates ?? [] });
});

email.post("/templates", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const body = await c.req.json() as { name?: string; subject?: string; body?: string };
  const { name, subject, body: templateBody } = body;

  if (!name || !templateBody) {
    return c.json({ error: "name and body required" }, 400);
  }

  const { data, error } = await supabase
    .from("email_templates")
    .insert({ name, subject: subject || null, body: templateBody })
    .select()
    .single();

  if (error) return c.json({ error: error.message }, 500);
  return c.json({ template: data });
});

email.put("/templates/:id", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const id = c.req.param("id");
  const body = await c.req.json() as { name?: string; subject?: string; body?: string };

  const { data, error } = await supabase
    .from("email_templates")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) return c.json({ error: error.message }, 500);
  return c.json({ template: data });
});

email.delete("/templates/:id", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const id = c.req.param("id");

  const { error } = await supabase.from("email_templates").delete().eq("id", id);
  if (error) return c.json({ error: error.message }, 500);
  return c.json({ success: true });
});

// ============================================
// AI DRAFT REPLY
// ============================================
email.post("/ai-draft-reply", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const body = await c.req.json() as { emailId?: string; style?: string };
  const { emailId, style = "professional" } = body;

  if (!emailId) return c.json({ error: "emailId required" }, 400);

  const { data: emailData } = await supabase
    .from("emails")
    .select("subject, from_name, from_email, body_text, snippet, received_at")
    .eq("id", emailId)
    .single();

  if (!emailData) return c.json({ error: "Email not found" }, 404);

  const threadContext = [
    `From: ${emailData.from_name || emailData.from_email} <${emailData.from_email}>`,
    `Subject: ${emailData.subject}`,
    `Date: ${new Date(emailData.received_at).toLocaleDateString()}`,
    "",
    emailData.body_text || emailData.snippet || "",
  ].join("\n").trim();

  const styleMap: Record<string, string> = {
    professional: "Write a professional, concise reply.",
    friendly: "Write a warm, friendly reply.",
    brief: "Write a very brief, to-the-point reply (2-3 sentences max).",
    detailed: "Write a thorough, detailed reply addressing all points.",
  };

  const anthropic = new Anthropic({ apiKey: c.env.ANTHROPIC_API_KEY });

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 500,
    messages: [
      {
        role: "user",
        content: `Draft a reply to this email. ${styleMap[style] ?? styleMap.professional}

Do not include subject line or email headers. Start directly with the greeting. Keep it natural and human-sounding. Sign off with just "Best," and no name (the user will add their signature).

EMAIL TO REPLY TO:
${threadContext}

DRAFT REPLY:`,
      },
    ],
  });

  const draft =
    response.content[0].type === "text" ? response.content[0].text.trim() : "";

  return c.json({ draft, style, emailId });
});

export default email;

// ============================================
// HELPER FUNCTIONS
// ============================================

// Thin wrapper over the shared Google token helper (Prompt 52A Part 1) so the
// many in-file call sites keep their 3-arg shape. The shared helper detects
// invalid_grant, flags needs_reauth, and serializes concurrent refreshes.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getValidAccessToken(account: Record<string, unknown>, env: Bindings, supabase: any): Promise<string> {
  return getGoogleAccessToken(account, env, supabase, "email_accounts");
}

const GMAIL_API = "https://gmail.googleapis.com/gmail/v1/users/me";

/**
 * Centralized read query for the `emails` table (Prompt 52A Part 5 — ES-5).
 * ALWAYS excludes soft-deleted rows (deleted in Gmail) so they can't resurface in
 * any list/detail/thread/search/count. Callers add folder-specific filters on top.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function baseEmailQuery(supabase: any, accountId?: string | null, select = "*") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let q: any = supabase.from("emails").select(select).eq("is_deleted", false);
  if (accountId) q = q.eq("account_id", accountId);
  return q;
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

/**
 * Single source of truth for deriving local folder/flag state from a Gmail
 * message's full labelId set (Prompt 52A Part 2 — ES-7). Used by the full-sync
 * parser, the full-sync update path, history-delta application, and write-back
 * confirmation. Kills the triplicated folder-derivation logic.
 */
function applyLabelStateToEmail(labels: string[]): {
  folder: string;
  is_read: boolean;
  is_starred: boolean;
  is_archived: boolean;
  is_trashed: boolean;
  is_spam: boolean;
} {
  let folder = "INBOX";
  if (labels.includes("SENT")) folder = "SENT";
  if (labels.includes("TRASH")) folder = "TRASH";
  if (labels.includes("SPAM")) folder = "SPAM";
  if (labels.includes("DRAFT")) folder = "DRAFTS";
  return {
    folder,
    is_read: !labels.includes("UNREAD"),
    is_starred: labels.includes("STARRED"),
    is_archived: !labels.includes("INBOX") && folder === "INBOX",
    is_trashed: labels.includes("TRASH"),
    is_spam: labels.includes("SPAM"),
  };
}

/** Look up an email + its owning account row (with tokens) by local id. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function loadEmailWithAccount(supabase: any, id: string): Promise<{
  external_id: string;
  account_id: string;
  folder: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  account: any;
} | null> {
  const { data } = await supabase
    .from("emails")
    .select("external_id, account_id, folder, email_accounts(*)")
    .eq("id", id)
    .single();
  if (!data) return null;
  return {
    external_id: data.external_id,
    account_id: data.account_id,
    folder: data.folder,
    account: data.email_accounts,
  };
}

/** Gmail users.messages.modify for a single message. Throws on non-OK. */
async function gmailModify(
  accessToken: string,
  externalId: string,
  body: { addLabelIds?: string[]; removeLabelIds?: string[] }
): Promise<void> {
  const res = await fetch(`${GMAIL_API}/messages/${externalId}/modify`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Gmail modify failed (${res.status}): ${text}`);
  }
}

/** Gmail users.messages.trash / untrash for a single message. Throws on non-OK. */
async function gmailTrash(accessToken: string, externalId: string, untrash = false): Promise<void> {
  const res = await fetch(`${GMAIL_API}/messages/${externalId}/${untrash ? "untrash" : "trash"}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Gmail ${untrash ? "untrash" : "trash"} failed (${res.status}): ${text}`);
  }
}

/** Gmail users.messages.batchModify over up to 1000 ids/chunk. Throws on non-OK. */
async function gmailBatchModify(
  accessToken: string,
  externalIds: string[],
  body: { addLabelIds?: string[]; removeLabelIds?: string[] }
): Promise<void> {
  for (const ids of chunk(externalIds, 1000)) {
    const res = await fetch(`${GMAIL_API}/messages/batchModify`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ ids, ...body }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Gmail batchModify failed (${res.status}): ${text}`);
    }
  }
}

/**
 * Write a single label add/remove back to Gmail (Prompt 52A Part 4). Local-only
 * labels (no `external_id`) are DB-only and skipped. Returns an error envelope to
 * surface (409 reauth / 502 Gmail) or null on success/skip.
 */
async function writeBackLabel(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  env: Bindings,
  emailId: string,
  labelId: string,
  add: boolean
): Promise<{ status: 409 | 502 | 404; body: Record<string, unknown> } | null> {
  const { data: label } = await supabase
    .from("email_labels")
    .select("external_id, account_id")
    .eq("id", labelId)
    .single();
  if (!label) return { status: 404, body: { error: "Label not found" } };

  // Local-only label → DB-only, no Gmail call.
  if (!label.external_id) return null;

  const em = await loadEmailWithAccount(supabase, emailId);
  if (!em) return { status: 404, body: { error: "Email not found" } };

  try {
    const token = await getValidAccessToken(em.account, env, supabase);
    await gmailModify(token, em.external_id, add ? { addLabelIds: [label.external_id] } : { removeLabelIds: [label.external_id] });
    return null;
  } catch (err) {
    if (err instanceof ReauthRequiredError) return { status: 409, body: { error: "Account needs reconnection", needs_reauth: true } };
    return { status: 502, body: { error: err instanceof Error ? err.message : "Gmail label write failed" } };
  }
}

/**
 * Fetch full message bodies for a batch of Gmail ids and upsert them (Prompt 52A
 * Part 3 — ES-10). Replaces per-message SELECT-then-INSERT with batched
 * upsert(onConflict account_id,external_id) and batched label assignment. Returns
 * the number of rows written.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function importMessages(messageIds: string[], accountId: string, accessToken: string, supabase: any): Promise<number> {
  if (!messageIds.length) return 0;

  const rows: Record<string, unknown>[] = [];
  const labelsByExternalId = new Map<string, string[]>();

  for (const msgId of messageIds) {
    const res = await fetch(`${GMAIL_API}/messages/${msgId}?format=full`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) {
      console.error(`[sync] message ${msgId} fetch failed: ${res.status}`);
      continue;
    }
    const fullMsg = (await res.json()) as { id: string; labelIds?: string[]; [k: string]: unknown };
    rows.push(parseGmailMessageFull(fullMsg, accountId));
    labelsByExternalId.set(fullMsg.id, fullMsg.labelIds ?? []);
  }

  let written = 0;
  for (const batch of chunk(rows, 100)) {
    const { data, error } = await supabase
      .from("emails")
      .upsert(batch, { onConflict: "account_id,external_id" })
      .select("id, external_id");
    if (error) {
      console.error(`[sync] upsert batch failed: ${error.message}`);
      continue;
    }
    written += data?.length ?? 0;
    await assignLabelsBatched(
      (data ?? []) as Array<{ id: string; external_id: string }>,
      labelsByExternalId,
      accountId,
      supabase
    );
  }
  return written;
}

/** Replace label assignments for a batch of emails in bulk (Prompt 52A Part 3). */
async function assignLabelsBatched(
  emails: Array<{ id: string; external_id: string }>,
  labelsByExternalId: Map<string, string[]>,
  accountId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any
): Promise<void> {
  if (!emails.length) return;

  const { data: localLabels } = await supabase
    .from("email_labels")
    .select("id, external_id")
    .eq("account_id", accountId);
  const byExternal = new Map<string, string>(
    (localLabels ?? []).map((l: { id: string; external_id: string }) => [l.external_id, l.id])
  );

  const emailIds = emails.map((e) => e.id);
  await supabase.from("email_label_assignments").delete().in("email_id", emailIds);

  const assignments: Array<{ email_id: string; label_id: string }> = [];
  for (const e of emails) {
    for (const ext of labelsByExternalId.get(e.external_id) ?? []) {
      const labelId = byExternal.get(ext);
      if (labelId) assignments.push({ email_id: e.id, label_id: labelId });
    }
  }
  for (const batch of chunk(assignments, 200)) {
    if (!batch.length) continue;
    const { error } = await supabase.from("email_label_assignments").insert(batch);
    if (error) console.error(`[sync] label-assignment insert failed: ${error.message}`);
  }
}

function decodeBase64(data: string): string {
  // URL-safe base64 → standard base64 → binary → UTF-8
  const standard = data.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(standard);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  try {
    return new TextDecoder("utf-8").decode(bytes);
  } catch {
    return new TextDecoder("latin1").decode(bytes);
  }
}

function extractBody(payload: Record<string, unknown> | undefined, mimeType: string): string {
  if (!payload) return "";

  const body = payload.body as { data?: string; size?: number } | undefined;
  if (payload.mimeType === mimeType && body?.data) {
    try { return decodeBase64(body.data); } catch { return ""; }
  }

  if (payload.parts) {
    for (const part of payload.parts as Array<Record<string, unknown>>) {
      const result = extractBody(part, mimeType);
      if (result) return result;
    }
  }

  return "";
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function findRelationship(emailAddr: string, supabase: any): Promise<string | null> {
  if (!emailAddr) return null;
  const { data } = await supabase
    .from("relationships")
    .select("id")
    .eq("email", emailAddr.toLowerCase())
    .single();
  return (data as { id: string } | null)?.id ?? null;
}

// ============================================
// HELPER: Sync Gmail Labels
// ============================================
interface LabelSyncResult {
  labels: unknown[];
  total: number;
  system: number;
  user: number;
  userLabelNames: string[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function syncLabelsForAccount(accountId: string, accessToken: string, supabase: any): Promise<LabelSyncResult> {
  const response = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/labels",
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[Labels] Gmail API error for account ${accountId}: ${response.status} ${errorText}`);
    throw new Error(`Gmail labels API returned ${response.status}: ${errorText}`);
  }

  const body = (await response.json()) as { labels?: Array<{
    id: string; name: string; type?: string;
    labelListVisibility?: string;
    messageListVisibility?: string;
    color?: { backgroundColor?: string };
  }> };

  const { labels } = body;
  console.log(`[Labels] Gmail returned ${labels?.length ?? 0} labels for account ${accountId}`);
  const userLabels = labels?.filter(l => l.type === "user") ?? [];
  const systemLabels = labels?.filter(l => l.type === "system") ?? [];
  console.log(`[Labels] User labels: ${userLabels.length}, names: ${userLabels.map(l => l.name).join(", ")}`);

  const systemLabelIds = ["INBOX", "SENT", "DRAFT", "TRASH", "SPAM", "STARRED", "UNREAD", "IMPORTANT"];

  // Track the external_ids we keep this run so we can reconcile deletions (ES-8).
  const keptExternalIds = new Set<string>(["SNOOZED", "ALL_MAIL"]);

  for (const label of labels ?? []) {
    // Skip category tabs (Promotions, Social, etc.) — not useful as labels
    if (label.id.startsWith("CATEGORY_")) continue;
    if (label.id === "IMPORTANT" || label.id === "UNREAD") continue;
    // For system labels: skip hidden ones. For user labels: always sync regardless of visibility.
    if (label.type !== "user" && label.labelListVisibility === "labelHide") continue;

    keptExternalIds.add(label.id);
    const isSystem = systemLabelIds.includes(label.id) || label.type === "system";

    let name = label.name;
    let icon = "Tag";
    let sortOrder = 100;

    if (label.id === "INBOX")        { name = "Inbox";   icon = "Inbox";         sortOrder = 1; }
    else if (label.id === "STARRED") { name = "Starred"; icon = "Star";          sortOrder = 2; }
    else if (label.id === "SENT")    { name = "Sent";    icon = "Send";          sortOrder = 4; }
    else if (label.id === "DRAFT")   { name = "Drafts";  icon = "File";          sortOrder = 5; }
    else if (label.id === "SPAM")    { name = "Spam";    icon = "AlertTriangle"; sortOrder = 90; }
    else if (label.id === "TRASH")   { name = "Trash";   icon = "Trash2";        sortOrder = 91; }

    await supabase.from("email_labels").upsert(
      {
        account_id: accountId,
        name,
        type: isSystem ? "system" : "user",
        icon,
        sort_order: sortOrder,
        color: label.color?.backgroundColor ?? (isSystem ? "#71717a" : "#2FE8B6"),
        external_id: label.id,
        label_list_visibility: label.labelListVisibility ?? "labelShow",
        message_list_visibility: label.messageListVisibility ?? "show",
      },
      { onConflict: "account_id,external_id" }
    );
  }

  // Ensure Snoozed and All Mail exist (no Gmail equivalent, use synthetic IDs)
  await supabase.from("email_labels").upsert(
    [
      { account_id: accountId, name: "Snoozed",  external_id: "SNOOZED",  type: "system", icon: "Clock", sort_order: 3,  color: "#71717a" },
      { account_id: accountId, name: "All Mail", external_id: "ALL_MAIL", type: "system", icon: "Mail",  sort_order: 92, color: "#71717a" },
    ],
    { onConflict: "account_id,external_id" }
  );

  // Reconcile deletions (ES-8): drop local labels whose Gmail external_id no longer
  // exists in the label list. User-created local-only labels (external_id IS NULL)
  // are exempt. Assignments cascade via the FK (migration 020).
  const { data: localSynced } = await supabase
    .from("email_labels")
    .select("id, external_id")
    .eq("account_id", accountId)
    .not("external_id", "is", null);
  const stale = (localSynced ?? [])
    .filter((l: { external_id: string }) => !keptExternalIds.has(l.external_id))
    .map((l: { id: string }) => l.id);
  if (stale.length) {
    const { error: delErr } = await supabase.from("email_labels").delete().in("id", stale);
    if (delErr) console.error(`[Labels] stale-label cleanup failed for ${accountId}: ${delErr.message}`);
  }

  const { data: savedLabels } = await supabase
    .from("email_labels")
    .select("*")
    .eq("account_id", accountId)
    .order("sort_order");

  return {
    labels: savedLabels ?? [],
    total: labels?.length ?? 0,
    system: systemLabels.length,
    user: userLabels.length,
    userLabelNames: userLabels.map(l => l.name),
  };
}

/** users.getProfile historyId — the safe incremental anchor (ES-7). */
async function fetchProfileHistoryId(accessToken: string): Promise<string | null> {
  const res = await fetch(`${GMAIL_API}/profile`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    console.error(`[sync] getProfile failed: ${res.status}`);
    return null;
  }
  const data = (await res.json()) as { historyId?: string };
  return data.historyId ?? null;
}

// ============================================
// HELPER: Full Sync (first-time or reset; continues across cron runs)
// ============================================
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fullSync(account: any, accessToken: string, supabase: any): Promise<number> {
  // Per-run cap keeps total Gmail subrequests well under the Workers 1,000 limit;
  // the long tail of a large mailbox continues on the next 5-minute cron run via
  // the persisted `sync_page_token` (ES-7).
  const MAX_MESSAGES_PER_RUN = 400;
  let pageToken: string | undefined = account.sync_page_token || undefined;

  // On the first run of a fresh full sync, anchor last_history_id from getProfile
  // BEFORE listing so the eventual switch to incremental misses no window.
  if (!pageToken) {
    const anchor = await fetchProfileHistoryId(accessToken);
    if (anchor) {
      await supabase.from("email_accounts").update({ last_history_id: anchor }).eq("id", account.id);
    }
  }

  let imported = 0;
  let processed = 0;
  do {
    const listUrl = new URL(`${GMAIL_API}/messages`);
    listUrl.searchParams.set("maxResults", "100");
    if (pageToken) listUrl.searchParams.set("pageToken", pageToken);

    const res = await fetch(listUrl.toString(), { headers: { Authorization: `Bearer ${accessToken}` } });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Gmail messages.list failed (${res.status}): ${text}`);
    }
    const data = (await res.json()) as { messages?: Array<{ id: string }>; nextPageToken?: string };
    const ids = (data.messages ?? []).map((m) => m.id);

    imported += await importMessages(ids, account.id, accessToken, supabase);
    processed += ids.length;
    pageToken = data.nextPageToken;
  } while (pageToken && processed < MAX_MESSAGES_PER_RUN);

  const complete = !pageToken;
  await supabase
    .from("email_accounts")
    .update({ full_sync_completed: complete, sync_page_token: complete ? null : pageToken })
    .eq("id", account.id);

  return imported;
}

// ============================================
// HELPER: Incremental Sync via History API
// ============================================
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function syncViaHistory(account: any, accessToken: string, supabase: any): Promise<number> {
  const added = new Set<string>();
  const deleted = new Set<string>();
  const changed = new Set<string>();
  let pageToken: string | undefined;
  let latestHistoryId: string | undefined;

  // Paginate ALL history pages before advancing the cursor (ES-6).
  do {
    const url = new URL(`${GMAIL_API}/history`);
    url.searchParams.set("startHistoryId", String(account.last_history_id));
    for (const t of ["messageAdded", "messageDeleted", "labelAdded", "labelRemoved"]) {
      url.searchParams.append("historyTypes", t);
    }
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${accessToken}` } });

    // Expired historyId (too old, ~1 week) → clear + full resync + re-anchor (ES-2).
    if (res.status === 404) {
      console.warn(`[sync] historyId expired for ${account.email}; running full resync`);
      await supabase
        .from("email_accounts")
        .update({ last_history_id: null, full_sync_completed: false, sync_page_token: null })
        .eq("id", account.id);
      const n = await fullSync({ ...account, sync_page_token: null }, accessToken, supabase);
      const reanchor = await fetchProfileHistoryId(accessToken);
      if (reanchor) {
        await supabase.from("email_accounts").update({ last_history_id: reanchor }).eq("id", account.id);
      }
      return n;
    }
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Gmail history failed (${res.status}): ${text}`);
    }

    const data = (await res.json()) as {
      history?: Array<{
        messagesAdded?: Array<{ message: { id: string } }>;
        messagesDeleted?: Array<{ message: { id: string } }>;
        labelsAdded?: Array<{ message: { id: string }; labelIds: string[] }>;
        labelsRemoved?: Array<{ message: { id: string }; labelIds: string[] }>;
      }>;
      historyId?: string;
      nextPageToken?: string;
    };
    if (data.historyId) latestHistoryId = data.historyId;
    for (const h of data.history ?? []) {
      for (const a of h.messagesAdded ?? []) added.add(a.message.id);
      for (const d of h.messagesDeleted ?? []) deleted.add(d.message.id);
      for (const l of h.labelsAdded ?? []) changed.add(l.message.id);
      for (const l of h.labelsRemoved ?? []) changed.add(l.message.id);
    }
    pageToken = data.nextPageToken;
  } while (pageToken);

  // Permanently deleted → soft delete locally.
  if (deleted.size) {
    await supabase
      .from("emails")
      .update({ is_trashed: true, is_deleted: true, deleted_at: new Date().toISOString() })
      .eq("account_id", account.id)
      .in("external_id", [...deleted]);
  }

  // New messages → full import.
  const toImport = [...added].filter((id) => !deleted.has(id));
  const imported = await importMessages(toImport, account.id, accessToken, supabase);

  // Label deltas on existing messages → refresh full state via the shared helper.
  const toRefresh = [...changed].filter((id) => !added.has(id) && !deleted.has(id));
  await refreshLabelState(toRefresh, account.id, accessToken, supabase);

  // Advance the cursor only after every page processed successfully.
  if (latestHistoryId) {
    await supabase.from("email_accounts").update({ last_history_id: latestHistoryId }).eq("id", account.id);
  }
  return imported;
}

/**
 * Re-derive local folder/flag/label state for messages whose labels changed on
 * another device (Prompt 52A Part 2 — ES-6). Fetches each message's current full
 * label set (minimal) and applies applyLabelStateToEmail — the same single helper
 * used by the parser and write-back, so UNREAD/STARRED/INBOX/TRASH/SPAM all stay
 * in sync.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function refreshLabelState(externalIds: string[], accountId: string, accessToken: string, supabase: any): Promise<void> {
  if (!externalIds.length) return;

  const { data: existing } = await supabase
    .from("emails")
    .select("id, external_id")
    .eq("account_id", accountId)
    .in("external_id", externalIds);
  if (!existing?.length) return;

  const idByExternal = new Map<string, string>(
    (existing as Array<{ id: string; external_id: string }>).map((e) => [e.external_id, e.id])
  );
  const labelsByExternalId = new Map<string, string[]>();

  for (const ext of idByExternal.keys()) {
    const res = await fetch(`${GMAIL_API}/messages/${ext}?format=minimal`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) continue;
    const data = (await res.json()) as { labelIds?: string[] };
    const labels = data.labelIds ?? [];
    labelsByExternalId.set(ext, labels);
    const { error } = await supabase.from("emails").update(applyLabelStateToEmail(labels)).eq("id", idByExternal.get(ext));
    if (error) console.error(`[sync] label-state update failed for ${ext}: ${error.message}`);
  }

  const refreshed = (existing as Array<{ id: string; external_id: string }>).filter((e) =>
    labelsByExternalId.has(e.external_id)
  );
  await assignLabelsBatched(refreshed, labelsByExternalId, accountId, supabase);
}

// ============================================
// HELPER: Parse Gmail Message (for new sync)
// ============================================
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseGmailMessageFull(msg: any, accountId: string): Record<string, unknown> {
  const headers: Array<{ name: string; value: string }> = msg.payload?.headers ?? [];
  const getHeader = (name: string) =>
    headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value ?? "";

  const bodyText = extractBody(msg.payload, "text/plain");
  const bodyHtml = extractBody(msg.payload, "text/html");

  const attachmentParts = (msg.payload?.parts ?? []).filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (p: any) => p.filename && p.filename.length > 0
  );

  const labels: string[] = msg.labelIds ?? [];
  const fromHeader = getHeader("from");
  const fromMatch = fromHeader.match(/^(?:"?([^"]*)"?\s*)?<?([^>]+)>?$/);

  return {
    account_id: accountId,
    external_id: msg.id,
    thread_id: msg.threadId,
    subject: getHeader("subject"),
    from_email: fromMatch?.[2] ?? fromHeader,
    from_name: fromMatch?.[1]?.replace(/"/g, "").trim() ?? "",
    to_emails: getHeader("to").split(",").map((e: string) => e.trim().replace(/.*<|>/g, "")).filter(Boolean),
    cc_emails: getHeader("cc").split(",").map((e: string) => e.trim().replace(/.*<|>/g, "")).filter(Boolean),
    body_text: bodyText,
    body_html: bodyHtml,
    snippet: msg.snippet ?? "",
    rfc_message_id: getHeader("message-id") || null,
    rfc_references: getHeader("references") || null,
    received_at: new Date(parseInt(msg.internalDate)).toISOString(),
    ...applyLabelStateToEmail(labels),
    has_attachments: attachmentParts.length > 0,
    attachment_count: attachmentParts.length,
  };
}
