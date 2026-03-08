import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
export declare function loader({ request, params, context }: LoaderFunctionArgs): Promise<{
    ventureId: string;
    tickets: {
        converted_milestone_id: string | null;
        converted_task_id: string | null;
        created_at: string | null;
        description: string | null;
        external_id: string | null;
        id: string;
        priority: string | null;
        source: string;
        status: string | null;
        submitter_email: string | null;
        submitter_name: string | null;
        synced_at: string | null;
        title: string;
        type: string;
        venture_id: string | null;
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        } | null;
        milestones: {
            id: string;
            title: string;
            status: string | null;
        } | null;
    }[];
    milestones: {
        id: string;
        title: string;
    }[];
    filterStatus: string;
    filterType: string;
}>;
export declare function action({ request, params, context }: ActionFunctionArgs): Promise<import("react-router").UNSAFE_DataWithResponseInit<{
    error: string;
}> | {
    ok: boolean;
}>;
export default function VentureTickets(): import("react/jsx-runtime").JSX.Element;
