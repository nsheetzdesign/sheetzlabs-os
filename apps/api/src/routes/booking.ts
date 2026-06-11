import { Hono } from "hono";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { guestConfirmationEmail, hostNotificationEmail, cancellationEmail, rescheduleConfirmationEmail } from "../lib/booking-emails";
import { sendBookingEmail } from "../lib/send-booking-email";
import { escapeHtml } from "../lib/escape";
import {
  computeSlotsForDate,
  zonedTimeToUtc,
  utcToZonedDateStr,
  type AvailabilityRules,
  type BusyInterval,
} from "../lib/slots";
import { getValidAccessToken as getGoogleAccessToken } from "../lib/google-auth";

interface RateLimit {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

type Bindings = {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  RESEND_API_KEY: string;
  BOOKING_RATE_LIMITER?: RateLimit;
  BOOKING_SLOTS_RATE_LIMITER?: RateLimit;
};

type HonoEnv = { Bindings: Bindings };

const booking = new Hono<HonoEnv>();

// ── Input validation (BK-4) ──────────────────────────────────────────────────

const bookingCreateSchema = z.object({
  guest_name: z.string().trim().min(1).max(120),
  guest_email: z.string().trim().email().max(254),
  guest_notes: z.string().max(2000).optional(),
  scheduled_at: z.string().datetime({ offset: true }),
  timezone: z.string().max(64).optional(),
});

const rescheduleSchema = z.object({
  scheduled_at: z.string().datetime({ offset: true }),
  timezone: z.string().max(64).optional(),
});

function zodErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

// ── Rate limiting (BK-5) ──────────────────────────────────────────────────────

/**
 * Returns true if the request is allowed. If no rate-limit binding is configured
 * (e.g. plan without the unsafe binding), fails open with a warning — see summary.
 */
async function checkRateLimit(limiter: RateLimit | undefined, key: string): Promise<boolean> {
  if (!limiter) return true;
  try {
    const { success } = await limiter.limit({ key });
    return success;
  } catch {
    return true;
  }
}

function clientIp(c: { req: { header: (n: string) => string | undefined } }): string {
  return c.req.header("CF-Connecting-IP") || c.req.header("x-forwarded-for") || "unknown";
}

// ── Busy-time fetch (fails closed, BK-3) ──────────────────────────────────────

/**
 * Fetch busy intervals for `date` (host-timezone calendar date). Returns ok:false on
 * any token/HTTP failure so callers fail closed (BK-3) rather than offering every slot
 * as free. Busy is the UNION of (BK-10/BK-11):
 *  - Google free/busy across ALL of the account's *visible* sub-calendars, queried via
 *    the freeBusy API. freeBusy intrinsically reports a calendar's effective busy
 *    blocks: `transparency:'transparent'` (free) events, all-day events, and events the
 *    host has declined are NOT counted as busy — matching Google's own availability
 *    semantics, which is exactly the BK-11 exclusion set (documented here).
 *  - LOCAL non-cancelled bookings for this account, so a booking whose Google event
 *    creation failed (BK-12, calendar_sync_failed) still blocks its slot.
 */
async function fetchBusyForDate(
  account: Record<string, unknown>,
  env: Bindings,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  date: string,
  tz: string
): Promise<{ ok: boolean; busy: BusyInterval[] }> {
  try {
    const accessToken = await getValidAccessToken(account, env, supabase);
    const startOfDay = zonedTimeToUtc(date, "00:00", tz);
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
    const accountId = account.id as string;

    // Visible sub-calendars for this account → freeBusy `items`. Fall back to the
    // primary calendar if none have been synced yet.
    const { data: subCals } = await supabase
      .from("calendar_sub_accounts")
      .select("external_id, is_visible")
      .eq("account_id", accountId);
    const calendarIds: string[] = (subCals ?? [])
      .filter((s: { is_visible?: boolean }) => s.is_visible !== false)
      .map((s: { external_id: string }) => s.external_id);
    if (calendarIds.length === 0) calendarIds.push("primary");

    const fbRes = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        timeMin: startOfDay.toISOString(),
        timeMax: endOfDay.toISOString(),
        items: calendarIds.map((id) => ({ id })),
      }),
    });

    if (!fbRes.ok) return { ok: false, busy: [] };

    const fb = (await fbRes.json()) as {
      calendars?: Record<string, { busy?: Array<{ start: string; end: string }> }>;
    };
    const busy: BusyInterval[] = [];
    for (const cal of Object.values(fb.calendars ?? {})) {
      for (const b of cal.busy ?? []) {
        busy.push({ start: new Date(b.start), end: new Date(b.end) });
      }
    }

    // Union local bookings (covers DB-only bookings whose gcal event failed).
    const { data: localBookings } = await supabase
      .from("bookings")
      .select("scheduled_at, duration_minutes")
      .eq("calendar_account_id", accountId)
      .neq("status", "cancelled")
      .gte("scheduled_at", new Date(startOfDay.getTime() - 24 * 60 * 60 * 1000).toISOString())
      .lte("scheduled_at", endOfDay.toISOString());
    for (const b of localBookings ?? []) {
      const start = new Date(b.scheduled_at as string);
      busy.push({
        start,
        end: new Date(start.getTime() + (b.duration_minutes as number) * 60000),
      });
    }

    return { ok: true, busy };
  } catch {
    return { ok: false, busy: [] };
  }
}

