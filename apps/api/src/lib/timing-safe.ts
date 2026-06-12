/**
 * Constant-time string equality (Prompt 57, NS-AUTH-1 / NS-BK-2).
 *
 * `===` short-circuits on the first differing byte, which leaks how many leading
 * bytes matched — a timing oracle against secrets compared on every request (the
 * cron's `X-Internal-Secret`) or per-booking management tokens. This compares the
 * full length every time. Cloudflare's Web Crypto has no `timingSafeEqual`, so we
 * XOR-accumulate. A length mismatch still fails (and is folded into the accumulator
 * so the early return doesn't itself become an oracle on length-equal inputs).
 */
export function timingSafeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const ab = enc.encode(a);
  const bb = enc.encode(b);
  let diff = ab.length ^ bb.length;
  const len = Math.max(ab.length, bb.length);
  for (let i = 0; i < len; i++) {
    diff |= (ab[i] ?? 0) ^ (bb[i] ?? 0);
  }
  return diff === 0;
}
