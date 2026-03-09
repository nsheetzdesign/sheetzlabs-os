import type { LoaderFunctionArgs, MetaFunction } from "react-router";
export declare const meta: MetaFunction;
export declare function loader({ request, context }: LoaderFunctionArgs): Promise<{
    emails: (({
        error: true;
    } & "column 'subject' does not exist on 'ventures'.") | ({
        error: true;
    } & "column 'subject' does not exist on 'tickets'.") | ({
        error: true;
    } & "column 'subject' does not exist on 'tasks'.") | ({
        error: true;
    } & "column 'subject' does not exist on 'pipeline'.") | ({
        error: true;
    } & "column 'subject' does not exist on 'revenue'.") | ({
        error: true;
    } & "column 'subject' does not exist on 'expenses'.") | ({
        error: true;
    } & "column 'subject' does not exist on 'relationships'.") | ({
        error: true;
    } & "column 'subject' does not exist on 'knowledge'.") | ({
        error: true;
    } & "column 'subject' does not exist on 'agents'.") | ({
        error: true;
    } & "column 'subject' does not exist on 'agent_actions'.") | ({
        error: true;
    } & "column 'subject' does not exist on 'agent_runs'.") | ({
        error: true;
    } & "column 'subject' does not exist on 'content_queue'.") | ({
        error: true;
    } & "column 'subject' does not exist on 'expense_connections'.") | ({
        error: true;
    } & "column 'subject' does not exist on 'interactions'.") | ({
        error: true;
    } & "column 'subject' does not exist on 'milestones'.") | ({
        error: true;
    } & "column 'subject' does not exist on 'stripe_connections'.") | ({
        error: true;
    } & "column 'subject' does not exist on 'stack_templates'.") | ({
        error: true;
    } & "column 'subject' does not exist on 'stripe_product_mappings'.") | ({
        error: true;
    } & "column 'subject' does not exist on 'venture_connections'.") | ({
        error: true;
    } & "column 'subject' does not exist on 'venture_docs'.") | ({
        error: true;
    } & "column 'subject' does not exist on 'venture_links'.") | ({
        error: true;
    } & "column 'subject' does not exist on 'venture_stack'."))[];
    accounts: (({
        error: true;
    } & "column 'email' does not exist on 'ventures'.") | ({
        error: true;
    } & "column 'email' does not exist on 'tickets'.") | ({
        error: true;
    } & "column 'email' does not exist on 'tasks'.") | ({
        error: true;
    } & "column 'email' does not exist on 'pipeline'.") | ({
        error: true;
    } & "column 'email' does not exist on 'revenue'.") | ({
        error: true;
    } & "column 'email' does not exist on 'expenses'.") | ({
        error: true;
    } & "column 'email' does not exist on 'relationships'.") | ({
        error: true;
    } & "column 'email' does not exist on 'knowledge'.") | ({
        error: true;
    } & "column 'email' does not exist on 'agents'.") | ({
        error: true;
    } & "column 'email' does not exist on 'agent_actions'.") | ({
        error: true;
    } & "column 'email' does not exist on 'agent_runs'.") | ({
        error: true;
    } & "column 'email' does not exist on 'content_queue'.") | ({
        error: true;
    } & "column 'email' does not exist on 'expense_connections'.") | ({
        error: true;
    } & "column 'email' does not exist on 'interactions'.") | ({
        error: true;
    } & "column 'email' does not exist on 'milestones'.") | ({
        error: true;
    } & "column 'email' does not exist on 'stripe_connections'.") | ({
        error: true;
    } & "column 'email' does not exist on 'stack_templates'.") | ({
        error: true;
    } & "column 'email' does not exist on 'stripe_product_mappings'.") | ({
        error: true;
    } & "column 'email' does not exist on 'venture_connections'.") | ({
        error: true;
    } & "column 'email' does not exist on 'venture_docs'.") | ({
        error: true;
    } & "column 'email' does not exist on 'venture_links'.") | ({
        error: true;
    } & "column 'email' does not exist on 'venture_stack'."))[];
    aliases: (({
        error: true;
    } & "column 'account_id' does not exist on 'ventures'.") | ({
        error: true;
    } & "column 'account_id' does not exist on 'tickets'.") | ({
        error: true;
    } & "column 'account_id' does not exist on 'tasks'.") | ({
        error: true;
    } & "column 'account_id' does not exist on 'pipeline'.") | ({
        error: true;
    } & "column 'account_id' does not exist on 'revenue'.") | ({
        error: true;
    } & "column 'account_id' does not exist on 'expenses'.") | ({
        error: true;
    } & "column 'account_id' does not exist on 'relationships'.") | ({
        error: true;
    } & "column 'account_id' does not exist on 'knowledge'.") | ({
        error: true;
    } & "column 'account_id' does not exist on 'agents'.") | ({
        error: true;
    } & "column 'account_id' does not exist on 'agent_actions'.") | ({
        error: true;
    } & "column 'account_id' does not exist on 'agent_runs'.") | ({
        error: true;
    } & "column 'account_id' does not exist on 'content_queue'.") | ({
        error: true;
    } & "column 'account_id' does not exist on 'expense_connections'.") | ({
        error: true;
    } & "column 'account_id' does not exist on 'interactions'.") | ({
        error: true;
    } & "column 'account_id' does not exist on 'milestones'.") | ({
        error: true;
    } & "column 'account_id' does not exist on 'stripe_connections'.") | ({
        error: true;
    } & "column 'account_id' does not exist on 'stack_templates'.") | ({
        error: true;
    } & "column 'account_id' does not exist on 'stripe_product_mappings'.") | ({
        error: true;
    } & "column 'account_id' does not exist on 'venture_connections'.") | ({
        error: true;
    } & "column 'account_id' does not exist on 'venture_docs'.") | ({
        error: true;
    } & "column 'account_id' does not exist on 'venture_links'.") | ({
        error: true;
    } & "column 'account_id' does not exist on 'venture_stack'."))[];
    category: string;
    unreadOnly: boolean;
    unreadCount: number;
}>;
export default function InboxIndex(): import("react/jsx-runtime").JSX.Element;
