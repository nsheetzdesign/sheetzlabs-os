/**
 * PWA icon generator (Prompt 69).
 *
 * Renders the Sheetz Labs "SL" mark (brand green #10B981) to the PNG sizes a
 * PWA install needs and writes them to `public/icons/`. One-time, idempotent —
 * the PNGs are committed; re-run only when the mark changes:
 *
 *   node scripts/gen-pwa-icons.mjs
 *
 * Outputs:
 *   icon-192.png / icon-512.png            — manifest `any` (rounded mark)
 *   icon-192-maskable.png / -512-maskable  — manifest `maskable` (full-bleed,
 *                                            logo inside the ~80% safe zone)
 *   apple-touch-icon.png (180×180)         — iOS home screen (full-bleed, opaque;
 *                                            iOS rounds + ignores transparency)
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

function resolveSharp() {
  const store = resolve(repoRoot, "node_modules/.pnpm");
  const match = readdirSync(store).find((d) => /^sharp@\d/.test(d));
  if (!match) throw new Error("sharp not found in node_modules/.pnpm — run pnpm install");
  return pathToFileURL(resolve(store, match, "node_modules/sharp/lib/index.js")).href;
}

const BRAND = "#10B981";
const WHITE = "#FFFFFF";

/**
 * @param {number} size  canvas size (px)
 * @param {boolean} rounded  true → rounded-rect mark (`any`); false → full-bleed (maskable/apple)
 * @param {number} textScale  glyph size as a fraction of the canvas
 */
function markSvg(size, rounded, textScale) {
  const radius = rounded ? Math.round(size * 0.22) : 0;
  const fontSize = Math.round(size * textScale);
  // Optical centering: nudge the baseline so "SL" sits visually centered.
  const y = Math.round(size * 0.5 + fontSize * 0.34);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="${BRAND}"/>
  <text x="50%" y="${y}" text-anchor="middle"
        font-family="'IBM Plex Sans','Helvetica Neue',Arial,sans-serif"
        font-weight="700" font-size="${fontSize}" fill="${WHITE}"
        letter-spacing="${Math.round(size * 0.01)}">SL</text>
</svg>`;
}

const TARGETS = [
  { file: "icon-192.png", size: 192, rounded: true, textScale: 0.42 },
  { file: "icon-512.png", size: 512, rounded: true, textScale: 0.42 },
  // Maskable: full-bleed background, logo kept inside the ~80% safe zone.
  { file: "icon-192-maskable.png", size: 192, rounded: false, textScale: 0.34 },
  { file: "icon-512-maskable.png", size: 512, rounded: false, textScale: 0.34 },
  // Apple touch icon: iOS adds its own rounding + drops transparency, so full-bleed.
  { file: "apple-touch-icon.png", size: 180, rounded: false, textScale: 0.4 },
];

const sharp = (await import(resolveSharp())).default;

await mkdir(outDir, { recursive: true });
for (const t of TARGETS) {
  const svg = Buffer.from(markSvg(t.size, t.rounded, t.textScale));
  // flatten onto opaque brand for the apple/maskable variants (no transparency).
  const png = await sharp(svg)
    .flatten(t.rounded ? false : { background: BRAND })
    .png()
    .toBuffer();
  await writeFile(resolve(outDir, t.file), png);
  console.log(`✓ ${t.file} (${t.size}×${t.size})`);
}
console.log(`\nWrote ${TARGETS.length} icons to public/icons/`);
