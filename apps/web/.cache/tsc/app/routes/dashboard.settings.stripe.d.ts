import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
export declare function loader({ request, context }: LoaderFunctionArgs): Promise<import("react-router").UNSAFE_DataWithResponseInit<{
    connections: {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
    }[];
    mappings: {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        stripe_connections: {
            name: string;
        } | null;
        ventures: {
            name: string;
            slug: string;
        } | null;
    }[];
    ventures: {
        id: string;
        name: string;
        slug: string;
    }[];
}>>;
export declare function action({ request, context }: ActionFunctionArgs): Promise<Response | import("react-router").UNSAFE_DataWithResponseInit<{
    error: string;
}>>;
export default function StripeSettings(): import("react/jsx-runtime").JSX.Element;
