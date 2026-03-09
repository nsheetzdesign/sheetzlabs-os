import type { LoaderFunctionArgs, MetaFunction } from "react-router";
export declare const meta: MetaFunction;
export declare function loader({ request, context }: LoaderFunctionArgs): Promise<{
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
    replyTo: {
        id: string;
        from_email: string | null;
        from_name: string | null;
        subject: string | null;
    } | null;
    drafts: (({
        error: true;
    } & "column 'to_emails' does not exist on 'ventures'.") | ({
        error: true;
    } & "column 'to_emails' does not exist on 'tickets'.") | ({
        error: true;
    } & "column 'to_emails' does not exist on 'tasks'.") | ({
        error: true;
    } & "column 'to_emails' does not exist on 'pipeline'.") | ({
        error: true;
    } & "column 'to_emails' does not exist on 'revenue'.") | ({
        error: true;
    } & "column 'to_emails' does not exist on 'expenses'.") | ({
        error: true;
    } & "column 'to_emails' does not exist on 'relationships'.") | ({
        error: true;
    } & "column 'to_emails' does not exist on 'knowledge'.") | ({
        error: true;
    } & "column 'to_emails' does not exist on 'agents'.") | ({
        error: true;
    } & "column 'to_emails' does not exist on 'agent_actions'.") | ({
        error: true;
    } & "column 'to_emails' does not exist on 'agent_runs'.") | ({
        error: true;
    } & "column 'to_emails' does not exist on 'content_queue'.") | ({
        error: true;
    } & "column 'to_emails' does not exist on 'expense_connections'.") | ({
        error: true;
    } & "column 'to_emails' does not exist on 'interactions'.") | ({
        error: true;
    } & "column 'to_emails' does not exist on 'milestones'.") | ({
        error: true;
    } & "column 'to_emails' does not exist on 'stripe_connections'.") | ({
        error: true;
    } & "column 'to_emails' does not exist on 'stack_templates'.") | ({
        error: true;
    } & "column 'to_emails' does not exist on 'stripe_product_mappings'.") | ({
        error: true;
    } & "column 'to_emails' does not exist on 'venture_connections'.") | ({
        error: true;
    } & "column 'to_emails' does not exist on 'venture_docs'.") | ({
        error: true;
    } & "column 'to_emails' does not exist on 'venture_links'.") | ({
        error: true;
    } & "column 'to_emails' does not exist on 'venture_stack'."))[];
}>;
export default function ComposeEmail(): import("react/jsx-runtime").JSX.Element;
