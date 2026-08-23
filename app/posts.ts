import { marked } from "marked";

export type Post = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  cover: string;
  coverAlt: string;
  html: string;
};

// Every .md file in content/posts is an article. The filename becomes the URL,
// so notes-on-learning-in-public.md is served at /writing/notes-on-learning-in-public/.
// Reading them at build time keeps the site a plain static export.
const files = import.meta.glob("../content/posts/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

/** Splits the `key: value` header off the top of an article from its Markdown body. */
function split(raw: string) {
  const match = raw.match(FRONTMATTER);
  if (!match) return { meta: {} as Record<string, string>, body: raw };

  const meta: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;

    const key = line.slice(0, colon).trim();
    const value = line.slice(colon + 1).trim().replace(/^["'](.*)["']$/, "$1");
    if (key) meta[key] = value;
  }

  return { meta, body: raw.slice(match[0].length) };
}

export const posts: Post[] = Object.entries(files)
  .map(([path, raw]) => {
    const slug = path.split("/").pop()!.replace(/\.md$/, "");
    const { meta, body } = split(raw);

    return {
      slug,
      title: meta.title || slug,
      date: meta.date || "",
      summary: meta.summary || "",
      cover: meta.cover || "",
      coverAlt: meta.coverAlt || meta.title || "",
      // The author of these files is the site owner, so the Markdown is trusted.
      html: marked.parse(body, { async: false, gfm: true }) as string,
    };
  })
  // Files starting with _ are templates and drafts, not published articles.
  .filter((post) => !post.slug.startsWith("_"))
  .sort((a, b) => b.date.localeCompare(a.date));

export const getPost = (slug: string) => posts.find((post) => post.slug === slug);
