import type { LoaderFunctionArgs, ActionFunctionArgs, MetaFunction } from "react-router";
export declare const meta: MetaFunction<typeof loader>;
export declare function loader({ params, request, context }: LoaderFunctionArgs): Promise<{
    event: {
        account_id: string | null;
        ai_prep_doc_id: string | null;
        ai_prep_generated: boolean | null;
        all_day: boolean | null;
        attendees: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        description: string | null;
        end_at: string;
        external_id: string;
        google_calendar_id: string | null;
        id: string;
        is_time_block: boolean | null;
        location: string | null;
        meeting_link: string | null;
        organizer_email: string | null;
        recurrence_rule: string | null;
        recurring: boolean | null;
        start_at: string;
        status: string | null;
        sub_account_id: string | null;
        task_id: string | null;
        timezone: string | null;
        title: string;
        updated_at: string | null;
        calendar_accounts: {
            email: string;
            color: string | null;
        } | null;
        tasks: {
            id: string;
            title: string;
            status: "done" | "backlog" | "todo" | "in-progress" | "review" | "blocked" | null;
        } | null;
        knowledge: {
            id: string;
            title: string;
        } | null;
    };
    tz: string;
}>;
export declare function action({ params, request, context }: ActionFunctionArgs): Promise<Response | null>;
export default function CalendarEventDetail(): import("react/jsx-runtime").JSX.Element;
