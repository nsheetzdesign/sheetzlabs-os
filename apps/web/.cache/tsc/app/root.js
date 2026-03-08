import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, } from "react-router";
import appCss from "./app.css?url";
export const links = () => [
    { rel: "stylesheet", href: appCss },
];
export function Layout({ children }) {
    return (_jsxs("html", { lang: "en", children: [_jsxs("head", { children: [_jsx("meta", { charSet: "utf-8" }), _jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }), _jsx(Meta, {}), _jsx(Links, {})] }), _jsxs("body", { className: "bg-surface-0 text-white antialiased", children: [children, _jsx(ScrollRestoration, {}), _jsx(Scripts, {})] })] }));
}
export default function App() {
    return _jsx(Outlet, {});
}
