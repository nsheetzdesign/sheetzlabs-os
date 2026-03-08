import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
export declare function loader({ request, context }: LoaderFunctionArgs): Promise<{}>;
export declare function action({ request, context }: ActionFunctionArgs): Promise<Response | import("react-router").UNSAFE_DataWithResponseInit<{
    error: string;
}>>;
export default function Login(): import("react/jsx-runtime").JSX.Element;
