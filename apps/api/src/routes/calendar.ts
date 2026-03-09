import { Hono } from "hono";
import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";
import { executeAgentWithTools } from "../lib/agent-engine";

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

const calendar = new Hono<HonoEnv>();

// ============================================
// ACCOUNT MANAGEMENT
// ============================================

calendar.get("/accounts", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data } = await supabase
    .from("calendar_accounts")
    .select("id, email, provider, color, sync_enabled, last_sync_at")
    .order("email");
  return c.json({ accounts: data ?? [] });
});

// Start Google Calendar OAuth flow
calendar.get("/auth/google", async (c) => {
  const scopes = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/userinfo.email",
  ].join(" ");

  const apiUrl = c.env.API_URL || "https://api.sheetzlabs.com";
  const authUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${c.env.GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(apiUrl + "/calendar/auth/google/callback")}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent(scopes)}` +
    `&access_type=offline` +
    `&prompt=consent`;

  return c.redirect(authUrl);
});

// OAuth callback
calendar.get("/auth/google/callback", async (c) => {
  const code = c.req.query("code");
  if (!code) return c.json({ error: "No code provided" }, 400);

  const apiUrl = c.env.API_URL || "https://api.sheetzlabs.com";

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: c.env.GOOGLE_CLIENT_ID,
      client_secret: c.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${apiUrl}/calendar/auth/google/callback`,
      grant_type: "authorization_code",
    }),
  });

  const tokens = (await tokenResponse.json()) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
  };

  if (!tokens.access_token) {
    return c.json({ error: "Failed to get tokens", details: tokens }, 400);
  }

  const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  const user = (await userResponse.json()) as { email: string };

  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  await supabase.from("calendar_accounts").upsert(
    {
      email: user.email,
      provider: "google",
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_expires_at: new Date(Date.now() + (tokens.expires_in ?? 3600) * 1000).toISOString(),
    },
    { onConflict: "email" }
  );

  return c.redirect("https://sheetzlabs.com/dashboard/calendar?connected=true");
});

// Update account
calendar.patch("/accounts/:id", async (c) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data } = await supabase
    .from("calendar_accounts")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  return c.json({ account: data });
});

// Disconnect account
calendar.delete("/accounts/:id", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  await supabase.from("calendar_events").delete().eq("account_id", id);
  await supabase.from("calendar_accounts").delete().eq("id", id);

  return c.json({ success: true });
});

// ============================================
// SYNC
// ============================================

