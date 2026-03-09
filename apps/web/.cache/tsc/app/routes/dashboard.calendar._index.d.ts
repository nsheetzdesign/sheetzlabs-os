import type { LoaderFunctionArgs, ActionFunctionArgs, MetaFunction } from "react-router";
export declare const meta: MetaFunction;
type SubCalendar = {
    id: string;
    external_id: string;
    name: string;
    color: string;
    is_visible: boolean;
};
type SubCalendarEntry = {
    accountId: string;
    calendars: SubCalendar[];
};
export declare function loader({ request, context }: LoaderFunctionArgs): Promise<{
    events: (({
        error: true;
    } & "column 'title' does not exist on 'ventures'.") | ({
        error: true;
    } & "column 'title' does not exist on 'tickets'.") | ({
        error: true;
    } & "column 'title' does not exist on 'tasks'.") | ({
        error: true;
    } & "column 'title' does not exist on 'pipeline'.") | ({
        error: true;
    } & "column 'title' does not exist on 'revenue'.") | ({
        error: true;
    } & "column 'title' does not exist on 'expenses'.") | ({
        error: true;
    } & "column 'title' does not exist on 'relationships'.") | ({
        error: true;
    } & "column 'title' does not exist on 'knowledge'.") | ({
        error: true;
    } & "column 'title' does not exist on 'agents'.") | ({
        error: true;
    } & "column 'title' does not exist on 'agent_actions'.") | ({
        error: true;
    } & "column 'title' does not exist on 'agent_runs'.") | ({
        error: true;
    } & "column 'title' does not exist on 'content_queue'.") | ({
        error: true;
    } & "column 'title' does not exist on 'expense_connections'.") | ({
        error: true;
    } & "column 'title' does not exist on 'interactions'.") | ({
        error: true;
    } & "column 'title' does not exist on 'milestones'.") | ({
        error: true;
    } & "column 'title' does not exist on 'stripe_connections'.") | ({
        error: true;
    } & "column 'title' does not exist on 'stack_templates'.") | ({
        error: true;
    } & "column 'title' does not exist on 'stripe_product_mappings'.") | ({
        error: true;
    } & "column 'title' does not exist on 'venture_connections'.") | ({
        error: true;
    } & "column 'title' does not exist on 'venture_docs'.") | ({
        error: true;
    } & "column 'title' does not exist on 'venture_links'.") | ({
        error: true;
    } & "column 'title' does not exist on 'venture_stack'."))[];
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
    tasks: {
        id: string;
        title: string;
        due_date: string | null;
        priority: "urgent" | "high" | "medium" | "low" | null;
        status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
    }[];
    subCalendars: SubCalendarEntry[];
    view: string;
    weekOffset: number;
    weekStart: string;
}>;
export declare function action({ request, context }: ActionFunctionArgs): Promise<null>;
export default function Calendar(): import("react/jsx-runtime").JSX.Element;
export {};
