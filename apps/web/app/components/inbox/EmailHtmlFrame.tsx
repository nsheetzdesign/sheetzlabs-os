import { useEffect, useRef, useState } from "react";

/**
 * Renders an email's HTML body safely (EU-1).
 *
 * - Sanitizes with DOMPurify (allowlist; scripts/iframes/forms/event handlers stripped).
 * - Renders inside a sandboxed iframe WITHOUT `allow-scripts`, so even if a payload
 *   slipped past DOMPurify it cannot execute in the app origin.
 * - `allow-popups allow-popups-to-escape-sandbox` so `<base target="_blank">` links
 *   open in a new tab.
 * - Auto-sizes to content height via a ResizeObserver on load.
 * - DOMPurify needs a DOM, so we render a placeholder server-side and hydrate the
 *   iframe client-side.
 *
 * NOTE: remote-image proxying/blocking (EU-9) is intentionally out of scope here
 * (Prompt 54). This frame does not improve nor regress it.
 */

// Folded-in dark-mode styling (was lib/email-utils.ts forceEmailDarkMode).
const FRAME_STYLE = `
  html, body { margin: 0; padding: 0; background: transparent; }
  body {
    color: #e4e4e7;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    line-height: 1.5;
    overflow-wrap: break-word;
    word-break: break-word;
  }
  *, *::before, *::after {
    color: #e4e4e7 !important;
    background-color: transparent !important;
  }
  a { color: #34d399 !important; text-decoration: underline !important; }
  a:hover { color: #6ee7b7 !important; }
  blockquote {
    border-left: 2px solid #3f3f46 !important;
    padding-left: 1rem !important;
    margin-left: 0 !important;
    color: #a1a1aa !important;
  }
  img { max-width: 100% !important; height: auto !important; }
  table { border-color: #3f3f46 !important; max-width: 100% !important; }
  td, th { border-color: #3f3f46 !important; }
  hr { border-color: #3f3f46 !important; }
`;

export function EmailHtmlFrame({ html }: { html: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const observerRef = useRef<ResizeObserver | null>(null);
  const [mounted, setMounted] = useState(false);
  const [srcDoc, setSrcDoc] = useState<string>("");
  const [height, setHeight] = useState(120);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    let cancelled = false;

    (async () => {
      const DOMPurify = (await import("dompurify")).default;
      const clean = DOMPurify.sanitize(html ?? "", {
        FORBID_TAGS: ["script", "iframe", "object", "embed", "form"],
        FORBID_ATTR: ["onerror", "onload", "onclick"],
      });
      if (cancelled) return;
      setSrcDoc(
        `<!DOCTYPE html><html><head><meta charset="utf-8">` +
          `<base target="_blank"><style>${FRAME_STYLE}</style></head>` +
          `<body>${clean}</body></html>`
      );
    })();

    return () => {
      cancelled = true;
    };
  }, [html, mounted]);

  const resize = () => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    try {
      const next = Math.max(
        win.document.body?.scrollHeight ?? 0,
        win.document.documentElement?.scrollHeight ?? 0
      );
      if (next) setHeight(next);
    } catch {
      // Same-origin guard — ignore.
    }
  };

  const handleLoad = () => {
    resize();
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    try {
      observerRef.current?.disconnect();
      const ro = new win.ResizeObserver(() => resize());
      if (win.document.body) ro.observe(win.document.body);
      observerRef.current = ro;
    } catch {
      // ResizeObserver unavailable — static height is fine.
    }
  };

  useEffect(() => () => observerRef.current?.disconnect(), []);

  if (!mounted) {
    return <div className="text-sm text-zinc-500 italic">Loading message…</div>;
  }

  return (
    <iframe
      ref={iframeRef}
      title="Email content"
      sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      referrerPolicy="no-referrer"
      srcDoc={srcDoc}
      onLoad={handleLoad}
      style={{ width: "100%", height, border: "none", display: "block" }}
    />
  );
}
