interface Tab {
    to: string;
    label: string;
    end?: boolean;
}
interface PageTabsProps {
    tabs: Tab[];
}
export declare function PageTabs({ tabs }: PageTabsProps): import("react/jsx-runtime").JSX.Element;
export {};
