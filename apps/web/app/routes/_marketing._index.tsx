import { redirect, type LoaderFunctionArgs, type MetaFunction } from "react-router";
import { Zap, Box, Cpu, ArrowUpRight, ChevronRight } from "lucide-react";

export async function loader({ request }: LoaderFunctionArgs) {
  const host = request.headers.get("host") ?? "";
  if (host.startsWith("app.")) {
    return redirect("/dashboard");
  }
  return null;
}

export const meta: MetaFunction = () => [
  { title: "Sheetz Labs — Operator-Built Software" },
  {
    name: "description",
    content:
      "AI-native tools built for operators. Vertical software designed by a founder who runs real businesses.",
  },
];

// ─── Hero ────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <div className="max-w-3xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-3 py-1 text-xs font-medium text-brand">
          <Zap className="h-3 w-3" />
          Operator-Built Software
        </div>

        <h1 className="mb-6 text-5xl font-semibold leading-tight tracking-tight text-white md:text-6xl">
          Software built by{" "}
          <span className="text-brand">operators,</span>
          <br />
          for operators.
        </h1>

        <p className="mb-10 max-w-xl text-lg font-light leading-relaxed text-zinc-400">
          Sheetz Labs builds AI-native vertical software for the industries we
          run. No generic SaaS. No outside investors. Just tools that solve real
          problems we&apos;ve lived firsthand.
        </p>

        <div className="flex flex-wrap gap-4">
          <a
            href="#products"
            className="flex items-center gap-2 rounded-lg bg-brand px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
          >
            View Products
            <ChevronRight className="h-4 w-4" />
          </a>
          <a
            href="mailto:nick@sheetzlabs.com"
            className="flex items-center gap-2 rounded-lg border border-surface-3 px-6 py-3 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
          >
            Get in Touch
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Stats ───────────────────────────────────────────────────────────────────

function Stats() {
  const stats = [
    { value: "500+", label: "Automations Running" },
    { value: "15+", label: "Years Operating" },
    { value: "1", label: "Founder, Zero Dilution" },
  ];

  return (
    <section className="border-y border-surface-2/50 bg-surface-1/30">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="text-center md:text-left">
              <div className="text-3xl font-semibold text-brand">{s.value}</div>
              <div className="mt-1 text-sm text-zinc-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Principles ──────────────────────────────────────────────────────────────

function Principles() {
  const items = [
    {
      icon: <Cpu className="h-5 w-5 text-brand" />,
      title: "AI-Native",
      body: "Every tool is built from the ground up around AI workflows. Not retrofitted. Not bolted on. Designed to think.",
    },
    {
      icon: <Box className="h-5 w-5 text-brand" />,
      title: "Vertical Focus",
      body: "We go deep in one industry at a time. Deep product knowledge beats broad surface area every time.",
    },
    {
      icon: <Zap className="h-5 w-5 text-brand" />,
      title: "Operator-Built",
      body: "We run the businesses we build for. That means we feel every bug, every missing feature, every slow workflow.",
    },
  ];

  return (
    <section id="principles" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-12">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-brand">
          How we think
        </p>
        <h2 className="text-3xl font-semibold text-white">
          Principles
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-surface-2/50 bg-surface-1/40 p-6 backdrop-blur-sm"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-brand/20 bg-brand/10">
              {item.icon}
            </div>
            <h3 className="mb-2 font-semibold text-white">{item.title}</h3>
            <p className="text-sm leading-relaxed text-zinc-400">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Products ────────────────────────────────────────────────────────────────

function Products() {
  const products = [
    {
      name: "Back of House Pro",
      tag: "Live",
      tagColor: "text-brand border-brand/20 bg-brand/10",
      description:
        "Operations management platform for houses of worship. Volunteer scheduling, asset tracking, facility management, and AI-powered workflows.",
      href: "https://backofhousepro.com",
      cta: "Visit Site",
    },
    {
      name: "Sheetz Labs OS",
      tag: "In Development",
      tagColor: "text-zinc-400 border-surface-3 bg-surface-2/50",
      description:
        "Founder operating system. Personal CRM, deal pipeline, task management, and AI briefings — all synced to how a single-operator business actually runs.",
      href: null,
      cta: "Coming Soon",
    },
    {
      name: "Next Product",
      tag: "Research",
      tagColor: "text-zinc-600 border-surface-2 bg-surface-1/50",
      description:
        "We identify the next vertical by running it ourselves first. The next tool is already in motion.",
      href: null,
      cta: "Stay Tuned",
    },
  ];

  return (
    <section id="products" className="border-t border-surface-2/50 bg-surface-1/20">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-12">
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-brand">
            What we ship
          </p>
          <h2 className="text-3xl font-semibold text-white">Products</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {products.map((p) => (
            <div
              key={p.name}
              className="flex flex-col rounded-xl border border-surface-2/50 bg-surface-1/40 p-6 backdrop-blur-sm"
            >
              <div className="mb-4 flex items-start justify-between">
                <h3 className="font-semibold text-white">{p.name}</h3>
                <span
                  className={`rounded-full border px-2 py-0.5 font-mono text-xs ${p.tagColor}`}
                >
                  {p.tag}
                </span>
              </div>
              <p className="mb-6 flex-1 text-sm leading-relaxed text-zinc-400">
                {p.description}
              </p>
              {p.href ? (
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm font-medium text-brand transition-colors hover:text-brand-light"
                >
                  {p.cta}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              ) : (
                <span className="text-sm text-zinc-600">{p.cta}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How We Build ────────────────────────────────────────────────────────────

function HowWeBuild() {
  return (
    <section id="build" className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:items-center">
        <div>
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-brand">
            The method
          </p>
          <h2 className="mb-6 text-3xl font-semibold text-white">
            How We Build
          </h2>
          <div className="space-y-4 text-sm leading-relaxed text-zinc-400">
            <p>
              We operate the business first. Every product starts with us running
              the exact workflow the software will eventually automate. That
              means we know the pain better than any customer interview.
            </p>
            <p>
              Then we build fast — AI-assisted, production-first, no internal
              tooling theater. If it&apos;s not deployed, it doesn&apos;t count.
            </p>
            <p>
              We ship to ourselves first, then open to early operators. Tight
              feedback loop, zero committee decisions.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-surface-2/50 bg-surface-1/60 p-6 backdrop-blur-sm">
          <div className="mb-3 flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500/70" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
            <div className="h-3 w-3 rounded-full bg-green-500/70" />
            <span className="ml-2 font-mono text-xs text-zinc-600">
              sheetzlabs-os / loop.ts
            </span>
          </div>
          <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-zinc-300">
            <code>{`async function operatorLoop() {
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
schedule("0 6 * * *", operatorLoop);`}</code>
          </pre>
        </div>
      </div>
    </section>
  );
}

// ─── CTA ─────────────────────────────────────────────────────────────────────

function CTA() {
  return (
    <section className="border-t border-surface-2/50 bg-surface-1/20">
      <div className="mx-auto max-w-6xl px-6 py-24 text-center">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-brand">
          Let&apos;s talk
        </p>
        <h2 className="mb-4 text-3xl font-semibold text-white">
          Building something for operators?
        </h2>
        <p className="mx-auto mb-10 max-w-md text-zinc-400">
          Whether you&apos;re an operator with a problem worth solving, or a
          collaborator who wants to build alongside us — we want to hear from
          you.
        </p>
        <a
          href="mailto:nick@sheetzlabs.com"
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
        >
          Get in Touch
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Index() {
  return (
    <>
      <Hero />
      <Stats />
      <Principles />
      <Products />
      <HowWeBuild />
      <CTA />
    </>
  );
}
