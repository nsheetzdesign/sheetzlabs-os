import { test, expect } from "@playwright/test";
import { ENV } from "../lib/env";
import { api, token } from "../lib/api";

/**
 * Prompt 57 (NS-IMG-1..4): the email image proxy must block IP-literal hosts in every
 * encoding and refuse to follow redirects / serve non-images. Authenticated (the proxy
 * is not on the public allowlist), so we hit it with the founder JWT.
 */
test.describe("image proxy SSRF guard", () => {
  const blocked: Array<[string, string]> = [
    ["localhost", "http://localhost/x.png"],
    ["decimal IPv4 (127.0.0.1)", "http://2130706433/x.png"],
    ["decimal IPv4 metadata (169.254.169.254)", "http://2852039166/x.png"],
    ["hex IPv4", "http://0x7f000001/x.png"],
    ["octal IPv4", "http://0177.0.0.1/x.png"],
    ["short-form IPv4", "http://127.1/x.png"],
    ["RFC-1918 dotted", "http://10.0.0.5/x.png"],
    ["IPv6 loopback", "http://[::1]/x.png"],
    ["IPv4-mapped IPv6 metadata", "http://[::ffff:169.254.169.254]/x.png"],
  ];

  for (const [name, url] of blocked) {
    test(`blocks ${name}`, async () => {
      const res = await api(`/email/image-proxy?url=${encodeURIComponent(url)}`);
      // 400 = guard rejected the host before any fetch (the desired outcome).
      expect(res.status, `${url} should be blocked`).toBe(400);
    });
  }

  test("non-http(s) scheme is rejected", async () => {
    const res = await api(`/email/image-proxy?url=${encodeURIComponent("file:///etc/passwd")}`);
    expect(res.status).toBe(400);
  });

  test("renders a real public image as image/*", async () => {
    const url = "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png";
    const res = await fetch(`${ENV.API_URL}/email/image-proxy?url=${encodeURIComponent(url)}`, {
      headers: { Authorization: `Bearer ${await token()}` },
    });
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type") ?? "").toMatch(/^image\//);
  });
});
