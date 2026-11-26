import unittest
import tempfile
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

from build import PAGES, build_site, render_advice, render_journal, replace_block


class ContentTests(unittest.TestCase):
    def entry(self, **changes):
        return dict({'published': True, 'slug': 'first-note', 'date': '2026-11-26',
                     'title': 'A <note>', 'paragraphs': ['Coffee & cameras.']}, **changes)

    def test_empty_journal_and_drafts(self):
        self.assertIn('No public entries yet', render_journal([]))
        self.assertNotIn('SECRET', render_journal([{'published': False, 'title': 'SECRET'}]))

    def test_entries_are_escaped_dated_and_linkable(self):
        result = render_journal([self.entry()])
        self.assertIn('A &lt;note&gt;', result)
        self.assertIn('Coffee &amp; cameras.', result)
        self.assertIn('November 26, 2026', result)
        self.assertIn('href="#journal-first-note"', result)

    def test_latest_entry_first(self):
        result = render_journal([self.entry(slug='older', date='2026-11-25'), self.entry(slug='newer')])
        self.assertLess(result.index('id="journal-newer"'), result.index('id="journal-older"'))

    def test_invalid_or_duplicate_entries_rejected(self):
        for entries in [[self.entry(slug='../bad')], [self.entry(date='2026-02-30')],
                        [self.entry(), self.entry()], [self.entry(paragraphs='Not a list')]]:
            with self.subTest(entries=entries), self.assertRaises(ValueError):
                render_journal(entries)

    def test_advice_topics_and_text_are_escaped(self):
        options, items = render_advice([{'topic': 'Friends & family', 'text': '<Be vague>'}])
        self.assertIn('Friends &amp; family', options)
        self.assertIn('&lt;Be vague&gt;', items)

    def test_render_is_repeatable_and_requires_markers(self):
        template = '<!-- JOURNAL_START -->old<!-- JOURNAL_END -->'
        updated = replace_block(template, 'JOURNAL', 'new')
        self.assertEqual(updated, replace_block(updated, 'JOURNAL', 'new'))
        with self.assertRaises(ValueError):
            replace_block('', 'JOURNAL', 'new')


class ParsedPage(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.ids = []
        self.links = []
        self.current = []
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        if tag == 'a':
            self.links.append(attrs.get('href', ''))
            if attrs.get('aria-current') == 'page':
                self.current.append(attrs['href'])
        elif tag in ['script', 'img', 'link']:
            self.links.append(attrs.get('src') or attrs.get('href', ''))


class SiteTests(unittest.TestCase):
    def test_built_pages_have_valid_navigation_and_no_private_sources(self):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory)
            build_site(output)
            pages = {('/' if key == 'home' else f'/{key}/'): key for key, *_ in PAGES}
            parsed = {}
            for route in pages:
                target = output / route.lstrip('/') / 'index.html'
                html = target.read_text()
                self.assertNotIn('{{', html)
                page = parsed[route] = ParsedPage(html)
                self.assertEqual(page.current, [route])
                self.assertEqual(len(page.ids), len(set(page.ids)))
            for route, page in parsed.items():
                for link in page.links:
                    url = urlsplit(link)
                    if url.scheme or url.netloc:
                        continue
                    destination = url.path or route
                    target = output / destination.lstrip('/')
                    if destination.endswith('/'):
                        target /= 'index.html'
                    self.assertTrue(target.is_file(), (route, link))
                    if url.fragment:
                        self.assertIn(url.fragment, parsed[destination].ids, (route, link))
            self.assertNotIn('advice-btn', parsed['/'].ids)
            self.assertIn('advice-btn', parsed['/bad-advice/'].ids)
            self.assertIn('journal-entries', parsed['/journal/'].ids)
            self.assertNotIn('journal-entries', parsed['/'].ids)
            self.assertFalse((output / 'content').exists())
            self.assertFalse((output / 'templates').exists())


if __name__ == '__main__':
    unittest.main()
