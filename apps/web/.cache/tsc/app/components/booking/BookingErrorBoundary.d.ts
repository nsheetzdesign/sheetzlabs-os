/**
 * Guest-facing error boundary for the public /book* routes (BK-16). An invalid
 * slug/UUID throws a Response(404) that must never show an external guest the
 * unstyled React Router default. Copy is intentionally guest-appropriate.
 */
export declare function BookingErrorBoundary(): import("react/jsx-runtime").JSX.Element;
