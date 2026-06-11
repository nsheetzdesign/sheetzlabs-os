import type { LoaderFunctionArgs, MetaFunction } from "react-router";
export declare const meta: MetaFunction;
export declare function loader({ request, context }: LoaderFunctionArgs): Promise<{
    accounts: {
        id: string;
        email: string;
    }[];
    aliases: {
        id: string;
        account_id: string;
        email: string;
        name: string | null;
    }[];
    replyTo: {
        id: string;
        from_email: string | null;
        from_name: string | null;
        subject: string | null;
    } | null;
    drafts: {
        id: string;
        to_emails: string[] | null;
        subject: string | null;
        created_at: string | null;
    }[];
}>;
export default function ComposeEmail(): import("react/jsx-runtime").JSX.Element;
