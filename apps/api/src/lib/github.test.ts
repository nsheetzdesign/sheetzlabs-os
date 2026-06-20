import { describe, it, expect } from "vitest";
import { verifyGithubSignature } from "./github";

/** Compute a valid sha256= header the way GitHub does, for the positive case. */
async function sign(body: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, enc.encode(body));
  const hex = [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `sha256=${hex}`;
}

describe("verifyGithubSignature", () => {
  const secret = "s3cr3t";
  const body = JSON.stringify({ action: "completed", workflow_run: { id: 1 } });

  it("accepts a correctly-signed body", async () => {
    const header = await sign(body, secret);
    expect(await verifyGithubSignature(body, header, secret)).toBe(true);
  });

  it("rejects a tampered body", async () => {
    const header = await sign(body, secret);
    expect(await verifyGithubSignature(body + " ", header, secret)).toBe(false);
  });

  it("rejects a signature made with the wrong secret", async () => {
    const header = await sign(body, "wrong-secret");
    expect(await verifyGithubSignature(body, header, secret)).toBe(false);
  });

  it("fails closed when the secret is unset", async () => {
    const header = await sign(body, secret);
    expect(await verifyGithubSignature(body, header, "")).toBe(false);
    expect(await verifyGithubSignature(body, header, undefined)).toBe(false);
  });

  it("rejects a missing or malformed header", async () => {
    expect(await verifyGithubSignature(body, undefined, secret)).toBe(false);
    expect(await verifyGithubSignature(body, "deadbeef", secret)).toBe(false); // no sha256= prefix
    expect(await verifyGithubSignature(body, "sha256=", secret)).toBe(false);
  });
});
