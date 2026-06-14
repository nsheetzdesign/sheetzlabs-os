import { useEffect, useRef } from 'react';

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  /** Which edge the panel slides in from. */
  side?: 'left' | 'right';
  ariaLabel: string;
  children: React.ReactNode;
  /** Extra classes for the sliding panel (e.g. width). */
  panelClassName?: string;
}

/**
 * Lightweight overlay drawer: focus-trapped, Esc-to-close, click-scrim-to-close,
 * restores focus to the opener on close. Hidden at ≥lg (the inbox nav is inline
 * there) so a left-open drawer can't linger after a resize past the breakpoint.
 * Reuses the dialog a11y conventions from the 54A/54B modals (role=dialog +
 * aria-modal); the trap + restore are what those modals lacked.
 */
export function Drawer({ open, onClose, side = 'left', ariaLabel, children, panelClassName = '' }: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    openerRef.current = (document.activeElement as HTMLElement | null) ?? null;
    const panel = panelRef.current;
    const first = panel?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? panel)?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key === 'Tab' && panel) {
        const nodes = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
          (el) => el.offsetParent !== null,
        );
        if (nodes.length === 0) {
          e.preventDefault();
          panel.focus();
          return;
        }
        const firstNode = nodes[0];
        const lastNode = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === firstNode) {
          e.preventDefault();
          lastNode.focus();
        } else if (!e.shiftKey && document.activeElement === lastNode) {
          e.preventDefault();
          firstNode.focus();
        }
      }
    };
    // Capture phase so the drawer claims Esc before page-level listeners.
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      openerRef.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 lg:hidden" role="presentation">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        tabIndex={-1}
        className={`absolute top-0 ${side === 'left' ? 'left-0 pl-safe' : 'right-0 pr-safe'} h-full max-w-[85vw] bg-zinc-950 shadow-2xl outline-none pt-safe pb-safe ${panelClassName}`}
      >
        {children}
      </div>
    </div>
  );
}
