interface SidebarProps {
    user?: {
        email?: string;
    };
    onOpenPalette: () => void;
    collapsed?: boolean;
    onToggle?: () => void;
}
export declare function Sidebar({ user, onOpenPalette, collapsed, onToggle }: SidebarProps): import("react/jsx-runtime").JSX.Element;
export {};
