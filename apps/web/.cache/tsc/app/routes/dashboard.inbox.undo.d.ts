import type { ActionFunctionArgs } from 'react-router';
/**
 * Undo a reversible inbox action (Prompt 54A Part 1). The undo toast posts the
 * affected ids + original action so the inverse mutation replays precisely; the
 * `z` shortcut posts an empty body meaning "undo my most recent action". Both
 * route through the API's write-back-aware /email/undo so the reversal lands in
 * Gmail too.
 */
export declare function action({ request, context }: ActionFunctionArgs): Promise<Response>;
