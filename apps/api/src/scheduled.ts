import { createClient } from "@supabase/supabase-js";
import { executeAgent, postToLinkedIn } from "./lib/agent-engine";
import { reminderEmail } from "./lib/booking-emails";
import { sendBookingEmail } from "./lib/send-booking-email";
import { runEmailSync } from "./routes/email";
import { getValidAccessToken as getGoogleAccessToken, ReauthRequiredError } from "./lib/google-auth";

type Env = {
  ENVIRONMENT: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  ANTHROPIC_API_KEY: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  LINKEDIN_ACCESS_TOKEN: string;
  LINKEDIN_PERSON_ID: string;
  CLOUDFLARE_BILLING_TOKEN: string;
  CLOUDFLARE_ACCOUNT_ID: string;
  API_URL: string;
  APP_URL: string;
  CRON_SECRET: string;
  RESEND_API_KEY: string;
};

// Header that lets the cron reach still-HTTP internal endpoints past the API's
// auth middleware (which now rejects unauthenticated requests).
function internalHeaders(env: Env): Record<string, string> {
  return env.CRON_SECRET ? { "X-Internal-Secret": env.CRON_SECRET } : {};
}

export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

    // Run scheduled agents
    const { data: agentsData } = await supabase
      .from("agents")
      .select("*")
      .eq("enabled", true)
      .not("schedule", "is", null);

    const now = new Date(event.scheduledTime);

    for (const agent of agentsData ?? []) {
      if (shouldRunNow(agent.schedule as string, now)) {
        const { data: run } = await supabase
          .from("agent_runs")
          .insert({
            agent_id: agent.id,
            agent_name: agent.name,
            status: "running",
            trigger_type: "scheduled",
            started_at: now.toISOString(),
          })
          .select()
          .single();

        if (run) {
          ctx.waitUntil(executeAgent(agent, run, {}, env, supabase));
        }
      }
    }

    // Post scheduled content queue items
    const { data: scheduledPosts } = await supabase
      .from("content_queue")
      .select("*")
      .eq("status", "scheduled")
      .lte("scheduled_for", now.toISOString());

    for (const post of scheduledPosts ?? []) {
      ctx.waitUntil(postScheduledContent(post, env, supabase));
    }

    // Fetch all enabled RSS feeds daily at 6am UTC
    if (now.getUTCHours() === 6 && now.getUTCMinutes() === 0) {
      ctx.waitUntil(fetchAllFeeds(env, supabase));
    }

    // Generate daily analytics snapshot at midnight UTC
    if (now.getUTCHours() === 0 && now.getUTCMinutes() === 0) {
      const apiUrl = env.API_URL ?? "https://api.sheetzlabs.com";
      ctx.waitUntil(
        fetch(`${apiUrl}/analytics/snapshot`, { method: "POST", headers: internalHeaders(env) })
      );
    }

    // Unsnooze emails every minute — in TS so each restore writes back to Gmail
    // and returns the message to its original folder (ES-9).
    ctx.waitUntil(unsnoozeEmails(env, supabase));

    // Sweep expired OAuth state nonces every minute (Prompt 51B).
    ctx.waitUntil(
      Promise.resolve(
        supabase.from("oauth_states").delete().lt("expires_at", now.toISOString())
      )
    );

    // Auto-sync all email accounts every 5 minutes — call the sync logic directly
    // instead of HTTP-fetching our own (now-authenticated) endpoint.
    if (now.getUTCMinutes() % 5 === 0) {
      ctx.waitUntil(runEmailSync(env, supabase).then(() => undefined));
    }

    // Process booking reminders every 5 minutes
    if (now.getUTCMinutes() % 5 === 0) {
      ctx.waitUntil(processBookingReminders(env));
    }
  },
};

/**
 * Restore due-snoozed emails (Prompt 52A Part 5 — ES-9). Replaces the old
 * unconditional `unsnooze_emails()` RPC: restores the stored original folder AND
 * re-adds the Gmail INBOX label per row so the message returns on every device.
 * A Gmail/token failure leaves the row snoozed for the next run rather than
 * clearing it silently.
 */
