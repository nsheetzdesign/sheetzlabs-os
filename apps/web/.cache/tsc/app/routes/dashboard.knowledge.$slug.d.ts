import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "react-router";
export declare const meta: MetaFunction<typeof loader>;
export declare function loader({ params, context }: LoaderFunctionArgs): Promise<{
    article: {
        content: string | null;
        created_at: string | null;
        id: string;
        is_pinned: boolean | null;
        parent_id: string | null;
        reading_time: number | null;
        slug: string;
        source_type: string | null;
        source_url: string | null;
        summary: string | null;
        tags: string[] | null;
        title: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        venture_id_new: string | null;
        word_count: number | null;
        ventures: {
            error: true;
        } & "Could not embed because more than one relationship was found for 'ventures' and 'knowledge' you need to hint the column with ventures!<columnName> ?";
        knowledge_tags: {
            tag_id: string;
            tags: {
                id: string;
                name: string;
                color: string | null;
            };
        }[];
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
}> | {
    summary: string;
} | null>;
export default function EditKnowledge(): import("react/jsx-runtime").JSX.Element;
