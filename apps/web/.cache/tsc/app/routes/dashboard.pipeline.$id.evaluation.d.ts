import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
export declare function loader({ params, context }: LoaderFunctionArgs): Promise<{
    item: {
        id: string;
        name: string;
        stage: "idea" | "researching" | "validating" | "speccing" | "building" | "beta" | "launched" | "parked" | null;
    };
    evaluation: {
        agent_run_id: string | null;
        ai_leverage_score: number | null;
        competition_score: number | null;
        competitor_summary: string | null;
        competitors: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        estimated_monthly_cost: number | null;
        estimated_mrr_high: number | null;
        estimated_mrr_low: number | null;
        estimated_startup_cost: number | null;
        estimated_time_to_revenue: string | null;
        id: string;
        market_analysis: string | null;
        market_clarity_score: number | null;
        market_size_estimate: string | null;
        operational_fit_score: number | null;
        personal_energy_score: number | null;
        pipeline_id: string | null;
        recommendation: string | null;
        recommendation_rationale: string | null;
        revenue_speed_score: number | null;
        risk_factors: string[] | null;
        success_factors: string[] | null;
        suggested_mvp_scope: string | null;
        suggested_next_steps: string[] | null;
        total_score: number | null;
        web_research: import("@sheetzlabs/shared").Json | null;
    } | null;
}>;
export declare function action({ request, params, context }: ActionFunctionArgs): Promise<Response | null>;
export default function EvaluationDetail(): import("react/jsx-runtime").JSX.Element;
