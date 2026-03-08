import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
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
}>>;
export default function EditKnowledge(): import("react/jsx-runtime").JSX.Element;
