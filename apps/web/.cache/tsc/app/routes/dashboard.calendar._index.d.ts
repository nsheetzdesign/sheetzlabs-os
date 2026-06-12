import type { LoaderFunctionArgs, ActionFunctionArgs, MetaFunction } from "react-router";
import { type DayDescriptor } from "~/lib/tz";
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
    events: ({
        error: true;
    } & "column 'all_day_end_date' does not exist on 'calendar_events'.")[];
    accounts: ({
        error: true;
    } & "column 'needs_reauth' does not exist on 'calendar_accounts'.")[];
    reauthAccounts: {
        id: any;
        email: any;
    }[];
    tasks: {
        id: string;
        title: string;
        due_date: string | null;
        priority: "high" | "low" | "urgent" | "medium" | null;
        status: "done" | "backlog" | "todo" | "in-progress" | "review" | "blocked" | null;
    }[];
    subCalendars: SubCalendarEntry[];
    view: string;
    offset: number;
    days: DayDescriptor[];
    tz: string;
    tzKnown: boolean;
}>;
export declare function action({ request, context }: ActionFunctionArgs): Promise<Response | null>;
export default function CalendarPage(): import("react/jsx-runtime").JSX.Element;
export {};
