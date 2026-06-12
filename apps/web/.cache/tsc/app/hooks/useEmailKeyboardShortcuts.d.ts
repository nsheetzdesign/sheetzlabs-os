interface Options {
    emails: Array<{
        id: string;
        is_starred?: boolean;
    }>;
    focusIndex: number;
    setFocusIndex: React.Dispatch<React.SetStateAction<number>>;
    activeEmail: {
        id: string;
    } | null;
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
export declare function useEmailKeyboardShortcuts({ emails, focusIndex, setFocusIndex, activeEmail, onOpenFocused, onClose, onBulkAction, onToggleSelect, onCompose, onReply, onReplyAll, onForward, onSearch, onShowHelp, onUndo, onMarkUnread, onGoInbox, enabled, }: Options): void;
export {};
