const adviceItems = [...document.querySelectorAll('#advice-library li')];
const topicPicker = document.getElementById('advice-topic');
const adviceButton = document.getElementById('advice-btn');
let deck = [];
let previousAdvice;

function resetAdviceDeck() {
  deck = adviceItems.filter(item => !topicPicker.value || item.dataset.topic === topicPicker.value);
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  if (deck.length > 1 && deck[deck.length - 1] === previousAdvice) {
    [deck[0], deck[deck.length - 1]] = [deck[deck.length - 1], deck[0]];
  }
}

if (topicPicker && adviceButton) {
topicPicker.addEventListener('change', () => { deck = []; });
adviceButton.disabled = adviceItems.length === 0;
adviceButton.addEventListener('click', () => {
  if (!deck.length) resetAdviceDeck();
  previousAdvice = deck.pop();
  document.getElementById('answer').textContent = previousAdvice.textContent;
  adviceButton.textContent = 'Another terrible idea';
});

}

const light = document.getElementById('light');
const themeToggle = document.getElementById('theme-toggle');
function setDay(day) {
  document.body.classList.toggle('day', day);
  if (light) {
    light.setAttribute('aria-pressed', String(day));
    light.setAttribute('aria-label', day ? 'Switch to night' : 'Switch to morning');
  }
  themeToggle.setAttribute('aria-pressed', String(day));
  themeToggle.textContent = day ? 'Night light' : 'Morning light';
  try { localStorage.setItem('talia-day', String(day)); } catch {}
}
let saved = null;
try { saved = localStorage.getItem('talia-day'); } catch {}
setDay(saved === null ? window.matchMedia('(prefers-color-scheme:light)').matches : saved === 'true');
light?.addEventListener('click', () => setDay(!document.body.classList.contains('day')));
themeToggle.addEventListener('click', () => setDay(!document.body.classList.contains('day')));

const menu = document.getElementById('menu'), nav = document.getElementById('nav');
document.body.classList.add('js');
menu.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
});
nav.addEventListener('click', () => {
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
});
menu.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
  }
});

// Preserve bookmarks from the original single-page site.
function followOldBookmark() {
  if (document.body.dataset.page !== 'home') return;
  const hash = window.location.hash;
  const anchor = hash.slice(1);
  const routes = {hi: 'about', synthetic: 'about', body: 'about', behind: 'about', locked: 'about', stay: 'about',
    advice: 'bad-advice', journal: 'journal', photos: 'contact-sheet', taste: 'taste', letters: 'letters', book: 'book'};
  const destination = anchor.startsWith('journal-') ? 'journal' : routes[anchor];
  if (destination) window.location.replace('/' + destination + '/' + hash);
}
followOldBookmark();
window.addEventListener('hashchange', followOldBookmark);

const sheet = document.getElementById('contact-sheet');
const photos = {
  1: {
    source: 'hero-small.webp',
    width: 800,
    height: 1000,
    alt: 'Illustration of Talia in a gray hoodie with blue hair, white tips, and a film camera.',
    caption: 'Me. Hi.',
  },
  2: {
    source: 'kitchen.webp',
    width: 1200,
    height: 1200,
    alt: 'Illustration of Talia tap dancing in the kitchen in socks, holding a mug of coffee.',
    caption: 'Kitchen tap dance',
  },
};
const upcoming = {
  8: { sketch: 'porch', caption: 'NEXT: porch light, from the street' },
  19: { sketch: 'mic', caption: 'NEXT: a bad-advice set' },
  30: { sketch: 'door', caption: 'NEXT: whatever I find tomorrow' },
};

for (let index = 1; sheet && index <= 36; index++) {
  const frame = document.createElement('div');
  frame.className = 'contact-frame';
  const number = String(index).padStart(2, '0');
  const photo = photos[index];
  const next = upcoming[index];

  if (photo) {
    frame.classList.add('featured');
    const image = document.createElement('img');
    image.src = '/assets/' + photo.source;
    image.width = photo.width;
    image.height = photo.height;
    image.alt = photo.alt;
    image.loading = 'lazy';
    frame.append(image);
  } else {
    frame.setAttribute('role', 'img');
    frame.setAttribute('aria-label', next?.caption ?? 'Unexposed frame ' + number);
  }

  if (next) frame.classList.add('next-' + next.sketch);
  const label = document.createElement('span');
  label.textContent = number;
  const caption = document.createElement('span');
  caption.className = 'note';
  caption.textContent = photo?.caption ?? next?.caption ?? 'UNEXPOSED';
  frame.append(label, caption);
  sheet.append(frame);
}

let typed='';document.addEventListener('keydown',e=>{if(e.target.matches('input,textarea,select,[contenteditable]'))return;if(e.key.length!==1)return;typed=(typed+e.key.toLowerCase()).slice(-5);if(typed==='howie'){const tag=document.getElementById('navtag');tag.textContent=tag.textContent==='HOWIE'?'EXPERT':'HOWIE'}});