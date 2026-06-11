import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "react-router";
export declare const meta: MetaFunction;
export declare function loader({ request, context }: LoaderFunctionArgs): Promise<{
    conversations: {
        id: string;
        title: string | null;
        department: string | null;
        last_message_at: string | null;
        message_count: number | null;
    }[];
    messages: any[];
    activeConversation: any;
    department: string | null;
}>;
export declare function action({ request, context }: ActionFunctionArgs): Promise<unknown>;
export default function Chat(): import("react/jsx-runtime").JSX.Element;
