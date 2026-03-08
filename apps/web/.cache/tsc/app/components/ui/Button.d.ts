import type { ButtonHTMLAttributes } from "react";
type Variant = "primary" | "secondary" | "danger";
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
}
export declare function Button({ variant, className, children, ...props }: ButtonProps): import("react/jsx-runtime").JSX.Element;
export {};
