import type { LoaderFunctionArgs } from "react-router";
export declare function loader({ context }: LoaderFunctionArgs): Promise<{
    ventures: {
        churn_rate: number | null;
        created_at: string | null;
        customer_count: number | null;
        domain: string | null;
        health_score: number | null;
        id: string;
        mrr_cents: number | null;
        name: string;
        parent_venture_id: string | null;
        slug: string;
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_stage"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_status"] | null;
        tagline: string | null;
        updated_at: string | null;
    }[];
}>;
export default function VenturesIndex(): import("react/jsx-runtime").JSX.Element;
