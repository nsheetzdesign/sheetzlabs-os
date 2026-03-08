import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
export declare function loader({ params, context }: LoaderFunctionArgs): Promise<{
    ventureId: string;
    links: {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
    }[];
}>;
export declare function action({ request, params, context }: ActionFunctionArgs): Promise<import("react-router").UNSAFE_DataWithResponseInit<{
    error: string;
}> | {
    ok: boolean;
}>;
export default function VentureLinks(): import("react/jsx-runtime").JSX.Element;
