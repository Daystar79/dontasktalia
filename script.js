const advice=[ "Stuck in a meeting that should have been an email? Fix it by being the email. Stand very still and stop talking. They'll adjourn out of fear.","If you can't decide, flip a coin. If you don't like the result, flip it again. Best out of fifty is just being thorough.","Nervous about a first date? Arrive an hour early so you can scout the exits. They'll be so impressed they'll assume you're a spy. That's still a good first impression.","Cooking something and it smells weird? Add garlic. Still weird? More garlic. Now it's intentional.","If you're lost, never ask directions. Just walk with the confidence of someone who owns the road. Eventually the road will agree.","Forgot a friend's birthday? Don't apologize. Tell them you've been building up to something big and then be vague for a year.","Bored at a family dinner? Ask everyone to rank the relatives. Out loud. In writing. You're welcome.","Phone at one percent? Lower the brightness, close all apps, and tell yourself you don't need it. It'll respect the boundary. Probably." ];let deck=[];document.getElementById('advice-btn').addEventListener('click',()=>{if(!deck.length)deck=[...advice].sort(()=>Math.random()-.5);document.getElementById('answer').textContent=deck.pop()});const light=document.getElementById('light');function setDay(day){document.body.classList.toggle('day',day);light.setAttribute('aria-pressed',String(day));light.setAttribute('aria-label',day?'Switch to night':'Switch to morning');try{localStorage.setItem('talia-day',String(day))}catch{}}let saved=null;try{saved=localStorage.getItem('talia-day')}catch{}setDay(saved===null?window.matchMedia('(prefers-color-scheme:light)').matches:saved==='true');light.addEventListener('click',()=>setDay(!document.body.classList.contains('day')));const menu=document.getElementById('menu'),nav=document.getElementById('nav');menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});nav.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')});

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

for (let index = 1; index <= 36; index++) {
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

let typed='';document.addEventListener('keydown',e=>{if(e.target.matches('input,textarea,[contenteditable]'))return;if(e.key.length!==1)return;typed=(typed+e.key.toLowerCase()).slice(-5);if(typed==='howie'){const tag=document.getElementById('navtag');tag.textContent=tag.textContent==='HOWIE'?'EXPERT':'HOWIE'}});