// ── Default availability ────────────────────────────────────────────────────

const DEFAULT_AVAILABILITY = {
  timezone: "America/Chicago",
  days: {
    monday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
    tuesday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
    wednesday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
    thursday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
    friday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
    saturday: { enabled: false, slots: [] },
    sunday: { enabled: false, slots: [] },
  },
  buffer_before_minutes: 0,
  buffer_after_minutes: 15,
  minimum_notice_hours: 24,
  date_range_days: 14,
};

// ── Helpers ─────────────────────────────────────────────────────────────────

// Delegates to the shared Google token helper (Prompt 52A Part 1 — CS-3).
function getValidAccessToken(
  account: Record<string, unknown>,
  env: Bindings,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any
): Promise<string> {
  return getGoogleAccessToken(account, env, supabase, "calendar_accounts");
}

/**
 * Best-effort delete of a booking's Google Calendar event. Returns true on success
 * (or if the event is already gone — 404/410), false on any token/HTTP failure so the
 * caller can flag `calendar_sync_failed` without aborting the DB-truth state change
 * (BK-9). Never throws.
 */
async function deleteGoogleEvent(
  account: Record<string, unknown>,
  eventId: string,
  env: Bindings,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any
): Promise<boolean> {
  try {
    const accessToken = await getValidAccessToken(account, env, supabase);
    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}?sendUpdates=all`,
      { method: "DELETE", headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (res.ok || res.status === 404 || res.status === 410) return true;
    console.error(`[booking] gcal delete ${eventId} failed: ${res.status}`);
    return false;
  } catch (err) {
    console.error(`[booking] gcal delete ${eventId} errored:`, err);
    return false;
  }
}

// ── Authenticated: Booking Link CRUD ─────────────────────────────────────────

booking.get("/links", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data } = await supabase
    .from("booking_links")
    .select("*, calendar_accounts(email, color, display_name)")
    .order("created_at", { ascending: false });
  return c.json({ links: data ?? [] });
});

booking.post("/links", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const body = await c.req.json<{
    calendar_account_id: string;
    slug: string;
    title: string;
    description?: string;
    duration_minutes: number;
    availability_rules?: object;
  }>();

  const cleanSlug = body.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-");

  const { data, error } = await supabase
    .from("booking_links")
    .insert({
      calendar_account_id: body.calendar_account_id,
      slug: cleanSlug,
      title: body.title,
      description: body.description ?? null,
      duration_minutes: body.duration_minutes,
      availability_rules: body.availability_rules ?? DEFAULT_AVAILABILITY,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return c.json({ error: "A booking link with this slug already exists" }, 400);
    }
    return c.json({ error: error.message }, 500);
  }

  return c.json({ link: data });
});

booking.patch("/links/:id", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const body = await c.req.json<{
    title?: string;
    description?: string;
    duration_minutes?: number;
    availability_rules?: object;
    is_active?: boolean;
  }>();

  // Explicit column allowlist — never trust the raw body (XC-1 mass assignment).
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.title !== undefined) updates.title = body.title;
  if (body.description !== undefined) updates.description = body.description;
  if (body.duration_minutes !== undefined) updates.duration_minutes = body.duration_minutes;
  if (body.availability_rules !== undefined) updates.availability_rules = body.availability_rules;
  if (body.is_active !== undefined) updates.is_active = body.is_active;

  const { data, error } = await supabase
    .from("booking_links")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return c.json({ error: error.message }, 500);
  return c.json({ link: data });
});

booking.delete("/links/:id", async (c) => {
  const { id } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  await supabase.from("booking_links").delete().eq("id", id);
  return c.json({ success: true });
});

// ── Authenticated: Booking management ────────────────────────────────────────

// List bookings for authenticated user
booking.get("/bookings", async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data } = await supabase
    .from("bookings")
    .select("*, booking_links(title, slug)")
    .order("scheduled_at", { ascending: true });
  return c.json({ bookings: data ?? [] });
});

// Host cancellation (authenticated)
booking.delete("/bookings/:bookingId", async (c) => {
  const { bookingId } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: bk, error } = await supabase
    .from("bookings")
    .select("*, booking_links(title, calendar_accounts(email, display_name, access_token, refresh_token, token_expires_at, id))")
    .eq("id", bookingId)
    .single();

  if (error || !bk) return c.json({ error: "Booking not found" }, 404);

  // 1. DB cancellation is the source of truth — abort on failure, nothing else fires.
  const { error: cancelErr } = await supabase
    .from("bookings")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", bookingId);
  if (cancelErr) return c.json({ error: cancelErr.message }, 500);

  // 2. Google delete is best-effort; flag (don't abort) if it fails.
  if (bk.calendar_event_id) {
    const account = bk.booking_links.calendar_accounts as Record<string, unknown>;
    const ok = await deleteGoogleEvent(account, bk.calendar_event_id as string, c.env, supabase);
    if (!ok) {
      await supabase.from("bookings").update({ calendar_sync_failed: true }).eq("id", bookingId);
    }
  }

  // 3. Emails — logged, never roll back the cancellation.
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

  const guestCancellation = cancellationEmail(emailData, false, "host");
  const gRes = await sendBookingEmail({ to: emailData.guestEmail, subject: guestCancellation.subject, html: guestCancellation.html, resendApiKey: c.env.RESEND_API_KEY });
  if (!gRes.ok) console.error(`[booking] guest cancel email failed for ${bookingId}: ${gRes.error}`);

  const hostCancellation = cancellationEmail(emailData, true, "host");
  const hRes = await sendBookingEmail({ to: hostEmail, subject: hostCancellation.subject, html: hostCancellation.html, resendApiKey: c.env.RESEND_API_KEY });
  if (!hRes.ok) console.error(`[booking] host cancel email failed for ${bookingId}: ${hRes.error}`);

  return c.json({ success: true });
});

// ── Public: rate limiting ─────────────────────────────────────────────────────
// Mutations (create / cancel / reschedule) are tightly limited per IP; slot
// display gets a looser limit. Keyed by CF-Connecting-IP.
booking.use("/public/*", async (c, next) => {
  const method = c.req.method;
  const path = c.req.path;
  const ip = clientIp(c);

  if (method === "POST") {
    const allowed = await checkRateLimit(c.env.BOOKING_RATE_LIMITER, `book:${ip}`);
    if (!allowed) return c.json({ error: "Too many requests. Please try again shortly." }, 429);
  } else if (path.endsWith("/slots")) {
    const allowed = await checkRateLimit(c.env.BOOKING_SLOTS_RATE_LIMITER, `slots:${ip}`);
    if (!allowed) return c.json({ error: "Too many requests. Please try again shortly." }, 429);
  }

  return next();
});

// ── Public: Booking Flow ──────────────────────────────────────────────────────

// Get link info by slug (no auth)
booking.get("/public/:slug", async (c) => {
  const { slug } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: link, error } = await supabase
    .from("booking_links")
    .select("id, slug, title, description, duration_minutes, availability_rules, is_active")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !link) return c.json({ error: "Booking link not found" }, 404);
  return c.json({ link });
});

// Get available slots for a date
booking.get("/public/:slug/slots", async (c) => {
  const { slug } = c.req.param();
  const date = c.req.query("date"); // YYYY-MM-DD
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  if (!date) return c.json({ error: "date parameter required" }, 400);

  const { data: link } = await supabase
    .from("booking_links")
    .select("*, calendar_accounts(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!link) return c.json({ error: "Booking link not found" }, 404);

  const rules = link.availability_rules as AvailabilityRules;
  const tz = rules.timezone || "America/Chicago";
  const duration = link.duration_minutes as number;

  // Fail closed: if we can't read the host's calendar, do NOT offer slots.
  const { ok, busy } = await fetchBusyForDate(
    link.calendar_accounts as Record<string, unknown>,
    c.env,
    supabase,
    date,
    tz
  );
  if (!ok) {
    return c.json({ error: "AVAILABILITY_UNAVAILABLE" }, 503);
  }

  const slots = computeSlotsForDate({ rules, date, durationMinutes: duration, busy });

  return c.json({ slots, date, duration: link.duration_minutes });
});

// Public booking lookup (for cancel page)
booking.get("/public/booking/:bookingId", async (c) => {
  const { bookingId } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: bk, error } = await supabase
    .from("bookings")
    .select("id, guest_name, guest_email, scheduled_at, duration_minutes, timezone, status, booking_links(title)")
    .eq("id", bookingId)
    .single();

  if (error || !bk) return c.json({ error: "Booking not found" }, 404);
  return c.json({ booking: bk });
});

// Guest cancellation (public, no auth)
booking.post("/public/cancel/:bookingId", async (c) => {
  const { bookingId } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: bk, error } = await supabase
    .from("bookings")
    .select("*, booking_links(title, calendar_accounts(email, display_name, access_token, refresh_token, token_expires_at, id))")
    .eq("id", bookingId)
    .single();

  if (error || !bk) return c.json({ error: "Booking not found" }, 404);
  if (bk.status === "cancelled") return c.json({ error: "Booking already cancelled" }, 400);

  // 1. DB cancellation first — abort on failure.
  const { error: cancelErr } = await supabase
    .from("bookings")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", bookingId);
  if (cancelErr) return c.json({ error: cancelErr.message }, 500);

  // 2. Google delete best-effort; flag on failure.
  if (bk.calendar_event_id) {
    const account = bk.booking_links.calendar_accounts as Record<string, unknown>;
    const ok = await deleteGoogleEvent(account, bk.calendar_event_id as string, c.env, supabase);
    if (!ok) {
      await supabase.from("bookings").update({ calendar_sync_failed: true }).eq("id", bookingId);
    }
  }

  // 3. Emails — logged, never roll back.
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

  const guestCancellation = cancellationEmail(emailData, false, "guest");
  const gRes = await sendBookingEmail({ to: emailData.guestEmail, subject: guestCancellation.subject, html: guestCancellation.html, resendApiKey: c.env.RESEND_API_KEY });
  if (!gRes.ok) console.error(`[booking] guest cancel email failed for ${bookingId}: ${gRes.error}`);

  const hostCancellation = cancellationEmail(emailData, true, "guest");
  const hRes = await sendBookingEmail({ to: hostEmail, subject: hostCancellation.subject, html: hostCancellation.html, resendApiKey: c.env.RESEND_API_KEY });
  if (!hRes.ok) console.error(`[booking] host cancel email failed for ${bookingId}: ${hRes.error}`);

  return c.json({ success: true });
});

// Create a booking
booking.post("/public/:slug", async (c) => {
  const { slug } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const parsed = bookingCreateSchema.safeParse(await c.req.json().catch(() => ({})));
  if (!parsed.success) {
    return c.json({ error: "Invalid input", fields: zodErrors(parsed.error) }, 422);
  }
  const body = parsed.data;

  // Strict instant parse (zod already enforced ISO; double-check it's a real date).
  const scheduledAt = new Date(body.scheduled_at);
  if (Number.isNaN(scheduledAt.getTime())) {
    return c.json({ error: "Invalid input", fields: { scheduled_at: "Invalid date" } }, 422);
  }

  const { data: link } = await supabase
    .from("booking_links")
    .select("*, calendar_accounts(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!link) return c.json({ error: "Booking link not found" }, 404);

  const guestTimezone = body.timezone ?? "America/Chicago";
  const rules = link.availability_rules as AvailabilityRules;
  const hostTz = rules.timezone || "America/Chicago";

  // Re-validate the requested time against live availability in the HOST tz (BK-1/2/3).
  const slotDate = utcToZonedDateStr(scheduledAt, hostTz);
  const { ok, busy } = await fetchBusyForDate(
    link.calendar_accounts as Record<string, unknown>,
    c.env,
    supabase,
    slotDate,
    hostTz
  );
  if (!ok) return c.json({ error: "AVAILABILITY_UNAVAILABLE" }, 503);

  const validSlots = computeSlotsForDate({
    rules,
    date: slotDate,
    durationMinutes: link.duration_minutes as number,
    busy,
  });
  const requestedMs = scheduledAt.getTime();
  if (!validSlots.some((s) => new Date(s).getTime() === requestedMs)) {
    return c.json({ error: "SLOT_UNAVAILABLE" }, 409);
  }

  // Create booking record. The partial unique index on (booking_link_id,
  // scheduled_at) WHERE status != 'cancelled' guards against the race.
  const { data: newBooking, error: bookingError } = await supabase
    .from("bookings")
    .insert({
      booking_link_id: link.id,
      calendar_account_id: link.calendar_account_id,
      guest_name: body.guest_name,
      guest_email: body.guest_email,
      guest_notes: body.guest_notes ?? null,
      scheduled_at: body.scheduled_at,
      duration_minutes: link.duration_minutes,
      timezone: guestTimezone,
      status: link.requires_confirmation ? "pending" : "confirmed",
    })
    .select()
    .single();

  if (bookingError) {
    if (bookingError.code === "23505") {
      return c.json({ error: "SLOT_UNAVAILABLE" }, 409);
    }
    return c.json({ error: bookingError.message }, 500);
  }

  // Create Google Calendar event with Meet link. If this fails the booking still
  // stands (DB is truth) but we flag calendar_sync_failed and leave meet_link null,
  // and the confirmation email drops the "calendar invite" copy (BK-12).
  let meetLink: string | null = null;
  let calendarEventCreated = false;
  try {
    const account = link.calendar_accounts as Record<string, unknown>;
    const accessToken = await getValidAccessToken(account, c.env, supabase);
    const eventEnd = new Date(new Date(body.scheduled_at).getTime() + (link.duration_minutes as number) * 60000);

    const gcalRes = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events?sendUpdates=all&conferenceDataVersion=1",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary: `${escapeHtml(link.title)} with ${escapeHtml(body.guest_name)}`,
          description: escapeHtml(body.guest_notes ?? ""),
          start: { dateTime: body.scheduled_at, timeZone: guestTimezone },
          end: { dateTime: eventEnd.toISOString(), timeZone: guestTimezone },
          attendees: [{ email: body.guest_email, displayName: body.guest_name }],
          conferenceData: {
            createRequest: {
              requestId: `booking-${newBooking.id}`,
              conferenceSolutionKey: { type: "hangoutsMeet" },
            },
          },
        }),
      }
    );

    if (gcalRes.ok) {
      const gcalData = (await gcalRes.json()) as {
        id?: string;
        conferenceData?: { entryPoints?: Array<{ entryPointType: string; uri: string }> };
      };
      meetLink = gcalData.conferenceData?.entryPoints?.find(
        (ep) => ep.entryPointType === "video"
      )?.uri ?? null;
      if (gcalData.id) {
        calendarEventCreated = true;
        await supabase
          .from("bookings")
          .update({ calendar_event_id: gcalData.id, meet_link: meetLink })
          .eq("id", newBooking.id);
      }
    } else {
      const text = await gcalRes.text().catch(() => "");
      console.error(`[booking] gcal event create failed (${gcalRes.status}) for ${newBooking.id}: ${text}`);
    }
  } catch (err) {
    console.error(`[booking] gcal event create errored for ${newBooking.id}:`, err);
  }

  if (!calendarEventCreated) {
    await supabase.from("bookings").update({ calendar_sync_failed: true }).eq("id", newBooking.id);
  }

  // Send confirmation emails
  const account = link.calendar_accounts as Record<string, unknown>;
  const hostName = (account.display_name as string) || (account.email as string).split("@")[0];
  const hostEmailAddr = account.email as string;

  const emailData = {
    guestName: body.guest_name,
    guestEmail: body.guest_email,
    hostName,
    hostEmail: hostEmailAddr,
    title: link.title as string,
    dateTime: new Date(body.scheduled_at),
    duration: link.duration_minutes as number,
    timezone: guestTimezone,
    bookingId: newBooking.id,
    notes: body.guest_notes,
    cancelUrl: `https://app.sheetzlabs.com/book/cancel/${newBooking.id}`,
    rescheduleUrl: `https://app.sheetzlabs.com/book/reschedule/${newBooking.id}`,
    meetLink: meetLink ?? undefined,
    // Drives the "a calendar invitation has been sent" copy — only true copy when
    // the Google event actually got created (BK-12).
    calendarInviteSent: calendarEventCreated,
  };

  const guestEmail = guestConfirmationEmail(emailData);
  const gRes = await sendBookingEmail({ to: body.guest_email, subject: guestEmail.subject, html: guestEmail.html, resendApiKey: c.env.RESEND_API_KEY });
  if (!gRes.ok) console.error(`[booking] guest confirmation email failed for ${newBooking.id}: ${gRes.error}`);

  const hostEmail = hostNotificationEmail(emailData);
  const hRes = await sendBookingEmail({ to: hostEmailAddr, subject: hostEmail.subject, html: hostEmail.html, resendApiKey: c.env.RESEND_API_KEY });
  if (!hRes.ok) console.error(`[booking] host notification email failed for ${newBooking.id}: ${hRes.error}`);

  return c.json({
    success: true,
    booking: {
      id: newBooking.id,
      scheduled_at: newBooking.scheduled_at,
      duration_minutes: newBooking.duration_minutes,
      meet_link: meetLink,
    },
  });
});

