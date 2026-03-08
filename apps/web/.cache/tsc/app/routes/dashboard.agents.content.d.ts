import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
export declare function loader({ request, context }: LoaderFunctionArgs): Promise<{
    queue: {
        agent_run_id: string | null;
        content: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        media_urls: string[] | null;
        platform: string;
        posted_at: string | null;
        scheduled_for: string | null;
        status: string | null;
        venture_id: string | null;
    }[];
    counts: {
        draft: number;
        scheduled: number;
        posted: number;
        failed: number;
    };
    statusFilter: string;
}>;
export declare function action({ request, context }: ActionFunctionArgs): Promise<null>;
export default function ContentQueue(): import("react/jsx-runtime").JSX.Element;
