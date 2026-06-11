import type { ActionFunctionArgs } from "react-router";
/**
 * Authenticated Gmail OAuth initiation (Prompt 51B). The "Connect Gmail" button
 * posts here; we call the API's authenticated start endpoint (which binds a
 * user-scoped `state` nonce) and redirect the browser to the returned Google URL.
 */
export declare function action({ request, context }: ActionFunctionArgs): Promise<Response>;
