import { afterEach, describe, expect, it, vi } from "vitest";
import { getCookie, isIosSafari, isStandalone } from "./pwa";

/**
 * UA sniffing + standalone detection are the error-prone parts of the PWA install
 * gate (Prompt 69) — the A2HS hint must show on iOS/iPadOS Safari only, and never
 * once installed. iPadOS 13+ reports as "Macintosh", so the touch-points fallback
 * is load-bearing.
 */

function stubNavigator(nav: Partial<Navigator>) {
  vi.stubGlobal("navigator", nav as Navigator);
}

afterEach(() => vi.unstubAllGlobals());

describe("isIosSafari", () => {
  it("true for iPhone Safari", () => {
    stubNavigator({
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
      platform: "iPhone",
      maxTouchPoints: 5,
    });
    expect(isIosSafari()).toBe(true);
  });

  it("true for iPadOS Safari (masquerades as Macintosh + touch points)", () => {
    stubNavigator({
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15",
      platform: "MacIntel",
      maxTouchPoints: 5,
    });
    expect(isIosSafari()).toBe(true);
  });

  it("false for Chrome on iOS (CriOS)", () => {
    stubNavigator({
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/126.0 Mobile/15E148 Safari/604.1",
      platform: "iPhone",
      maxTouchPoints: 5,
    });
    expect(isIosSafari()).toBe(false);
  });

  it("false for desktop macOS Safari (no touch)", () => {
    stubNavigator({
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15",
      platform: "MacIntel",
      maxTouchPoints: 0,
    });
    expect(isIosSafari()).toBe(false);
  });

  it("false for desktop Chrome", () => {
    stubNavigator({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
      platform: "Win32",
      maxTouchPoints: 0,
    });
    expect(isIosSafari()).toBe(false);
  });
});

describe("isStandalone", () => {
  it("true when iOS navigator.standalone is set", () => {
    vi.stubGlobal("window", { matchMedia: () => ({ matches: false }), navigator: { standalone: true } });
    expect(isStandalone()).toBe(true);
  });

  it("true when display-mode: standalone matches", () => {
    vi.stubGlobal("window", {
      matchMedia: (q: string) => ({ matches: q.includes("standalone") }),
      navigator: {},
    });
    expect(isStandalone()).toBe(true);
  });

  it("false in a normal browser tab", () => {
    vi.stubGlobal("window", { matchMedia: () => ({ matches: false }), navigator: {} });
    expect(isStandalone()).toBe(false);
  });
});

describe("getCookie", () => {
  it("parses a named cookie value", () => {
    vi.stubGlobal("document", { cookie: "tz=America%2FChicago; a2hs_dismissed=1" });
    expect(getCookie("a2hs_dismissed")).toBe("1");
    expect(getCookie("tz")).toBe("America/Chicago");
    expect(getCookie("missing")).toBeNull();
  });
});
