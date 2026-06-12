import type { LinksFunction } from "react-router";
export declare const links: LinksFunction;
export declare function Layout({ children }: {
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export default function App(): import("react/jsx-runtime").JSX.Element;
/**
 * Top-level styled error boundary (BK-16). Without this, any thrown Response /
 * render error — including an invalid /book/:slug for an external guest — falls
 * through to React Router's unstyled default screen. Public /book* routes export
 * their own guest-appropriate boundaries that take precedence.
 */
export declare function ErrorBoundary(): import("react/jsx-runtime").JSX.Element;
