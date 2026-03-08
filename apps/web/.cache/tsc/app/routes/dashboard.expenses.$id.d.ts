import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
export declare function loader({ request, params, context }: LoaderFunctionArgs): Promise<import("react-router").UNSAFE_DataWithResponseInit<{
    expense: {
        amount_cents: number;
        category: import("@sheetzlabs/shared").Database["public"]["Enums"]["expense_category"];
        created_at: string | null;
        description: string | null;
        expense_date: string;
        external_id: string | null;
        id: string;
        is_recurring: boolean | null;
        receipt_filename: string | null;
        receipt_url: string | null;
        source: string | null;
        vendor: string;
        venture_id: string | null;
        ventures: {
            id: string;
            name: string;
            slug: string;
        } | null;
    };
    ventures: {
        id: string;
        name: string;
        slug: string;
    }[];
}>>;
export declare function action({ request, params, context }: ActionFunctionArgs): Promise<Response | import("react-router").UNSAFE_DataWithResponseInit<{
    error: string;
}>>;
export default function ExpenseDetail(): import("react/jsx-runtime").JSX.Element;
