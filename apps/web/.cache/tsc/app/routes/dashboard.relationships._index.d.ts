import type { LoaderFunctionArgs } from "react-router";
export declare function loader({ request, context }: LoaderFunctionArgs): Promise<{
    relationships: {
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
    }[];
    filters: {
        type: string;
    };
}>;
export default function RelationshipsIndex(): import("react/jsx-runtime").JSX.Element;
