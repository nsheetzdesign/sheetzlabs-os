import type { ComponentType } from "react";
export declare function EmptyState({ icon: Icon, title, description, action, }: {
    icon?: ComponentType<{
        className?: string;
    }>;
    title: string;
    description?: string;
    action?: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
