/**
 * PWA client helpers (Prompt 69). All client-only — guard for SSR before calling.
 */

/** True when running as an installed PWA (iOS `navigator.standalone` or the
 *  display-mode media query that covers Android/desktop installs). */
export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches === true ||
    // iOS Safari home-screen apps expose this non-standard flag.
    (window.navigator as Navigator & { standalone?: boolean })?.standalone === true
  );
}

/** True only on iOS/iPadOS *Safari* (not Chrome/Firefox-iOS, which can't A2HS via
 *  the Share sheet the same way). iPadOS 13+ masquerades as macOS, so we sniff
 *  touch points for the iPad case. */
export function isIosSafari(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const iOS =
    /iPad|iPhone|iPod/.test(ua) ||
    // iPadOS reports as "Macintosh" — distinguish by touch support.
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isWebKit = /WebKit/.test(ua);
  const isOtherBrowser = /CriOS|FxiOS|EdgiOS|OPiOS|mercury/.test(ua);
  return iOS && isWebKit && !isOtherBrowser;
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp("(?:^|;\\s*)" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[1]) : null;
}

export function setCookie(name: string, value: string, maxAgeDays: number): void {
  if (typeof document === "undefined") return;
  const maxAge = Math.round(maxAgeDays * 24 * 60 * 60);
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${maxAge};samesite=lax`;
}
