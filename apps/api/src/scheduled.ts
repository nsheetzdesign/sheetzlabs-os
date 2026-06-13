import { createClient } from "@supabase/supabase-js";
import {
  executeAgent,
  postToLinkedIn,
  resolveAgentLimits,
  isDailyBudgetExceeded,
  resetStuckRuns,
} from "./lib/agent-engine";
import { reminderEmail } from "./lib/booking-emails";
import { sendBookingEmail } from "./lib/send-booking-email";
import { runEmailSync, processScheduledSends } from "./routes/email";
import { reconcileAccount } from "./lib/email-reconcile";
import { getValidAccessToken as getGoogleAccessToken, ReauthRequiredError } from "./lib/google-auth";
import { syncCalendarAccount } from "./lib/calendar-sync";

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

    const now = new Date(event.scheduledTime);

    // Run scheduled agents (AG-B1/B2/B3 — bounded launch, see runScheduledAgents).
    await runScheduledAgents(env, supabase, ctx, now);

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

    // Send due scheduled drafts + undo-send (+10s) drafts every minute, and
    // crash-recover any stuck "sending" rows (Prompt 54A Part 2).
    ctx.waitUntil(processScheduledSends(env, supabase).then(() => undefined));

    // Sweep expired OAuth state nonces every minute (Prompt 51B).
    ctx.waitUntil(
      Promise.resolve(
        supabase.from("oauth_states").delete().lt("expires_at", now.toISOString())
      )
    );

    // Purge undo breadcrumbs older than 24h every 15 minutes — the table grows on
    // every archive/trash/spam/snooze and is never otherwise pruned (NS-UNDO-1). The
    // empty-body "undo last" already enforces its own recency bound, so day-old rows
    // are dead weight.
    if (now.getUTCMinutes() % 15 === 0) {
      const undoCutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      ctx.waitUntil(
        Promise.resolve(
          supabase.from("email_undo_actions").delete().lt("created_at", undoCutoff)
        )
      );
    }

    // Auto-sync all email accounts every 5 minutes — call the sync logic directly
    // instead of HTTP-fetching our own (now-authenticated) endpoint.
    if (now.getUTCMinutes() % 5 === 0) {
      ctx.waitUntil(runEmailSync(env, supabase).then(() => undefined));
    }

    // Process booking reminders every 5 minutes
    if (now.getUTCMinutes() % 5 === 0) {
      ctx.waitUntil(processBookingReminders(env));
    }

    // Flip past confirmed bookings to "completed" every 15 minutes — feeds
    // analytics and clears them out of the host's "upcoming" view (Part E, XC-6).
    if (now.getUTCMinutes() % 15 === 0) {
      ctx.waitUntil(markCompletedBookings(supabase));
    }

    // Sync calendars every 15 minutes (CS-8). Gated by modulo on the single
    // every-minute trigger — consistent with the email/reminder cadence above and
    // avoids the double-invocation a second `wrangler.toml` trigger would cause at
    // minutes 0/15/30/45 (both triggers fire and the handler would run twice).
    if (now.getUTCMinutes() % 15 === 0) {
      ctx.waitUntil(syncAllCalendars(env, supabase));
    }

    // Gmail full-state reconciliation (Prompt 59). Weekly per account, but at most
    // ONE account per qualifying tick so the set-diff + metadata fetches never
    // contend with the email/calendar syncs for the shared subrequest budget. An
    // in-progress backlog (non-null reconcile_cursor) takes priority and continues
    // every 15 min until drained.
    if (now.getUTCMinutes() % 15 === 0) {
      ctx.waitUntil(reconcileNextAccount(env, supabase, now));
    }
  },
};

/**
 * Launch due scheduled agents safely (AG-B1/B2/B3, Prompt 65B):
 *   1. Stuck-`running` recovery — reset runs left running past the lease window to
 *      `failed` so a crashed run doesn't pin the dashboard or its agent claim forever
 *      (the claim itself auto-expires via running_until; this clears the orphan row).
 *   2. Daily spend ceiling — if any agent is due and today's spend is at the cap, skip
 *      the whole launch and record one visible marker (no per-agent skip-row spam).
 *   3. Per-agent try/catch — one agent's insert/launch failure never blocks the rest.
 * The run-overlap claim + per-run token/iteration caps live inside executeAgent.
 */
