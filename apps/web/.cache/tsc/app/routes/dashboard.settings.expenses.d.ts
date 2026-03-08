import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
export declare function loader({ request, context }: LoaderFunctionArgs): Promise<import("react-router").UNSAFE_DataWithResponseInit<{
    connections: {
        id: string;
        provider: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        venture_id: string | null;
    }[];
    ventures: {
        id: string;
        name: string;
    }[];
}>>;
export declare function action({ request, context }: ActionFunctionArgs): Promise<import("react-router").UNSAFE_DataWithResponseInit<{
    ok: boolean;
}>>;
export default function SettingsExpenses(): import("react/jsx-runtime").JSX.Element;
