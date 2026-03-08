import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
export declare function loader({ params, context }: LoaderFunctionArgs): Promise<{
    task: {
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
    };
    ventures: {
        id: string;
        name: string;
        slug: string;
    }[];
}>;
export declare function action({ request, params, context }: ActionFunctionArgs): Promise<Response | import("react-router").UNSAFE_DataWithResponseInit<{
    errors: Record<string, string>;
}> | import("react-router").UNSAFE_DataWithResponseInit<{
    errors: {
        _form: string;
    };
}>>;
export default function EditTask(): import("react/jsx-runtime").JSX.Element;
