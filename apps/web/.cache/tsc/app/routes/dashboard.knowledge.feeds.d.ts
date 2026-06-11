import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "react-router";
export declare const meta: MetaFunction;
export declare function loader({ context }: LoaderFunctionArgs): Promise<{
    feeds: {
        category: string | null;
        created_at: string | null;
        enabled: boolean | null;
        feed_type: string | null;
        id: string;
        last_fetched_at: string | null;
        name: string;
        url: string;
    }[];
    unreadItems: {
        content: string | null;
        created_at: string | null;
        external_id: string;
        id: string;
        is_read: boolean | null;
        is_saved: boolean | null;
        knowledge_id: string | null;
        published_at: string | null;
        source_id: string | null;
        summary: string | null;
        title: string;
        url: string | null;
        feed_sources: {
            name: string;
            category: string | null;
        } | null;
    }[];
}>;
export declare function action({ request, context }: ActionFunctionArgs): Promise<import("react-router").UNSAFE_DataWithResponseInit<{
    error: string;
}> | {
    feed: any;
    ok?: undefined;
    added?: undefined;
    item?: undefined;
} | {
    ok: boolean;
    feed?: undefined;
    added?: undefined;
    item?: undefined;
} | {
    added: any;
    feed?: undefined;
    ok?: undefined;
    item?: undefined;
} | {
    item: any;
    feed?: undefined;
    ok?: undefined;
    added?: undefined;
}>;
export default function Feeds(): import("react/jsx-runtime").JSX.Element;
