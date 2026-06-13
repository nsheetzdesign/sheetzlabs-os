import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'sidebar-collapsed';

/**
 * Collapse state for the primary dashboard sidebar, persisted to localStorage.
 *
 * SSR-safe in the same shape as {@link useListWidth}: the server (and the first
 * client paint) always render expanded (`false`), then the stored value is
 * reconciled in an effect after mount. That avoids a hydration mismatch on the
 * width class — `localStorage` can't be read during render without the server
 * and client disagreeing.
 *
 * `mounted` is exposed so the shell can gate the width transition: on the very
 * first reconcile we want the rail to *snap* to the persisted width rather than
 * animate the collapse on load (which would read as a flash). After mount, real
 * toggles animate normally.
 *
 * No auto-collapse: we respect the persisted choice and default to expanded.
 * Auto-collapsing on navigation (e.g. entering a page that has its own secondary
 * sidebar) surprises people, so it was deliberately dropped — Prompt 61, Part 3.
 */
export function useSidebarCollapsed() {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (window.localStorage.getItem(STORAGE_KEY) === 'true') {
      setCollapsed(true);
    }
    // Enable the width transition only on the *next* frame, after the reconcile
    // above has painted. If `mounted` flipped in the same render as `collapsed`,
    // the transition class would already be present when the width changes and
    // the rail would animate the collapse on load — a flash. Deferring by a
    // frame makes that first reconcile a snap; real toggles afterward animate.
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const toggle = useCallback(() => {
    setCollapsed((v) => {
      const next = !v;
      window.localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  return { collapsed, toggle, mounted };
}
