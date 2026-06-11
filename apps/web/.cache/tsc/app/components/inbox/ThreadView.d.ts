interface Email {
    id: string;
    subject: string;
    from_name: string;
    from_email: string;
    to_emails: string;
    cc_emails?: string;
    body_html?: string;
    body_text?: string;
    received_at: string;
    is_read: boolean;
    is_starred: boolean;
}
interface Props {
    emails: Email[];
    onReply: (email: Email) => void;
    onReplyAll: (email: Email) => void;
    onForward: (email: Email) => void;
    onClose: () => void;
}
export declare function ThreadView({ emails, onReply, onReplyAll, onForward, onClose }: Props): import("react/jsx-runtime").JSX.Element | null;
export {};
