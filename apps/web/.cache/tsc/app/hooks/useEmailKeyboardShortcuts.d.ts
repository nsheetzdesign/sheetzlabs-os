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
}
export declare function useEmailKeyboardShortcuts({ emails, focusIndex, setFocusIndex, activeEmail, onOpenFocused, onClose, onBulkAction, onToggleSelect, onCompose, onReply, onReplyAll, onForward, onSearch, onShowHelp, }: Options): void;
export {};
