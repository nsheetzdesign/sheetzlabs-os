import type { LoaderFunctionArgs, ActionFunctionArgs, MetaFunction } from "react-router";
export declare const meta: MetaFunction;
type Booking = {
    id: string;
    guest_name: string;
    guest_email: string;
    guest_notes?: string;
    scheduled_at: string;
    duration_minutes: number;
    timezone: string;
    status: string;
    meet_link?: string;
    booking_links?: {
        title: string;
        slug: string;
    };
};
export declare function loader({ request, context }: LoaderFunctionArgs): Promise<{
    bookings: Booking[];
}>;
export declare function action({ request, context }: ActionFunctionArgs): Promise<null>;
export default function BookingsPage(): import("react/jsx-runtime").JSX.Element;
export {};
