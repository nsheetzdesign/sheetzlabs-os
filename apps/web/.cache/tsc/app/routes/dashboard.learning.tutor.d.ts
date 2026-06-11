import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
export declare function loader({ request, context }: LoaderFunctionArgs): Promise<{
    conversations: any;
    currentConversationId: string | null;
    messages: any[];
}>;
export declare function action({ request, context }: ActionFunctionArgs): Promise<{
    conversationId: any;
    message: any;
    success?: undefined;
    deleted?: undefined;
} | {
    success: boolean;
    conversationId?: undefined;
    message?: undefined;
    deleted?: undefined;
} | {
    success: boolean;
    deleted: string;
    conversationId?: undefined;
    message?: undefined;
} | null>;
export default function TutorPage(): import("react/jsx-runtime").JSX.Element;
