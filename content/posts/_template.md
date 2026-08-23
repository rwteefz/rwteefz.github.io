---
title: The title of your article
date: 2026-08-23
summary: One sentence shown under the title on the homepage.
cover:
coverAlt:
---

Files whose name starts with an underscore are ignored, so this template never
appears on the site. To write a new article, make a copy with a normal name such
as `my-first-article.md` — that filename becomes the web address.

Write normally. A blank line starts a new paragraph.

## A heading

Use `##` for a heading and `###` for a smaller one.

You can make text **bold** or *italic*, add a [link](https://example.com), and
write lists:

- first point
- second point

1. numbered
2. also numbered

> A quote, for something worth setting apart.

## Adding a picture

Put the image file in the `public/images/` folder, then write:

![A short description of the picture](/images/my-picture.jpg)

The description is read aloud by screen readers, so write a real one.

To show a picture at the very top of the article instead, put its address on the
`cover:` line in the header above, and a description on `coverAlt:`.

## Code

Indent with backticks for `short code`, or fence a block:

```python
print("hello")
```
