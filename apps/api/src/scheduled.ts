import { createClient } from "@supabase/supabase-js";
import { executeAgent, postToLinkedIn } from "./lib/agent-engine";
import { reminderEmail } from "./lib/booking-emails";
import { sendBookingEmail } from "./lib/send-booking-email";

type Env = {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  ANTHROPIC_API_KEY: string;
  LINKEDIN_ACCESS_TOKEN: string;
  LINKEDIN_PERSON_ID: string;
  CLOUDFLARE_BILLING_TOKEN: string;
  CLOUDFLARE_ACCOUNT_ID: string;
  API_URL: string;
  RESEND_API_KEY: string;
};

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
      ctx.waitUntil(fetch(`${apiUrl}/analytics/snapshot`, { method: "POST" }));
    }

    // Unsnooze emails every minute
    ctx.waitUntil(Promise.resolve(supabase.rpc("unsnooze_emails")));

    // Auto-sync all email accounts every 5 minutes
    if (now.getUTCMinutes() % 5 === 0) {
      const apiUrl = env.API_URL ?? "https://api.sheetzlabs.com";
      ctx.waitUntil(fetch(`${apiUrl}/email/sync`, { method: "POST" }));
    }

    // Process booking reminders every 5 minutes
    if (now.getUTCMinutes() % 5 === 0) {
      ctx.waitUntil(processBookingReminders(env));
    }
  },
};

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
      await fetch(`${apiUrl}/knowledge/feeds/${feed.id}/fetch`, { method: "POST" });
    } catch {
      // continue with remaining feeds
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
