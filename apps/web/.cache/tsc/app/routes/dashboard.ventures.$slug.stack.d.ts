import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
export declare function loader({ params, context }: LoaderFunctionArgs): Promise<{
    ventureId: string;
    stack: {
        category: string;
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        dashboard_url: string | null;
        docs_url: string | null;
        id: string;
        secrets_required: string[] | null;
        setup_commands: string | null;
        tool_name: string;
        venture_id: string | null;
    }[];
}>;
export declare function action({ request, params, context }: ActionFunctionArgs): Promise<import("react-router").UNSAFE_DataWithResponseInit<{
    error: string;
}> | {
    ok: boolean;
}>;
export default function VentureStack(): import("react/jsx-runtime").JSX.Element;
