import { Resend } from "resend";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  resendApiKey: string;
  from?: string;
}

export async function sendBookingEmail({ to, subject, html, resendApiKey, from }: SendEmailParams): Promise<boolean> {
  try {
    const resend = new Resend(resendApiKey);
    await resend.emails.send({
      from: from || "Sheetz Labs <bookings@sheetzlabs.com>",
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error("Failed to send booking email:", error);
    return false;
  }
}
