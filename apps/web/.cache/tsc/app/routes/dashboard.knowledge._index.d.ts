import type { LoaderFunctionArgs } from "react-router";
export declare function loader({ request, context }: LoaderFunctionArgs): Promise<{
    items: {
        id: string;
        title: string;
        slug: string;
        type: string;
        tags: string[] | null;
        venture_id: string | null;
        created_at: string | null;
        ventures: {
            id: string;
            name: string;
            slug: string;
        } | null;
    }[];
    allTags: string[];
    filters: {
        type: string;
        tag: string;
    };
}>;
export default function KnowledgeIndex(): import("react/jsx-runtime").JSX.Element;
