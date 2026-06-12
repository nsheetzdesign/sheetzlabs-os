import type { ActionFunctionArgs } from 'react-router';
/**
 * Draft autosave target (EC-3). The ComposeModal posts here every 30s; previously
 * this route didn't exist and every save 404'd, losing the draft on close.
 *
 * Creates a draft on first save (no `id`) and PATCHes the same row thereafter, so
 * close-and-reopen can restore the body. Routes through the API worker's drafts
 * endpoints via the founder's JWT.
 */
export declare function action({ request, context }: ActionFunctionArgs): Promise<Response>;
