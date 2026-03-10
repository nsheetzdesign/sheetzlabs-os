export interface BookingEmailData {
  guestName: string;
  guestEmail: string;
  hostName: string;
  hostEmail: string;
  title: string;
  dateTime: Date;
  duration: number;
  timezone: string;
  bookingId: string;
  notes?: string;
  cancelUrl?: string;
}

export function formatDateTime(date: Date, timezone: string): { date: string; time: string } {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: timezone,
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
    timeZone: timezone,
  };

  return {
    date: date.toLocaleDateString("en-US", options),
    time: date.toLocaleTimeString("en-US", timeOptions),
  };
}

export function guestConfirmationEmail(data: BookingEmailData): { subject: string; html: string } {
  const { date, time } = formatDateTime(data.dateTime, data.timezone);

  return {
    subject: `Confirmed: ${data.title} with ${data.hostName}`,
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #09090b; color: #fafafa; padding: 40px 20px; margin: 0;">
  <div style="max-width: 480px; margin: 0 auto;">
    <div style="background-color: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 32px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="width: 48px; height: 48px; background-color: rgba(16, 185, 129, 0.2); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
          <span style="color: #10b981; font-size: 24px;">✓</span>
        </div>
      </div>
      <h1 style="color: #fafafa; font-size: 24px; font-weight: 600; text-align: center; margin: 0 0 8px 0;">Booking Confirmed</h1>
      <p style="color: #a1a1aa; text-align: center; margin: 0 0 32px 0;">You're scheduled with ${data.hostName}</p>
      <div style="background-color: #27272a; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <h2 style="color: #fafafa; font-size: 16px; font-weight: 600; margin: 0 0 16px 0;">${data.title}</h2>
        <div style="color: #a1a1aa; font-size: 14px;">
          <p style="margin: 0 0 8px 0;">📅 ${date}</p>
          <p style="margin: 0 0 8px 0;">🕐 ${time} · ${data.duration} minutes</p>
        </div>
      </div>
      ${data.notes ? `<div style="background-color: #27272a; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <p style="color: #a1a1aa; font-size: 12px; margin: 0 0 4px 0;">Your notes:</p>
        <p style="color: #d4d4d8; font-size: 14px; margin: 0;">${data.notes}</p>
      </div>` : ""}
      <p style="color: #71717a; font-size: 12px; text-align: center; margin: 24px 0 0 0;">A calendar invitation has been sent to your email.</p>
      ${data.cancelUrl ? `<p style="text-align: center; margin-top: 24px;">
        <a href="${data.cancelUrl}" style="color: #ef4444; font-size: 12px; text-decoration: none;">Cancel this booking</a>
      </p>` : ""}
    </div>
    <p style="color: #52525b; font-size: 11px; text-align: center; margin-top: 24px;">Powered by Sheetz Labs</p>
  </div>
</body>
</html>`,
  };
}

export function hostNotificationEmail(data: BookingEmailData): { subject: string; html: string } {
  const { date, time } = formatDateTime(data.dateTime, data.timezone);

  return {
    subject: `New booking: ${data.title} with ${data.guestName}`,
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #09090b; color: #fafafa; padding: 40px 20px; margin: 0;">
  <div style="max-width: 480px; margin: 0 auto;">
    <div style="background-color: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 32px;">
      <h1 style="color: #fafafa; font-size: 20px; font-weight: 600; margin: 0 0 24px 0;">📅 New Booking</h1>
      <div style="background-color: #27272a; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <h2 style="color: #fafafa; font-size: 16px; font-weight: 600; margin: 0 0 16px 0;">${data.title}</h2>
        <div style="color: #a1a1aa; font-size: 14px;">
          <p style="margin: 0 0 8px 0;">👤 ${data.guestName}</p>
          <p style="margin: 0 0 8px 0;">✉️ ${data.guestEmail}</p>
          <p style="margin: 0 0 8px 0;">📅 ${date}</p>
          <p style="margin: 0;">🕐 ${time} · ${data.duration} minutes</p>
        </div>
      </div>
      ${data.notes ? `<div style="background-color: #27272a; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <p style="color: #a1a1aa; font-size: 12px; margin: 0 0 4px 0;">Guest notes:</p>
        <p style="color: #d4d4d8; font-size: 14px; margin: 0;">${data.notes}</p>
      </div>` : ""}
      <a href="https://app.sheetzlabs.com/dashboard/calendar" style="display: block; background-color: #10b981; color: white; text-align: center; padding: 12px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 500;">View in Calendar</a>
    </div>
  </div>
</body>
</html>`,
  };
}

export function reminderEmail(
  data: BookingEmailData,
  isHost: boolean,
  hoursUntil: number
): { subject: string; html: string } {
  const { date, time } = formatDateTime(data.dateTime, data.timezone);
  const recipientName = isHost ? data.hostName : data.guestName;
  const otherParty = isHost ? data.guestName : data.hostName;
  const timeLabel = hoursUntil === 24 ? "tomorrow" : "in 1 hour";

  return {
    subject: `Reminder: ${data.title} ${timeLabel}`,
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #09090b; color: #fafafa; padding: 40px 20px; margin: 0;">
  <div style="max-width: 480px; margin: 0 auto;">
    <div style="background-color: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 32px;">
      <h1 style="color: #fafafa; font-size: 20px; font-weight: 600; margin: 0 0 8px 0;">⏰ Meeting ${timeLabel}</h1>
      <p style="color: #a1a1aa; margin: 0 0 24px 0;">Hi ${recipientName.split(" ")[0]}, just a reminder about your upcoming meeting.</p>
      <div style="background-color: #27272a; border-radius: 8px; padding: 20px;">
        <h2 style="color: #fafafa; font-size: 16px; font-weight: 600; margin: 0 0 16px 0;">${data.title}</h2>
        <div style="color: #a1a1aa; font-size: 14px;">
          <p style="margin: 0 0 8px 0;">👤 with ${otherParty}</p>
          <p style="margin: 0 0 8px 0;">📅 ${date}</p>
          <p style="margin: 0;">🕐 ${time} · ${data.duration} minutes</p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`,
  };
}

export function cancellationEmail(
  data: BookingEmailData,
  isHost: boolean,
  cancelledBy: "host" | "guest"
): { subject: string; html: string } {
  const { date, time } = formatDateTime(data.dateTime, data.timezone);

  return {
    subject: `Cancelled: ${data.title}`,
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #09090b; color: #fafafa; padding: 40px 20px; margin: 0;">
  <div style="max-width: 480px; margin: 0 auto;">
    <div style="background-color: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 32px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="width: 48px; height: 48px; background-color: rgba(239, 68, 68, 0.2); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
          <span style="color: #ef4444; font-size: 24px;">✕</span>
        </div>
      </div>
      <h1 style="color: #fafafa; font-size: 20px; font-weight: 600; text-align: center; margin: 0 0 8px 0;">Booking Cancelled</h1>
      <p style="color: #a1a1aa; text-align: center; margin: 0 0 24px 0;">This meeting has been cancelled${cancelledBy === "guest" ? " by the guest" : ""}.</p>
      <div style="background-color: #27272a; border-radius: 8px; padding: 20px; opacity: 0.7;">
        <h2 style="color: #a1a1aa; font-size: 16px; font-weight: 600; margin: 0 0 16px 0; text-decoration: line-through;">${data.title}</h2>
        <div style="color: #71717a; font-size: 14px;">
          <p style="margin: 0 0 8px 0;">📅 ${date}</p>
          <p style="margin: 0;">🕐 ${time}</p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`,
  };
}
