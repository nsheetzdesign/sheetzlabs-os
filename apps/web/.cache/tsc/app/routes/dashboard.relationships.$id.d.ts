import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
export declare function loader({ params, context }: LoaderFunctionArgs): Promise<{
    rel: {
        company: string | null;
        created_at: string | null;
        email: string | null;
        id: string;
        last_contact: string | null;
        name: string;
        notes: string | null;
        role: string | null;
        strength: number | null;
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["relationship_type"] | null;
        updated_at: string | null;
        venture_ids: string[] | null;
    };
    ventures: {
        id: string;
        name: string;
        slug: string;
    }[];
    interactions: {
        created_at: string | null;
        direction: string | null;
        id: string;
        occurred_at: string | null;
        relationship_id: string | null;
        subject: string | null;
        summary: string | null;
        type: string;
        venture_id: string | null;
    }[];
}>;
export declare function action({ request, params, context }: ActionFunctionArgs): Promise<Response | import("react-router").UNSAFE_DataWithResponseInit<{
    errors: Record<string, string>;
}> | import("react-router").UNSAFE_DataWithResponseInit<{
    errors: {
        _form: string;
    };
}>>;
export default function EditRelationship(): import("react/jsx-runtime").JSX.Element;
