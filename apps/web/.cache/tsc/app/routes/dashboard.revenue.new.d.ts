import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
export declare function loader({ context }: LoaderFunctionArgs): Promise<{
    ventures: {
        id: string;
        name: string;
        slug: string;
    }[];
}>;
export declare function action({ request, context }: ActionFunctionArgs): Promise<Response | import("react-router").UNSAFE_DataWithResponseInit<{
    errors: Record<string, string>;
}> | import("react-router").UNSAFE_DataWithResponseInit<{
    errors: {
        _form: string;
    };
}>>;
export default function NewRevenue(): import("react/jsx-runtime").JSX.Element;
