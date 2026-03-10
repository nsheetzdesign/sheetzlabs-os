import { Hono } from "hono";
import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";
import { executeAgent } from "../lib/agent-engine";

type Bindings = {
  ENVIRONMENT: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  ANTHROPIC_API_KEY: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  API_URL: string;
};

type HonoEnv = { Bindings: Bindings };

const email = new Hono<HonoEnv>();

// ============================================
// ACCOUNT MANAGEMENT
// ============================================
email.get("/accounts", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data } = await supabase
    .from("email_accounts")
    .select("id, email, provider, sync_enabled, last_sync_at")
    .order("email");
  return c.json({ accounts: data ?? [] });
});

// Start Gmail OAuth flow
email.get("/auth/gmail", async (c) => {
  const scopes = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/gmail.modify",
    "https://www.googleapis.com/auth/userinfo.email",
  ].join(" ");

  const apiUrl = c.env.API_URL ?? "https://api.sheetzlabs.com";
  const authUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${c.env.GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(apiUrl + "/email/auth/gmail/callback")}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent(scopes)}` +
    `&access_type=offline` +
    `&prompt=consent`;

  return c.redirect(authUrl);
});

// OAuth callback
email.get("/auth/gmail/callback", async (c) => {
  const code = c.req.query("code");
  if (!code) return c.json({ error: "No code provided" }, 400);

  const apiUrl = c.env.API_URL ?? "https://api.sheetzlabs.com";

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

  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data: newAccount } = await supabase
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
      },
      { onConflict: "email" }
    )
    .select("id")
    .single();

  if (newAccount?.id) {
    const accessToken = tokens.access_token as string;
    await syncLabelsForAccount(newAccount.id, accessToken, supabase);
  }

  return c.redirect("https://sheetzlabs.com/dashboard/inbox?connected=true");
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
email.post("/accounts/:id/sync", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: account } = await supabase
    .from("email_accounts")
    .select("*")
    .eq("id", id)
    .single();

  if (!account) return c.json({ error: "Account not found" }, 404);

  const accessToken = await getValidAccessToken(account, c.env, supabase);

  // Sync labels first
  const labelSync = await syncLabelsForAccount(id, accessToken, supabase);

  const messagesResponse = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=50",
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const { messages } = (await messagesResponse.json()) as { messages?: Array<{ id: string }> };

  let syncedCount = 0;

  for (const msg of messages ?? []) {
    const { data: existing } = await supabase
      .from("emails")
      .select("id")
      .eq("account_id", id)
      .eq("external_id", msg.id)
      .single();

    if (existing) continue;

    const fullMsgRes = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const msgData = (await fullMsgRes.json()) as Record<string, unknown>;

    const parsed = parseGmailMessage(msgData);
    const triage = await triageEmail(parsed, c.env);
    const relationshipId = await findRelationship(parsed.from_email, supabase);

    await supabase.from("emails").insert({
      account_id: id,
      external_id: msg.id,
      thread_id: msgData.threadId,
      ...parsed,
      ...triage,
      relationship_id: relationshipId,
    });

    if (relationshipId) {
      await supabase.from("interactions").insert({
        relationship_id: relationshipId,
        type: "email",
        direction: "incoming",
        summary: `Received: ${parsed.subject}`,
      });
      await supabase
        .from("relationships")
        .update({ last_contact: new Date().toISOString() })
        .eq("id", relationshipId);
    }

    syncedCount++;
  }

  await supabase
    .from("email_accounts")
    .update({ last_sync_at: new Date().toISOString() })
    .eq("id", id);

  return c.json({
    success: true,
    labelSync: {
      total: labelSync.total,
      system: labelSync.system,
      user: labelSync.user,
      userLabelNames: labelSync.userLabelNames,
    },
    emailSync: { synced: syncedCount },
  });
});

// ============================================
// EMAIL OPERATIONS
// ============================================
email.get("/messages", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const category = c.req.query("category");
  const account_id = c.req.query("account_id");
  const unread_only = c.req.query("unread_only") === "true";

  let query = supabase
    .from("emails")
    .select("*, email_accounts(email)")
    .order("received_at", { ascending: false })
    .limit(50);

  if (category && category !== "all") query = query.eq("ai_category", category);
  if (account_id) query = query.eq("account_id", account_id);
  if (unread_only) query = query.eq("is_read", false);

  const { data } = await query;
  return c.json({ emails: data ?? [] });
});

email.get("/messages/:id", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: emailData } = await supabase
    .from("emails")
    .select("*, email_accounts(email), relationships(id, name, company)")
    .eq("id", id)
    .single();

  let thread: unknown[] = [];
  if (emailData?.thread_id) {
    const { data } = await supabase
      .from("emails")
      .select("*")
      .eq("thread_id", emailData.thread_id)
      .order("received_at");
    thread = data ?? [];
  }

  if (!emailData?.is_read) {
    await supabase.from("emails").update({ is_read: true }).eq("id", id);
  }

  return c.json({ email: emailData, thread });
});

email.patch("/messages/:id/read", async (c) => {
  const { id } = c.req.param();
  const { is_read } = await c.req.json<{ is_read: boolean }>();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  await supabase.from("emails").update({ is_read }).eq("id", id);
  return c.json({ success: true });
});

email.patch("/messages/:id/star", async (c) => {
  const { id } = c.req.param();
  const { is_starred } = await c.req.json<{ is_starred: boolean }>();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  await supabase.from("emails").update({ is_starred }).eq("id", id);
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

email.post("/drafts/:id/send", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: draft } = await supabase
    .from("email_drafts")
    .select("*, email_accounts(*)")
    .eq("id", id)
    .single();

  if (!draft) return c.json({ error: "Draft not found" }, 404);

  await supabase.from("email_drafts").update({ status: "sending" }).eq("id", id);

  const draftWithAccount = draft as typeof draft & { email_accounts: Record<string, unknown> };
  const accessToken = await getValidAccessToken(draftWithAccount.email_accounts, c.env, supabase);

  const message = [
    `To: ${(draft.to_emails ?? []).join(", ")}`,
    (draft.cc_emails ?? []).length ? `Cc: ${(draft.cc_emails ?? []).join(", ")}` : "",
    `Subject: ${draft.subject ?? ""}`,
    "Content-Type: text/plain; charset=utf-8",
    "",
    draft.body_text ?? "",
  ]
    .filter(Boolean)
    .join("\r\n");

  const encoded = btoa(unescape(encodeURIComponent(message)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const response = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw: encoded }),
    }
  );

  if (!response.ok) {
    await supabase.from("email_drafts").update({ status: "failed" }).eq("id", id);
    return c.json({ error: "Failed to send" }, 500);
  }

  await supabase
    .from("email_drafts")
    .update({ status: "sent", sent_at: new Date().toISOString() })
    .eq("id", id);

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

  return c.json({ success: true });
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

  // Fetch up to 100 emails with missing body
  const { data: missing } = await supabase
    .from("emails")
    .select("id, external_id, account_id")
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
    } catch {
      // Skip failures
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
// DEBUG: Test Gmail labels API directly
// ============================================
email.get("/test-labels/:accountId", async (c) => {
  const accountId = c.req.param("accountId");
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: account, error: accountError } = await supabase
    .from("email_accounts")
    .select("id, email, access_token, refresh_token, token_expires_at")
    .eq("id", accountId)
    .single();

  if (accountError || !account) {
    return c.json({ error: "Account not found", details: accountError }, 404);
  }

  let accessToken: string;
  try {
    accessToken = await getValidAccessToken(account, c.env, supabase);
  } catch (e) {
    return c.json({ error: "Token refresh failed", details: String(e) }, 500);
  }

  const response = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/labels",
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  const status = response.status;
  const body = await response.json() as Record<string, unknown>;
  const labels = (body.labels as Array<{ id: string; name: string; type?: string }>) ?? [];

  return c.json({
    account: account.email,
    token_expires_at: account.token_expires_at,
    gmail_api_status: status,
    labels_count: labels.length,
    system_labels: labels.filter(l => l.type === "system").length,
    user_labels: labels.filter(l => l.type === "user").length,
    user_label_names: labels.filter(l => l.type === "user").map(l => l.name),
    raw_response: body,
  });
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

  const { data } = await supabase
    .from("email_labels")
    .insert({ account_id: body.account_id, name: body.name, color: body.color ?? "#2FE8B6", type: "user", sort_order: body.sort_order ?? 100 })
    .select()
    .single();

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

  const { data } = await supabase
    .from("email_label_assignments")
    .upsert({ email_id: id, label_id: labelId })
    .select()
    .single();

  return c.json({ assignment: data });
});

email.delete("/:id/labels/:labelId", async (c) => {
  const { id, labelId } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  await supabase
    .from("email_label_assignments")
    .delete()
    .eq("email_id", id)
    .eq("label_id", labelId);

  return c.json({ success: true });
});

// ============================================
// BULK ACTIONS
// ============================================
email.post("/bulk", async (c) => {
  const { action, email_ids, label_id } = await c.req.json<{ action: string; email_ids: string[]; label_id?: string }>();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  if (!email_ids?.length) return c.json({ error: "No emails specified" }, 400);

  let affected = 0;

  switch (action) {
    case "archive":
      { const { count } = await supabase.from("emails").update({ is_archived: true, folder: "ARCHIVE" }).in("id", email_ids);
      affected = count ?? 0; break; }
    case "unarchive":
      { const { count } = await supabase.from("emails").update({ is_archived: false, folder: "INBOX" }).in("id", email_ids);
      affected = count ?? 0; break; }
    case "trash":
      { const { count } = await supabase.from("emails").update({ is_trashed: true, folder: "TRASH" }).in("id", email_ids);
      affected = count ?? 0; break; }
    case "untrash":
      { const { count } = await supabase.from("emails").update({ is_trashed: false, folder: "INBOX" }).in("id", email_ids);
      affected = count ?? 0; break; }
    case "delete":
      { const { count } = await supabase.from("emails").delete().in("id", email_ids);
      affected = count ?? 0; break; }
    case "spam":
      { const { count } = await supabase.from("emails").update({ is_spam: true, folder: "SPAM" }).in("id", email_ids);
      affected = count ?? 0; break; }
    case "not_spam":
      { const { count } = await supabase.from("emails").update({ is_spam: false, folder: "INBOX" }).in("id", email_ids);
      affected = count ?? 0; break; }
    case "read":
      { const { count } = await supabase.from("emails").update({ is_read: true }).in("id", email_ids);
      affected = count ?? 0; break; }
    case "unread":
      { const { count } = await supabase.from("emails").update({ is_read: false }).in("id", email_ids);
      affected = count ?? 0; break; }
    case "star":
      { const { count } = await supabase.from("emails").update({ is_starred: true }).in("id", email_ids);
      affected = count ?? 0; break; }
    case "unstar":
      { const { count } = await supabase.from("emails").update({ is_starred: false }).in("id", email_ids);
      affected = count ?? 0; break; }
    case "add_label":
      if (!label_id) return c.json({ error: "label_id required" }, 400);
      for (const email_id of email_ids) {
        await supabase.from("email_label_assignments").upsert({ email_id, label_id });
      }
      affected = email_ids.length;
      break;
    case "remove_label":
      if (!label_id) return c.json({ error: "label_id required" }, 400);
      { const { count } = await supabase.from("email_label_assignments").delete().in("email_id", email_ids).eq("label_id", label_id);
      affected = count ?? 0; break; }
    default:
      return c.json({ error: "Unknown action" }, 400);
  }

  return c.json({ success: true, affected });
});

// ============================================
// SNOOZE
// ============================================
email.post("/:id/snooze", async (c) => {
  const { id } = c.req.param();
  const { until } = await c.req.json<{ until: string }>();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data } = await supabase
    .from("emails")
    .update({ snoozed_until: until, folder: "SNOOZED" })
    .eq("id", id)
    .select()
    .single();

  return c.json({ email: data });
});

email.delete("/:id/snooze", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data } = await supabase
    .from("emails")
    .update({ snoozed_until: null, folder: "INBOX" })
    .eq("id", id)
    .select()
    .single();

  return c.json({ email: data });
});

// ============================================
// THREAD VIEW
// ============================================
email.get("/thread/:threadId", async (c) => {
  const { threadId } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data } = await supabase
    .from("emails")
    .select("*, email_label_assignments(label_id, email_labels(*))")
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = supabase
    .from("emails")
    .select("*, email_label_assignments(label_id, email_labels(*))")
    .eq("is_trashed", false)
    .order("received_at", { ascending: false })
    .limit(50);

  if (account_id) query = query.eq("account_id", account_id);
  if (filters.from) query = query.ilike("from_email", `%${filters.from}%`);
  if (filters.to) query = query.ilike("to_emails", `%${filters.to}%`);
  if (filters.subject) query = query.ilike("subject", `%${filters.subject}%`);
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
    query = query.or(`subject.ilike.%${textQuery}%,body_text.ilike.%${textQuery}%,from_name.ilike.%${textQuery}%`);
  }

  const { data } = await query;
  return c.json({ emails: data ?? [], query: q, filters });
});

// ============================================
// SYNC (Background + Manual)
// ============================================
email.post("/sync", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const account_id = c.req.query("account_id");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = supabase.from("email_accounts").select("*").eq("sync_enabled", true);
  if (account_id) query = query.eq("id", account_id);

  const { data: accounts } = await query;
  const results = [];

  for (const account of accounts ?? []) {
    try {
      await supabase
        .from("email_accounts")
        .update({ sync_status: "syncing", sync_error: null })
        .eq("id", account.id);

      const accessToken = await getValidAccessToken(account, c.env, supabase);

      // Sync labels first so email-label assignments can be created
      await syncLabelsForAccount(account.id, accessToken, supabase);

      let newMessages = 0;
      if (account.last_history_id && account.full_sync_completed) {
        newMessages = await syncViaHistory(account, accessToken, supabase);
      } else {
        newMessages = await fullSync(account, accessToken, supabase);
      }

      await supabase
        .from("email_accounts")
        .update({ sync_status: "idle", last_sync_at: new Date().toISOString(), full_sync_completed: true })
        .eq("id", account.id);

      results.push({ account_id: account.id, email: account.email, new_messages: newMessages });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      await supabase
        .from("email_accounts")
        .update({ sync_status: "error", sync_error: msg })
        .eq("id", account.id);
      results.push({ account_id: account.id, email: account.email, error: msg });
    }
  }

  return c.json({ synced: results });
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

  // Sync labels first
  await syncLabelsForAccount(id, accessToken, supabase);

  let pageToken: string | undefined;
  let totalSynced = 0;
  let pageCount = 0;
  const maxPages = 100; // 100 pages × 100 messages = 10,000 emails max

  try {
    do {
      const listUrl = new URL("https://gmail.googleapis.com/gmail/v1/users/me/messages");
      listUrl.searchParams.set("maxResults", "100");
      if (pageToken) listUrl.searchParams.set("pageToken", pageToken);

      const listResponse = await fetch(listUrl.toString(), {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!listResponse.ok) {
        throw new Error(`Gmail API error: ${listResponse.status}`);
      }

      const listData = (await listResponse.json()) as { messages?: Array<{ id: string }>; nextPageToken?: string };
      const messages = listData.messages ?? [];
      pageToken = listData.nextPageToken;

      for (const msg of messages) {
        try {
          const { data: existing } = await supabase
            .from("emails")
            .select("id")
            .eq("external_id", msg.id)
            .single();

          if (existing) continue;

          const msgResponse = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );

          if (!msgResponse.ok) continue;

          const fullMsg = (await msgResponse.json()) as { labelIds?: string[]; [key: string]: unknown };
          const emailRow = parseGmailMessageFull(fullMsg, id);
          const { data: inserted, error } = await supabase
            .from("emails")
            .insert(emailRow)
            .select("id")
            .single();

          if (!error && inserted) {
            totalSynced++;
            await assignEmailLabels(inserted.id, fullMsg.labelIds ?? [], id, supabase);
          }
        } catch {
          // Skip individual message failures
        }
      }

      pageCount++;
      console.log(`[FullSync] Page ${pageCount}: processed ${messages.length} messages, total synced: ${totalSynced}`);
    } while (pageToken && pageCount < maxPages);

    await supabase
      .from("email_accounts")
      .update({ last_sync_at: new Date().toISOString(), full_sync_completed: true })
      .eq("id", id);

    return c.json({
      success: true,
      totalSynced,
      pages: pageCount,
      complete: !pageToken,
    });
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

  const counts: Record<string, number> = {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const withAccount = (q: any) => (account_id ? q.eq("account_id", account_id) : q);

  const { count: inboxCount } = await withAccount(
    supabase.from("emails").select("id", { count: "exact", head: true })
      .eq("folder", "INBOX").eq("is_archived", false).eq("is_trashed", false).eq("is_read", false)
  );
  counts.inbox = inboxCount ?? 0;

  const { count: starredCount } = await withAccount(
    supabase.from("emails").select("id", { count: "exact", head: true })
      .eq("is_starred", true).eq("is_trashed", false)
  );
  counts.starred = starredCount ?? 0;

  const { count: snoozedCount } = await withAccount(
    supabase.from("emails").select("id", { count: "exact", head: true })
      .not("snoozed_until", "is", null)
  );
  counts.snoozed = snoozedCount ?? 0;

  const { count: draftsCount } = await withAccount(
    supabase.from("email_drafts").select("id", { count: "exact", head: true }).eq("status", "draft")
  );
  counts.drafts = draftsCount ?? 0;

  const { count: spamCount } = await withAccount(
    supabase.from("emails").select("id", { count: "exact", head: true })
      .eq("is_spam", true).eq("is_trashed", false)
  );
  counts.spam = spamCount ?? 0;

  const { count: trashCount } = await withAccount(
    supabase.from("emails").select("id", { count: "exact", head: true }).eq("is_trashed", true)
  );
  counts.trash = trashCount ?? 0;

  return c.json({ counts });
});

// ============================================
// UNIFIED SEARCH
// ============================================
email.get("/search", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const query = c.req.query("q");
  const accountId = c.req.query("account");
  const limit = Math.min(parseInt(c.req.query("limit") || "20"), 50);

  if (!query || query.length < 2) {
    return c.json({ results: [] });
  }

  const safe = query.replace(/[%_]/g, "\\$&");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let dbQuery: any = supabase
    .from("emails")
    .select("id, subject, snippet, from_email, from_name, received_at, account_id")
    .or(`subject.ilike.%${safe}%,from_email.ilike.%${safe}%,from_name.ilike.%${safe}%,snippet.ilike.%${safe}%`)
    .order("received_at", { ascending: false })
    .limit(limit);

  if (accountId) {
    dbQuery = dbQuery.eq("account_id", accountId);
  }

  const { data: results, error } = await dbQuery;

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json({ results: results ?? [], query, count: results?.length ?? 0 });
});

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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getValidAccessToken(account: Record<string, unknown>, env: Bindings, supabase: any): Promise<string> {
  if (new Date(account.token_expires_at as string) > new Date(Date.now() + 60000)) {
    return account.access_token as string;
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      refresh_token: account.refresh_token as string,
      grant_type: "refresh_token",
    }),
  });

  const tokens = (await response.json()) as { access_token: string; expires_in: number };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any)
    .from("email_accounts")
    .update({
      access_token: tokens.access_token,
      token_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
    })
    .eq("id", account.id as string);

  return tokens.access_token;
}

function parseGmailMessage(msg: Record<string, unknown>) {
  const payload = msg.payload as Record<string, unknown>;
  const headers = (payload?.headers as Array<{ name: string; value: string }>) ?? [];
  const getHeader = (name: string) =>
    headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value ?? "";

  const fromHeader = getHeader("From");
  const fromMatch = fromHeader.match(/^(?:"?([^"]*)"?\s*)?<?([^>]+)>?$/);

  return {
    subject: getHeader("Subject"),
    from_email: fromMatch?.[2] ?? fromHeader,
    from_name: fromMatch?.[1] ?? "",
    to_emails: getHeader("To")
      .split(",")
      .map((e) => e.trim().replace(/.*<|>/g, ""))
      .filter(Boolean),
    cc_emails: getHeader("Cc")
      .split(",")
      .map((e) => e.trim().replace(/.*<|>/g, ""))
      .filter(Boolean),
    snippet: msg.snippet as string,
    body_text: extractBody(payload, "text/plain"),
    body_html: extractBody(payload, "text/html"),
    labels: (msg.labelIds as string[]) ?? [],
    is_read: !(msg.labelIds as string[])?.includes("UNREAD"),
    is_starred: (msg.labelIds as string[])?.includes("STARRED") ?? false,
    has_attachments: hasAttachments(payload),
    received_at: new Date(parseInt(msg.internalDate as string)).toISOString(),
  };
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

function hasAttachments(payload: Record<string, unknown> | undefined): boolean {
  if (!payload) return false;
  if (payload.filename) return true;
  if (payload.parts) {
    return (payload.parts as Array<Record<string, unknown>>).some((p) => hasAttachments(p));
  }
  return false;
}

async function triageEmail(
  emailData: { from_name: string; from_email: string; subject: string; snippet: string },
  env: Bindings
) {
  try {
    const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      system:
        'Categorize this email. Respond with JSON only: {"category": "action_required|fyi|newsletter|automated|spam", "priority": "high|medium|low", "summary": "one sentence summary"}',
      messages: [
        {
          role: "user",
          content: `From: ${emailData.from_name} <${emailData.from_email}>\nSubject: ${emailData.subject}\n\n${emailData.snippet}`,
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "{}";
    const parsed = JSON.parse(text.replace(/```json\n?|\n?```/g, "")) as {
      category?: string;
      priority?: string;
      summary?: string;
    };

    const aiCategory = parsed.category ?? "fyi";
    return {
      ai_category: aiCategory,
      ai_priority: parsed.priority ?? "medium",
      ai_summary: parsed.summary ?? "",
      triage_category: mapTriageCategory(aiCategory),
      triage_confidence: 0.8,
      triaged_at: new Date().toISOString(),
    };
  } catch {
    return {
      ai_category: "fyi",
      ai_priority: "medium",
      ai_summary: "",
      triage_category: "other",
      triage_confidence: 0.5,
      triaged_at: new Date().toISOString(),
    };
  }
}

function mapTriageCategory(aiCategory: string): string {
  switch (aiCategory) {
    case "action_required": return "important";
    case "newsletter":      return "newsletter";
    case "automated":       return "notification";
    default:                return "other";
  }
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

  for (const label of labels ?? []) {
    // Skip category tabs (Promotions, Social, etc.) — not useful as labels
    if (label.id.startsWith("CATEGORY_")) continue;
    if (label.id === "IMPORTANT" || label.id === "UNREAD") continue;
    // For system labels: skip hidden ones. For user labels: always sync regardless of visibility.
    if (label.type !== "user" && label.labelListVisibility === "labelHide") continue;

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

// ============================================
// HELPER: Assign Gmail label IDs to a synced email
// ============================================
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function assignEmailLabels(emailId: string, gmailLabelIds: string[], accountId: string, supabase: any): Promise<void> {
  if (!gmailLabelIds.length) return;

  const { data: localLabels } = await supabase
    .from("email_labels")
    .select("id, external_id")
    .eq("account_id", accountId)
    .in("external_id", gmailLabelIds);

  if (!localLabels?.length) return;

  const assignments = (localLabels as Array<{ id: string }>).map((label) => ({
    email_id: emailId,
    label_id: label.id,
  }));

  await supabase.from("email_label_assignments").upsert(assignments, {
    onConflict: "email_id,label_id",
    ignoreDuplicates: true,
  });
}

// ============================================
// HELPER: Full Sync (first-time or reset)
// ============================================
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fullSync(account: any, accessToken: string, supabase: any): Promise<number> {
  const listResponse = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=100",
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const { messages } = (await listResponse.json()) as { messages?: Array<{ id: string }> };
  if (!messages?.length) return 0;

  let newCount = 0;
  for (const msg of messages) {
    const { data: existing } = await supabase.from("emails").select("id").eq("external_id", msg.id).single();
    if (existing) continue;

    const msgResponse = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const fullMsg = await msgResponse.json() as { labelIds?: string[]; [key: string]: unknown };
    const emailRow = parseGmailMessageFull(fullMsg, account.id);
    const { data: inserted, error } = await supabase.from("emails").insert(emailRow).select("id").single();
    if (!error && inserted) {
      newCount++;
      await assignEmailLabels(inserted.id, fullMsg.labelIds ?? [], account.id, supabase);
    }
  }

  // Store historyId for incremental syncs
  const latestRes = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messages[0].id}?format=metadata`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const { historyId } = (await latestRes.json()) as { historyId?: string };
  if (historyId) {
    await supabase.from("email_accounts").update({ last_history_id: historyId }).eq("id", account.id);
  }

  return newCount;
}

