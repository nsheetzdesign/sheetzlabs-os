import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "react-router";
export declare const meta: MetaFunction<typeof loader>;
export declare function loader({ params, context }: LoaderFunctionArgs): Promise<{
    article: {
        content: string | null;
        created_at: string | null;
        id: string;
        slug: string;
        tags: string[] | null;
        title: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        ventures: {
            id: string;
            name: string;
            slug: string;
        } | null;
        knowledge_tags: {
            error: true;
        } & "could not find the relation between knowledge and knowledge_tags";
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