async function runScheduledAgents(
  env: Env,
  supabase: ReturnType<typeof createClient<any>>,
  ctx: ExecutionContext,
  now: Date
) {
  const limits = resolveAgentLimits(env);

  // (1) Crash recovery: unstick runs left "running" past the lease window.
  await resetStuckRuns(supabase, limits, now);

  const { data: agentsData, error: agentsErr } = await supabase
    .from("agents")
    .select("*")
    .eq("enabled", true)
    .not("schedule", "is", null);
  if (agentsErr) {
    console.error(`[agents-cron] agent query failed: ${agentsErr.message}`);
    return;
  }

  const due = (agentsData ?? []).filter((a) => shouldRunNow(a.schedule as string, now));
  if (!due.length) return;

  // (2) Daily spend ceiling — skip the whole batch when over budget, record once.
  if (await isDailyBudgetExceeded(supabase, limits)) {
    console.warn(`[agents-cron] daily spend cap reached — skipping ${due.length} due agent(s)`);
    await supabase.from("agent_runs").insert({
      agent_name: "__system__",
      status: "skipped",
      terminated_reason: "daily_budget",
      trigger_type: "scheduled",
      started_at: now.toISOString(),
      completed_at: now.toISOString(),
    });
    return;
  }

  // (3) Per-agent try/catch — isolate launch failures.
  for (const agent of due) {
    try {
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

      if (run) ctx.waitUntil(executeAgent(agent, run, {}, env, supabase));
    } catch (err) {
      console.error(`[agents-cron] launch failed for ${agent.slug}:`, err);
    }
  }
}

/**
 * Pick the single most-eligible email account and reconcile it (Prompt 59). An
 * account is eligible when it has an in-progress cursor, has never been reconciled,
 * or was last reconciled over a week ago. Eligibility is filtered in JS over the
 * tiny account set to sidestep the PostgREST `.or()` mutex pitfall. Cursor-active
 * accounts sort first (drain the backlog), then oldest-reconciled.
 */
async function reconcileNextAccount(
  env: Env,
  supabase: ReturnType<typeof createClient<any>>,
  now: Date
) {
  const { data: accounts, error } = await supabase
    .from("email_accounts")
    .select("*")
    .eq("sync_enabled", true)
    .eq("needs_reauth", false);

  if (error) {
    console.error(`[reconcile-cron] account query failed: ${error.message}`);
    return;
  }

  const weekAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;
  const eligible = (accounts ?? []).filter((a) => {
    if (a.reconcile_cursor) return true; // in-progress backlog — continue
    if (!a.last_reconciled_at) return true; // never reconciled
    return new Date(a.last_reconciled_at).getTime() < weekAgo;
  });
  if (!eligible.length) return;

  eligible.sort((a, b) => {
    // Cursor-active first.
    const ac = a.reconcile_cursor ? 0 : 1;
    const bc = b.reconcile_cursor ? 0 : 1;
    if (ac !== bc) return ac - bc;
    // Then oldest last_reconciled_at first (nulls — never reconciled — are oldest).
    const at = a.last_reconciled_at ? new Date(a.last_reconciled_at).getTime() : 0;
    const bt = b.last_reconciled_at ? new Date(b.last_reconciled_at).getTime() : 0;
    return at - bt;
  });

  const account = eligible[0];
  try {
    const result = await reconcileAccount(account, env, supabase);
    if (result.skipped) {
      console.warn(`[reconcile-cron] ${account.email} skipped: ${result.skipped}`);
    } else if (result.error) {
      console.error(`[reconcile-cron] ${account.email} failed: ${result.error}`);
    } else {
      const s = result.summary;
      console.log(
        `[reconcile-cron] ${account.email}: folder=${s.folder_fixed} read=${s.read_fixed} ` +
          `star=${s.starred_fixed} del=${s.deleted} missing=${s.missing_local} ` +
          `(complete=${result.complete}, pending=${result.pending})`
      );
    }
  } catch (err) {
    console.error(`[reconcile-cron] ${account.email} threw:`, err);
  }
}

