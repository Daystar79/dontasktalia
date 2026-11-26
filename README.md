# Don't Ask Talia

Talia's static multipage website, with **Bad Advice with Talia** and a **public journal**. It keeps the porch-light, film-camera design and identifies Talia as a fictional, synthetic character.

## Preview and edit

The finished site is committed in `public/`. Serve it directly with any static file server. For example:

```sh
python3 -m http.server 8000 --directory public
```

Visit `http://localhost:8000`. The journal and complete advice archive are readable without JavaScript. The topic picker, lantern, and mobile menu use JavaScript.

After editing templates, content, or assets, run `python3 build.py` locally with Python 3.10+ and commit the refreshed `public/` files with the source changes.

## Page structure

- `/` — a shorter welcome page with links to the main rooms.
- `/bad-advice/` — topic picker, complete advice archive, and comedy notebook.
- `/journal/` — public journal.
- `/about/` — introduction, synthetic disclosure, body-model snapshot, and how it works.
- `/contact-sheet/` — the 36-frame contact sheet.
- `/taste/` — music and movies.
- `/letters/` — the public letter.
- `/book/` — the book and prequel information.

Edit page content in `templates/<page>.html`. The shared head, header, navigation slot, and footer live in `templates/layout.html`; navigation labels and page metadata live in `build.py`. CSS and JavaScript are shared, with page-specific features initialized only where present. The light setting carries between pages. Old homepage section bookmarks redirect to the matching page when JavaScript is available.

## Publish a journal entry

Edit `content/journal.json`. It starts empty; no journal entries have been invented for Talia. Add entries using this shape, replacing the example with approved writing:

```json
[
  {
    "slug": "a-title-for-the-entry",
    "date": "2026-11-26",
    "title": "An entry title",
    "paragraphs": ["First paragraph.", "Second paragraph."],
    "published": true
  }
]
```

Only entries with `published: true` appear. Dates use `YYYY-MM-DD`; slugs must be unique, lowercase, and hyphenated. Entries appear newest first and have permanent links such as `/journal/#journal-a-title-for-the-entry`. Titles and paragraphs are plain text, not HTML or Markdown. A human author should review Talia's writing before setting `published` to `true`.

After editing content, run `python3 build.py` and commit the updated `public/` files. There is no online editor or automatic connection to Talia's runtime.

## Update Bad Advice

Edit `content/advice.json`, an array of objects with `topic` and `text` fields, then rebuild. Topics populate the picker automatically. The eight initial bits come from the existing page; they are prewritten comedy, not generated replies. The existing skit notebook stays in `templates/bad-advice.html`.

## Cloudflare Pages

For Git-connected Cloudflare Pages, use these project settings:

- Production branch: `main`
- Root directory: repository root
- Framework preset: None
- Build command: leave blank
- Build output directory: `public`

For direct upload, upload the contents of `public/`. This directory contains only the served files. Templates, source content, and unpublished journal entries stay outside the deployment.

## Checks

```sh
python3 -m unittest -v
node --check script.js
node test_script.js
```
