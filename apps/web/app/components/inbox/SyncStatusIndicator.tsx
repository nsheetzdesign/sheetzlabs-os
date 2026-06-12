import { useState } from 'react';
import { Form } from 'react-router';
import { Check, CircleAlert, RefreshCw } from 'lucide-react';
import type { SyncStatus } from '~/hooks/useSyncStatus';

/**
 * Visible sync-health chip for the inbox header (Prompt 59 Part 3).
 *
 *  - synced:  quiet — a muted check, no call to action.
 *  - syncing: a spinner with "Syncing".
 *  - issue:   amber "Sync issue" + Retry; the underlying error is available on
 *             hover (title) and on click (expandable detail). A persistent,
 *             auth-shaped failure additionally offers the reconnect path.
 */
export function SyncStatusIndicator({
  sync,
  busy,
  onRetry,
}: {
  sync: SyncStatus;
  busy: boolean;
  onRetry: () => void;
}) {
  const [showDetail, setShowDetail] = useState(false);

  if (sync.state === 'syncing' || busy) {
    return (
      <span
        data-testid="sync-status"
        data-state="syncing"
        className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-zinc-400"
      >
        <RefreshCw size={13} className="animate-spin" />
        <span className="hidden sm:inline">Syncing…</span>
      </span>
    );
  }

  if (sync.state === 'issue') {
    return (
      <div className="relative">
        <div
          data-testid="sync-status"
          data-state="issue"
          className="flex items-center gap-1 rounded bg-amber-950/40 px-2 py-1.5 text-xs text-amber-300"
        >
          <button
            type="button"
            onClick={() => setShowDetail((v) => !v)}
            title={sync.error ?? 'Sync issue'}
            className="flex items-center gap-1.5 hover:text-amber-200"
          >
            <CircleAlert size={13} />
            <span>Sync issue</span>
          </button>
          <button
            type="button"
            onClick={onRetry}
            className="ml-1 rounded px-1.5 py-0.5 font-medium text-amber-200 hover:bg-amber-900/50"
          >
            Retry
          </button>
        </div>

        {showDetail && (
          <div
            data-testid="sync-error-detail"
            className="absolute right-0 z-20 mt-1 w-64 rounded-lg border border-amber-800/50 bg-zinc-900 p-3 text-xs text-amber-100 shadow-xl"
          >
            <p className="break-words">{sync.error ?? 'Sync failed.'}</p>
            {sync.suggestReconnect ? (
              <Form method="post" action="/dashboard/inbox/connect-gmail" className="mt-2">
                <button
                  type="submit"
                  className="w-full rounded bg-amber-500 px-2 py-1 font-medium text-amber-950 hover:bg-amber-400"
                >
                  Reconnect Gmail
                </button>
              </Form>
            ) : (
              <p className="mt-1.5 text-amber-300/70">
                {sync.failures >= 3
                  ? 'This has failed several times — it may clear on its own, or try Retry.'
                  : 'Usually transient — the next sync should clear it.'}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  // synced — quiet
  return (
    <span
      data-testid="sync-status"
      data-state="synced"
      title="All inboxes synced"
      className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-zinc-600"
    >
      <Check size={13} />
      <span className="hidden sm:inline">Synced</span>
    </span>
  );
}
