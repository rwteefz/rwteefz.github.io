# rwteefz.github.io

My personal site: profile, projects, education, activities, and writing.

> **New here, or just want to edit the site?** Read the step-by-step guide:
> **[HELP.md](HELP.md)** · **[使用说明（中文）](HELP.zh.md)**

The published site is plain static files — no database, no server, no admin
panel. Everything comes from three places in this repository:

| Where | What it holds |
| --- | --- |
| `content/site.json` | Profile, sections, theme, and all the short text |
| `content/posts/*.md` | One Markdown file per article |
| `public/images/` | Pictures used by articles and the logo |

## Editing with the studio (the easy way)

The studio is a local editing app. It runs on your own computer, writes these
files for you, and can publish to GitHub with one button.

```bash
npm install    # first time only
npm run edit   # every time you want to make changes
```

That one command starts the studio, starts the live preview, and opens the
studio in your browser. Press Ctrl-C once to stop both.

- **Studio** — http://127.0.0.1:4321 — where you edit
- **Preview** — http://localhost:3000 — the real site, updating as you type

(`npm run studio` starts the studio on its own if you ever want just that.)

The studio has six tabs:

- **Look** — pick a theme, colour mode, fonts, accent colour, logo, and how many
  articles appear per page
- **Profile** — your name, tagline, links, and the page's sharing text
- **Sections** — reorder or hide sections, and edit Now, Projects, Education and
  Activities
- **Articles** — write, rename, and delete articles, with a live preview and an
  **Add a picture** button that uploads and links the image for you
- **Pictures** — upload and manage everything in `public/images`
- **Publish** — writes a commit and pushes it. It builds and tests the site
  first, and refuses to publish if something is broken.

Your changes are saved to disk as you type. Publishing is always a separate,
deliberate click.

The studio is not part of the published site. It listens only on `127.0.0.1`,
so nothing outside your computer can reach it.

## Editing on github.com (no tools needed)

You can also edit straight in the browser:

- **Text** — open `content/site.json`, click the pencil icon, change the text
  between the quotation marks, and press **Commit changes**.
- **A new article** — open `content/posts/`, click **Add file → Create new
  file**, name it `my-article.md`, and copy the shape of
  [`_template.md`](content/posts/_template.md).
- **A picture** — open `public/images/`, click **Add file → Upload files**, then
  use it in an article with `![description](/images/your-file.jpg)`.

Either way, GitHub rebuilds and republishes the site automatically in about a
minute.

## Writing articles

Each article is a Markdown file in `content/posts/`. The filename becomes the
web address, so `notes-on-learning.md` is served at `/writing/notes-on-learning`.

```markdown
---
title: The title of your article
date: 2026-08-23
summary: One sentence shown under the title on the homepage.
cover:
coverAlt:
---

Write normally. A blank line starts a new paragraph.
```

Files whose name starts with `_` are drafts and never appear on the site.
[`_template.md`](content/posts/_template.md) documents the rest of the format.

Articles are listed newest first, paged at `/writing`, with the most recent few
also shown on the homepage. Both counts are set under **Look** in the studio.

## Themes

Four presets live in [`content/themes.json`](content/themes.json), each a full
palette for light and dark plus a heading typeface:

- **Ink** — warm paper, serif headings, deep green. Quiet and editorial.
- **Slate** — cool neutrals, tight sans headings, electric blue. Crisp and modern.
- **Archive** — parchment and oxblood, high-contrast serif. Academic press.
- **Noir** — dark-first graphite, monospace headings, teal signal.

Pick one under **Look**, or set `theme.preset` in `site.json`. Heading font, body
font, and accent colour can each be overridden on top of the preset.

## Running it yourself

Requires Node.js 22 or newer.

```bash
npm install
npm run edit      # studio + preview together, opens the browser
npm run dev       # preview only, at http://localhost:3000
npm run studio    # studio only, at http://127.0.0.1:4321
npm test          # build the site and check the export
npm run lint
```

## How it gets published

GitHub Pages serves static files only — there is no server behind this site.
`.github/workflows/pages.yml` builds into `dist/client` and deploys on every
commit to `main`. Keep the repository's Pages source set to **GitHub Actions**.

`tools/finalise-export.mjs` runs after the build. vinext cannot prerender a
dynamic route while `trailingSlash` is enabled, so the config turns it off and
this script mirrors every exported `page.html` to `page/index.html`, keeping both
`/writing/my-article` and `/writing/my-article/` working.
