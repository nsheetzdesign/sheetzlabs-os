import { Hono } from "hono";
import { createClient } from "@supabase/supabase-js";
import { guestConfirmationEmail, hostNotificationEmail, cancellationEmail } from "../lib/booking-emails";
import { sendBookingEmail } from "../lib/send-booking-email";

type Bindings = {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  RESEND_API_KEY: string;
};

type HonoEnv = { Bindings: Bindings };

const booking = new Hono<HonoEnv>();

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

function parseTime(date: string, time: string): Date {
  const [hours, minutes] = time.split(":").map(Number);
  const d = new Date(date + "T00:00:00");
  d.setHours(hours, minutes, 0, 0);
  return d;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getValidAccessToken(
  account: Record<string, unknown>,
  env: Bindings,
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
  const body = await c.req.json();

  const { data, error } = await supabase
    .from("booking_links")
    .update({ ...body, updated_at: new Date().toISOString() })
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

  await supabase
    .from("bookings")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", bookingId);

  // Delete Google Calendar event
  if (bk.calendar_event_id) {
    try {
      const account = bk.booking_links.calendar_accounts as Record<string, unknown>;
      const accessToken = await getValidAccessToken(account, c.env, supabase);
      await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${bk.calendar_event_id}?sendUpdates=all`,
        { method: "DELETE", headers: { Authorization: `Bearer ${accessToken}` } }
      );
    } catch {
      // Calendar deletion failed — booking still cancelled
    }
  }

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
  await sendBookingEmail({ to: emailData.guestEmail, subject: guestCancellation.subject, html: guestCancellation.html, resendApiKey: c.env.RESEND_API_KEY });

  const hostCancellation = cancellationEmail(emailData, true, "host");
  await sendBookingEmail({ to: hostEmail, subject: hostCancellation.subject, html: hostCancellation.html, resendApiKey: c.env.RESEND_API_KEY });

  return c.json({ success: true });
});

// ── Public: Booking Flow ──────────────────────────────────────────────────────

// Get link info by slug (no auth)
booking.get("/public/:slug", async (c) => {
  const { slug } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: link, error } = await supabase
    .from("booking_links")
    .select("id, slug, title, description, duration_minutes, availability_rules, is_active, calendar_account_id")
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

  const rules = link.availability_rules as typeof DEFAULT_AVAILABILITY;
  const dayName = new Date(date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
  const dayRules = rules.days?.[dayName as keyof typeof rules.days];

  if (!dayRules?.enabled) return c.json({ slots: [] });

  // Fetch existing Google Calendar events for busy periods
  let busySlots: Array<{ start: Date; end: Date }> = [];
  try {
    const account = link.calendar_accounts as Record<string, unknown>;
    const accessToken = await getValidAccessToken(account, c.env, supabase);

    const startOfDay = new Date(date + "T00:00:00");
    const endOfDay = new Date(date + "T23:59:59");

    const calRes = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
        `timeMin=${startOfDay.toISOString()}&timeMax=${endOfDay.toISOString()}&singleEvents=true`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const calData = (await calRes.json()) as { items?: Array<{ start: { dateTime?: string; date?: string }; end: { dateTime?: string; date?: string } }> };
    busySlots = (calData.items ?? []).map((e) => ({
      start: new Date(e.start.dateTime ?? e.start.date ?? ""),
      end: new Date(e.end.dateTime ?? e.end.date ?? ""),
    }));
  } catch {
    // If we can't fetch calendar, still return slots (no conflicts)
  }

  // Generate available time slots
  const slots: string[] = [];
  const duration = link.duration_minutes as number;
  const bufferAfter = rules.buffer_after_minutes ?? 15;
  const minNoticeMs = (rules.minimum_notice_hours ?? 24) * 60 * 60 * 1000;
  const now = new Date();

  for (const slot of dayRules.slots) {
    let current = parseTime(date, slot.start);
    const slotEnd = parseTime(date, slot.end);

    while (current.getTime() + duration * 60000 <= slotEnd.getTime()) {
      const end = new Date(current.getTime() + duration * 60000);

      const hasConflict = busySlots.some(
        (busy) => current < busy.end && end > busy.start
      );
      const hasNotice = current.getTime() - now.getTime() >= minNoticeMs;

      if (!hasConflict && hasNotice) {
        slots.push(current.toISOString());
      }

      current = new Date(current.getTime() + (duration + bufferAfter) * 60000);
    }
  }

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

  await supabase
    .from("bookings")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", bookingId);

  // Delete Google Calendar event
  if (bk.calendar_event_id) {
    try {
      const account = bk.booking_links.calendar_accounts as Record<string, unknown>;
      const accessToken = await getValidAccessToken(account, c.env, supabase);
      await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${bk.calendar_event_id}?sendUpdates=all`,
        { method: "DELETE", headers: { Authorization: `Bearer ${accessToken}` } }
      );
    } catch {
      // Calendar deletion failed — booking still cancelled
    }
  }

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
  await sendBookingEmail({ to: emailData.guestEmail, subject: guestCancellation.subject, html: guestCancellation.html, resendApiKey: c.env.RESEND_API_KEY });

  const hostCancellation = cancellationEmail(emailData, true, "guest");
  await sendBookingEmail({ to: hostEmail, subject: hostCancellation.subject, html: hostCancellation.html, resendApiKey: c.env.RESEND_API_KEY });

  return c.json({ success: true });
});

