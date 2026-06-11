import type { LoaderFunctionArgs, MetaFunction } from "react-router";
export declare const meta: MetaFunction<typeof loader>;
export declare function loader({ params, context }: LoaderFunctionArgs): Promise<{
    item: {
        agent_run_id: string | null;
        body: string | null;
        clicks: number | null;
        comments: number | null;
        created_at: string | null;
        excerpt: string | null;
        id: string;
        knowledge_id: string | null;
        likes: number | null;
        parent_id: string | null;
        platform_id: string | null;
        platform_url: string | null;
        published_at: string | null;
        reading_time: number | null;
        scheduled_for: string | null;
        shares: number | null;
        status: string | null;
        tags: string[] | null;
        title: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        views: number | null;
        word_count: number | null;
        ventures: {
            id: string;
            name: string;
            slug: string;
        } | null;
        parent: {
            id: string;
            title: string;
            type: string;
        } | null;
        children: {
            id: string;
            title: string;
            type: string;
            status: string | null;
            platform_url: string | null;
        }[];
        knowledge: {
            id: string;
            title: string;
        } | null;
    } | null;
}>;
export default function ContentDetail(): import("react/jsx-runtime").JSX.Element;