/**
 * Calendar sync cron (CS-8). One try/catch per account so a single failing or
 * reauth-needed account never blocks the rest; syncCalendarAccount records
 * last_sync_at / sync_error / needs_reauth on the account row itself.
 */
async function syncAllCalendars(env: Env, supabase: ReturnType<typeof createClient<any>>) {
  const { data: accounts, error } = await supabase
    .from("calendar_accounts")
    .select("*")
    .eq("sync_enabled", true);

  if (error) {
    console.error(`[calendar-cron] account query failed: ${error.message}`);
    return;
  }

  for (const account of accounts ?? []) {
    if (account.needs_reauth) continue; // don't burn a refresh on a revoked account
    try {
      const result = await syncCalendarAccount(
        account as Record<string, unknown>,
        env,
        supabase
      );
      console.log(
        `[calendar-cron] ${account.email}: +${result.synced} −${result.deleted} ` +
          `(${result.calendars} cals, complete=${result.complete})`
      );
    } catch (err) {
      if (err instanceof ReauthRequiredError) {
        console.warn(`[calendar-cron] ${err.email} needs reauth; skipped`);
        continue; // row already flagged by getValidAccessToken
      }
      const msg = err instanceof Error ? err.message : "Unknown error";
      console.error(`[calendar-cron] ${account.email} sync failed: ${msg}`);
      await supabase
        .from("calendar_accounts")
        .update({ sync_status: "error", sync_error: msg })
        .eq("id", account.id);
    }
  }
}

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

/**
 * Idempotent booking reminders (BK-6). For each window the flow is:
 *   1. select candidate bookings whose `reminder_*_sent_at` is still NULL;
 *   2. atomically CLAIM each one — `UPDATE ... SET ..._sent_at = now()
 *      WHERE id = $1 AND ..._sent_at IS NULL RETURNING id`. Zero rows back means a
 *      concurrent invocation already owns it → skip (no duplicate);
 *   3. send via Resend and inspect the `{ error }` result;
 *   4. if the guest send fails, CLEAR the claim so the next run retries (no false
 *      "sent"). The host send is best-effort — a host failure is logged but keeps
 *      the claim so we don't loop resending the guest.
 * Each booking is wrapped in its own try/catch: a null calendar_accounts join (a
 * deleted account) skips just that row with a log and never aborts the loop.
 */
async function processBookingReminders(env: Env) {
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
  const now = new Date();

  const sent24h = await sendRemindersForWindow(env, supabase, {
    column: "reminder_24h_sent_at",
    hoursUntil: 24,
    windowStart: new Date(now.getTime() + 23 * 60 * 60 * 1000),
    windowEnd: new Date(now.getTime() + 25 * 60 * 60 * 1000),
  });

  const sent1h = await sendRemindersForWindow(env, supabase, {
    column: "reminder_1h_sent_at",
    hoursUntil: 1,
    windowStart: new Date(now.getTime() + 55 * 60 * 1000),
    windowEnd: new Date(now.getTime() + 65 * 60 * 1000),
  });

  console.log(`Processed ${sent24h} 24h reminders, ${sent1h} 1h reminders`);
}

