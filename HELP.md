# Help — how to run and edit your site

**English** · [中文](HELP.zh.md)

This is the plain-language guide. You do not need to write any code.

- [Start here](#start-here)
- [The whole loop](#the-whole-loop)
- [What each tab does](#what-each-tab-does)
- [Writing an article](#writing-an-article)
- [Adding pictures](#adding-pictures)
- [Changing how it looks](#changing-how-it-looks)
- [Publishing](#publishing)
- [Where everything lives](#where-everything-lives)
- [When something goes wrong](#when-something-goes-wrong)
- [Editing without any of this](#editing-without-any-of-this)

---

## Start here

Open Terminal, go to the project folder, and run:

```bash
npm install    # only the first time, or after you pull changes
npm run edit
```

`npm run edit` starts everything and opens your browser:

| | Address | What it is |
| --- | --- | --- |
| **Studio** | http://127.0.0.1:4321 | Where you edit |
| **Preview** | http://localhost:3000 | Your real site, updating as you type |

Press **Ctrl-C** once in that terminal to stop both when you are finished.

> The studio only listens on your own computer. Nobody else can reach it, and it
> is not part of the published website.

---

## The whole loop

1. `npm run edit`
2. Change whatever you like in the studio
3. Look at the preview to check it
4. Click **Publish**
5. Wait about a minute — your changes are live at https://rwteefz.github.io/

Your typing is saved to your computer as you go. Nothing reaches the internet
until you click Publish.

---

## What each tab does

**Look** — theme, colour mode, fonts, heading weight, text size, logo, and how
many articles show per page.

**Profile** — your name, profile photo, tagline, role, location, links, the page
title used by search engines, the footer, and your contact email.

**Sections** — reorder or hide whole sections with the ↑ ↓ and Visible/Hidden
buttons, rename their headings, and edit the contents of Now, Projects,
Education, and Activities.

**Articles** — write, rename, and delete articles, with a live preview.

**Pictures** — upload, copy the address of, or delete images.

**Publish** — send everything to GitHub.

---

## Writing an article

1. Go to **Articles** → **+ New article**
2. Type the title and press OK
3. Fill in the boxes, then write in the big area at the bottom

The **web address** box becomes the link. An article with the address
`my-first-post` appears at `/writing/my-first-post`. Use lowercase letters,
numbers, and hyphens — no spaces.

The **summary** is the one line shown under the title on your homepage.

### Formatting

The writing area uses Markdown. It is just text with a few marks:

| You type | You get |
| --- | --- |
| `## Section title` | A heading |
| `### Smaller title` | A smaller heading |
| `**important**` | **important** |
| `*emphasis*` | *emphasis* |
| `[the text](https://example.com)` | A link |
| `- a point` | A bulleted list |
| `1. a step` | A numbered list |
| `> a quotation` | An indented quote |
| `` `some_code` `` | Code, in a monospace font |

A blank line starts a new paragraph. The **Preview** underneath shows exactly how
it will look, as you type.

### Drafts

Any article whose web address begins with `_` is a draft: it stays on your
computer and never appears on the site. `_template.md` is one of these — it is a
reference sheet you can copy from. Leave it alone.

---

## Adding pictures

**Inside an article:** put the cursor where you want the picture, click **Add a
picture**, and choose a file. It uploads and inserts the link for you.

**A picture at the top of an article:** upload it under **Pictures**, click
**Copy address**, and paste that into the article's **Cover picture** box.

**Your logo:** same idea — upload it, copy the address, and paste it into
**Look → Logo**. Leave that box empty to show your name as text instead.

**Your profile photo:** the round picture in the left column of every page.
Upload a square photo (about 500 pixels wide is plenty) under **Pictures**, copy
its address, and paste it into **Profile → Profile photo**. Leave that box empty
and the column shows your initials instead.

Two habits worth keeping:

- **Write a description.** The text in `![description](/images/photo.jpg)` is read
  aloud to people using screen readers, and shown if the image fails to load.
- **Shrink big photos first**, to roughly 1600 pixels wide. Phone photos are
  often 5–10 MB, which makes your site slow and your repository large.

---

## Changing how it looks

**Look → Theme** has four complete designs. Click one to switch:

| Theme | Character |
| --- | --- |
| **Ink** | Warm paper, serif headings, deep green. Quiet and editorial. |
| **Slate** | Cool white, tight sans headings, electric blue. Crisp and modern. |
| **Archive** | Parchment and oxblood, high-contrast serif. Academic press. |
| **Noir** | Dark graphite, monospace headings, teal. A restrained terminal look. |

Underneath, you can adjust things on top of the theme:

- **Starting colour mode** — light, dark, or follow the visitor's device. Whatever
  you pick, visitors can still flip it with the ☾/☀ button, and their choice is
  remembered.
- **Heading and body font** — serif, sans-serif, or monospace.
- **Heading weight** — Light through Extra bold.
- **Text size** — scales all the text together.
- **Accent colour** — the green (or blue, or red) used for links and highlights.
  Leave it empty to keep the theme's own.

Watch the preview as you change these. If you dislike the result, set the boxes
back to their default option.

---

## Publishing

Go to **Publish**, write a short note about what you changed, and click
**Check and publish**.

It does three things:

1. Builds your site and runs the checks
2. Saves your changes to the project history
3. Sends them to GitHub

GitHub then rebuilds and republishes the site by itself, which takes about a
minute. Reload https://rwteefz.github.io/ to see it.

If the check finds a problem, **nothing is published** and the message explains
what broke. That is the point — it stops a broken site from going live. Fix the
problem and try again, or use **Publish without checking** if you are certain.

---

## Where everything lives

Everything on your site comes from three places:

| Folder or file | What it holds |
| --- | --- |
| `content/site.json` | Your profile, sections, theme, and all the short text |
| `content/posts/` | One file per article |
| `public/images/` | Every picture |

The studio edits all three for you. You can also open them directly in any text
editor if you prefer.

---

## When something goes wrong

**`npm run edit` says a command is not found.**
Node.js is missing or too old. You need version 22 or newer. Check with
`node --version`.

**"The studio did not start on port 4321."**
Something else is already using that port. Close the other program, or start the
studio on a different one:

```bash
PORT=4400 npm run studio
```

**The preview at localhost:3000 does not load.**
Give it a few seconds after starting — it builds the site first. If it still
fails, stop with Ctrl-C and run `npm run edit` again.

**A picture does not appear.**
Check the address starts with `/images/` and the filename matches exactly,
including capital letters. Upload it under **Pictures** if you are unsure.

**Publish says it failed.**
Read the message in the black box. The two usual causes are no internet
connection, or someone changed the project on GitHub since you last pulled. For
the second one, run `git pull` in the terminal and publish again.

**The site did not change after publishing.**
Wait a full minute, then reload. If it still looks old, your browser is showing a
saved copy — reload with Shift held down.

**I made a mess and want to undo it.**
Every publish is saved in the project history, so nothing is ever really lost.
Ask for help rather than deleting files.

---

## Editing without any of this

You can change everything from github.com in a browser, with nothing installed:

- **Text** — open `content/site.json`, click the pencil icon, change the words
  between the quotation marks, and press **Commit changes**. Leave the quotes,
  commas, and brackets exactly where they are.
- **A new article** — open `content/posts/`, choose **Add file → Create new
  file**, name it `my-article.md`, and copy the shape of `_template.md`.
- **A picture** — open `public/images/`, choose **Add file → Upload files**, then
  use it in an article with `![description](/images/your-file.jpg)`.

GitHub rebuilds and republishes the site automatically, the same as the Publish
button does.
