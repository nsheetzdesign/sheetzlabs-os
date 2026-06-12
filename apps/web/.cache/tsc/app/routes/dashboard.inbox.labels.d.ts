import type { ActionFunctionArgs } from 'react-router';
/**
 * Create-label target for the InboxSidebar (EU-8). Previously posted to an
 * unregistered route (silent 404). Routes through the 52A Gmail-first
 * `POST /email/labels`, so the label is created in Gmail and applyable there.
 */
export declare function action({ request, context }: ActionFunctionArgs): Promise<Response>;
