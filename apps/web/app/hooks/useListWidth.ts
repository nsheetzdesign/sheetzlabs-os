import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'inbox-list-width';
export const DEFAULT_LIST_WIDTH = 400;
const MIN_LIST_WIDTH = 280;
const MAX_LIST_WIDTH = 720;

const clampWidth = (n: number) => Math.max(MIN_LIST_WIDTH, Math.min(MAX_LIST_WIDTH, n));

/**
 * Width of the email-list pane in the ≥xl three-pane layout, persisted to
 * localStorage. Drag is pointer-based (works for mouse + touch + pen); the
 * starting width is read on pointerdown so the delta is absolute. Below xl the
 * list pane is `flex-1` (flex-basis:0) which overrides this inline width, so the
 * value is harmless there — no breakpoint detection needed.
 *
 * Init is the SSR-safe default; the stored value lands in an effect after mount
 * to avoid a hydration mismatch on the inline `width` style.
 */
export function useListWidth() {
  const [width, setWidth] = useState(DEFAULT_LIST_WIDTH);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const n = parseInt(stored, 10);
      if (!Number.isNaN(n)) setWidth(clampWidth(n));
    }
  }, []);

  // Suppress text selection + force the resize cursor for the whole drag.
  useEffect(() => {
    if (!dragging) return;
    const prevUserSelect = document.body.style.userSelect;
    const prevCursor = document.body.style.cursor;
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
    return () => {
      document.body.style.userSelect = prevUserSelect;
      document.body.style.cursor = prevCursor;
    };
  }, [dragging]);

  const startDrag = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      const startX = e.clientX;
      const startW = width;
      setDragging(true);
      const onMove = (ev: PointerEvent) => {
        setWidth(clampWidth(startW + (ev.clientX - startX)));
      };
      const onUp = () => {
        setDragging(false);
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        setWidth((w) => {
          window.localStorage.setItem(STORAGE_KEY, String(w));
          return w;
        });
      };
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    },
    [width],
  );

  const reset = useCallback(() => {
    setWidth(DEFAULT_LIST_WIDTH);
    window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { width, dragging, startDrag, reset };
}
