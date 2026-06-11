import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
export declare function loader({ request, context, params }: LoaderFunctionArgs): Promise<Response>;
export declare function action({ request, context, params }: ActionFunctionArgs): Promise<Response>;
