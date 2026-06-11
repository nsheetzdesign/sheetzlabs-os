import { Hono } from "hono";
import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";
import { executeAgentWithTools } from "../lib/agent-engine";
import { sanitizeAccount } from "../lib/sanitize";
import { createOAuthState, consumeOAuthState } from "../lib/oauth-state";
import { getValidAccessToken as getGoogleAccessToken, ReauthRequiredError } from "../lib/google-auth";
import { syncCalendarAccount } from "../lib/calendar-sync";

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

// Start Google Calendar OAuth flow — authenticated (behind the auth middleware).
// Binds a single-use `state` nonce to the founder's user id and returns the Google
// auth URL for the app to redirect to. Replaces the old public `<a href>` route.
calendar.post("/auth/google/start", async (c) => {
  const scopes = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/userinfo.email",
  ].join(" ");

  const apiUrl = c.env.API_URL || "https://api.sheetzlabs.com";
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const state = await createOAuthState(supabase, c.get("userId"), "google");

  const authUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${c.env.GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(apiUrl + "/calendar/auth/google/callback")}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent(scopes)}` +
    `&access_type=offline` +
    `&prompt=consent` +
    `&state=${state}`;

  return c.json({ url: authUrl });
});

// OAuth callback (public — Google redirects here with no auth header). The state
// nonce binds this back to the user who started the flow.
calendar.get("/auth/google/callback", async (c) => {
  const code = c.req.query("code");
  if (!code) return c.json({ error: "No code provided" }, 400);

  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  // Validate + consume the single-use state row before trusting the code.
  const { valid } = await consumeOAuthState(supabase, c.req.query("state"), "google");
  if (!valid) {
    return c.json({ error: "Invalid OAuth state" }, 403);
  }

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

  const appUrl = c.env.APP_URL || "https://app.sheetzlabs.com";
  const { error: upsertError } = await supabase.from("calendar_accounts").upsert(
    {
      email: user.email,
      provider: "google",
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_expires_at: new Date(Date.now() + (tokens.expires_in ?? 3600) * 1000).toISOString(),
      // A successful (re)link clears any prior reauth flag (CS-3 Part 1).
      needs_reauth: false,
    },
    { onConflict: "email" }
  );

  if (upsertError) {
    return c.redirect(
      `${appUrl}/dashboard/calendar?connected=false&error=${encodeURIComponent(upsertError.message)}`
    );
  }

  return c.redirect(`${appUrl}/dashboard/calendar?connected=true`);
});

// Update account (explicit column allowlist — never trust the raw body, which
// would let a caller overwrite access_token/refresh_token, XC-1 mass assignment)
calendar.patch("/accounts/:id", async (c) => {
  const { id } = c.req.param();
  const body = await c.req.json<{
    display_name?: string;
    color?: string;
    is_visible?: boolean;
  }>();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const updates: Record<string, unknown> = {};
  if (body.display_name !== undefined) updates.display_name = body.display_name;
  if (body.color !== undefined) updates.color = body.color;
  if (body.is_visible !== undefined) updates.is_visible = body.is_visible;

  const { data } = await supabase
    .from("calendar_accounts")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  return c.json({ account: sanitizeAccount(data) });
});

// Disconnect account (CS-9). Refuses while active bookings exist (409), revokes the
// Google refresh token best-effort, then deletes in order with every step checked —
// no more {success:true} while the row (and its plaintext tokens) silently survive.
// Migration 043 made the booking FKs ON DELETE SET NULL so historical bookings live on.
calendar.delete("/accounts/:id", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: account, error: accErr } = await supabase
    .from("calendar_accounts")
    .select("id, refresh_token")
    .eq("id", id)
    .single();
  if (accErr || !account) return c.json({ error: "Account not found" }, 404);

  // Guard: active = non-cancelled bookings in the future. Block until they clear.
  const { count: activeCount, error: countErr } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("calendar_account_id", id)
    .neq("status", "cancelled")
    .gte("scheduled_at", new Date().toISOString());
  if (countErr) return c.json({ error: countErr.message }, 500);
  if ((activeCount ?? 0) > 0) {
    return c.json(
      {
        error: "ACTIVE_BOOKINGS",
        count: activeCount,
        message: `Cancel or wait out ${activeCount} upcoming booking${
          activeCount === 1 ? "" : "s"
        } before disconnecting this account.`,
      },
      409
    );
  }

  // Best-effort token revocation (don't block the delete on its failure).
  if (account.refresh_token) {
    try {
      const res = await fetch("https://oauth2.googleapis.com/revoke", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ token: account.refresh_token as string }),
      });
      if (!res.ok) {
        console.error(`[calendar] token revoke for ${id} returned ${res.status}`);
      }
    } catch (err) {
      console.error(`[calendar] token revoke for ${id} failed:`, err);
    }
  }

  const { error: evErr } = await supabase.from("calendar_events").delete().eq("account_id", id);
  if (evErr) return c.json({ error: `Failed to delete events: ${evErr.message}` }, 500);

  // Deletes the account; cascades booking_links and nulls bookings' FKs (migration 043).
  const { error: delErr } = await supabase.from("calendar_accounts").delete().eq("id", id);
  if (delErr) return c.json({ error: `Failed to delete account: ${delErr.message}` }, 500);

  return c.json({ success: true });
});

// List Google sub-calendars for an account
calendar.get("/accounts/:id/google-calendars", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: account } = await supabase
    .from("calendar_accounts")
    .select("*")
    .eq("id", id)
    .single();

  if (!account) return c.json({ error: "Account not found" }, 404);

  const accessToken = await getValidAccessToken(account, c.env, supabase);

  const res = await fetch(
    "https://www.googleapis.com/calendar/v3/users/me/calendarList?maxResults=50",
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const data = (await res.json()) as {
    items?: Array<{
      id: string;
      summary: string;
      primary?: boolean;
      backgroundColor?: string;
      foregroundColor?: string;
    }>;
  };

  return c.json({ calendars: data.items ?? [] });
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

  // Deletion-aware, paginated, batched sync (CS-1/2). Resumes across runs via
  // sync_cursor if a large account exceeds the per-run subrequest budget.
  try {
    const result = await syncCalendarAccount(account, c.env, supabase);
    return c.json({
      message: result.complete ? "Sync complete" : "Sync in progress (continuing next run)",
      synced: result.synced,
      deleted: result.deleted,
      calendars: result.calendars,
      complete: result.complete,
    });
  } catch (err) {
    if (err instanceof ReauthRequiredError) {
      return c.json({ error: "needs_reauth", email: err.email }, 409);
    }
    const msg = err instanceof Error ? err.message : "Sync failed";
    await supabase
      .from("calendar_accounts")
      .update({ sync_status: "error", sync_error: msg })
      .eq("id", id);
    return c.json({ error: msg }, 500);
  }
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
    google_calendar_id?: string;
    add_google_meet?: boolean;
    meeting_link?: string;
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
      meeting_link: body.meeting_link ?? null,
    })
    .select()
    .single();

  // Push to Google Calendar if account connected
  if (account) {
    try {
      const accessToken = await getValidAccessToken(account, c.env, supabase);

      const calendarId = body.google_calendar_id ?? "primary";
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

      if (body.add_google_meet) {
        gcalBody.conferenceData = {
          createRequest: {
            requestId: `meet-${Date.now()}`,
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        };
      }

      const gcalUrl =
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events` +
        (body.add_google_meet ? "?conferenceDataVersion=1" : "");

      const gcalRes = await fetch(gcalUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gcalBody),
      });

      const gcalData = (await gcalRes.json()) as {
        id?: string;
        hangoutLink?: string;
        conferenceData?: { entryPoints?: Array<{ uri: string }> };
      };

      if (gcalData.id && event) {
        const meetingLink =
          gcalData.hangoutLink ||
          gcalData.conferenceData?.entryPoints?.[0]?.uri ||
          body.meeting_link ||
          null;

        await supabase
          .from("calendar_events")
          .update({
            external_id: gcalData.id,
            google_calendar_id: calendarId,
            meeting_link: meetingLink,
          })
          .eq("id", event.id);
      }
    } catch (err) {
      console.error("Failed to push event to Google Calendar:", err);
    }
  }

  return c.json({ event });
});

