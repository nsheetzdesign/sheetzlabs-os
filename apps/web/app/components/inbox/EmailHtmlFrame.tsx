import { useEffect, useRef, useState } from "react";
import type { Attachment } from "./AttachmentChips";

/**
 * Renders an email's HTML body safely (EU-1) with remote-image proxying (EU-9).
 *
 * - Sanitizes with DOMPurify (allowlist; scripts/iframes/forms/event handlers stripped).
 * - Rewrites every remote `img src`/`srcset` and CSS `url()` to the API image proxy
 *   so tracking pixels see Cloudflare, not the user's IP (Prompt 54A Part 4).
 * - Renders inside a sandboxed iframe WITHOUT `allow-scripts`.
 * - `allow-popups allow-popups-to-escape-sandbox` so `<base target="_blank">` links
 *   open in a new tab.
 * - Light document (Gmail's model): white background, dark text as defaults, with the
 *   email's own styles layered intact on top — no color-nuking (EU-10).
 * - Auto-sizes to content height via a ResizeObserver on load.
 */

// Gmail-style light defaults. Deliberately NOT `!important` (except layout safety
// rails) so the email's own inline/embedded styles win — branded colors survive.
const FRAME_STYLE = `
  html { color-scheme: light; }
  html, body { margin: 0; padding: 0; }
  body {
    background: #ffffff;
    color: #1a1a1a;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    line-height: 1.5;
    overflow-wrap: break-word;
    word-break: break-word;
    padding: 8px;
  }
  img { max-width: 100% !important; height: auto; }
  table { max-width: 100% !important; }
  a { color: #2563eb; }
`;

/** Route a remote (http/https) URL through the auth-gated API image proxy. */
function proxify(url: string): string {
  return `/api/email/image-proxy?url=${encodeURIComponent(url)}`;
}

function isRemote(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

/** Rewrite each candidate in a `srcset` ("url 2x, url 480w") through the proxy. */
function rewriteSrcset(srcset: string): string {
  return srcset
    .split(",")
    .map((part) => {
      const seg = part.trim();
      if (!seg) return seg;
      const sp = seg.indexOf(" ");
      const url = sp === -1 ? seg : seg.slice(0, sp);
      const rest = sp === -1 ? "" : seg.slice(sp);
      return (isRemote(url) ? proxify(url) : url) + rest;
    })
    .join(", ");
}

/** Rewrite `url(...)` occurrences inside a CSS string (style attr or <style> block). */
function rewriteCssUrls(css: string): string {
  return css.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/gi, (m, q, url) =>
    isRemote(url) ? `url(${q}${proxify(url)}${q})` : m,
  );
}

// Quoted-reply containers we collapse behind a "•••" toggle (Part 6, EU-15).
const QUOTE_SELECTOR =
  '.gmail_quote, blockquote[type="cite"], div.gmail_quote, #appendonsend, .moz-cite-prefix, #divRplyFwdMsg';

/** Split off trailing quoted-reply blocks; returns the collapsed HTML + whether any were found. */
function splitQuoted(cleanHtml: string): { collapsed: string; hasQuoted: boolean } {
  try {
    const doc = new DOMParser().parseFromString(cleanHtml, 'text/html');
    const quoted = doc.body.querySelectorAll(QUOTE_SELECTOR);
    if (quoted.length === 0) return { collapsed: cleanHtml, hasQuoted: false };
    quoted.forEach((q) => q.remove());
    return { collapsed: doc.body.innerHTML, hasQuoted: true };
  } catch {
    return { collapsed: cleanHtml, hasQuoted: false };
  }
}

