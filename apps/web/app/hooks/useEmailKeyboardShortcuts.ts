import { useEffect, useCallback } from 'react';

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
}: Options) {
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

        case 'o':
        case 'Enter':
          e.preventDefault();
          if (focused) onOpenFocused();
          break;

        case 'u':
          e.preventDefault();
          onClose();
          break;

        case 'e':
          e.preventDefault();
          onBulkAction('archive');
          break;

        case '#':
          e.preventDefault();
          onBulkAction('trash');
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
          if (!e.metaKey && !e.ctrlKey) onForward();
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
    ]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
