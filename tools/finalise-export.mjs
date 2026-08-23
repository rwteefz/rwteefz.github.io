// vinext's static export cannot prerender dynamic routes while `trailingSlash` is
// on (its prerenderer follows its own 308 and gives up), so the config keeps
// trailing slashes off and every route lands at <route>.html.
//
// GitHub Pages resolves /writing to writing.html, but two cases still break:
// a link written with a trailing slash, and /writing itself once a writing/
// directory exists next to writing.html — the directory can win and there is no
// index.html inside it.
//
// So: for every exported page.html, also write page/index.html.

import { copyFile, mkdir, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const clientDir = join(dirname(fileURLToPath(import.meta.url)), "..", "dist", "client");

const SKIP = new Set(["index.html", "404.html"]);

async function mirror(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return 0;
    throw error;
  }

  let count = 0;

  for (const entry of entries) {
    if (entry.isDirectory()) {
      count += await mirror(join(dir, entry.name));
      continue;
    }

    if (!entry.isFile() || !entry.name.endsWith(".html") || SKIP.has(entry.name)) continue;

    const base = entry.name.replace(/\.html$/, "");
    await mkdir(join(dir, base), { recursive: true });
    await copyFile(join(dir, entry.name), join(dir, base, "index.html"));
    count += 1;
  }

  return count;
}

const mirrored = await mirror(clientDir);
console.log(`finalise-export: mirrored ${mirrored} page(s) to directory URLs`);
