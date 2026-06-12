import type { LoaderFunctionArgs, ActionFunctionArgs, MetaFunction } from "react-router";
export { BookingErrorBoundary as ErrorBoundary } from "~/components/booking/BookingErrorBoundary";
export declare const meta: MetaFunction;
type AvailabilityRules = {
    date_range_days?: number;
};
type BookingLink = {
    slug: string;
    title: string;
    duration_minutes: number;
    availability_rules: AvailabilityRules;
};
type Booking = {
    id: string;
    guest_name: string;
    scheduled_at: string;
    duration_minutes: number;
    timezone: string;
    status: string;
    booking_links: BookingLink;
};
export declare function loader({ params, context }: LoaderFunctionArgs): Promise<{
    booking: Booking;
}>;
export declare function action({ params, request, context }: ActionFunctionArgs): Promise<{
    status: number;
} | null>;
export default function ReschedulePage(): import("react/jsx-runtime").JSX.Element;
