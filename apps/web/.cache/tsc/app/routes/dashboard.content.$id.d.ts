import type { LoaderFunctionArgs, MetaFunction } from "react-router";
export declare const meta: MetaFunction<typeof loader>;
export declare function loader({ params, context }: LoaderFunctionArgs): Promise<{
    item: ResultOne | null;
}>;
export default function ContentDetail(): import("react/jsx-runtime").JSX.Element;
