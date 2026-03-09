import type { LoaderFunctionArgs, MetaFunction } from "react-router";
export declare const meta: MetaFunction;
export declare function loader({ request, context }: LoaderFunctionArgs): Promise<{
    items: ({
        error: true;
    } & "column 'is_pinned' does not exist on 'knowledge'.")[];
    allTags: (({
        error: true;
    } & "column 'name' does not exist on 'relationships'.") | ({
        error: true;
    } & "column 'name' does not exist on 'ventures'.") | ({
        error: true;
    } & "column 'name' does not exist on 'tickets'.") | ({
        error: true;
    } & "column 'name' does not exist on 'tasks'.") | ({
        error: true;
    } & "column 'name' does not exist on 'pipeline'.") | ({
        error: true;
    } & "column 'name' does not exist on 'revenue'.") | ({
        error: true;
    } & "column 'name' does not exist on 'expenses'.") | ({
        error: true;
    } & "column 'name' does not exist on 'knowledge'.") | ({
        error: true;
    } & "column 'name' does not exist on 'agents'.") | ({
        error: true;
    } & "column 'name' does not exist on 'agent_actions'.") | ({
        error: true;
    } & "column 'name' does not exist on 'agent_runs'.") | ({
        error: true;
    } & "column 'name' does not exist on 'content_queue'.") | ({
        error: true;
    } & "column 'name' does not exist on 'expense_connections'.") | ({
        error: true;
    } & "column 'name' does not exist on 'interactions'.") | ({
        error: true;
    } & "column 'name' does not exist on 'milestones'.") | ({
        error: true;
    } & "column 'name' does not exist on 'stripe_connections'.") | ({
        error: true;
    } & "column 'name' does not exist on 'stack_templates'.") | ({
        error: true;
    } & "column 'name' does not exist on 'stripe_product_mappings'.") | ({
        error: true;
    } & "column 'name' does not exist on 'venture_connections'.") | ({
        error: true;
    } & "column 'name' does not exist on 'venture_docs'.") | ({
        error: true;
    } & "column 'name' does not exist on 'venture_links'.") | ({
        error: true;
    } & "column 'name' does not exist on 'venture_stack'."))[];
    filters: {
        type: string;
        tag: string;
        search: string;
        pinned: boolean;
    };
    captureCount: number;
}>;
export default function KnowledgeIndex(): import("react/jsx-runtime").JSX.Element;
