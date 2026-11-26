# Don't Ask Talia

Talia's static multipage website, with **Bad Advice with Talia** and a **public journal**. It keeps the porch-light, film-camera design and identifies Talia as a fictional, synthetic character.

## Preview and build

No packages are required. Use Python 3.10+:

```sh
python3 build.py
python3 -m http.server 8000 --directory dist
```

Visit `http://localhost:8000`. The build renders the shared layout, individual pages, and approved content and copies only public website files into `dist/`. Both the journal and complete advice archive are readable without JavaScript; the topic picker, lantern, and mobile menu use JavaScript.

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

After editing content, run `python3 build.py` and deploy the new output. There is no online editor or automatic connection to Talia's runtime.

## Update Bad Advice

Edit `content/advice.json`, an array of objects with `topic` and `text` fields, then rebuild. Topics populate the picker automatically. The eight initial bits come from the existing page; they are prewritten comedy, not generated replies. The existing skit notebook stays in `templates/bad-advice.html`.

## Cloudflare Pages

For a Git-connected Pages project, use build command `python3 build.py` and output directory `dist`, with this repository as the root. For an existing direct-upload project, upload the contents of `dist/` using its existing deployment workflow. No Worker, database, account credentials, or new service is needed.

**Deploy only `dist/`, not the repository root.** The repository's source content may contain unpublished drafts; those source files are deliberately excluded from the output. Generated, unpublished entries are omitted from the HTML as well. Do not commit sensitive private writing to the repository.

This change prepares the site locally; it does not change your Cloudflare project settings or deploy it.

## Checks

```sh
python3 -m unittest -v
node --check script.js
node test_script.js
```
