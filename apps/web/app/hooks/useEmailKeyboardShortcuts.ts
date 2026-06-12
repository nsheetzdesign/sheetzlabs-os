import { useEffect, useCallback, useRef } from 'react';

interface Options {
  emails: Array<{ id: string; is_starred?: boolean }>;
  focusIndex: number;
  setFocusIndex: React.Dispatch<React.SetStateAction<number>>;
  activeEmail: { id: string } | null;
  onOpenFocused: () => void;
  onClose: () => void;
  onBulkAction: (action: string) => void;
  onToggleSelect: () => void;
  onCompose: () => void;
  onReply: () => void;
  onReplyAll: () => void;
  onForward: () => void;
  onSearch: () => void;
  onShowHelp: () => void;
  /** `z` — undo the most recent undoable action. */
  onUndo?: () => void;
  /** `Shift+U` — mark the focused/selected message unread. */
  onMarkUnread?: () => void;
  /** `g i` — jump to the inbox folder. */
  onGoInbox?: () => void;
  /** When false the listener is not attached (e.g. a modal owns the keyboard). */
  enabled?: boolean;
}

export function useEmailKeyboardShortcuts({
  emails,
  focusIndex,
  setFocusIndex,
  activeEmail,
  onOpenFocused,
  onClose,
  onBulkAction,
  onToggleSelect,
  onCompose,
  onReply,
  onReplyAll,
  onForward,
  onSearch,
  onShowHelp,
  onUndo,
  onMarkUnread,
  onGoInbox,
  enabled = true,
}: Options) {
  // Pending first key of a two-key chord (e.g. `g` then `i`), with an expiry.
  const chord = useRef<{ key: string; at: number } | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        if (e.key === 'Escape') target.blur();
        return;
      }

      // Never hijack browser/OS chords — Cmd+C, Cmd+R, Cmd+L, Alt+… all pass
      // straight through to the browser (Part 5, EU-3).
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      // Two-key chords: `g i` → inbox. Honour a pending `g` within 1s.
      const pending = chord.current;
      chord.current = null;
      if (pending && Date.now() - pending.at < 1000 && pending.key === 'g') {
        if (e.key === 'i') {
          e.preventDefault();
          onGoInbox?.();
          return;
        }
      }

      const focused = emails[focusIndex];

      switch (e.key) {
        case 'j':
          e.preventDefault();
          setFocusIndex(i => Math.min(i + 1, emails.length - 1));
          break;

        case 'k':
          e.preventDefault();
          setFocusIndex(i => Math.max(i - 1, 0));
          break;

        case 'g':
          // Start a chord; the next key decides.
          chord.current = { key: 'g', at: Date.now() };
          break;

        case 'o':
        case 'Enter':
          e.preventDefault();
          if (focused) onOpenFocused();
          break;

        case 'u':
          e.preventDefault();
          onClose();
          break;

        case 'U': // Shift+U — mark unread
          e.preventDefault();
          (onMarkUnread ?? (() => onBulkAction('unread')))();
          break;

        case 'z':
          e.preventDefault();
          onUndo?.();
          break;

        case 'e':
        case '[':
        case ']':
          // Archive (and-advance is implicit: removing the row promotes the next).
          e.preventDefault();
          onBulkAction('archive');
          break;

        case '#':
          e.preventDefault();
          onBulkAction('trash');
          break;

        case '!':
          e.preventDefault();
          onBulkAction('spam');
          break;

        case 's':
          e.preventDefault();
          if (focused) {
            onBulkAction(focused.is_starred ? 'unstar' : 'star');
          }
          break;

        case 'x':
          e.preventDefault();
          onToggleSelect();
          break;

        case 'c':
          e.preventDefault();
          onCompose();
          break;

        case 'r':
          if (!e.shiftKey) {
            e.preventDefault();
            onReply();
          }
          break;

        case 'a':
          e.preventDefault();
          onReplyAll();
          break;

        case 'f':
          e.preventDefault();
          onForward();
          break;

        case '/':
          e.preventDefault();
          onSearch();
          break;

        case 'Escape':
          e.preventDefault();
          onClose();
          break;

        case '?':
          e.preventDefault();
          onShowHelp();
          break;
      }
    },
    [
      emails,
      focusIndex,
      setFocusIndex,
      activeEmail,
      onOpenFocused,
      onClose,
      onBulkAction,
      onToggleSelect,
      onCompose,
      onReply,
      onReplyAll,
      onForward,
      onSearch,
      onShowHelp,
      onUndo,
      onMarkUnread,
      onGoInbox,
    ]
  );

  useEffect(() => {
    if (!enabled) return;
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);
}
