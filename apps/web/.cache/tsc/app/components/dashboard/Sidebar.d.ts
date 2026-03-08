interface SidebarProps {
    user?: {
        email?: string;
    };
    onOpenPalette: () => void;
}
export declare function Sidebar({ user, onOpenPalette }: SidebarProps): import("react/jsx-runtime").JSX.Element;
export {};
