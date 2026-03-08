import type { MetaFunction, LoaderFunctionArgs } from "react-router";
export declare const meta: MetaFunction;
export declare function loader({ context }: LoaderFunctionArgs): Promise<{
    ventures: {
        mrr_cents: number;
        customer_count: number;
        _live: boolean;
        churn_rate: number | null;
        created_at: string | null;
        domain: string | null;
        health_score: number | null;
        id: string;
        name: string;
        parent_venture_id: string | null;
        slug: string;
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_stage"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_status"] | null;
        tagline: string | null;
        updated_at: string | null;
    }[];
    pipeline: {
        created_at: string | null;
        id: string;
        name: string;
        notes: string | null;
        problem_statement: string | null;
        score_ai_leverage: number | null;
        score_market_size: number | null;
        score_operator_insight: number | null;
        score_personal_energy: number | null;
        score_portfolio_fit: number | null;
        score_revenue_speed: number | null;
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["pipeline_stage"] | null;
        target_market: string | null;
        total_score: number | null;
        updated_at: string | null;
        venture_id: string | null;
    }[];
    tasks: {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        due_date: string | null;
        id: string;
        milestone_id: string | null;
        priority: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_priority"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_status"] | null;
        title: string;
        updated_at: string | null;
        venture_id: string | null;
    }[];
    financials: {
        totalRevenueCents: number;
        totalExpenseCents: number;
    };
}>;
export default function CommandCenter(): import("react/jsx-runtime").JSX.Element;