// Update an event (and sync to Google Calendar)
calendar.patch("/events/:id", async (c) => {
  const { id } = c.req.param();
  const body = await c.req.json<{
    title?: string;
    description?: string;
    location?: string;
    start_at?: string;
    end_at?: string;
    meeting_link?: string;
    add_google_meet?: boolean;
  }>();

  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: event } = await supabase
    .from("calendar_events")
    .select("*, calendar_accounts(*)")
    .eq("id", id)
    .single();

  if (!event) return c.json({ error: "Event not found" }, 404);

  const updates: Record<string, unknown> = {};
  if (body.title !== undefined) updates.title = body.title;
  if (body.description !== undefined) updates.description = body.description;
  if (body.location !== undefined) updates.location = body.location;
  if (body.start_at !== undefined) updates.start_at = body.start_at;
  if (body.end_at !== undefined) updates.end_at = body.end_at;
  if (body.meeting_link !== undefined) updates.meeting_link = body.meeting_link;

  // Sync to Google Calendar if connected and has a real external ID
  const extId = event.external_id as string;
  if (
    event.calendar_accounts &&
    !extId.startsWith("local-") &&
    !extId.startsWith("timeblock-")
  ) {
    try {
      const accessToken = await getValidAccessToken(event.calendar_accounts, c.env, supabase);
      const calendarId = (event.google_calendar_id as string) ?? "primary";

      const gcalBody: Record<string, unknown> = {};
      if (body.title !== undefined) gcalBody.summary = body.title;
      if (body.description !== undefined) gcalBody.description = body.description;
      if (body.location !== undefined) gcalBody.location = body.location;
      if (body.start_at !== undefined) gcalBody.start = { dateTime: body.start_at };
      if (body.end_at !== undefined) gcalBody.end = { dateTime: body.end_at };

      if (body.add_google_meet) {
        gcalBody.conferenceData = {
          createRequest: {
            requestId: `meet-${Date.now()}`,
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        };
      }

      const gcalUrl =
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${extId}` +
        (body.add_google_meet ? "?conferenceDataVersion=1" : "");

      const gcalRes = await fetch(gcalUrl, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gcalBody),
      });

      if (gcalRes.ok) {
        const gcalData = (await gcalRes.json()) as {
          hangoutLink?: string;
          conferenceData?: { entryPoints?: Array<{ uri: string }> };
        };
        if (!body.meeting_link) {
          if (gcalData.hangoutLink) updates.meeting_link = gcalData.hangoutLink;
          else if (gcalData.conferenceData?.entryPoints?.[0]?.uri) {
            updates.meeting_link = gcalData.conferenceData.entryPoints[0].uri;
          }
        }
      }
    } catch (err) {
      console.error("Failed to update Google Calendar event:", err);
    }
  }

  const { data: updated } = await supabase
    .from("calendar_events")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  return c.json({ event: updated });
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

// ============================================
// SUB-CALENDARS
// ============================================

// List sub-calendars for an account (syncs from Google, upserts to DB, returns DB records)
calendar.get("/accounts/:id/calendars", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: account } = await supabase
    .from("calendar_accounts")
    .select("*")
    .eq("id", id)
    .single();

  if (!account) return c.json({ error: "Account not found" }, 404);

  const accessToken = await getValidAccessToken(account, c.env, supabase);

  const res = await fetch(
    "https://www.googleapis.com/calendar/v3/users/me/calendarList?maxResults=50",
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const calList = (await res.json()) as {
    items?: Array<{ id: string; summary?: string; backgroundColor?: string }>;
  };

  for (const cal of calList.items ?? []) {
    await supabase.from("calendar_sub_accounts").upsert(
      {
        account_id: id,
        external_id: cal.id,
        name: cal.summary || cal.id,
        color: cal.backgroundColor || "#2FE8B6",
      },
      { onConflict: "account_id,external_id" }
    );
  }

  const { data: subCalendars } = await supabase
    .from("calendar_sub_accounts")
    .select("*")
    .eq("account_id", id)
    .order("name");

  return c.json({ calendars: subCalendars ?? [] });
});

// Update sub-calendar visibility or color
calendar.patch("/sub-accounts/:id", async (c) => {
  const { id } = c.req.param();
  const body = await c.req.json<{ is_visible?: boolean; color?: string }>();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const updates: Record<string, unknown> = {};
  if (body.is_visible !== undefined) updates.is_visible = body.is_visible;
  if (body.color !== undefined) updates.color = body.color;

  const { data } = await supabase
    .from("calendar_sub_accounts")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  return c.json({ calendar: data });
});

export default calendar;

// ============================================
// HELPER FUNCTIONS
// ============================================

// Delegates to the shared Google token helper (Prompt 52A Part 1 — CS-3). Detects
// invalid_grant, flags needs_reauth, and never writes an undefined token.
function getValidAccessToken(
  account: Record<string, unknown>,
  env: { GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any
): Promise<string> {
  return getGoogleAccessToken(account, env, supabase, "calendar_accounts");
}