// ── Public: Reschedule Flow ───────────────────────────────────────────────────

// Get booking info for reschedule page
booking.get("/public/reschedule/:bookingId", async (c) => {
  const { bookingId } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: bk, error } = await supabase
    .from("bookings")
    .select("id, guest_name, scheduled_at, duration_minutes, timezone, status, booking_links(id, slug, title, duration_minutes, availability_rules)")
    .eq("id", bookingId)
    .single();

  if (error || !bk) return c.json({ error: "Booking not found" }, 404);
  if (bk.status === "cancelled") return c.json({ error: "Booking is cancelled" }, 400);

  // BK-17: don't over-expose. The reschedule page only needs date_range_days from
  // the rules and never reads guest_notes/guest_email — strip the rest.
  const link = bk.booking_links as unknown as {
    id: string;
    slug: string;
    title: string;
    duration_minutes: number;
    availability_rules: (AvailabilityRules & { date_range_days?: number }) | null;
  };
  const fullRules = (link?.availability_rules ?? {}) as AvailabilityRules & {
    date_range_days?: number;
  };
  const trimmed = {
    ...bk,
    booking_links: {
      ...link,
      availability_rules: {
        date_range_days: fullRules.date_range_days ?? 14,
        timezone: fullRules.timezone ?? "America/Chicago",
      },
    },
  };

  return c.json({ booking: trimmed });
});

