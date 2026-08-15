import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("exports a GitHub Pages-ready homepage", async () => {
  const html = await readFile(new URL("../dist/client/index.html", import.meta.url), "utf8");

  assert.match(html, /XX大学数学课程试卷与资料/);
  assert.match(html, /Math Archive/);
  assert.match(html, /id=["']main-content["']/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
  await access(new URL("../dist/client/files/README.md", import.meta.url));
});

test("keeps editable content in one valid JSON file", async () => {
  const raw = await readFile(new URL("../content/site.json", import.meta.url), "utf8");
  const content = JSON.parse(raw);

  assert.equal(content.site.shortName, "Math Archive");
  assert.ok(content.categories.length >= 6);
  assert.ok(content.categories.every((category) => category.courses.length > 0));
  assert.ok(
    content.categories.every((category) =>
      category.courses.every((course) => course.materials.length > 0),
    ),
  );
  await access(new URL("../.github/workflows/pages.yml", import.meta.url));
  await access(root);
});