async function sendRemindersForWindow(
  env: Env,
  supabase: ReturnType<typeof createClient<any>>,
  opts: {
    column: "reminder_24h_sent_at" | "reminder_1h_sent_at";
    hoursUntil: number;
    windowStart: Date;
    windowEnd: Date;
  }
): Promise<number> {
  const { column, hoursUntil, windowStart, windowEnd } = opts;

  // Bounded + ordered: one cycle can't exhaust the shared Workers subrequest budget
  // (NS-CRON-1). Soonest-first so a backlog drains in time order; the carryover is
  // picked up next minute (claims are idempotent).
  const { data: candidates, error } = await supabase
    .from("bookings")
    .select("*, booking_links(title, calendar_accounts(email, display_name))")
    .eq("status", "confirmed")
    .is(column, null)
    .gte("scheduled_at", windowStart.toISOString())
    .lte("scheduled_at", windowEnd.toISOString())
    .order("scheduled_at", { ascending: true })
    .limit(100);

  if (error) {
    console.error(`[reminders] ${column} select failed: ${error.message}`);
    return 0;
  }

  let sent = 0;
  for (const bk of candidates ?? []) {
    try {
      // Join-null-safe: a deleted calendar account leaves this null — skip, don't crash.
      const account = bk.booking_links?.calendar_accounts;
      if (!account?.email) {
        console.warn(`[reminders] booking ${bk.id} has no host account; skipping`);
        continue;
      }

      // Atomic claim: only one invocation flips NULL → now().
      const { data: claimed, error: claimErr } = await supabase
        .from("bookings")
        .update({ [column]: new Date().toISOString() })
        .eq("id", bk.id)
        .is(column, null)
        .select("id");
      if (claimErr) {
        console.error(`[reminders] claim failed for ${bk.id}: ${claimErr.message}`);
        continue;
      }
      if (!claimed?.length) continue; // another run owns it

      const hostEmail = account.email as string;
      const hostName = (account.display_name as string) || hostEmail.split("@")[0];
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

      const guestReminder = reminderEmail(emailData, false, hoursUntil);
      const guestRes = await sendBookingEmail({
        to: emailData.guestEmail,
        subject: guestReminder.subject,
        html: guestReminder.html,
        resendApiKey: env.RESEND_API_KEY,
      });

      if (!guestRes.ok) {
        // Release the claim so the next run retries — never leave a false "sent".
        await supabase.from("bookings").update({ [column]: null }).eq("id", bk.id);
        console.error(`[reminders] guest send failed for ${bk.id}: ${guestRes.error}; claim cleared`);
        continue;
      }

      const hostReminder = reminderEmail(emailData, true, hoursUntil);
      const hostRes = await sendBookingEmail({
        to: hostEmail,
        subject: hostReminder.subject,
        html: hostReminder.html,
        resendApiKey: env.RESEND_API_KEY,
      });
      if (!hostRes.ok) {
        console.error(`[reminders] host send failed for ${bk.id}: ${hostRes.error} (claim kept)`);
      }

      sent++;
    } catch (err) {
      console.error(`[reminders] booking ${bk.id} errored:`, err);
    }
  }

  return sent;
}

/**
 * Mark confirmed bookings whose end time (`scheduled_at` + duration) is in the
 * past as `completed` (Part E). PostgREST can't express the duration arithmetic
 * in a filter, so we pull recently-past confirmed rows and finish the check in
 * JS, then batch-update by id.
 */
async function markCompletedBookings(supabase: ReturnType<typeof createClient<any>>) {
  const now = new Date();
  const { data, error } = await supabase
    .from("bookings")
    .select("id, scheduled_at, duration_minutes")
    .eq("status", "confirmed")
    .lte("scheduled_at", now.toISOString())
    .order("scheduled_at", { ascending: true }) // oldest backlog first (NS-CRON-1)
    .limit(500);

  if (error) {
    console.error(`[bookings-complete] query failed: ${error.message}`);
    return;
  }

  const due = (data ?? [])
    .filter(
      (b: { scheduled_at: string; duration_minutes: number }) =>
        new Date(b.scheduled_at).getTime() + b.duration_minutes * 60000 <= now.getTime()
    )
    .map((b: { id: string }) => b.id);

  if (!due.length) return;

  const { error: upErr } = await supabase
    .from("bookings")
    .update({ status: "completed", updated_at: now.toISOString() })
    .in("id", due);
  if (upErr) console.error(`[bookings-complete] update failed: ${upErr.message}`);
  else console.log(`[bookings-complete] marked ${due.length} completed`);
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
