import type { InputHTMLAttributes } from "react";
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
}
export declare function Input({ error, className, ...props }: InputProps): import("react/jsx-runtime").JSX.Element;
export {};
