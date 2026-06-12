import type { ActionFunctionArgs } from 'react-router';
/**
 * Real send (EC-2). Routes through the API worker's send path — the one real
 * implementation — instead of inserting a fake "sent" draft row. Creates the
 * draft, then sends it; returns a structured result the ComposeModal reads so it
 * can keep itself open with an inline error on failure (no close-before-resolve).
 */
export declare function action({ request, context }: ActionFunctionArgs): Promise<Response>;
