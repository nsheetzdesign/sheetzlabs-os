import { useEffect, useRef, useCallback } from 'react';
import { useRevalidator } from 'react-router';

const API_URL = 'https://api.sheetzlabs.com';

interface UseEmailPollingOptions {
  enabled?: boolean;
  interval?: number; // milliseconds
  /** ISO timestamp of the newest email currently displayed */
  newestEmailAt?: string | null;
}

export function useEmailPolling({
  enabled = true,
  interval = 60_000,
  newestEmailAt,
}: UseEmailPollingOptions = {}) {
  const revalidator = useRevalidator();
  const sinceRef = useRef<string>(newestEmailAt ?? new Date().toISOString());
  const isPollingRef = useRef(false);
  const lastPollRef = useRef<number>(Date.now());

  // Keep sinceRef up to date as new emails load
  useEffect(() => {
    if (newestEmailAt && newestEmailAt > sinceRef.current) {
      sinceRef.current = newestEmailAt;
    }
  }, [newestEmailAt]);

  const poll = useCallback(async () => {
    if (isPollingRef.current) return;
    if (revalidator.state !== 'idle') return;

    isPollingRef.current = true;
    lastPollRef.current = Date.now();

    try {
      const res = await fetch(
        `${API_URL}/email/check-updates?since=${encodeURIComponent(sinceRef.current)}`
      );
      if (!res.ok) return;

      const data = (await res.json()) as { hasUpdates: boolean; newestAt?: string };

      if (data.hasUpdates) {
        if (data.newestAt) sinceRef.current = data.newestAt;
        revalidator.revalidate();
      }
    } catch {
      // network errors are expected when offline — ignore
    } finally {
      isPollingRef.current = false;
    }
  }, [revalidator]);

  // Set up interval polling
  useEffect(() => {
    if (!enabled) return;

    const id = setInterval(poll, interval);
    return () => clearInterval(id);
  }, [enabled, interval, poll]);

  // Poll immediately when the tab regains visibility after a long absence
  useEffect(() => {
    if (!enabled) return;

    const handleVisibility = () => {
      if (document.visibilityState !== 'visible') return;
      const elapsed = Date.now() - lastPollRef.current;
      if (elapsed >= interval) poll();
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [enabled, interval, poll]);

  return { poll };
}
