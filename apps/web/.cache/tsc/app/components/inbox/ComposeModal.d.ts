interface Props {
    isOpen: boolean;
    onClose: () => void;
    replyTo?: {
        id: string;
        subject: string;
        from_email: string;
        from_name: string;
        to_emails: string;
        cc_emails?: string;
        body_text?: string;
    };
    replyAll?: boolean;
    forward?: boolean;
    accountId: string;
    accountEmail: string;
}
export declare function ComposeModal({ isOpen, onClose, replyTo, replyAll, forward, accountId, accountEmail: _accountEmail, }: Props): import("react/jsx-runtime").JSX.Element | null;
export {};
