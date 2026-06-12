import type { LoaderFunctionArgs, MetaFunction } from 'react-router';
export declare const meta: MetaFunction;
export declare function loader({ request, context }: LoaderFunctionArgs): Promise<{
    emails: any[];
    accounts: {
        id: string;
        email: string;
        labels: any[];
    }[];
    reauthAccounts: {
        id: string;
        email: string;
    }[];
    counts: Record<string, {
        inbox: number;
        starred: number;
        snoozed: number;
        drafts: number;
        spam: number;
        trash: number;
    }>;
    globalCounts: {
        inbox: number;
        starred: number;
        snoozed: number;
        spam: number;
        trash: number;
        drafts: number;
    };
    folder: string;
    accountId: string | null;
    labelId: string | null;
    search: string | null;
}>;
export default function Inbox(): import("react/jsx-runtime").JSX.Element;
