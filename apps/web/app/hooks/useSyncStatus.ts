import { useCallback, useRef, useState } from 'react';

/**
 * Central sync-health state for the inbox (Prompt 59 Part 3).
 *
 * Before this, the three sync paths — background polling (`useEmailPolling`),
 * window-focus sync, and the manual Refresh button — all silently swallowed
 * non-ok / thrown responses. A transient backend blip (429, a brief Google
 * outage, a token mid-refresh) therefore presented as a mysteriously frozen
 * inbox with nothing but console noise. This hook gives those paths one place to
 * report into, and the header a single visible indicator to render.
 *
 * Transient vs persistent: any single failure flips to `issue` (amber), but the
 * next successful poll/sync clears it (self-heal). Three consecutive failures is
 * treated as persistent; when the error is auth-shaped we additionally surface
 * the reconnect path. Reporting never schedules its own retries — the existing
 * 60s poll / 2-min focus throttles remain the only cadence, so there are no
 * retry storms.
 */
export type SyncState = 'synced' | 'syncing' | 'issue';

export interface SyncStatus {
  state: SyncState;
  /** Human-readable detail of the most recent failure (for hover/click). */
  error: string | null;
  /** The failure looks like a revoked/expired Google grant → offer reconnect. */
  isAuthError: boolean;
  /** Consecutive failure count; ≥3 is treated as persistent. */
  failures: number;
  /** True once a persistent, auth-shaped failure warrants the reconnect path. */
  suggestReconnect: boolean;
}

export interface SyncStatusApi extends SyncStatus {
  reportStart: () => void;
  reportSuccess: () => void;
  reportError: (message: string, opts?: { auth?: boolean }) => void;
}

const PERSISTENT_THRESHOLD = 3;

const SYNCED: SyncStatus = {
  state: 'synced',
  error: null,
  isAuthError: false,
  failures: 0,
  suggestReconnect: false,
};

export function useSyncStatus(): SyncStatusApi {
  const [status, setStatus] = useState<SyncStatus>(SYNCED);
  // Track consecutive failures in a ref too so concurrent reporters don't race on
  // a stale closure of `status.failures`.
  const failuresRef = useRef(0);

  const reportStart = useCallback(() => {
    // Don't clobber a standing issue with an optimistic "syncing" — but do show the
    // spinner while an explicit sync is in flight from a healthy state.
    setStatus((prev) => (prev.state === 'issue' ? prev : { ...SYNCED, state: 'syncing' }));
  }, []);

  const reportSuccess = useCallback(() => {
    failuresRef.current = 0;
    setStatus(SYNCED);
  }, []);

  const reportError = useCallback((message: string, opts?: { auth?: boolean }) => {
    failuresRef.current += 1;
    const failures = failuresRef.current;
    const auth = Boolean(opts?.auth);
    setStatus({
      state: 'issue',
      error: message || 'Sync failed',
      isAuthError: auth,
      failures,
      suggestReconnect: auth && failures >= PERSISTENT_THRESHOLD,
    });
  }, []);

  return { ...status, reportStart, reportSuccess, reportError };
}

/** Heuristic: does this failure look like a revoked/expired Google grant? */
export function looksLikeAuthError(status: number | null, body?: unknown): boolean {
  if (status === 401 || status === 403 || status === 409) return true;
  const text =
    typeof body === 'string'
      ? body
      : body && typeof body === 'object'
        ? JSON.stringify(body)
        : '';
  return /needs_reauth|reconnect|reauth|invalid_grant/i.test(text);
}
