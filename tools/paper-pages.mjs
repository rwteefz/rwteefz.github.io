/**
 * Turns a paper into page images: `node tools/paper-pages.mjs <pdf> <slug>`.
 *
 * The site never serves the PDF itself — a reader who wants the whole document
 * would have to collect it page by page at screen resolution. Ghostscript does
 * the rasterising; nothing else here depends on it, so this runs by hand when a
 * paper is added rather than as part of the build.
 */

import { execFile } from "node:child_process";
import { mkdir, readdir, rm } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const run = promisify(execFile);

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const [pdf, slug] = process.argv.slice(2);

if (!pdf || !/^[a-z0-9][a-z0-9-]*$/.test(slug ?? "")) {
  console.error("usage: node tools/paper-pages.mjs <file.pdf> <slug>");
  process.exit(1);
}

const outDir = join(repoRoot, "public", "papers", slug);

// 300 dpi, as a 256-colour PNG. These pages are black text on white with a
// little red on the covers, which a palette compresses far better than JPEG —
// each page lands near 130 kB, smaller than a 170 dpi JPEG of the same page and
// with no ringing around the glyphs, so the mathematics stays crisp when a
// reader zooms in. Pages load as they are reached.
await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

await run("gs", [
  "-sDEVICE=png256", "-r300",
  "-dNOPAUSE", "-dBATCH", "-dQUIET", "-dSAFER",
  "-dTextAlphaBits=4", "-dGraphicsAlphaBits=4",
  `-sOutputFile=${join(outDir, "p-%03d.png")}`,
  resolve(pdf),
], { maxBuffer: 32 * 1024 * 1024 });

const pages = (await readdir(outDir)).filter((name) => name.endsWith(".png")).length;
console.log(`${slug}: ${pages} page images in public/papers/${slug}`);
console.log(`set "pages": ${pages} on that paper in content/site.json`);
