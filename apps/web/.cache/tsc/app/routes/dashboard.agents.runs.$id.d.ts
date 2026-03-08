import type { LoaderFunctionArgs } from "react-router";
export declare function loader({ params, context }: LoaderFunctionArgs): Promise<{
    run: {
        agent_id: string | null;
        agent_name: string;
        completed_at: string | null;
        cost_cents: number | null;
        created_at: string | null;
        duration_ms: number | null;
        error_message: string | null;
        id: string;
        input_context: import("@sheetzlabs/shared").Json | null;
        input_data: import("@sheetzlabs/shared").Json | null;
        output_data: import("@sheetzlabs/shared").Json | null;
        started_at: string | null;
        status: string | null;
        tokens_input: number | null;
        tokens_output: number | null;
        tokens_used: number | null;
        trigger_type: string | null;
    };
}>;
export default function AgentRunDetail(): import("react/jsx-runtime").JSX.Element;
