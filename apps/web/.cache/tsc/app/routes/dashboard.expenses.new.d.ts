import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
export declare function loader({ request, context }: LoaderFunctionArgs): Promise<import("react-router").UNSAFE_DataWithResponseInit<{
    ventures: {
        id: string;
        name: string;
        slug: string;
    }[];
}>>;
export declare function action({ request, context }: ActionFunctionArgs): Promise<Response | import("react-router").UNSAFE_DataWithResponseInit<{
    error: string;
}>>;
export default function NewExpense(): import("react/jsx-runtime").JSX.Element;
