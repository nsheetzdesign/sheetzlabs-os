import type { ActionFunctionArgs } from "react-router";
export declare function action({ params, request, context }: ActionFunctionArgs): Promise<{
    success: boolean;
}>;
