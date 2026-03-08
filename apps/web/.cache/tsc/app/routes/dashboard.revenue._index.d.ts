import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
export declare function loader({ request, context }: LoaderFunctionArgs): Promise<{
    entries: {
        amount_cents: number;
        client_name: string | null;
        created_at: string | null;
        description: string | null;
        id: string;
        period_end: string | null;
        period_start: string | null;
        recorded_at: string | null;
        stripe_connection_id: string | null;
        stripe_invoice_id: string | null;
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["revenue_type"];
        venture_id: string | null;
        ventures: {
            id: string;
            name: string;
            slug: string;
        } | null;
    }[];
    ventures: {
        id: string;
        name: string;
        slug: string;
    }[];
    filters: {
        ventureId: string;
    };
    stats: {
        totalMrrCents: number;
        totalRevenueCents: number;
        count: number;
    };
}>;
export declare function action({ request, context }: ActionFunctionArgs): Promise<Response | null>;
export default function RevenueIndex(): import("react/jsx-runtime").JSX.Element;
