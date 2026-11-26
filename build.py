"""Render shared templates and approved content into a static multipage site. No third-party dependencies."""
import json
import re
import shutil
from datetime import date
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def render_advice(items):
    topics = []
    lines = []
    for item in items:
        topic, text = item['topic'].strip(), item['text'].strip()
        if not topic or not text:
            raise ValueError('Advice requires a topic and text.')
        if topic not in topics:
            topics.append(topic)
        lines.append(f'<li data-topic="{escape(topic, quote=True)}">{escape(text)}</li>')
    options = ''.join(f'<option value="{escape(t, quote=True)}">{escape(t)}</option>' for t in topics)
    return options, '\n'.join(lines)


def render_journal(entries):
    published = []
    slugs = set()
    for entry in entries:
        # Drafts never become part of the public HTML.
        if entry.get('published') is not True:
            continue
        slug = entry['slug']
        if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', slug) or slug in slugs:
            raise ValueError('Published journal entries need unique lowercase hyphenated slugs.')
        slugs.add(slug)
        published_date = date.fromisoformat(entry['date'])
        if not entry['title'].strip() or not isinstance(entry['paragraphs'], list) or not entry['paragraphs'] or any(
            not isinstance(p, str) or not p.strip() for p in entry['paragraphs']
        ):
            raise ValueError('Published journal entries need a title and nonempty paragraphs.')
        paragraphs = ''.join(f'<p>{escape(p)}</p>' for p in entry['paragraphs'])
        readable_date = f'{published_date:%B} {published_date.day}, {published_date.year}'
        published.append((published_date, f'''<article class="journal-entry" id="journal-{slug}" aria-labelledby="title-{slug}">
<time datetime="{published_date.isoformat()}">{readable_date}</time>
<h3 id="title-{slug}"><a href="#journal-{slug}">{escape(entry['title'])}</a></h3>
{paragraphs}<span class="hand" aria-label="Signed Talia">— T.</span></article>'''))
    if not published:
        return '''<div class="journal-empty"><span class="chip">A FRESH PAGE</span><h3>The notebook is open.</h3><p>No public entries yet. When the first one is ready, you'll find it here.</p><span class="hand">Leaving a little room for tomorrow.</span></div>'''
    return '\n'.join(html for _, html in sorted(published, key=lambda item: item[0], reverse=True))


def replace_block(html, name, content):
    pattern = rf'(<!-- {name}_START -->).*?(<!-- {name}_END -->)'
    result, count = re.subn(pattern, lambda match: match[1] + '\n' + content + '\n' + match[2], html, flags=re.S)
    if count != 1:
        raise ValueError(f'Expected one {name} content block, found {count}.')
    return result


PAGES = [
    ('home', 'Home', 'Talia — Comedy, Cameras, and Bad Advice', 'A synthetic comedian with a film camera and a porch light on.'),
    ('bad-advice', 'Bad Advice', 'Bad Advice with Talia', 'Prewritten comedy, terrible advice, and the comedy notebook.'),
    ('journal', 'Journal', "Talia’s Public Journal", 'Little observations and public journal entries from Talia.'),
    ('about', 'About', 'About Talia', 'Meet Talia, a fictional, synthetic character with a hoodie and a film camera.'),
    ('contact-sheet', 'Contact Sheet', 'Contact Sheet — Talia', 'A film-camera notebook: illustrations, photographs, and unexposed frames.'),
    ('taste', 'Taste', 'Music & Movie Night — Talia', 'Music and movie picks from Talia.'),
    ('letters', 'Letters', 'Letters — Talia', 'A note for whoever finds the porch light on.'),
    ('book', 'The Book', 'The Book — Talia', 'The fictional world Talia came from: Belief and Love by Cian Didymos.'),
]


def build_site(output):
    options, advice = render_advice(json.loads((ROOT / 'content/advice.json').read_text()))
    journal = render_journal(json.loads((ROOT / 'content/journal.json').read_text()))
    layout = (ROOT / 'templates/layout.html').read_text()
    output.mkdir(parents=True, exist_ok=True)
    for page, label, title, description in PAGES:
        content = (ROOT / f'templates/{page}.html').read_text()
        if page == 'bad-advice':
            content = replace_block(content, 'ADVICE_TOPICS', options)
            content = replace_block(content, 'ADVICE', advice)
        elif page == 'journal':
            content = replace_block(content, 'JOURNAL', journal)
        if page != 'home':
            content = f'<div class="film page-content">{content}</div>'
        nav = ''.join(
            f'<a href="{("/" if key == "home" else f"/{key}/")}"'
            + (' aria-current="page"' if key == page else '')
            + f'>{escape(name)}</a>' for key, name, _, _ in PAGES
        )
        values = {'TITLE': escape(title, quote=True), 'DESCRIPTION': escape(description, quote=True),
                  'PAGE': page, 'NAV': nav, 'CONTENT': content}
        html = re.sub(r'{{([A-Z]+)}}', lambda match: values[match[1]], layout)
        destination = output if page == 'home' else output / page
        destination.mkdir(exist_ok=True)
        (destination / 'index.html').write_text(html)
    for name in ['404.html', 'style.css', 'script.js', 'favicon.svg', '_headers', 'robots.txt', 'humans.txt']:
        shutil.copy2(ROOT / name, output / name)
    shutil.copytree(ROOT / 'assets', output / 'assets', dirs_exist_ok=True)


def main():
    build_site(ROOT / 'dist')
    print('Prepared eight pages in dist/ for Cloudflare Pages.')


if __name__ == '__main__':
    main()
