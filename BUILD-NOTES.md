# Talia landing page — review checklist

Built from TALIA-PAGE-OUTLINE.md (Nov 25, 2026). Static HTML/CSS/JS; no build step, API, tracking, forms, or deployment.

## Multipage update — November 26, 2026
- Replaced the scrolling homepage with eight static routes and a shared layout in `templates/`.
- Added active navigation, a theme toggle on every page, a shorter welcome page, and redirects for old section bookmarks.
- Page scripts safely initialize without the advice, lantern, or contact-sheet elements present on other pages.
- Verified seven Python tests including cross-page links, all eight pages' JavaScript behavior, and JavaScript syntax. Browser preview still reports that its access host is unavailable. No deployment performed.

## November 26, 2026 update
- Added a topic picker and readable full archive for the existing Bad Advice lines, while preserving the skit notebook.
- Added the public journal section, navigation, empty state, and generation of dated, linkable entries from `content/journal.json`.
- Added a dependency-free build to `dist/`, excluding source content and drafts from the deployment output. See README.md for editing and Cloudflare Pages settings.
- Verified six content-generation tests, advice topic/deck behavior, homepage anchors and assets, and repeatable builds. JavaScript syntax and Git whitespace checks pass.
- Browser QA could not run: the browser access host was unavailable. No deployment performed.

## Original implementation
- First-person copy and 12 film frames, night/morning lantern, responsive film rails, 36 contact-sheet slots, eight local canned bad-advice lines, HOWIE easter eggs, accessible details and navigation, 404, metadata, favicon, Cloudflare headers.
- Archived Golem snapshot is explicitly dated; not represented as live.
- Book link, socials and newsletter deliberately not connected.

## Artwork for review
- Generated porch and kitchen illustrations follow the outline. The source avatar and kitchen photograph referenced there were unavailable locally, so likeness and final art approval are pending.
- The page includes the lantern states, film rails and grain, contact-sheet sketches, HOWIE sticker, clapperboard, speech bubble, exposure dials, letter texture, locked door, social card, lantern icons, and custom 404 art.
- The social image uses a local asset path. Set an absolute social image URL once the public origin is confirmed.

## Awaiting approval/assets
- Prequel download URL, social destinations, copyright text, sign-off for newly drafted bad-advice lines.
- Optional performance and WCAG browser audit.
- No deployment or Cloudflare Pages integration performed.

## Local preview and hosting
Serve the checked-in site with `python3 -m http.server 8000 --directory public`. Cloudflare Pages uses `public` as its output directory with the build command blank. Run `python3 build.py` locally to regenerate the committed files after editing the sources.
