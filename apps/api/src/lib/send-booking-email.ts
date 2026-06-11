import { Resend } from "resend";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  resendApiKey: string;
  from?: string;
}

export interface SendEmailResult {
  ok: boolean;
  error: string | null;
}

/**
 * Send a booking email via Resend. Returns a structured result instead of a bare
 * boolean (BK-6): the Resend SDK reports delivery failures via a `{ error }` payload
 * (it does NOT throw on a 4xx), so a thrown-only check silently marked failed sends
 * as successful. The reminder pipeline relies on this to clear its claim and retry.
 */
export async function sendBookingEmail({
  to,
  subject,
  html,
  resendApiKey,
  from,
}: SendEmailParams): Promise<SendEmailResult> {
  try {
    const resend = new Resend(resendApiKey);
    const { error } = await resend.emails.send({
      from: from || "Sheetz Labs <bookings@sheetzlabs.com>",
      to,
      subject,
      html,
    });
    if (error) {
      console.error("Resend rejected booking email:", error);
      return { ok: false, error: error.message ?? "Resend error" };
    }
    return { ok: true, error: null };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown send error";
    console.error("Failed to send booking email:", msg);
    return { ok: false, error: msg };
  }
}
