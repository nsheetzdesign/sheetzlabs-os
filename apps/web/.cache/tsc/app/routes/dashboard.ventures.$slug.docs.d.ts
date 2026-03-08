import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
export declare function loader({ params, context }: LoaderFunctionArgs): Promise<{
    venture: {
        id: string;
        name: string;
        tagline: string | null;
        slug: string;
    };
    docs: {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
    }[];
    template: {
        claude_md_template: string | null;
        created_at: string | null;
        description: string | null;
        hooks: import("@sheetzlabs/shared").Json | null;
        id: string;
        name: string;
        skills: import("@sheetzlabs/shared").Json | null;
        stack_items: import("@sheetzlabs/shared").Json;
        venture_type: string;
    } | null;
}>;
export declare function action({ request, params, context }: ActionFunctionArgs): Promise<import("react-router").UNSAFE_DataWithResponseInit<{
    error: string;
}> | {
    ok: boolean;
}>;
export default function VentureDocs(): import("react/jsx-runtime").JSX.Element;
