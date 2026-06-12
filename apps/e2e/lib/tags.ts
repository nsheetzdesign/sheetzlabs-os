/**
 * Every artifact the suite creates is tagged with this marker so teardown can find
 * and purge it — and so no test ever touches pre-existing founder data.
 */
export const E2E_TAG = "[E2E]";

/** A unique, sortable, human-readable run token, e.g. "[E2E] send 1718155845123-x7f2". */
export function e2eSubject(kind: string): string {
  // Math.random/Date.now are fine here — this is a real Node process, not a worker.
  const ts = Date.now();
  const rand = Math.random().toString(36).slice(2, 6);
  return `${E2E_TAG} ${kind} ${ts}-${rand}`;
}

/** True for any subject/title this suite owns. */
export function isE2E(text: string | null | undefined): boolean {
  return !!text && text.includes(E2E_TAG);
}

/** Cutoff helper for the stranded-artifact sweep (default 1 hour). */
export function olderThanCutoff(hours = 1): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}