export function EmailHtmlFrame({
  html,
  emailId,
  attachments,
}: {
  html: string;
  emailId?: string;
  attachments?: Attachment[];
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const observerRef = useRef<ResizeObserver | null>(null);
  const [mounted, setMounted] = useState(false);
  const [srcDoc, setSrcDoc] = useState<string>("");
  const [collapsedDoc, setCollapsedDoc] = useState<string>("");
  const [hasQuoted, setHasQuoted] = useState(false);
  const [showQuoted, setShowQuoted] = useState(false);
  const [height, setHeight] = useState(120);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Stable key so the sanitize effect re-runs only when the cid map changes.
  const cidKey = (attachments ?? [])
    .map((a) => `${a.content_id ?? ""}:${a.gmail_attachment_id ?? ""}`)
    .join(",");

  useEffect(() => {
    if (!mounted) return;
    let cancelled = false;

    // Map inline cid → Gmail attachment id for this message (Part 3).
    const cidMap = new Map<string, string>();
    for (const a of attachments ?? []) {
      if (a.content_id && a.gmail_attachment_id) cidMap.set(a.content_id, a.gmail_attachment_id);
    }
    const resolveCid = (src: string): string | null => {
      if (!emailId) return null;
      const cid = src.replace(/^cid:/i, "").replace(/^<|>$/g, "");
      const attId = cidMap.get(cid);
      return attId ? `/api/email/messages/${emailId}/attachments/${attId}` : null;
    };

    (async () => {
      const DOMPurify = (await import("dompurify")).default;

      // Rewrite remote image references to the proxy during sanitization.
      const attrHook = (node: Element) => {
        if (node.tagName === "IMG") {
          const src = node.getAttribute("src");
          if (src && /^cid:/i.test(src)) {
            const resolved = resolveCid(src);
            if (resolved) node.setAttribute("src", resolved);
          } else if (src && isRemote(src)) {
            node.setAttribute("src", proxify(src));
          }
          const srcset = node.getAttribute("srcset");
          if (srcset) node.setAttribute("srcset", rewriteSrcset(srcset));
          node.removeAttribute("loading");
        }
        const style = node.getAttribute?.("style");
        if (style && /url\(/i.test(style)) node.setAttribute("style", rewriteCssUrls(style));
      };
      const elHook = (node: Element) => {
        if (node.tagName === "STYLE" && node.textContent && /url\(/i.test(node.textContent)) {
          node.textContent = rewriteCssUrls(node.textContent);
        }
      };
      DOMPurify.addHook("afterSanitizeAttributes", attrHook);
      DOMPurify.addHook("afterSanitizeElements", elHook);
      const clean = DOMPurify.sanitize(html ?? "", {
        FORBID_TAGS: ["script", "iframe", "object", "embed", "form"],
        FORBID_ATTR: ["onerror", "onload", "onclick"],
      });
      DOMPurify.removeHook("afterSanitizeAttributes");
      DOMPurify.removeHook("afterSanitizeElements");

      if (cancelled) return;
      const wrap = (bodyHtml: string) =>
        `<!DOCTYPE html><html><head><meta charset="utf-8">` +
        `<base target="_blank"><style>${FRAME_STYLE}</style></head>` +
        `<body>${bodyHtml}</body></html>`;
      const { collapsed, hasQuoted: foundQuote } = splitQuoted(clean);
      setSrcDoc(wrap(clean));
      setCollapsedDoc(wrap(collapsed));
      setHasQuoted(foundQuote);
      setShowQuoted(false);
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [html, mounted, emailId, cidKey]);

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

  const activeDoc = hasQuoted && !showQuoted ? collapsedDoc : srcDoc;

  return (
    <div>
      <iframe
        ref={iframeRef}
        title="Email content"
        sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        referrerPolicy="no-referrer"
        srcDoc={activeDoc}
        onLoad={handleLoad}
        style={{ width: "100%", height, border: "none", display: "block", borderRadius: 8 }}
      />
      {hasQuoted && (
        <button
          type="button"
          onClick={() => setShowQuoted((v) => !v)}
          aria-label={showQuoted ? "Hide quoted text" : "Show quoted text"}
          className="mt-1 rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
        >
          {showQuoted ? "Hide quoted text" : "•••"}
        </button>
      )}
    </div>
  );
}
