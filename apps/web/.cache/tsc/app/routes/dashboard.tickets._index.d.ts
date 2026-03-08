import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
export declare function loader({ request, context }: LoaderFunctionArgs): Promise<{
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
        ventures: {
            id: string;
            name: string;
            slug: string;
        } | null;
    }[];
    ventures: {
        id: string;
        name: string;
        slug: string;
    }[];
    summary: {
        open: number;
        inProgress: number;
        resolved: number;
        total: number;
    };
    filterVenture: string;
    filterStatus: string;
    filterType: string;
}>;
export declare function action({ request, context }: ActionFunctionArgs): Promise<{
    ok: boolean;
}>;
export default function AllTickets(): import("react/jsx-runtime").JSX.Element;
