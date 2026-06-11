import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
export declare function loader({ request, params, context }: LoaderFunctionArgs): Promise<{
    lesson: any;
}>;
export declare function action({ request, params, context }: ActionFunctionArgs): Promise<{
    error: string;
    success?: undefined;
} | {
    success: boolean;
    error?: undefined;
}>;
export default function LessonPage(): import("react/jsx-runtime").JSX.Element;
