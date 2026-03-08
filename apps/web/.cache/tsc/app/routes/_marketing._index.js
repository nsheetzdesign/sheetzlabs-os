import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { redirect } from "react-router";
import { Zap, Box, Cpu, ArrowUpRight, ChevronRight } from "lucide-react";
export async function loader({ request }) {
    const host = request.headers.get("host") ?? "";
    if (host.startsWith("app.")) {
        return redirect("/dashboard");
    }
    return null;
}
export const meta = () => [
    { title: "Sheetz Labs — Operator-Built Software" },
    {
        name: "description",
        content: "AI-native tools built for operators. Vertical software designed by a founder who runs real businesses.",
    },
];
// ─── Hero ────────────────────────────────────────────────────────────────────
function Hero() {
    return (_jsx("section", { className: "mx-auto max-w-6xl px-6 pb-24 pt-32", children: _jsxs("div", { className: "max-w-3xl", children: [_jsxs("div", { className: "mb-6 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-3 py-1 text-xs font-medium text-brand", children: [_jsx(Zap, { className: "h-3 w-3" }), "Operator-Built Software"] }), _jsxs("h1", { className: "mb-6 text-5xl font-semibold leading-tight tracking-tight text-white md:text-6xl", children: ["Software built by", " ", _jsx("span", { className: "text-brand", children: "operators," }), _jsx("br", {}), "for operators."] }), _jsx("p", { className: "mb-10 max-w-xl text-lg font-light leading-relaxed text-zinc-400", children: "Sheetz Labs builds AI-native vertical software for the industries we run. No generic SaaS. No outside investors. Just tools that solve real problems we've lived firsthand." }), _jsxs("div", { className: "flex flex-wrap gap-4", children: [_jsxs("a", { href: "#products", className: "flex items-center gap-2 rounded-lg bg-brand px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-dark", children: ["View Products", _jsx(ChevronRight, { className: "h-4 w-4" })] }), _jsxs("a", { href: "mailto:nick@sheetzlabs.com", className: "flex items-center gap-2 rounded-lg border border-surface-3 px-6 py-3 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white", children: ["Get in Touch", _jsx(ArrowUpRight, { className: "h-4 w-4" })] })] })] }) }));
}
// ─── Stats ───────────────────────────────────────────────────────────────────
function Stats() {
    const stats = [
        { value: "500+", label: "Automations Running" },
        { value: "15+", label: "Years Operating" },
        { value: "1", label: "Founder, Zero Dilution" },
    ];
    return (_jsx("section", { className: "border-y border-surface-2/50 bg-surface-1/30", children: _jsx("div", { className: "mx-auto max-w-6xl px-6 py-12", children: _jsx("div", { className: "grid grid-cols-1 gap-8 md:grid-cols-3", children: stats.map((s) => (_jsxs("div", { className: "text-center md:text-left", children: [_jsx("div", { className: "text-3xl font-semibold text-brand", children: s.value }), _jsx("div", { className: "mt-1 text-sm text-zinc-500", children: s.label })] }, s.label))) }) }) }));
}
// ─── Principles ──────────────────────────────────────────────────────────────
function Principles() {
    const items = [
        {
            icon: _jsx(Cpu, { className: "h-5 w-5 text-brand" }),
            title: "AI-Native",
            body: "Every tool is built from the ground up around AI workflows. Not retrofitted. Not bolted on. Designed to think.",
        },
        {
            icon: _jsx(Box, { className: "h-5 w-5 text-brand" }),
            title: "Vertical Focus",
            body: "We go deep in one industry at a time. Deep product knowledge beats broad surface area every time.",
        },
        {
            icon: _jsx(Zap, { className: "h-5 w-5 text-brand" }),
            title: "Operator-Built",
            body: "We run the businesses we build for. That means we feel every bug, every missing feature, every slow workflow.",
        },
    ];
    return (_jsxs("section", { id: "principles", className: "mx-auto max-w-6xl px-6 py-24", children: [_jsxs("div", { className: "mb-12", children: [_jsx("p", { className: "mb-2 font-mono text-xs uppercase tracking-widest text-brand", children: "How we think" }), _jsx("h2", { className: "text-3xl font-semibold text-white", children: "Principles" })] }), _jsx("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-3", children: items.map((item) => (_jsxs("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/40 p-6 backdrop-blur-sm", children: [_jsx("div", { className: "mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-brand/20 bg-brand/10", children: item.icon }), _jsx("h3", { className: "mb-2 font-semibold text-white", children: item.title }), _jsx("p", { className: "text-sm leading-relaxed text-zinc-400", children: item.body })] }, item.title))) })] }));
}
// ─── Products ────────────────────────────────────────────────────────────────
function Products() {
    const products = [
        {
            name: "Back of House Pro",
            tag: "Live",
            tagColor: "text-brand border-brand/20 bg-brand/10",
            description: "Operations management platform for houses of worship. Volunteer scheduling, asset tracking, facility management, and AI-powered workflows.",
            href: "https://backofhousepro.com",
            cta: "Visit Site",
        },
        {
            name: "Sheetz Labs OS",
            tag: "In Development",
            tagColor: "text-zinc-400 border-surface-3 bg-surface-2/50",
            description: "Founder operating system. Personal CRM, deal pipeline, task management, and AI briefings — all synced to how a single-operator business actually runs.",
            href: null,
            cta: "Coming Soon",
        },
        {
            name: "Next Product",
            tag: "Research",
            tagColor: "text-zinc-600 border-surface-2 bg-surface-1/50",
            description: "We identify the next vertical by running it ourselves first. The next tool is already in motion.",
            href: null,
            cta: "Stay Tuned",
        },
    ];
    return (_jsx("section", { id: "products", className: "border-t border-surface-2/50 bg-surface-1/20", children: _jsxs("div", { className: "mx-auto max-w-6xl px-6 py-24", children: [_jsxs("div", { className: "mb-12", children: [_jsx("p", { className: "mb-2 font-mono text-xs uppercase tracking-widest text-brand", children: "What we ship" }), _jsx("h2", { className: "text-3xl font-semibold text-white", children: "Products" })] }), _jsx("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-3", children: products.map((p) => (_jsxs("div", { className: "flex flex-col rounded-xl border border-surface-2/50 bg-surface-1/40 p-6 backdrop-blur-sm", children: [_jsxs("div", { className: "mb-4 flex items-start justify-between", children: [_jsx("h3", { className: "font-semibold text-white", children: p.name }), _jsx("span", { className: `rounded-full border px-2 py-0.5 font-mono text-xs ${p.tagColor}`, children: p.tag })] }), _jsx("p", { className: "mb-6 flex-1 text-sm leading-relaxed text-zinc-400", children: p.description }), p.href ? (_jsxs("a", { href: p.href, target: "_blank", rel: "noopener noreferrer", className: "flex items-center gap-1.5 text-sm font-medium text-brand transition-colors hover:text-brand-light", children: [p.cta, _jsx(ArrowUpRight, { className: "h-4 w-4" })] })) : (_jsx("span", { className: "text-sm text-zinc-600", children: p.cta }))] }, p.name))) })] }) }));
}
// ─── How We Build ────────────────────────────────────────────────────────────
function HowWeBuild() {
    return (_jsx("section", { id: "build", className: "mx-auto max-w-6xl px-6 py-24", children: _jsxs("div", { className: "grid grid-cols-1 gap-16 md:grid-cols-2 md:items-center", children: [_jsxs("div", { children: [_jsx("p", { className: "mb-2 font-mono text-xs uppercase tracking-widest text-brand", children: "The method" }), _jsx("h2", { className: "mb-6 text-3xl font-semibold text-white", children: "How We Build" }), _jsxs("div", { className: "space-y-4 text-sm leading-relaxed text-zinc-400", children: [_jsx("p", { children: "We operate the business first. Every product starts with us running the exact workflow the software will eventually automate. That means we know the pain better than any customer interview." }), _jsx("p", { children: "Then we build fast \u2014 AI-assisted, production-first, no internal tooling theater. If it's not deployed, it doesn't count." }), _jsx("p", { children: "We ship to ourselves first, then open to early operators. Tight feedback loop, zero committee decisions." })] })] }), _jsxs("div", { className: "rounded-xl border border-surface-2/50 bg-surface-1/60 p-6 backdrop-blur-sm", children: [_jsxs("div", { className: "mb-3 flex items-center gap-2", children: [_jsx("div", { className: "h-3 w-3 rounded-full bg-red-500/70" }), _jsx("div", { className: "h-3 w-3 rounded-full bg-yellow-500/70" }), _jsx("div", { className: "h-3 w-3 rounded-full bg-green-500/70" }), _jsx("span", { className: "ml-2 font-mono text-xs text-zinc-600", children: "sheetzlabs-os / loop.ts" })] }), _jsx("pre", { className: "overflow-x-auto font-mono text-xs leading-relaxed text-zinc-300", children: _jsx("code", { children: `async function operatorLoop() {
  const context = await getFounderContext({
    deals: pipeline.active,
    tasks: inbox.prioritized,
    signals: crm.recentActivity,
  });

  const brief = await ai.synthesize(context);

  return {
    todaysFocus: brief.topPriority,
    blockers:    brief.risksToAddress,
    momentum:    brief.winsToCapture,
  };
}

// Runs every morning at 6am
schedule("0 6 * * *", operatorLoop);` }) })] })] }) }));
}
// ─── CTA ─────────────────────────────────────────────────────────────────────
function CTA() {
    return (_jsx("section", { className: "border-t border-surface-2/50 bg-surface-1/20", children: _jsxs("div", { className: "mx-auto max-w-6xl px-6 py-24 text-center", children: [_jsx("p", { className: "mb-2 font-mono text-xs uppercase tracking-widest text-brand", children: "Let's talk" }), _jsx("h2", { className: "mb-4 text-3xl font-semibold text-white", children: "Building something for operators?" }), _jsx("p", { className: "mx-auto mb-10 max-w-md text-zinc-400", children: "Whether you're an operator with a problem worth solving, or a collaborator who wants to build alongside us \u2014 we want to hear from you." }), _jsxs("a", { href: "mailto:nick@sheetzlabs.com", className: "inline-flex items-center gap-2 rounded-lg bg-brand px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-dark", children: ["Get in Touch", _jsx(ArrowUpRight, { className: "h-4 w-4" })] })] }) }));
}
// ─── Page ────────────────────────────────────────────────────────────────────
export default function Index() {
    return (_jsxs(_Fragment, { children: [_jsx(Hero, {}), _jsx(Stats, {}), _jsx(Principles, {}), _jsx(Products, {}), _jsx(HowWeBuild, {}), _jsx(CTA, {})] }));
}