calendar.post("/accounts/:id/sync", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: account } = await supabase
    .from("calendar_accounts")
    .select("*")
    .eq("id", id)
    .single();

  if (!account) return c.json({ error: "Account not found" }, 404);

  const accessToken = await getValidAccessToken(account, c.env, supabase);

  const now = new Date();
  const timeMin = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const timeMax = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString();

  // Enumerate all calendars this account has access to
  const calListRes = await fetch(
    "https://www.googleapis.com/calendar/v3/users/me/calendarList?maxResults=50",
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const calList = (await calListRes.json()) as {
    items?: Array<{ id: string; summary: string; primary?: boolean }>;
  };

  const calendarsToSync = calList.items ?? [{ id: "primary", summary: "Primary" }];

  let syncedCount = 0;
  for (const cal of calendarsToSync) {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(cal.id)}/events?` +
        `timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}` +
        `&singleEvents=true&orderBy=startTime&maxResults=250`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const gcalData = (await response.json()) as { items?: unknown[] };

    for (const event of gcalData.items ?? []) {
      const parsed = parseGoogleEvent(event as Record<string, unknown>);

      await supabase.from("calendar_events").upsert(
        {
          account_id: id,
          // Google event IDs are globally unique per user — safe to use directly
          external_id: (event as Record<string, unknown>).id as string,
          ...parsed,
        },
        { onConflict: "account_id,external_id" }
      );

      syncedCount++;
    }
  }

  await supabase
    .from("calendar_accounts")
    .update({ last_sync_at: new Date().toISOString() })
    .eq("id", id);

  return c.json({ message: "Sync complete", synced: syncedCount, calendars: calendarsToSync.length });
});

// ============================================
// EVENTS
// ============================================

calendar.get("/events", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const start = c.req.query("start") || new Date().toISOString();
  const end =
    c.req.query("end") || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const account_id = c.req.query("account_id");

  let query = supabase
    .from("calendar_events")
    .select("*, calendar_accounts(email, color), tasks(id, title, status)")
    .gte("start_at", start)
    .lte("start_at", end)
    .order("start_at");

  if (account_id) query = query.eq("account_id", account_id);

  const { data } = await query;
  return c.json({ events: data ?? [] });
});

calendar.get("/events/:id", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data } = await supabase
    .from("calendar_events")
    .select("*, calendar_accounts(email, color), tasks(*), knowledge(*)")
    .eq("id", id)
    .single();

  return c.json({ event: data });
});

// Create a new event (and push to Google Calendar)
calendar.post("/events", async (c) => {
  const body = await c.req.json<{
    account_id: string;
    title: string;
    description?: string;
    location?: string;
    start_at: string;
    end_at: string;
    attendees?: Array<{ email: string; name?: string }>;
  }>();

  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: account } = await supabase
    .from("calendar_accounts")
    .select("*")
    .eq("id", body.account_id)
    .single();

  // Build local event first with a placeholder external_id
  const localExternalId = `local-${Date.now()}`;
  const { data: event } = await supabase
    .from("calendar_events")
    .insert({
      account_id: body.account_id,
      external_id: localExternalId,
      title: body.title,
      description: body.description ?? null,
      location: body.location ?? null,
      start_at: body.start_at,
      end_at: body.end_at,
      attendees: body.attendees ?? [],
    })
    .select()
    .single();

  // Push to Google Calendar if account connected
  if (account) {
    try {
      const accessToken = await getValidAccessToken(account, c.env, supabase);

      const gcalBody: Record<string, unknown> = {
        summary: body.title,
        description: body.description,
        location: body.location,
        start: { dateTime: body.start_at },
        end: { dateTime: body.end_at },
      };

      if (body.attendees?.length) {
        gcalBody.attendees = body.attendees.map((a) => ({ email: a.email, displayName: a.name }));
      }

      const gcalRes = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(gcalBody),
        }
      );

      const gcalData = (await gcalRes.json()) as { id?: string; hangoutLink?: string };

      if (gcalData.id && event) {
        await supabase
          .from("calendar_events")
          .update({
            external_id: gcalData.id,
            meeting_link: gcalData.hangoutLink ?? null,
          })
          .eq("id", event.id);
      }
    } catch (err) {
      console.error("Failed to push event to Google Calendar:", err);
    }
  }

  return c.json({ event });
});

// ============================================
// TIME BLOCKING
// ============================================

calendar.get("/tasks/unscheduled", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .in("status", ["todo", "in_progress"])
    .order("due_date", { nullsFirst: false });

  const { data: blockedTasks } = await supabase
    .from("calendar_events")
    .select("task_id")
    .eq("is_time_block", true)
    .not("task_id", "is", null);

  const blockedIds = new Set((blockedTasks ?? []).map((e: { task_id: string }) => e.task_id));
  const unscheduled = (tasks ?? []).filter((t: { id: string }) => !blockedIds.has(t.id));

  return c.json({ tasks: unscheduled });
});

calendar.post("/time-blocks", async (c) => {
  const body = await c.req.json<{
    task_id: string;
    start_at: string;
    end_at: string;
    account_id: string;
  }>();
  const { task_id, start_at, end_at, account_id } = body;

  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: task } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", task_id)
    .single();

  if (!task) return c.json({ error: "Task not found" }, 404);

  const { data: event } = await supabase
    .from("calendar_events")
    .insert({
      account_id,
      external_id: `timeblock-${Date.now()}`,
      title: `⏱️ ${task.title}`,
      description: task.description,
      start_at,
      end_at,
      is_time_block: true,
      task_id,
    })
    .select()
    .single();

  // Sync to Google Calendar
  const { data: account } = await supabase
    .from("calendar_accounts")
    .select("*")
    .eq("id", account_id)
    .single();

  if (account && event) {
    try {
      const accessToken = await getValidAccessToken(account, c.env, supabase);

      const gcalResponse = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            summary: event.title,
            description: event.description,
            start: { dateTime: start_at },
            end: { dateTime: end_at },
          }),
        }
      );

      const gcalData = (await gcalResponse.json()) as { id?: string };

      if (gcalData.id) {
        await supabase
          .from("calendar_events")
          .update({ external_id: gcalData.id })
          .eq("id", event.id);
      }
    } catch (err) {
      console.error("Failed to sync time block to Google Calendar:", err);
    }
  }

  return c.json({ event });
});

calendar.delete("/time-blocks/:id", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: event } = await supabase
    .from("calendar_events")
    .select("*, calendar_accounts(*)")
    .eq("id", id)
    .single();

  if (!event) return c.json({ error: "Event not found" }, 404);

  // Delete from Google Calendar if synced (not a local-only time block)
  if (event.calendar_accounts && !event.external_id.startsWith("timeblock-")) {
    try {
      const accessToken = await getValidAccessToken(event.calendar_accounts, c.env, supabase);
      await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${event.external_id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
    } catch (err) {
      console.error("Failed to delete from Google Calendar:", err);
    }
  }

  await supabase.from("calendar_events").delete().eq("id", id);

  return c.json({ success: true });
});

// AI suggest time blocks
calendar.post("/time-blocks/suggest", async (c) => {
  const { task_ids, date } = await c.req.json<{ task_ids: string[]; date: string }>();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: tasks } = await supabase.from("tasks").select("*").in("id", task_ids);

  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  const { data: events } = await supabase
    .from("calendar_events")
    .select("*")
    .gte("start_at", dayStart.toISOString())
    .lte("end_at", dayEnd.toISOString());

  const anthropic = new Anthropic({ apiKey: c.env.ANTHROPIC_API_KEY });

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    system: `You are a scheduling assistant. Given tasks and existing calendar events, suggest optimal time blocks.

