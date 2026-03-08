import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
export declare function loader({ params, context }: LoaderFunctionArgs): Promise<{
    item: {
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
    };
    ventures: {
        id: string;
        name: string;
        slug: string;
    }[];
    scaffoldPrompt: string | null;
}>;
export declare function action({ request, params, context }: ActionFunctionArgs): Promise<Response | import("react-router").UNSAFE_DataWithResponseInit<{
    errors: {
        _form: string;
    };
}> | import("react-router").UNSAFE_DataWithResponseInit<{
    errors: Record<string, string>;
}>>;
export default function EditPipeline(): import("react/jsx-runtime").JSX.Element;
