import type { LoaderFunctionArgs } from "react-router";
export declare function loader({ request, context }: LoaderFunctionArgs): Promise<{
    paths: never[];
    error: string;
} | {
    paths: any;
    error?: undefined;
}>;
export default function LearningPathsPage(): import("react/jsx-runtime").JSX.Element;
