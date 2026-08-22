# rwteefz.github.io

A deliberately small personal homepage: mono typography, a little terminal energy, and a single JSON file as the source of truth.

## Update the page

Open `/edit/` on the published site (or `http://localhost:3000/edit/` locally). Change the quick fields or edit the JSON directly, then download `site.json`.

Replace `content/site.json` in the repository with that file and commit. The existing GitHub Actions workflow rebuilds and publishes the site automatically.

For larger edits, the main fields are:

- `profile`: name, role, motto, location, and links
- `now`: the three things currently in progress
- `education`: education and experience rows
- `projects`: project cards
- `writing`: short notes or external links
- `contact`: email call-to-action

The editor is intentionally local-only: it does not need a database, login, or API token, and it never writes to GitHub on your behalf.

## Local preview

Requires Node.js 22 or newer:

```bash
npm install
npm run dev
```

Then open `http://localhost:3000/`. Run `npm test` for the export and content checks.

## Publish

Keep the repository's GitHub Pages source set to **GitHub Actions**. The included workflow builds `dist/client` and deploys it on every commit to `main`.
