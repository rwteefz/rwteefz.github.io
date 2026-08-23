# rwteefz.github.io

My personal site: profile, projects, education, activities, and writing.
Everything you see on the page comes from one file, [`content/site.json`](content/site.json).
No database, no login, no admin panel — the published site is plain static files.

## How to change the content

You never need to touch the code. Pick whichever of these suits you.

### 1. Edit on github.com (easiest, nothing to install)

1. Open [`content/site.json`](content/site.json) on github.com.
2. Click the pencil icon (**Edit this file**).
3. Change the text between the quotation marks. Leave the quotes, commas, and brackets alone.
4. Scroll down and press **Commit changes**.

GitHub rebuilds and republishes the site automatically. Give it about a minute, then reload the page.

### 2. Use the form editor (best if JSON makes you nervous)

Open [`tools/editor.html`](tools/editor.html) in your browser — double-clicking the file is enough.
It shows a normal form: labelled boxes, and buttons to add, reorder, or remove entries.

1. Click **Load site.json** and choose `content/site.json`.
2. Edit the boxes.
3. Click **Download site.json**, then put the downloaded file back at `content/site.json` and commit it.
   Or click **Copy JSON** and paste it over the file on github.com using the steps above.

This tool runs entirely on your computer. It is not part of the published site, makes no network
calls, and never touches GitHub on your behalf.

### 3. Edit the file directly

Open `content/site.json` in any text editor, change it, and commit. Run `npm test` first if you want
to be sure the file is still valid.

## What each part of `site.json` controls

| Key | Where it shows up |
| --- | --- |
| `profile` | Your name, tagline, role, location, and the links at the top |
| `site` | Browser tab title, intro paragraph, footer, and link-preview text |
| `now` | The short "Now" list of what you are working on |
| `projects` | The Projects rows |
| `education` | The Education rows |
| `activities` | The Activities rows — clubs, volunteering, competitions |
| `writing` | The Writing rows. Use `"#"` as the link for anything unpublished |
| `contact` | The closing block and your email address |

## Run it on your own computer

Requires Node.js 22 or newer:

```bash
npm install
npm run dev
```

Then open `http://localhost:3000/`. Run `npm test` to build the site and check the export.

## How it gets published

GitHub Pages serves static files only — there is no server running behind this site. The workflow in
`.github/workflows/pages.yml` builds the page into `dist/client` and deploys it on every commit to
`main`. Keep the repository's Pages source set to **GitHub Actions**.