// Create a booking
booking.post("/public/:slug", async (c) => {
  const { slug } = c.req.param();
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const body = await c.req.json<{
    guest_name: string;
    guest_email: string;
    guest_notes?: string;
    scheduled_at: string;
    timezone?: string;
  }>();

  if (!body.guest_name || !body.guest_email || !body.scheduled_at) {
    return c.json({ error: "Missing required fields" }, 400);
  }

  const { data: link } = await supabase
    .from("booking_links")
    .select("*, calendar_accounts(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!link) return c.json({ error: "Booking link not found" }, 404);

  const timezone = body.timezone ?? "America/Chicago";

  // Create booking record
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
      timezone,
      status: link.requires_confirmation ? "pending" : "confirmed",
    })
    .select()
    .single();

  if (bookingError) return c.json({ error: bookingError.message }, 500);

  // Create Google Calendar event
  try {
    const account = link.calendar_accounts as Record<string, unknown>;
    const accessToken = await getValidAccessToken(account, c.env, supabase);
    const eventEnd = new Date(new Date(body.scheduled_at).getTime() + (link.duration_minutes as number) * 60000);

    const gcalRes = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events?sendUpdates=all",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary: `${link.title} with ${body.guest_name}`,
          description: body.guest_notes ?? "",
          start: { dateTime: body.scheduled_at, timeZone: timezone },
          end: { dateTime: eventEnd.toISOString(), timeZone: timezone },
          attendees: [{ email: body.guest_email, displayName: body.guest_name }],
        }),
      }
    );

    if (gcalRes.ok) {
      const gcalData = (await gcalRes.json()) as { id?: string };
      if (gcalData.id) {
        await supabase
          .from("bookings")
          .update({ calendar_event_id: gcalData.id })
          .eq("id", newBooking.id);
      }
    }
  } catch {
    // Calendar event creation failed — booking still saved
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
    timezone,
    bookingId: newBooking.id,
    notes: body.guest_notes,
    cancelUrl: `https://app.sheetzlabs.com/book/cancel/${newBooking.id}`,
  };

  const guestEmail = guestConfirmationEmail(emailData);
  await sendBookingEmail({ to: body.guest_email, subject: guestEmail.subject, html: guestEmail.html, resendApiKey: c.env.RESEND_API_KEY });

  const hostEmail = hostNotificationEmail(emailData);
  await sendBookingEmail({ to: hostEmailAddr, subject: hostEmail.subject, html: hostEmail.html, resendApiKey: c.env.RESEND_API_KEY });

  return c.json({
    success: true,
    booking: {
      id: newBooking.id,
      scheduled_at: newBooking.scheduled_at,
      duration_minutes: newBooking.duration_minutes,
    },
  });
});

export default booking;
