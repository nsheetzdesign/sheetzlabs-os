import type { LoaderFunctionArgs, MetaFunction } from "react-router";
export declare const meta: MetaFunction;
export declare function loader({ request, context }: LoaderFunctionArgs): Promise<{
    items: {
        id: string;
        title: string;
        type: string;
        status: string | null;
        excerpt: string | null;
        scheduled_for: string | null;
        word_count: number | null;
        parent_id: string | null;
        created_at: string | null;
        parent: {
            id: string;
            title: string;
        } | null;
    }[];
    filters: {
        type: string;
        status: string;
    };
}>;
export default function ContentIndex(): import("react/jsx-runtime").JSX.Element;
