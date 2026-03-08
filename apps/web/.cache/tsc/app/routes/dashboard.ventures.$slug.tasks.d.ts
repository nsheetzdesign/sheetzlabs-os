import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
export declare function loader({ request, params, context }: LoaderFunctionArgs): Promise<{
    ventureId: string;
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
        milestones: {
            id: string;
            title: string;
        } | null;
    }[];
    milestones: {
        id: string;
        title: string;
    }[];
    filterStatus: string;
}>;
export declare function action({ request, params, context }: ActionFunctionArgs): Promise<import("react-router").UNSAFE_DataWithResponseInit<{
    error: string;
}> | {
    ok: boolean;
}>;
export default function VentureTasks(): import("react/jsx-runtime").JSX.Element;
