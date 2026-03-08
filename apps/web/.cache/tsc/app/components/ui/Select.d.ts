import type { SelectHTMLAttributes } from "react";
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    error?: boolean;
}
export declare function Select({ error, className, children, ...props }: SelectProps): import("react/jsx-runtime").JSX.Element;
export {};
