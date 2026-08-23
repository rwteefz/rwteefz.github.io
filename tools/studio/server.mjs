/**
 * Local editing studio.
 *
 * Runs only on your own machine (`npm run studio`), never on GitHub Pages. It
 * reads and writes the files this site is built from — content/site.json,
 * content/posts/*.md, public/images/* — and can commit and push for you.
 *
 * It binds to 127.0.0.1 so nothing outside this computer can reach it.
 */

import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, resolve } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

const run = promisify(execFile);

const studioDir = fileURLToPath(new URL(".", import.meta.url));
const repoRoot = resolve(studioDir, "..", "..");
const siteJson = join(repoRoot, "content", "site.json");
const themesJson = join(repoRoot, "content", "themes.json");
const postsDir = join(repoRoot, "content", "posts");
const imagesDir = join(repoRoot, "public", "images");

/**
 * A fingerprint of content/site.json as it is on disk right now.
 *
 * The browser holds a whole copy of that file and writes all of it back on
 * every save, so a tab left open since before an outside edit would silently
 * undo it. Each save carries the fingerprint the tab loaded; if the file has
 * moved on since, the write is refused and the tab is told to reload.
 */
const siteStamp = async () =>
  createHash("sha1").update(await readFile(siteJson)).digest("hex").slice(0, 12);

const PORT = Number(process.env.PORT) || 4321;
const MAX_IMAGE_BYTES = 12 * 1024 * 1024;

// Anything used to build a path is checked against these before it touches disk.
const SLUG = /^[a-z0-9][a-z0-9-]{0,80}$/;
const IMAGE_NAME = /^[a-z0-9][a-z0-9._-]{0,80}\.(png|jpe?g|gif|webp|avif|svg)$/i;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
};

/* ---------------------------------------------------------------- articles */

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
const FIELDS = ["title", "date", "summary", "cover", "coverAlt"];

