export interface PreviewEmail {
    id: string;
    subject: string | null;
    from_name: string | null;
    from_email: string | null;
    to_emails?: string[] | string | null;
    cc_emails?: string[] | string | null;
    body_html?: string | null;
    body_text?: string | null;
    received_at: string | null;
    is_read: boolean;
    is_starred: boolean;
    thread_id?: string | null;
    ai_summary?: string | null;
    labels?: {
        id: string;
        name: string;
        color: string;
    }[];
}
interface Props {
    email: PreviewEmail | null;
    onClose: () => void;
    onReply: () => void;
    onReplyAll: () => void;
    onForward: () => void;
    onBulkAction?: (action: string) => void;
}
export declare function EmailPreview({ email, onClose, onReply, onReplyAll, onForward, onBulkAction }: Props): import("react/jsx-runtime").JSX.Element;
export {};