Consider:
- Deep work (coding, writing) → morning slots
- Admin tasks → afternoon
- Avoid back-to-back without breaks
- Account for existing meetings
Return JSON array only: [{"task_id": "...", "start_at": "ISO", "end_at": "ISO", "reason": "..."}]`,
    messages: [
      {
        role: "user",
        content: `Tasks to schedule:\n${JSON.stringify(tasks, null, 2)}\n\nExisting events:\n${JSON.stringify(events, null, 2)}\n\nDate: ${date}\nWorking hours: 8am-6pm CT`,
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "[]";
  let suggestions: unknown[] = [];
  try {
    suggestions = JSON.parse(text.replace(/```json\n?|\n?```/g, ""));
  } catch {
    suggestions = [];
  }

  return c.json({ suggestions });
});

// ============================================
// MEETING PREP
// ============================================

calendar.post("/events/:id/prep", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: event } = await supabase
    .from("calendar_events")
    .select("*")
    .eq("id", id)
    .single();

  if (!event) return c.json({ error: "Event not found" }, 404);

  const { data: agent } = await supabase
    .from("agents")
    .select("*")
    .eq("slug", "meeting-prep")
    .single();

  if (!agent) return c.json({ error: "Meeting prep agent not found" }, 404);

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

  c.executionCtx.waitUntil(
    executeAgentWithTools(
      agent,
      run,
      {
        event_title: event.title,
        event_start: event.start_at,
        event_end: event.end_at,
        event_location: event.location ?? "",
        event_description: event.description ?? "",
        attendees: JSON.stringify(event.attendees ?? []),
        event_id: id,
      },
      c.env,
      supabase
    ).then(async () => {
      // Mark prep as generated
      await supabase
        .from("calendar_events")
        .update({ ai_prep_generated: true })
        .eq("id", id);
    })
  );

  return c.json({ message: "Meeting prep started", run_id: run.id });
});

// ============================================
// TIME BLOCK TEMPLATES
// ============================================

calendar.get("/templates", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data } = await supabase.from("time_block_templates").select("*").order("name");
  return c.json({ templates: data ?? [] });
});

calendar.post("/templates", async (c) => {
  const body = await c.req.json();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data } = await supabase
    .from("time_block_templates")
    .insert(body)
    .select()
    .single();

  return c.json({ template: data });
});

calendar.delete("/templates/:id", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  await supabase.from("time_block_templates").delete().eq("id", id);
  return c.json({ success: true });
});

export default calendar;

// ============================================
// HELPER FUNCTIONS
// ============================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getValidAccessToken(
  account: Record<string, unknown>,
  env: { GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string },
  supabase: any
): Promise<string> {
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

  await supabase
    .from("calendar_accounts")
    .update({
      access_token: tokens.access_token,
      token_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
    })
    .eq("id", account.id as string);

  return tokens.access_token;
}

function parseGoogleEvent(event: Record<string, unknown>) {
  const start = event.start as Record<string, string> | undefined;
  const end = event.end as Record<string, string> | undefined;
  const attendees = (event.attendees as Array<Record<string, string>> | undefined) ?? [];
  const organizer = event.organizer as Record<string, string> | undefined;
  const conferenceData = event.conferenceData as
    | { entryPoints?: Array<{ uri: string }> }
    | undefined;

  return {
    title: (event.summary as string) || "(No title)",
    description: (event.description as string) || null,
    location: (event.location as string) || null,
    start_at: start?.dateTime || start?.date,
    end_at: end?.dateTime || end?.date,
    all_day: !start?.dateTime,
    timezone: start?.timeZone || "America/Chicago",
    attendees: attendees.map((a) => ({
      email: a.email,
      name: a.displayName || null,
      status: a.responseStatus,
    })),
    organizer_email: organizer?.email || null,
    meeting_link:
      (event.hangoutLink as string) || conferenceData?.entryPoints?.[0]?.uri || null,
    status: (event.status as string) || "confirmed",
    recurring: !!(event.recurringEventId as string),
    recurrence_rule: (event.recurrence as string[] | undefined)?.[0] || null,
  };
}
