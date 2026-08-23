// vinext's static export cannot prerender dynamic routes while `trailingSlash` is
// on (its prerenderer follows its own 308 and gives up), so the config keeps
// trailing slashes off and each article lands at writing/<slug>.html.
//
// GitHub Pages resolves /writing/<slug> to that file, but a link someone typed or
// shared with a trailing slash would 404. This copies each article to
// writing/<slug>/index.html as well, so both addresses work.

import { copyFile, mkdir, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const writingDir = join(dirname(fileURLToPath(import.meta.url)), "..", "dist", "client", "writing");

let entries;
try {
  entries = await readdir(writingDir, { withFileTypes: true });
} catch (error) {
  if (error.code === "ENOENT") {
    console.log("finalise-export: no articles to mirror");
    process.exit(0);
  }
  throw error;
}

const articles = entries.filter((entry) => entry.isFile() && entry.name.endsWith(".html"));

for (const article of articles) {
  const slug = article.name.replace(/\.html$/, "");
  await mkdir(join(writingDir, slug), { recursive: true });
  await copyFile(join(writingDir, article.name), join(writingDir, slug, "index.html"));
}

console.log(`finalise-export: mirrored ${articles.length} article(s) to directory URLs`);
