import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "react-router";
export declare const meta: MetaFunction;
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
export default function NewKnowledge(): import("react/jsx-runtime").JSX.Element;