// Reschedule a booking
booking.post("/public/reschedule/:bookingId", async (c) => {
  const { bookingId } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const parsed = rescheduleSchema.safeParse(await c.req.json().catch(() => ({})));
  if (!parsed.success) {
    return c.json({ error: "Invalid input", fields: zodErrors(parsed.error) }, 422);
  }
  const body = parsed.data;

  const newDateTime = new Date(body.scheduled_at);
  if (Number.isNaN(newDateTime.getTime())) {
    return c.json({ error: "Invalid input", fields: { scheduled_at: "Invalid date" } }, 422);
  }

  const { data: bk } = await supabase
    .from("bookings")
    .select("*, booking_links(id, title, availability_rules, calendar_accounts(email, display_name, access_token, refresh_token, token_expires_at, id))")
    .eq("id", bookingId)
    .single();

  if (!bk || bk.status === "cancelled") return c.json({ error: "Booking not found or cancelled" }, 404);

  const oldDateTime = new Date(bk.scheduled_at as string);
  const newTimezone = body.timezone ?? (bk.timezone as string);

  // Re-validate the new time against live availability in the host tz (BK-1/2/3).
  const rules = bk.booking_links.availability_rules as AvailabilityRules;
  const hostTz = rules.timezone || "America/Chicago";
  const slotDate = utcToZonedDateStr(newDateTime, hostTz);
  const { ok, busy } = await fetchBusyForDate(
    bk.booking_links.calendar_accounts as Record<string, unknown>,
    c.env,
    supabase,
    slotDate,
    hostTz
  );
  if (!ok) return c.json({ error: "AVAILABILITY_UNAVAILABLE" }, 503);

  const validSlots = computeSlotsForDate({
    rules,
    date: slotDate,
    durationMinutes: bk.duration_minutes as number,
    busy,
  });
  const requestedMs = newDateTime.getTime();
  if (!validSlots.some((s) => new Date(s).getTime() === requestedMs)) {
    return c.json({ error: "SLOT_UNAVAILABLE" }, 409);
  }

  // 1. DB update first (source of truth). Reset reminder claims so the new time
  //    re-arms both reminders (timestamp columns from migration 042).
  const { error: updateError } = await supabase
    .from("bookings")
    .update({
      scheduled_at: body.scheduled_at,
      timezone: newTimezone,
      updated_at: new Date().toISOString(),
      reminder_24h_sent_at: null,
      reminder_1h_sent_at: null,
    })
    .eq("id", bookingId);

  if (updateError) {
    if (updateError.code === "23505") {
      return c.json({ error: "SLOT_UNAVAILABLE" }, 409);
    }
    return c.json({ error: updateError.message }, 500);
  }

  // 2. Update Google Calendar event — best-effort; flag on failure, don't abort.
  if (bk.calendar_event_id) {
    let patchOk = false;
    try {
      const account = bk.booking_links.calendar_accounts as Record<string, unknown>;
      const accessToken = await getValidAccessToken(account, c.env, supabase);
      const eventEnd = new Date(newDateTime.getTime() + (bk.duration_minutes as number) * 60000);

      const patchRes = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${bk.calendar_event_id}?sendUpdates=all`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            start: { dateTime: body.scheduled_at, timeZone: newTimezone },
            end: { dateTime: eventEnd.toISOString(), timeZone: newTimezone },
          }),
        }
      );
      patchOk = patchRes.ok;
      if (!patchRes.ok) {
        const text = await patchRes.text().catch(() => "");
        console.error(`[booking] gcal reschedule patch failed (${patchRes.status}) for ${bookingId}: ${text}`);
      }
    } catch (err) {
      console.error(`[booking] gcal reschedule patch errored for ${bookingId}:`, err);
    }
    if (!patchOk) {
      await supabase.from("bookings").update({ calendar_sync_failed: true }).eq("id", bookingId);
    }
  }

  // 3. Emails — logged, never roll back.
  const hostEmail = bk.booking_links.calendar_accounts.email as string;
  const hostName = (bk.booking_links.calendar_accounts.display_name as string) || hostEmail.split("@")[0];

  const emailData = {
    guestName: bk.guest_name as string,
    guestEmail: bk.guest_email as string,
    hostName,
    hostEmail,
    title: bk.booking_links.title as string,
    dateTime: newDateTime,
    duration: bk.duration_minutes as number,
    timezone: newTimezone,
    bookingId: bk.id as string,
    meetLink: (bk.meet_link as string) ?? undefined,
  };

  const guestEmailContent = rescheduleConfirmationEmail(emailData, false, oldDateTime);
  const gRes = await sendBookingEmail({ to: emailData.guestEmail, subject: guestEmailContent.subject, html: guestEmailContent.html, resendApiKey: c.env.RESEND_API_KEY });
  if (!gRes.ok) console.error(`[booking] guest reschedule email failed for ${bookingId}: ${gRes.error}`);

  const hostEmailContent = rescheduleConfirmationEmail(emailData, true, oldDateTime);
  const hRes = await sendBookingEmail({ to: hostEmail, subject: hostEmailContent.subject, html: hostEmailContent.html, resendApiKey: c.env.RESEND_API_KEY });
  if (!hRes.ok) console.error(`[booking] host reschedule email failed for ${bookingId}: ${hRes.error}`);

  return c.json({ success: true });
});

export default booking;
