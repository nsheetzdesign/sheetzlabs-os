import type { LoaderFunctionArgs } from "react-router";
export declare function loader({ request, context }: LoaderFunctionArgs): Promise<import("react-router").UNSAFE_DataWithResponseInit<{
    user: {
        email: string | undefined;
    };
}>>;
export default function DashboardLayout(): import("react/jsx-runtime").JSX.Element;
