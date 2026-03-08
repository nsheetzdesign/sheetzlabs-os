import { Outlet, Link } from "react-router";
import { Github, Twitter, Mail } from "lucide-react";

function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-surface-2/50 bg-surface-0/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-brand" />
          <span className="font-semibold tracking-tight">Sheetz Labs</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
          <a href="#products" className="transition-colors hover:text-white">
            Products
          </a>
          <a href="#principles" className="transition-colors hover:text-white">
            About
          </a>
          <a href="#build" className="transition-colors hover:text-white">
            Labs
          </a>
        </nav>

        <a
          href="mailto:nick@sheetzlabs.com"
          className="flex items-center gap-2 rounded-lg border border-brand/30 bg-brand/10 px-4 py-2 text-sm font-medium text-brand transition-colors hover:bg-brand/20"
        >
          <Mail className="h-4 w-4" />
          Contact
        </a>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-surface-2/50 bg-surface-0">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded bg-brand" />
          <span className="text-sm text-zinc-400">
            © 2026 Sheetz Labs. All rights reserved.
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/nsheetzdesign"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 transition-colors hover:text-white"
            aria-label="GitHub"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href="https://twitter.com/nsheetzdesign"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 transition-colors hover:text-white"
            aria-label="Twitter"
          >
            <Twitter className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function MarketingLayout() {
  return (
    <div className="relative min-h-screen">
      <div className="gradient-orb" />
      <div className="grid-bg fixed inset-0 z-0" />
      <div className="relative z-10">
        <Nav />
        <main className="pt-16">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