async function unsnoozeEmails(env: Env, supabase: ReturnType<typeof createClient<any>>) {
  const nowIso = new Date().toISOString();
  const { data: due, error } = await supabase
    .from("emails")
    .select("id, external_id, snooze_return_folder, email_accounts(*)")
    .not("snoozed_until", "is", null)
    .lte("snoozed_until", nowIso)
    .eq("is_deleted", false)
    .limit(100);

  if (error) {
    console.error(`[unsnooze] query failed: ${error.message}`);
    return;
  }

  for (const row of due ?? []) {
    const returnFolder = (row.snooze_return_folder as string) || "INBOX";
    try {
      if (returnFolder === "INBOX") {
        const token = await getGoogleAccessToken(
          row.email_accounts as unknown as Record<string, unknown>,
          env,
          supabase,
          "email_accounts"
        );
        const res = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${row.external_id}/modify`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({ addLabelIds: ["INBOX"] }),
          }
        );
        if (!res.ok) {
          console.error(`[unsnooze] Gmail modify failed for ${row.id}: ${res.status}`);
          continue; // leave snoozed; retry next run
        }
      }

      const { error: upErr } = await supabase
        .from("emails")
        .update({ snoozed_until: null, folder: returnFolder, snooze_return_folder: null })
        .eq("id", row.id);
      if (upErr) console.error(`[unsnooze] DB update failed for ${row.id}: ${upErr.message}`);
    } catch (err) {
      if (err instanceof ReauthRequiredError) {
        console.warn(`[unsnooze] ${err.email} needs reauth; leaving snoozed`);
      } else {
        console.error(`[unsnooze] row ${row.id} failed:`, err);
      }
    }
  }
}

async function postScheduledContent(
  post: { id: string; content: string; platform: string },
  env: Env,
  supabase: ReturnType<typeof createClient<any>>
) {
  try {
    let externalId: string | null = null;

    if (post.platform === "linkedin") {
      externalId = await postToLinkedIn({ content: post.content }, env);
    }

    await supabase
      .from("content_queue")
      .update({
        status: externalId ? "posted" : "failed",
        posted_at: externalId ? new Date().toISOString() : null,
        external_id: externalId,
      })
      .eq("id", post.id);
  } catch {
    await supabase
      .from("content_queue")
      .update({ status: "failed" })
      .eq("id", post.id);
  }
}

async function fetchAllFeeds(
  env: Env,
  supabase: ReturnType<typeof createClient<any>>
) {
  const { data: feeds } = await supabase
    .from("feed_sources")
    .select("id")
    .eq("enabled", true);

  const apiUrl = env.API_URL ?? "https://api.sheetzlabs.com";
  for (const feed of feeds ?? []) {
    try {
      await fetch(`${apiUrl}/knowledge/feeds/${feed.id}/fetch`, {
        method: "POST",
        headers: internalHeaders(env),
      });
    } catch (err) {
      console.error(`[feeds] fetch failed for ${feed.id}:`, err);
    }
  }
}

async function processBookingReminders(env: Env) {
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
  const now = new Date();

  // 24-hour reminders: bookings between 23-25 hours from now
  const reminder24hStart = new Date(now.getTime() + 23 * 60 * 60 * 1000);
  const reminder24hEnd = new Date(now.getTime() + 25 * 60 * 60 * 1000);

  const { data: reminders24h } = await supabase
    .from("bookings")
    .select("*, booking_links(title, calendar_accounts(email, display_name))")
    .eq("status", "confirmed")
    .eq("reminder_24h_sent", false)
    .gte("scheduled_at", reminder24hStart.toISOString())
    .lte("scheduled_at", reminder24hEnd.toISOString());

  for (const bk of reminders24h ?? []) {
    const hostEmail = bk.booking_links.calendar_accounts.email as string;
    const hostName = (bk.booking_links.calendar_accounts.display_name as string) || hostEmail.split("@")[0];

    const emailData = {
      guestName: bk.guest_name as string,
      guestEmail: bk.guest_email as string,
      hostName,
      hostEmail,
      title: bk.booking_links.title as string,
      dateTime: new Date(bk.scheduled_at as string),
      duration: bk.duration_minutes as number,
      timezone: (bk.timezone as string) || "America/Chicago",
      bookingId: bk.id as string,
    };

    const guestReminder = reminderEmail(emailData, false, 24);
    await sendBookingEmail({ to: emailData.guestEmail, subject: guestReminder.subject, html: guestReminder.html, resendApiKey: env.RESEND_API_KEY });

    const hostReminder = reminderEmail(emailData, true, 24);
    await sendBookingEmail({ to: hostEmail, subject: hostReminder.subject, html: hostReminder.html, resendApiKey: env.RESEND_API_KEY });

    await supabase.from("bookings").update({ reminder_24h_sent: true }).eq("id", bk.id);
  }

  // 1-hour reminders: bookings between 55-65 minutes from now
  const reminder1hStart = new Date(now.getTime() + 55 * 60 * 1000);
  const reminder1hEnd = new Date(now.getTime() + 65 * 60 * 1000);

  const { data: reminders1h } = await supabase
    .from("bookings")
    .select("*, booking_links(title, calendar_accounts(email, display_name))")
    .eq("status", "confirmed")
    .eq("reminder_1h_sent", false)
    .gte("scheduled_at", reminder1hStart.toISOString())
    .lte("scheduled_at", reminder1hEnd.toISOString());

  for (const bk of reminders1h ?? []) {
    const hostEmail = bk.booking_links.calendar_accounts.email as string;
    const hostName = (bk.booking_links.calendar_accounts.display_name as string) || hostEmail.split("@")[0];

    const emailData = {
      guestName: bk.guest_name as string,
      guestEmail: bk.guest_email as string,
      hostName,
      hostEmail,
      title: bk.booking_links.title as string,
      dateTime: new Date(bk.scheduled_at as string),
      duration: bk.duration_minutes as number,
      timezone: (bk.timezone as string) || "America/Chicago",
      bookingId: bk.id as string,
    };

    const guestReminder = reminderEmail(emailData, false, 1);
    await sendBookingEmail({ to: emailData.guestEmail, subject: guestReminder.subject, html: guestReminder.html, resendApiKey: env.RESEND_API_KEY });

    const hostReminder = reminderEmail(emailData, true, 1);
    await sendBookingEmail({ to: hostEmail, subject: hostReminder.subject, html: hostReminder.html, resendApiKey: env.RESEND_API_KEY });

    await supabase.from("bookings").update({ reminder_1h_sent: true }).eq("id", bk.id);
  }

  console.log(`Processed ${reminders24h?.length ?? 0} 24h reminders, ${reminders1h?.length ?? 0} 1h reminders`);
}

function shouldRunNow(cronExpr: string, now: Date): boolean {
  const [min, hour, day, month, weekday] = cronExpr.split(" ");

  const matches = (expr: string, value: number) => {
    if (expr === "*") return true;
    if (expr.includes("/")) {
      const [, step] = expr.split("/");
      return value % parseInt(step) === 0;
    }
    return parseInt(expr) === value;
  };

  return (
    matches(min, now.getUTCMinutes()) &&
    matches(hour, now.getUTCHours()) &&
    matches(day, now.getUTCDate()) &&
    matches(month, now.getUTCMonth() + 1) &&
    matches(weekday, now.getUTCDay())
  );
}
