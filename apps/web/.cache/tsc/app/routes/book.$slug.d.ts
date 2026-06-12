import type { LoaderFunctionArgs, ActionFunctionArgs, MetaFunction } from "react-router";
export { BookingErrorBoundary as ErrorBoundary } from "~/components/booking/BookingErrorBoundary";
export declare const meta: MetaFunction<typeof loader>;
type AvailabilityRules = {
    timezone?: string;
    days?: Record<string, {
        enabled: boolean;
        slots: Array<{
            start: string;
            end: string;
        }>;
    }>;
    buffer_after_minutes?: number;
    minimum_notice_hours?: number;
    date_range_days?: number;
};
type BookingLink = {
    id: string;
    slug: string;
    title: string;
    description?: string;
    duration_minutes: number;
    availability_rules: AvailabilityRules;
};
export declare function loader({ params, context }: LoaderFunctionArgs): Promise<{
    link: BookingLink;
    apiUrl: string;
}>;
export declare function action({ params, request, context }: ActionFunctionArgs): Promise<{
    status: number;
} | null>;
export default function BookingPage(): import("react/jsx-runtime").JSX.Element;
