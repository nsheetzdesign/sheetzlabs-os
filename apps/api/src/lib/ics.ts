/**
 * iCalendar (.ics) generation + "add to calendar" URL builders (Prompt 54B, BK-15/18).
 *
 * Produces an RFC 5545 VCALENDAR with a single VEVENT so a guest can import the
 * booking into Google Calendar, Apple Calendar, or Outlook. Times are emitted in
 * UTC ("Z") to avoid any VTIMEZONE bookkeeping. The same data drives the
 * google/outlook deep-link URLs used in the confirmation page + emails.
 */

export interface IcsEvent {
  uid: string;
  start: Date;
  end: Date;
  summary: string;
  description?: string;
  location?: string;
  organizerName?: string;
  organizerEmail?: string;
  attendeeName?: string;
  attendeeEmail?: string;
  /** When set (cancelled bookings), emits STATUS:CANCELLED + METHOD:CANCEL. */
  cancelled?: boolean;
  /** Injectable for deterministic tests; defaults to `start` (DTSTAMP must exist). */
  dtstamp?: Date;
}

/** UTC basic-format timestamp: 20260612T140000Z. */
function fmt(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/**
 * Escape per RFC 5545 §3.3.11 (text value): backslash, comma, semicolon, newline.
 * Critically, ALL line breaks — CRLF, lone CR, lone LF — collapse to the escaped
 * `\n` sequence. A bare `\r` left unescaped (the old gap, NS-ICS-1) is treated by
 * lenient parsers as a line boundary, letting a guest name/notes inject arbitrary
 * VEVENT properties. Remaining C0 control chars are stripped — they have no valid
 * place in a text value and only serve to confuse parsers.
 */
function esc(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/\r\n|\r|\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;")
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, "");
}

/**
 * Fold lines to ≤75 OCTETS per RFC 5545 §3.1 (CRLF + leading-space continuation).
 * Counts UTF-8 bytes (not UTF-16 code units) and never splits a multi-byte char,
 * so non-ASCII guest names fold correctly (NS-ICS-2). The leading space on a
 * continuation line counts toward its 75-octet budget, hence 74 octets of content.
 */
function fold(line: string): string {
  const enc = new TextEncoder();
  if (enc.encode(line).length <= 75) return line;
  const out: string[] = [];
  let cur = "";
  let curBytes = 0;
  let first = true;
  for (const ch of line) {
    const chBytes = enc.encode(ch).length;
    const budget = first ? 75 : 74;
    if (curBytes + chBytes > budget) {
      out.push(first ? cur : " " + cur);
      first = false;
      cur = ch;
      curBytes = chBytes;
    } else {
      cur += ch;
      curBytes += chBytes;
    }
  }
  if (cur) out.push(first ? cur : " " + cur);
  return out.join("\r\n");
}

export function buildIcs(ev: IcsEvent): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Sheetz Labs//Booking//EN",
    "CALSCALE:GREGORIAN",
    ev.cancelled ? "METHOD:CANCEL" : "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${ev.uid}`,
    `DTSTAMP:${fmt(ev.dtstamp ?? ev.start)}`,
    `DTSTART:${fmt(ev.start)}`,
    `DTEND:${fmt(ev.end)}`,
    `SUMMARY:${esc(ev.summary)}`,
  ];
  if (ev.description) lines.push(`DESCRIPTION:${esc(ev.description)}`);
  if (ev.location) lines.push(`LOCATION:${esc(ev.location)}`);
  if (ev.organizerEmail) {
    const cn = ev.organizerName ? `;CN=${esc(ev.organizerName)}` : "";
    lines.push(`ORGANIZER${cn}:mailto:${ev.organizerEmail}`);
  }
  if (ev.attendeeEmail) {
    const cn = ev.attendeeName ? `;CN=${esc(ev.attendeeName)}` : "";
    lines.push(`ATTENDEE${cn};RSVP=TRUE:mailto:${ev.attendeeEmail}`);
  }
  lines.push(`STATUS:${ev.cancelled ? "CANCELLED" : "CONFIRMED"}`);
  lines.push("SEQUENCE:0");
  lines.push("END:VEVENT");
  lines.push("END:VCALENDAR");
  return lines.map(fold).join("\r\n") + "\r\n";
}

/** Compact UTC range Google/Outlook deep links expect: 20260612T140000Z/20260612T143000Z. */
function range(start: Date, end: Date): string {
  return `${fmt(start)}/${fmt(end)}`;
}

export function googleCalendarUrl(ev: {
  summary: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
}): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: ev.summary,
    dates: range(ev.start, ev.end),
  });
  if (ev.description) params.set("details", ev.description);
  if (ev.location) params.set("location", ev.location);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function outlookCalendarUrl(ev: {
  summary: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
}): string {
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: ev.summary,
    startdt: ev.start.toISOString(),
    enddt: ev.end.toISOString(),
  });
  if (ev.description) params.set("body", ev.description);
  if (ev.location) params.set("location", ev.location);
  return `https://outlook.office.com/calendar/0/deeplink/compose?${params.toString()}`;
}
