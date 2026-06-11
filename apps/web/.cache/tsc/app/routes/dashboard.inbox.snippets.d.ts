import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "react-router";
export declare const meta: MetaFunction;
export declare function loader({ context }: LoaderFunctionArgs): Promise<{
    snippets: {
        content: string;
        created_at: string | null;
        id: string;
        title: string;
        trigger: string;
        updated_at: string | null;
        user_id: string | null;
    }[];
}>;
export declare function action({ request, context }: ActionFunctionArgs): Promise<Response>;
export default function SnippetsPage(): import("react/jsx-runtime").JSX.Element;
