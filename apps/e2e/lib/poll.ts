/** Poll `fn` until it returns a truthy value or the timeout elapses. */
export async function pollFor<T>(
  fn: () => Promise<T | null | undefined | false>,
  opts: { timeoutMs?: number; intervalMs?: number; label?: string } = {}
): Promise<T> {
  const timeoutMs = opts.timeoutMs ?? 180_000;
  const intervalMs = opts.intervalMs ?? 5_000;
  const deadline = Date.now() + timeoutMs;
  let last: T | null | undefined | false = null;
  // Date.now() is fine — real Node process.
  while (Date.now() < deadline) {
    last = await fn();
    if (last) return last as T;
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error(
    `pollFor timed out after ${timeoutMs}ms${opts.label ? ` waiting for: ${opts.label}` : ""}`
  );
}
