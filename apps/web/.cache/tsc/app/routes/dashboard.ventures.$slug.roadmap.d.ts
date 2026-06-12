import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
export declare function loader({ params, context }: LoaderFunctionArgs): Promise<{
    ventureId: string;
    slug: string;
    milestones: {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        id: string;
        sort_order: number | null;
        status: string | null;
        target_date: string | null;
        title: string;
        venture_id: string | null;
    }[];
    tasks: {
        id: string;
        title: string;
        status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        milestone_id: string | null;
        priority: "urgent" | "high" | "medium" | "low" | null;
    }[];
}>;
export declare function action({ request, params, context }: ActionFunctionArgs): Promise<import("react-router").UNSAFE_DataWithResponseInit<{
    error: string;
}> | {
    ok: boolean;
}>;
export default function VentureRoadmap(): import("react/jsx-runtime").JSX.Element;
