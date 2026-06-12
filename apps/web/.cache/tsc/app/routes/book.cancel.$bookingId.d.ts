import type { LoaderFunctionArgs } from "react-router";
export { BookingErrorBoundary as ErrorBoundary } from "~/components/booking/BookingErrorBoundary";
type Booking = {
    id: string;
    guest_name: string;
    guest_email: string;
    scheduled_at: string;
    duration_minutes: number;
    timezone: string;
    status: string;
    booking_links: {
        title: string;
    };
};
export declare function loader({ params, context }: LoaderFunctionArgs): Promise<{
    booking: Booking;
    apiUrl: string;
}>;
export default function CancelBookingPage(): import("react/jsx-runtime").JSX.Element;
