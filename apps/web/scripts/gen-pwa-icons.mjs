/**
 * PWA icon generator (Prompt 69).
 *
 * Derives the PWA / iOS install icons from the canonical Sheetz Labs mark
 * (`apps/desktop/src-tauri/icons/512x512.png` — the same logo the desktop app
 * ships) and writes them to `public/icons/`. One-time, idempotent — the PNGs are
 * committed; re-run only when the source mark changes:
 *
 *   node scripts/gen-pwa-icons.mjs
 *
 * The source has a transparent background that composites to ~#09090b, so every
 * variant is flattened onto the app surface (#09090b) — matching the manifest
 * background/theme colour for a seamless splash + opaque iOS tile (iOS drops
 * transparency).
 *
 * Outputs:
 *   icon-192.png / icon-512.png            — manifest `any`
 *   icon-192-maskable.png / -512-maskable  — manifest `maskable` (logo scaled into
 *                                            the ~80% safe zone, bg bleeds to edge)
 *   apple-touch-icon.png (180×180)         — iOS home screen (opaque)
 *   favicon.png (48×48)                    — browser tab
 *
 * sharp lives only in the pnpm store here (transitive dep), so we resolve it by
 * globbing `.pnpm` rather than a bare import.
 */
import { readdirSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "../../..");
const outDir = resolve(__dirname, "../public/icons");
const publicDir = resolve(__dirname, "../public");
const SRC = resolve(repoRoot, "apps/desktop/src-tauri/icons/512x512.png");
const SURFACE = "#09090b"; // app surface (zinc-950) === manifest background_color

function resolveSharp() {
  const store = resolve(repoRoot, "node_modules/.pnpm");
  const match = readdirSync(store).find((d) => /^sharp@\d/.test(d));
  if (!match) throw new Error("sharp not found in node_modules/.pnpm — run pnpm install");
  return pathToFileURL(resolve(store, match, "node_modules/sharp/lib/index.js")).href;
}

const sharp = (await import(resolveSharp())).default;

/** Full-bleed: source flattened onto the surface, resized to `size`. */
async function plain(size) {
  return sharp(SRC).resize(size, size, { fit: "contain", background: SURFACE })
    .flatten({ background: SURFACE })
    .png()
    .toBuffer();
}

/** Maskable: logo scaled to ~82% and padded with surface so it sits inside the
 *  maskable safe zone (aggressive launchers crop toward a centred circle). */
async function maskable(size) {
  const inner = Math.round(size * 0.82);
  const pad = Math.round((size - inner) / 2);
  return sharp(SRC)
    .resize(inner, inner, { fit: "contain", background: SURFACE })
    .flatten({ background: SURFACE })
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: SURFACE })
    .resize(size, size)
    .png()
    .toBuffer();
}

await mkdir(outDir, { recursive: true });

const writes = [
  ["icons/icon-192.png", await plain(192)],
  ["icons/icon-512.png", await plain(512)],
  ["icons/icon-192-maskable.png", await maskable(192)],
  ["icons/icon-512-maskable.png", await maskable(512)],
  ["icons/apple-touch-icon.png", await plain(180)],
  ["favicon.png", await plain(48)],
];

for (const [rel, buf] of writes) {
  await writeFile(resolve(publicDir, rel), buf);
  console.log(`✓ ${rel}`);
}
console.log(`\nGenerated ${writes.length} icons from ${SRC.replace(repoRoot + "/", "")}`);
