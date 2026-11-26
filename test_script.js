// Exercise the shared script on every page without a browser dependency.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const pages = ['home', 'bad-advice', 'journal', 'about', 'contact-sheet', 'taste', 'letters', 'book'];
const advice = JSON.parse(fs.readFileSync('content/advice.json', 'utf8'));
for (const page of pages) {
  const elements = new Map();
  function element() {
    const classes = new Set();
    return {
      dataset: {}, value: '', listeners: {}, attributes: {}, children: [],
      classList: {
        add(value) { classes.add(value); },
        contains(value) { return classes.has(value); },
        remove(value) { classes.delete(value); },
        toggle(value, force) {
          const enabled = force ?? !classes.has(value);
          if (enabled) classes.add(value); else classes.delete(value);
          return enabled;
        },
      },
      setAttribute(key, value) { this.attributes[key] = value; },
      addEventListener(type, callback) { this.listeners[type] = callback; },
      append(...children) { this.children.push(...children); },
    };
  }
  const file = page === 'home' ? 'dist/index.html' : `dist/${page}/index.html`;
  for (const match of fs.readFileSync(file, 'utf8').matchAll(/\bid="([^"]+)"/g)) {
    elements.set(match[1], element());
  }
  const body = element();
  body.dataset.page = page;
  const items = advice.map(item => ({dataset: {topic: item.topic}, textContent: item.text}));
  const redirects = [];
  const context = {
    document: {
      body,
      getElementById(id) { return elements.get(id) ?? null; },
      querySelectorAll() { return page === 'bad-advice' ? items : []; },
      createElement: element,
      addEventListener() {},
    },
    localStorage: {getItem() { return 'false'; }, setItem() {}},
    window: {
      matchMedia() { return {matches: false}; },
      addEventListener() {},
      location: {hash: '#journal-first-note', replace(url) { redirects.push(url); }},
    },
    Math,
  };
  vm.runInNewContext(fs.readFileSync('script.js', 'utf8'), context);
  assert.equal(redirects.length, page === 'home' ? 1 : 0);
  if (page === 'home') assert.equal(redirects[0], '/journal/#journal-first-note');
  elements.get('theme-toggle').listeners.click();
  assert(body.classList.contains('day'));
  elements.get('menu').listeners.click();
  assert(elements.get('nav').classList.contains('open'));
  elements.get('nav').listeners.click();
  assert(!elements.get('nav').classList.contains('open'));
  if (page === 'contact-sheet') assert.equal(elements.get('contact-sheet').children.length, 36);
  if (page === 'bad-advice') {
    const button = elements.get('advice-btn');
    const answer = elements.get('answer');
    const picker = elements.get('advice-topic');
    const seen = new Set();
    for (let i = 0; i < items.length; i++) {
      button.listeners.click();
      seen.add(answer.textContent);
    }
    assert.equal(seen.size, items.length);
    const previous = answer.textContent;
    button.listeners.click();
    assert.notEqual(answer.textContent, previous);
    for (const topic of new Set(advice.map(item => item.topic))) {
      picker.value = topic;
      picker.listeners.change();
      for (let i = 0; i < 10; i++) {
        button.listeners.click();
        assert(advice.some(item => item.topic === topic && item.text === answer.textContent));
      }
    }
  }
}
console.log('Shared navigation, themes, bookmarks, photos, and advice passed across eight pages.');
