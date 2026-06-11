import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "react-router";
export declare const meta: MetaFunction;
export declare function loader({ context }: LoaderFunctionArgs): Promise<{
    captures: {
        capture_type: string | null;
        content: string;
        created_at: string | null;
        id: string;
        knowledge_id: string | null;
        processed: boolean | null;
        source_title: string | null;
        source_url: string | null;
    }[];
}>;
export declare function action({ request, context }: ActionFunctionArgs): Promise<import("react-router").UNSAFE_DataWithResponseInit<{
    error: string;
}> | {
    ok: boolean;
    slug?: undefined;
} | {
    ok: boolean;
    slug: string | undefined;
}>;
export default function Captures(): import("react/jsx-runtime").JSX.Element;
