interface Props {
    isOpen: boolean;
    onClose: () => void;
    replyTo?: {
        id: string;
        subject: string;
        from_email: string;
        from_name: string;
        to_emails: string | string[];
        cc_emails?: string | string[];
        body_text?: string;
        account_id?: string;
    };
    replyAll?: boolean;
    forward?: boolean;
    accountId: string;
    accountEmail: string;
}
export declare function ComposeModal({ isOpen, onClose, replyTo, replyAll, forward, accountId, accountEmail, }: Props): import("react/jsx-runtime").JSX.Element | null;
export {};
