import { useEffect, useState } from "react";
import { Share, X, Plus } from "lucide-react";
import { getCookie, isIosSafari, isStandalone, setCookie } from "~/lib/pwa";

/**
 * One-time "Add to Home Screen" nudge for iOS Safari (Prompt 69).
 *
 * iOS has no `beforeinstallprompt` — install is manual via the Share sheet — so a
 * brief instructional hint is the only option. We show it ONCE: only on iOS/iPadOS
 * Safari, only when not already installed, and never again after dismissal. The
 * dismissal persists in a COOKIE (per project rule: not localStorage-in-useState).
 * Visibility is decided in an effect (client-only) so SSR renders nothing and
 * there's no hydration flash.
 */
const DISMISS_COOKIE = "a2hs_dismissed";

export function AddToHomeScreen() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isStandalone()) return; // already installed
    if (!isIosSafari()) return; // only the Share-sheet platform
    if (getCookie(DISMISS_COOKIE)) return; // already dismissed
    // Small delay so it doesn't fight the initial render.
    const t = setTimeout(() => setShow(true), 1200);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  const dismiss = () => {
    setCookie(DISMISS_COOKIE, "1", 180);
    setShow(false);
  };

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-0"
      role="dialog"
      aria-label="Install Sheetz Labs OS"
      data-testid="a2hs-hint"
    >
      <div className="mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-surface-2 bg-surface-1 px-4 py-3 shadow-2xl">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white">
          SL
        </div>
        <p className="min-w-0 flex-1 text-xs leading-relaxed text-zinc-300">
          Install for full-screen, app-like access. Tap{" "}
          <Share className="-mt-0.5 inline h-3.5 w-3.5 text-brand" aria-label="the Share button" />{" "}
          then{" "}
          <span className="whitespace-nowrap font-medium text-zinc-100">
            <Plus className="-mt-0.5 inline h-3.5 w-3.5" /> Add to Home Screen
          </span>
          .
        </p>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          data-testid="a2hs-dismiss"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-surface-2/60 hover:text-zinc-300"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
