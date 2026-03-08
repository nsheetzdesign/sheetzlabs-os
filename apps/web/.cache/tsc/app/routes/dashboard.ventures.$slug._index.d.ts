import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
export declare function loader({ params, context }: LoaderFunctionArgs): Promise<{
    parentOptions: {
        id: string;
        name: string;
        slug: string;
    }[];
    quickLinks: {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
    }[];
    stackCount: number;
}>;
export declare function action({ request, params, context }: ActionFunctionArgs): Promise<Response | import("react-router").UNSAFE_DataWithResponseInit<{
    errors: Record<string, string>;
}> | import("react-router").UNSAFE_DataWithResponseInit<{
    errors: {
        _form: string;
    };
}>>;
export default function VentureOverview(): import("react/jsx-runtime").JSX.Element | null;
