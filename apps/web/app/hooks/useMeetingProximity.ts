import { useEffect, useState } from "react";
import {
  meetingProximity,
  type ProximityEvent,
  type ProximityResult,
} from "~/lib/meeting-proximity";

const CLEAR: ProximityResult = { level: "clear", title: null, startAt: null };

/**
 * Client-side meeting-proximity for the Calendar nav dot (Prompt 68).
 *
 * SSR-safe: renders "clear" until mounted (so server + first client render agree,
 * no hydration mismatch), then recomputes from the already-loaded `events` on a
 * 30s interval and on window focus — no extra API calls; the events come from the
 * dashboard loader and refresh on navigation/revalidation.
 */
export function useMeetingProximity(events: ProximityEvent[]): ProximityResult {
  const [result, setResult] = useState<ProximityResult>(CLEAR);

  useEffect(() => {
    const recompute = () => setResult(meetingProximity(Date.now(), events));
    recompute();
    const id = window.setInterval(recompute, 30_000);
    window.addEventListener("focus", recompute);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("focus", recompute);
    };
  }, [events]);

  return result;
}
