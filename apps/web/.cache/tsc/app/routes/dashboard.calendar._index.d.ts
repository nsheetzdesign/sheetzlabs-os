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
    events: {
        id: string;
        title: string;
        start_at: string;
        end_at: string;
        is_time_block: boolean | null;
        all_day: boolean | null;
        account_id: string | null;
        task_id: string | null;
        google_calendar_id: string | null;
    }[];
    accounts: {
        id: string;
        email: string;
        color: string | null;
        sync_enabled: boolean | null;
        last_sync_at: string | null;
    }[];
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
export declare function action({ request, context }: ActionFunctionArgs): Promise<Response | null>;
export default function CalendarPage(): import("react/jsx-runtime").JSX.Element;
export {};
