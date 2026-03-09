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
  await supabase.from("email_accounts").upsert(
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
  );

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

  return c.json({ message: "Sync complete", synced: syncedCount });
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

function extractBody(payload: Record<string, unknown> | undefined, mimeType: string): string {
  if (!payload) return "";

  const body = payload.body as { data?: string } | undefined;
  if (payload.mimeType === mimeType && body?.data) {
    return atob(body.data.replace(/-/g, "+").replace(/_/g, "/"));
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

    return {
      ai_category: parsed.category ?? "fyi",
      ai_priority: parsed.priority ?? "medium",
      ai_summary: parsed.summary ?? "",
    };
  } catch {
    return { ai_category: "fyi", ai_priority: "medium", ai_summary: "" };
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