// ============================================
// HELPER: Incremental Sync via History API
// ============================================
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function syncViaHistory(account: any, accessToken: string, supabase: any): Promise<number> {
  const historyResponse = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/history?startHistoryId=${account.last_history_id}&historyTypes=messageAdded`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const { history, historyId } = (await historyResponse.json()) as {
    history?: Array<{ messagesAdded?: Array<{ message: { id: string } }> }>;
    historyId?: string;
  };

  if (!history?.length) {
    if (historyId) {
      await supabase.from("email_accounts").update({ last_history_id: historyId }).eq("id", account.id);
    }
    return 0;
  }

  let newCount = 0;
  for (const h of history) {
    for (const added of h.messagesAdded ?? []) {
      const { data: existing } = await supabase.from("emails").select("id").eq("external_id", added.message.id).single();
      if (existing) continue;

      const msgResponse = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${added.message.id}?format=full`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const fullMsg = await msgResponse.json() as { labelIds?: string[]; [key: string]: unknown };
      const emailRow = parseGmailMessageFull(fullMsg, account.id);
      const { data: inserted, error } = await supabase.from("emails").insert(emailRow).select("id").single();
      if (!error && inserted) {
        newCount++;
        await assignEmailLabels(inserted.id, fullMsg.labelIds ?? [], account.id, supabase);
      }
    }
  }

  if (historyId) {
    await supabase.from("email_accounts").update({ last_history_id: historyId }).eq("id", account.id);
  }
  return newCount;
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
  let folder = "INBOX";
  if (labels.includes("SENT")) folder = "SENT";
  if (labels.includes("TRASH")) folder = "TRASH";
  if (labels.includes("SPAM")) folder = "SPAM";
  if (labels.includes("DRAFT")) folder = "DRAFTS";

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
    received_at: new Date(parseInt(msg.internalDate)).toISOString(),
    folder,
    is_read: !labels.includes("UNREAD"),
    is_starred: labels.includes("STARRED"),
    is_archived: !labels.includes("INBOX") && folder === "INBOX",
    is_trashed: labels.includes("TRASH"),
    is_spam: labels.includes("SPAM"),
    has_attachments: attachmentParts.length > 0,
    attachment_count: attachmentParts.length,
  };
}
