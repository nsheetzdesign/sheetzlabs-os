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
    latestEvaluation: ({
        error: true;
    } & "column 'total_score' does not exist on 'ventures'.") | ({
        error: true;
    } & "column 'total_score' does not exist on 'tickets'.") | ({
        error: true;
    } & "column 'total_score' does not exist on 'tasks'.") | ({
        error: true;
    } & "column 'total_score' does not exist on 'pipeline'.") | ({
        error: true;
    } & "column 'total_score' does not exist on 'revenue'.") | ({
        error: true;
    } & "column 'total_score' does not exist on 'expenses'.") | ({
        error: true;
    } & "column 'total_score' does not exist on 'relationships'.") | ({
        error: true;
    } & "column 'total_score' does not exist on 'knowledge'.") | ({
        error: true;
    } & "column 'total_score' does not exist on 'agents'.") | ({
        error: true;
    } & "column 'total_score' does not exist on 'agent_actions'.") | ({
        error: true;
    } & "column 'total_score' does not exist on 'agent_runs'.") | ({
        error: true;
    } & "column 'total_score' does not exist on 'content_queue'.") | ({
        error: true;
    } & "column 'total_score' does not exist on 'expense_connections'.") | ({
        error: true;
    } & "column 'total_score' does not exist on 'interactions'.") | ({
        error: true;
    } & "column 'total_score' does not exist on 'milestones'.") | ({
        error: true;
    } & "column 'total_score' does not exist on 'stripe_connections'.") | ({
        error: true;
    } & "column 'total_score' does not exist on 'stack_templates'.") | ({
        error: true;
    } & "column 'total_score' does not exist on 'stripe_product_mappings'.") | ({
        error: true;
    } & "column 'total_score' does not exist on 'venture_connections'.") | ({
        error: true;
    } & "column 'total_score' does not exist on 'venture_docs'.") | ({
        error: true;
    } & "column 'total_score' does not exist on 'venture_links'.") | ({
        error: true;
    } & "column 'total_score' does not exist on 'venture_stack'.") | null;
}>;
export declare function action({ request, params, context }: ActionFunctionArgs): Promise<Response | import("react-router").UNSAFE_DataWithResponseInit<{
    errors: {
        _form: string;
    };
}> | import("react-router").UNSAFE_DataWithResponseInit<{
    errors: Record<string, string>;
}>>;
export default function EditPipeline(): import("react/jsx-runtime").JSX.Element;
