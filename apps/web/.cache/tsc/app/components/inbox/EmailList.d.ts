export interface Email {
    id: string;
    subject: string | null;
    from_name: string | null;
    from_email: string | null;
    snippet: string | null;
    received_at: string | null;
    is_read: boolean;
    is_starred: boolean;
    has_attachments: boolean;
    thread_id: string | null;
    labels?: {
        id: string;
        name: string;
        color: string;
    }[];
}
interface Props {
    emails: Email[];
    selectedIds: Set<string>;
    activeEmailId: string | null;
    focusedIndex?: number;
    onSelect: (id: string, multi?: boolean) => void;
    onSelectAll: () => void;
    onClearSelection: () => void;
    onOpen: (email: Email) => void;
    onDragStart: (e: React.DragEvent, emailIds: string[]) => void;
}
export declare function EmailList({ emails, selectedIds, activeEmailId, focusedIndex, onSelect, onSelectAll, onClearSelection, onOpen, onDragStart, }: Props): import("react/jsx-runtime").JSX.Element;
export {};