function parsePost(raw) {
  const match = raw.match(FRONTMATTER);
  if (!match) return { meta: {}, body: raw };

  const meta = {};
  for (const line of match[1].split(/\r?\n/)) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    if (key) meta[key] = line.slice(colon + 1).trim().replace(/^["'](.*)["']$/, "$1");
  }
  return { meta, body: raw.slice(match[0].length) };
}

const serialisePost = (post) =>
  ["---", ...FIELDS.map((key) => `${key}: ${String(post[key] ?? "").trim()}`), "---", "", post.body.trimStart()]
    .join("\n")
    .replace(/\s*$/, "\n");

async function readPosts() {
  await mkdir(postsDir, { recursive: true });
  const names = (await readdir(postsDir)).filter((name) => name.endsWith(".md"));

  const posts = await Promise.all(
    names.map(async (name) => {
      const { meta, body } = parsePost(await readFile(join(postsDir, name), "utf8"));
      const slug = name.replace(/\.md$/, "");
      return {
        slug,
        draft: slug.startsWith("_"),
        body,
        ...Object.fromEntries(FIELDS.map((key) => [key, meta[key] ?? ""])),
      };
    }),
  );

  return posts.sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

async function readImages() {
  await mkdir(imagesDir, { recursive: true });
  const names = (await readdir(imagesDir)).filter((name) => IMAGE_NAME.test(name));

  return Promise.all(
    names.map(async (name) => ({
      name,
      url: `/images/${name}`,
      bytes: (await stat(join(imagesDir, name))).size,
    })),
  );
}

/* --------------------------------------------------------------------- git */

async function git(...args) {
  const { stdout, stderr } = await run("git", args, { cwd: repoRoot, maxBuffer: 8 * 1024 * 1024 });
  return (stdout + stderr).trim();
}

async function gitState() {
  try {
    const [branch, status] = await Promise.all([git("branch", "--show-current"), git("status", "--porcelain")]);
    const changed = status ? status.split("\n").filter(Boolean) : [];
    return { ok: true, branch, changed: changed.length, files: changed.slice(0, 40) };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

/* ------------------------------------------------------------------ server */

const send = (res, status, body, type = "application/json; charset=utf-8") => {
  res.writeHead(status, { "content-type": type, "cache-control": "no-store" });
  res.end(typeof body === "string" || Buffer.isBuffer(body) ? body : JSON.stringify(body));
};

const fail = (res, status, message) => send(res, status, { error: message });

function readBody(req, limit) {
  return new Promise((resolvePromise, rejectPromise) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > limit) {
        rejectPromise(new Error("too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolvePromise(Buffer.concat(chunks)));
    req.on("error", rejectPromise);
  });
}

const readJson = async (req) => JSON.parse((await readBody(req, 4 * 1024 * 1024)).toString("utf8") || "{}");

/**
 * Streams a file, answering 404 if it is missing. A ReadStream emits its
 * failure as an 'error' event, and an unhandled one takes down the process —
 * a broken image link in an article preview must not stop the studio.
 */
function streamFile(res, file, type) {
  const stream = createReadStream(file);

  stream.once("error", () => {
    if (!res.headersSent) fail(res, 404, "not found");
    else res.end();
  });

  stream.once("open", () => {
    res.writeHead(200, { "content-type": type, "cache-control": "no-store" });
    stream.pipe(res);
  });
}

async function serveStatic(res, pathname) {
  const name = pathname === "/" ? "index.html" : pathname.slice(1);
  const file = join(studioDir, name);

  // Never serve outside tools/studio.
  if (!file.startsWith(studioDir)) return fail(res, 403, "forbidden");

  streamFile(res, file, MIME[extname(file)] ?? "application/octet-stream");
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
  const { pathname } = url;

  try {
    if (!pathname.startsWith("/api/")) {
      if (pathname.startsWith("/images/")) {
        const name = pathname.slice("/images/".length);
        if (!IMAGE_NAME.test(name)) return fail(res, 400, "bad image name");
        return streamFile(res, join(imagesDir, name), MIME[extname(name)] ?? "application/octet-stream");
      }
      return serveStatic(res, pathname);
    }

    /* ---- read everything the UI needs ---- */
    if (pathname === "/api/state" && req.method === "GET") {
      const [site, themes, posts, images, git] = await Promise.all([
        readFile(siteJson, "utf8").then(JSON.parse),
        readFile(themesJson, "utf8").then(JSON.parse),
        readPosts(),
        readImages(),
        gitState(),
      ]);
      return send(res, 200, { site, themes, posts, images, git, stamp: await siteStamp() });
    }

    /* ---- site.json ---- */
    if (pathname === "/api/site" && req.method === "PUT") {
      const site = await readJson(req);
      if (!site || typeof site !== "object" || Array.isArray(site)) return fail(res, 400, "expected an object");

      const sent = req.headers["x-site-stamp"];
      if (sent && sent !== await siteStamp()) {
        return fail(res, 409, "This page was opened before content/site.json last changed, " +
          "so saving would undo that change. Reload the studio (Cmd-R) and edit again.");
      }

      await writeFile(siteJson, JSON.stringify(site, null, 2) + "\n");
      return send(res, 200, { saved: "content/site.json", stamp: await siteStamp() });
    }

    /* ---- articles ---- */
    if (pathname === "/api/post" && req.method === "PUT") {
      const post = await readJson(req);
      const slug = String(post.slug ?? "").trim();
      if (!SLUG.test(slug)) return fail(res, 400, "Use lowercase letters, numbers and hyphens for the web address.");
      if (!String(post.title ?? "").trim()) return fail(res, 400, "An article needs a title.");

      await mkdir(postsDir, { recursive: true });
      await writeFile(join(postsDir, `${slug}.md`), serialisePost({ ...post, body: String(post.body ?? "") }));

      // Renaming means the old file has to go, or the article publishes twice.
      const previous = String(post.previousSlug ?? "").trim();
      if (previous && previous !== slug && SLUG.test(previous)) {
        await rm(join(postsDir, `${previous}.md`), { force: true });
      }
      return send(res, 200, { saved: `content/posts/${slug}.md` });
    }

    if (pathname === "/api/post" && req.method === "DELETE") {
      const slug = url.searchParams.get("slug") ?? "";
      if (!SLUG.test(slug)) return fail(res, 400, "bad slug");
      await rm(join(postsDir, `${slug}.md`), { force: true });
      return send(res, 200, { deleted: slug });
    }

    if (pathname === "/api/preview" && req.method === "POST") {
      const { body = "" } = await readJson(req);
      return send(res, 200, { html: marked.parse(String(body), { async: false, gfm: true }) });
    }

    /* ---- images ---- */
    if (pathname === "/api/image" && req.method === "POST") {
      const name = (url.searchParams.get("name") ?? "").toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
      if (!IMAGE_NAME.test(name)) return fail(res, 400, "Use a .jpg, .png, .gif, .webp, .avif or .svg file.");

      const bytes = await readBody(req, MAX_IMAGE_BYTES);
      await mkdir(imagesDir, { recursive: true });
      await writeFile(join(imagesDir, name), bytes);
      return send(res, 200, { name, url: `/images/${name}`, bytes: bytes.length });
    }

    if (pathname === "/api/image" && req.method === "DELETE") {
      const name = url.searchParams.get("name") ?? "";
      if (!IMAGE_NAME.test(name)) return fail(res, 400, "bad image name");
      await rm(join(imagesDir, name), { force: true });
      return send(res, 200, { deleted: name });
    }

    /* ---- publish ---- */
    if (pathname === "/api/git" && req.method === "GET") {
      return send(res, 200, await gitState());
    }

    if (pathname === "/api/publish" && req.method === "POST") {
      const { message = "Update site content", check = true } = await readJson(req);
      const log = [];

      try {
        if (check) {
          log.push("Checking the site builds…");
          const { stdout, stderr } = await run("npm", ["test"], { cwd: repoRoot, maxBuffer: 32 * 1024 * 1024 });
          const output = stdout + stderr;
          if (!/# fail 0\b/.test(output)) {
            return send(res, 200, { ok: false, stage: "check", log: [...log, output.slice(-4000)] });
          }
          log.push("Build and checks passed.");
        }

        const status = await git("status", "--porcelain");
        if (!status) return send(res, 200, { ok: true, nothing: true, log: [...log, "No changes to publish."] });

        await git("add", "-A");
        log.push(await git("commit", "-m", String(message).slice(0, 500) || "Update site content"));
        log.push(await git("push"));
        log.push("Published. GitHub rebuilds the site in about a minute.");

        return send(res, 200, { ok: true, log });
      } catch (error) {
        return send(res, 200, { ok: false, stage: "git", log: [...log, error.stdout ?? "", error.stderr ?? "", error.message].filter(Boolean) });
      }
    }

    return fail(res, 404, "unknown endpoint");
  } catch (error) {
    return fail(res, 500, error.message);
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`\n  Studio    http://127.0.0.1:${PORT}`);
  console.log(`  Preview   http://localhost:3000   (started for you by "npm run edit")\n`);
});
