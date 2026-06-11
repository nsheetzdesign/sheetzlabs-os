import type { LoaderFunctionArgs, ActionFunctionArgs, MetaFunction } from "react-router";
export declare const meta: MetaFunction;
type BookingLink = {
    id: string;
    slug: string;
    title: string;
    description?: string;
    duration_minutes: number;
    is_active: boolean;
    calendar_accounts: {
        email: string;
        color?: string;
        display_name?: string;
    } | null;
};
type Account = {
    id: string;
    email: string;
    color?: string;
    display_name?: string;
};
export declare function loader({ request, context }: LoaderFunctionArgs): Promise<{
    links: BookingLink[];
    accounts: Account[];
    appUrl: string;
}>;
export declare function action({ request, context }: ActionFunctionArgs): Promise<null>;
export default function BookingLinksPage(): import("react/jsx-runtime").JSX.Element;
export {};
