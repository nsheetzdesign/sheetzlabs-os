import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
export declare function loader({ request, context }: LoaderFunctionArgs): Promise<{
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
    filters: {
        ventureId: string;
        status: string;
        priority: string;
    };
}>;
export declare function action({ request, context }: ActionFunctionArgs): Promise<{
    ok: boolean;
}>;
export default function TasksIndex(): import("react/jsx-runtime").JSX.Element;
