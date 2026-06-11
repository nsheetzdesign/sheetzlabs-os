interface Props {
    emailId: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    position?: {
        x: number;
        y: number;
    };
}
export declare function SnoozePicker({ emailId, isOpen, onClose, onSuccess, position }: Props): import("react/jsx-runtime").JSX.Element | null;
export {};
