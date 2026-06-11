interface Label {
    id: string;
    name: string;
    color: string;
    type: 'system' | 'user';
    icon?: string;
}
interface Account {
    id: string;
    email: string;
    labels: Label[];
}
interface Counts {
    inbox: number;
    starred: number;
    snoozed: number;
    drafts: number;
    spam: number;
    trash: number;
}
interface Props {
    accounts: Account[];
    counts: Record<string, Counts>;
    globalCounts: Counts;
    activeFolder: string;
    activeAccountId: string | null;
    activeLabel: string | null;
    onSelectFolder: (folder: string, accountId?: string | null) => void;
    onSelectLabel: (labelId: string, accountId: string) => void;
    onDragOver: (e: React.DragEvent, target: {
        type: 'folder' | 'label';
        id: string;
        accountId: string;
    }) => void;
    onDrop: (e: React.DragEvent, target: {
        type: 'folder' | 'label';
        id: string;
        accountId: string;
    }) => void;
}
export declare function InboxSidebar({ accounts, counts, globalCounts, activeFolder, activeAccountId, activeLabel, onSelectFolder, onSelectLabel, onDragOver, onDrop, }: Props): import("react/jsx-runtime").JSX.Element;
export {};
