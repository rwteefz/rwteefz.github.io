import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

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
  assert.ok(content.writing.length >= 1);
  await access(new URL("../.github/workflows/pages.yml", import.meta.url));
  await access(root);
});
