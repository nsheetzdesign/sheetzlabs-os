import type { LoaderFunctionArgs, MetaFunction } from "react-router";
export declare const meta: MetaFunction;
export declare function loader({ request, context }: LoaderFunctionArgs): Promise<{
    items: {
        id: string;
        title: string;
        slug: string;
        type: string;
        tags: string[] | null;
        venture_id: string | null;
        is_pinned: boolean | null;
        summary: string | null;
        reading_time: number | null;
        source_type: string | null;
        created_at: string | null;
        updated_at: string | null;
        knowledge_tags: {
            tag_id: string;
            tags: {
                id: string;
                name: string;
                color: string | null;
            };
        }[];
        ventures: {
            error: true;
        } & "Could not embed because more than one relationship was found for 'ventures' and 'knowledge' you need to hint the column with ventures!<columnName> ?";
    }[];
    allTags: {
        id: string;
        name: string;
        color: string | null;
    }[];
    filters: {
        type: string;
        tag: string;
        search: string;
        pinned: boolean;
    };
    captureCount: number;
}>;
export default function KnowledgeIndex(): import("react/jsx-runtime").JSX.Element;
