/**
 * Minimal ntfy publisher (Repos & GitHub Actions module).
 *
 * Posts a notification to the Sheetz Labs ntfy topic. Modeled on the
 * `sendBookingEmail` contract — returns a structured `{ ok, error }` instead of
 * throwing, so the caller (the failure-alert claim) can decide whether to release
 * its claim and retry.
 *
 * DEGRADES TO A NO-OP when `NTFY_TOPIC` is unset: the module never hard-fails just
 * because alerting isn't configured. A no-op returns `ok: true` with `skipped: true`.
 *
 * ntfy's HTTP headers (Title/Priority/Tags/Click) are ASCII-only — emoji belong in
 * `Tags` (ntfy renders e.g. `x` → ❌), never the Title.
 */

export interface NtfyResult {
  ok: boolean;
  error: string | null;
  /** True when NTFY_TOPIC was unset and the send was skipped (a successful no-op). */
  skipped?: boolean;
}

export interface NtfyEnv {
  NTFY_URL?: string;
  NTFY_TOPIC?: string;
}

interface NtfyParams {
  env: NtfyEnv;
  title: string;
  message: string;
  priority?: "min" | "low" | "default" | "high" | "urgent";
  tags?: string[];
  /** URL opened when the notification is tapped. */
  click?: string;
}

export async function sendNtfy({
  env,
  title,
  message,
  priority,
  tags,
  click,
}: NtfyParams): Promise<NtfyResult> {
  const topic = env.NTFY_TOPIC?.trim();
  if (!topic) {
    // Not configured — degrade to a no-op (never hard-fail).
    return { ok: true, error: null, skipped: true };
  }

  const base = (env.NTFY_URL?.trim() || "https://ntfy.sh").replace(/\/+$/, "");

  try {
    const headers: Record<string, string> = { Title: title };
    if (priority) headers.Priority = priority;
    if (tags?.length) headers.Tags = tags.join(",");
    if (click) headers.Click = click;

    const res = await fetch(`${base}/${topic}`, {
      method: "POST",
      headers,
      body: message,
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return { ok: false, error: `ntfy ${res.status}: ${body.slice(0, 200)}` };
    }
    return { ok: true, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown ntfy error";
    console.error("ntfy publish failed:", msg);
    return { ok: false, error: msg };
  }
}
