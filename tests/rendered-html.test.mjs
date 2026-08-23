import assert from "node:assert/strict";
import { access, readdir, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const postsDir = new URL("../content/posts/", import.meta.url);

const publishedPosts = async () =>
  (await readdir(postsDir)).filter((name) => name.endsWith(".md") && !name.startsWith("_"));

test("exports a GitHub Pages-ready homepage", async () => {
  const html = await readFile(new URL("../dist/client/index.html", import.meta.url), "utf8");

  assert.match(html, /rwteefz/);
  assert.match(html, /systems, math, and small useful things/);
  assert.match(html, /id=["']main-content["']/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
  assert.doesNotMatch(html, /maintainer interface|local editor|download site\.json|#edit/i);
  await access(new URL("../dist/client/files/README.md", import.meta.url));
});

test("keeps editable content in one valid JSON file", async () => {
  const raw = await readFile(new URL("../content/site.json", import.meta.url), "utf8");
  const content = JSON.parse(raw);

  assert.equal(content.site.shortName, "rwteefz");
  assert.ok(content.projects.length >= 3);
  assert.ok(content.education.length >= 1);
  assert.ok(content.activities.length >= 1);
  await access(new URL("../.github/workflows/pages.yml", import.meta.url));
  await access(root);
});

test("every article has a header and its own exported page", async () => {
  const names = await publishedPosts();
  assert.ok(names.length >= 1, "expected at least one article in content/posts");

  for (const name of names) {
    const slug = name.replace(/\.md$/, "");
    const raw = await readFile(new URL(name, postsDir), "utf8");

    assert.match(raw, /^---\r?\n/, `${name} is missing its --- header`);
    assert.match(raw, /^title:\s*\S/m, `${name} is missing a title`);
    assert.match(raw, /^date:\s*\d{4}-\d{2}-\d{2}\s*$/m, `${name} needs date: YYYY-MM-DD`);

    // Both address forms must resolve: the exported file, and the directory copy
    // that tools/finalise-export.mjs adds for links written with a trailing slash.
    await access(new URL(`../dist/client/writing/${slug}.html`, import.meta.url));
    await access(new URL(`../dist/client/writing/${slug}/index.html`, import.meta.url));
  }
});

test("the homepage links to each article and the 404 page is exported", async () => {
  const html = await readFile(new URL("../dist/client/index.html", import.meta.url), "utf8");

  for (const name of await publishedPosts()) {
    const slug = name.replace(/\.md$/, "");
    assert.ok(html.includes(`/writing/${slug}`), `homepage does not link to ${slug}`);
  }

  await access(new URL("../dist/client/404.html", import.meta.url));
});
