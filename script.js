/* ================= EDIT ONLY THIS PART ================= */
const birthdayData = {
  name: "BABU",
  sender: "Someone special",
  birthdayDate: "",               // e.g. "12 March" (optional, shown on the letter)
  greeting: "Happy Birthday",
  intro: "A little something for you...",
  balloonWords: ["Beautiful", "Special", "Kind", "Wonderful", "My favorite", "Precious"],
  cards: [
    "You make ordinary days feel special.",
    "Your smile can make everything feel a little brighter.",
    "I'm really lucky to have you in my life.",
    "Never forget how loved and appreciated you are."
  ],
  letter: [
    "Happy Birthday!",
    "I hope this new year of your life brings you countless reasons to smile, beautiful memories, exciting adventures, and everything your heart wishes for.",
    "Thank you for being such a wonderful person.",
    "Today is your day, so enjoy every little moment of it.",
    "You deserve all the happiness in the world.",
    "Happy Birthday once again! ❤️"
  ],
  music: "assets/music/music.mp3",          // loads only when the ♫ button is tapped
  useSounds: false,                          // set true after adding the files below
  sounds: { click: "assets/sounds/click.mp3", pop: "assets/sounds/pop.mp3", candle: "assets/sounds/candle.mp3", envelope: "assets/sounds/envelope.mp3", celebrate: "assets/sounds/celebrate.mp3" }
};
/* ================= END OF EDITABLE PART ================= */

const $ = (s, r = document) => r.querySelector(s), D = birthdayData, S = {};
const sleep = ms => new Promise(r => setTimeout(r, ms)), rnd = (a, b) => a + Math.random() * (b - a);
const PAL = ['#ff9ec7', '#ffc2dc', '#c9a7ff', '#a78bfa', '#ffd76b', '#fff3d6'], pick = () => PAL[Math.random() * 6 | 0];
const small = () => innerWidth < 700, fine = matchMedia('(pointer:fine)').matches;

/* ---- audio (optional) ---- */
const sfx = k => { try { if (D.useSounds && D.sounds[k]) { const a = new Audio(D.sounds[k]); a.volume = .5; a.play().catch(() => {}); } } catch (e) {} };
let bgm, musicOn = false;
$('#music').onclick = e => {
  musicOn = !musicOn; e.currentTarget.classList.toggle('on', musicOn);
  try { if (!bgm) { bgm = new Audio(D.music); bgm.loop = true; bgm.volume = .4; } musicOn ? bgm.play().catch(() => {}) : bgm.pause(); } catch (_) {}
};

/* ---- particles canvas ---- */
const cv = $('#fx'), cx = cv.getContext('2d');
let W, H, amb = [], P = [], mode = 'dark', px = 0, py = 0, tx = 0, ty = 0, celeb;
function size() {
  const d = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight;
  cv.width = W * d; cv.height = H * d; cx.setTransform(d, 0, 0, d, 0, 0);
  amb = Array.from({ length: small() ? 42 : 78 }, () => ({ x: rnd(0, W), y: rnd(0, H), r: rnd(.8, 2.6), v: rnd(.15, .5), p: rnd(0, 6.3), h: Math.random() < .22, c: pick() }));
}
addEventListener('resize', size); size();
const heart = (x, y, s) => {
  cx.beginPath(); cx.moveTo(x, y + s * .3);
  cx.bezierCurveTo(x, y - s * .2, x - s, y - s * .2, x - s, y + s * .3); cx.bezierCurveTo(x - s, y + s * .8, x, y + s, x, y + s * 1.3);
  cx.bezierCurveTo(x, y + s, x + s, y + s * .8, x + s, y + s * .3); cx.bezierCurveTo(x + s, y - s * .2, x, y - s * .2, x, y + s * .3); cx.fill();
};
const burst = (x, y, n = 40, k = 'mix') => {
  for (let i = 0; i < n && P.length < 600; i++) {
    const a = rnd(0, 6.3), s = rnd(2, 8);
    P.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 3, g: .13, r: rnd(4, 9), a: rnd(0, 6), w: rnd(-.2, .2), l: 1, d: rnd(.008, .016), c: pick(), h: k == 'hearts' || (k == 'mix' && Math.random() < .5) });
  }
};
const rain = n => { for (let i = 0; i < n && P.length < 600; i++) P.push({ x: rnd(0, W), y: -10, vx: rnd(-1, 1), vy: rnd(1.5, 4), g: .01, r: rnd(4, 8), a: rnd(0, 6), w: rnd(-.1, .1), l: 1, d: .004, c: pick(), h: Math.random() < .3 }); };
function loop(t) {
  cx.clearRect(0, 0, W, H); px += (tx - px) * .05; py += (ty - py) * .05; const day = mode == 'day';
  for (const a of amb) {
    a.y -= day || a.h ? a.v : a.v * .2; if (a.y < -10) { a.y = H + 10; a.x = rnd(0, W); }
    const x = a.x + px * a.r * 8, y = a.y + py * a.r * 8;
    cx.globalAlpha = day ? .55 : .3 + .7 * (.5 + .5 * Math.sin(t / 700 + a.p)); cx.fillStyle = day || a.h ? a.c : '#fff';
    if (a.h) heart(x, y, a.r * 2.4); else { cx.beginPath(); cx.arc(x, y, a.r, 0, 6.3); cx.fill(); }
  }
  for (let i = P.length; i--;) {
    const p = P[i]; p.vy += p.g; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.a += p.w; p.l -= p.d;
    if (p.l <= 0 || p.y > H + 20) { P.splice(i, 1); continue; }
    cx.globalAlpha = Math.min(1, p.l * 2); cx.fillStyle = p.c;
    if (p.h) heart(p.x, p.y, p.r * .6); else { cx.save(); cx.translate(p.x, p.y); cx.rotate(p.a); cx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); cx.restore(); }
  }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

/* parallax (mouse on desktop, touch-drag on mobile) + cursor sparkles */
addEventListener('pointermove', e => {
  tx = e.clientX / W * 2 - 1; ty = e.clientY / H * 2 - 1;
  document.body.style.setProperty('--px', tx); document.body.style.setProperty('--py', ty);
  if (fine && e.pointerType == 'mouse' && Math.random() < .3) P.push({ x: e.clientX, y: e.clientY, vx: rnd(-.6, .6), vy: rnd(-.6, .2), g: .02, r: rnd(3, 6), a: 0, w: 0, l: 1, d: .03, c: pick(), h: Math.random() < .5 });
});
const flash = () => { const f = $('#flash'); f.classList.add('on'); setTimeout(() => f.classList.remove('on'), 450); };

/* ---- scene engine ---- */
let busy = false;
async function go(id) {
  if (busy) return; busy = true; clearInterval(celeb);
  const f = $('.scene.active');
  if (f) { f.classList.add('leaving'); await sleep(650); f.classList.remove('active', 'leaving'); }
  const t = $('#' + id); mode = t.dataset.mode; document.body.dataset.mode = mode;
  document.body.classList.toggle('blur', id == 's7'); t.classList.add('active'); busy = false; S[id]();
}
document.addEventListener('click', e => {
  const b = e.target.closest('.btn');
  if (b) { sfx('click'); const r = b.getBoundingClientRect(); burst(r.x + r.width / 2, r.y + r.height / 2, 14, 'hearts'); }
  const g = e.target.closest('[data-go]'); if (g) go(g.dataset.go);
});

/* 1 — heart */
S.s1 = async () => {
  const t = $('#introText'), h = $('#heart'), b = $('#openBtn');
  t.textContent = D.intro; t.classList.remove('in'); h.classList.remove('in', 'go'); b.classList.add('off');
  await sleep(400); t.classList.add('in'); await sleep(1300); h.classList.add('in'); await sleep(1800); b.classList.remove('off');
};
async function openHeart() {
  const h = $('#heart'); if (h.classList.contains('go') || busy) return; h.classList.add('go'); sfx('click');
  const r = h.getBoundingClientRect(); burst(r.x + r.width / 2, r.y + r.height / 2, 70, 'hearts'); await sleep(900); go('s2');
}
$('#heart').onclick = $('#openBtn').onclick = openHeart;

/* 2 — birthday reveal */
S.s2 = () => {
  $('#hbTitle').textContent = D.greeting + ', ' + D.name;
  const t = $('#tree'), N = small() ? 60 : 88; t.innerHTML = '';
  for (let i = 0; i < N; i++) {
    const a = i / N * 6.283, k = i % 3 ? 1 : rnd(.2, .75), e = document.createElement('i'); e.textContent = '♥';
    e.style.cssText = `left:${50 + 16 * Math.sin(a) ** 3 * k * 2.7}%;top:${46 - (13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) * k * 2.7}%;color:${PAL[i % 5]};font-size:${rnd(11, 22)}px;--d:${(i * .025).toFixed(2)}s`;
    t.append(e);
  }
};

/* 3 — cake & candle */
S.s3 = () => { $('#cake').classList.remove('out'); $('#wishText').textContent = 'Tap the flame 🕯️'; $('#wishBtn').classList.add('off'); };
$('#flame').onclick = async () => {
  const c = $('#cake'); if (c.classList.contains('out')) return; c.classList.add('out'); sfx('candle');
  const r = $('#flame').getBoundingClientRect(), cd = $('.candle');
  for (let i = 0; i < 4; i++) { const s = document.createElement('span'); s.className = 'smoke'; s.style.setProperty('--dx', rnd(-22, 22) + 'px'); s.style.animationDelay = i * .2 + 's'; cd.append(s); setTimeout(() => s.remove(), 2800); }
  flash(); burst(r.x + r.width / 2, r.y + r.height / 2, 80, 'mix');
  $('#wishText').textContent = 'Make a wish... ✨'; await sleep(2300);
  $('#wishText').textContent = "Wish made? Let's continue 💕"; $('#wishBtn').classList.remove('off');
};

/* 4 — balloons */
S.s4 = () => {
  const f = $('#field'), words = D.balloonWords, cols = ['#ff8fb8', '#c9a7ff', '#ffd76b', '#ff9e9e', '#9ad0ff', '#9be3c0']; let n = 0;
  f.innerHTML = ''; $('#s4msg').classList.remove('in'); $('#s4btn').classList.add('off'); $('#cnt').textContent = `0 / ${words.length}`;
  words.forEach((w, i) => {
    const s = document.createElement('div'), b = document.createElement('button'), l = document.createElement('span');
    s.className = 'slot'; b.className = 'balloon'; l.className = 'word'; l.textContent = w; b.setAttribute('aria-label', 'Pop balloon ' + (i + 1));
    b.style.cssText = `--c:${cols[i % cols.length]};--t:${rnd(3, 5).toFixed(1)}s;--dl:${-rnd(0, 3).toFixed(1)}s;--rt:${rnd(3, 7).toFixed(1)}deg`;
    b.onclick = async () => {
      if (s.classList.contains('popped')) return; s.classList.add('popped'); sfx('pop');
      const r = b.getBoundingClientRect(); burst(r.x + r.width / 2, r.y + r.height / 3, 28, 'mix'); $('#cnt').textContent = `${++n} / ${words.length}`;
      if (n == words.length) { await sleep(900); $('#s4msg').classList.add('in'); await sleep(900); $('#s4btn').classList.remove('off'); }
    };
    s.append(b, l); f.append(s);
  });
};

/* 5 — message cards */
let io, qt; 
S.s5 = () => {
  const l = $('#cards'), sc = $('#s5'), q = []; let seen = 0; l.innerHTML = ''; sc.scrollTop = 0; $('#s5btn').classList.add('off');
  clearInterval(qt); qt = 0; io && io.disconnect();
  const rev = c => {
    if (c.classList.contains('in')) return; c.classList.add('in'); const r = c.getBoundingClientRect(); burst(r.x + rnd(30, r.width - 30), r.y + r.height / 2, 10, 'hearts');
    if (++seen == D.cards.length) setTimeout(() => $('#s5btn').classList.remove('off'), 500);
  };
  io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting && !q.includes(e.target) && !e.target.classList.contains('in')) {
      q.push(e.target);
      if (!qt) qt = setInterval(() => { const c = q.shift(); if (!c) { clearInterval(qt); qt = 0; } else rev(c); }, 550);
    }
  }), { root: sc, threshold: .5 });
  D.cards.forEach(t => {
    const c = document.createElement('div'), i = document.createElement('i'), p = document.createElement('p'); c.className = 'card'; i.textContent = '♥'; p.textContent = t; c.append(i, p);
    c.onclick = () => rev(c);
    c.onpointermove = e => { if (e.pointerType != 'mouse') return; const r = c.getBoundingClientRect(); c.style.setProperty('--ry', ((e.clientX - r.x) / r.width - .5) * 14 + 'deg'); c.style.setProperty('--rx', -((e.clientY - r.y) / r.height - .5) * 14 + 'deg'); };
    c.onpointerleave = () => { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); };
    l.append(c); io.observe(c);
  });
};

/* 6 — envelope */
S.s6 = () => { $('#env').classList.remove('open'); $('#elT').textContent = 'For ' + D.name; $('#envBtn').classList.remove('off'); };
async function openEnv() {
  const e = $('#env'); if (e.classList.contains('open')) return; e.classList.add('open'); sfx('envelope');
  $('#envBtn').classList.add('off'); document.body.classList.add('blur');
  const r = e.getBoundingClientRect(), iv = setInterval(() => burst(r.x + rnd(0, r.width), r.y + rnd(0, r.height / 2), 4, 'hearts'), 250);
  burst(r.x + r.width / 2, r.y + r.height / 2, 30, 'hearts'); await sleep(2800); clearInterval(iv); go('s7');
}
$('#env').onclick = $('#envBtn').onclick = openEnv;

/* 7 — letter */
S.s7 = async () => {
  const L = $('#letter'), b = $('#s7btn'); L.innerHTML = ''; L.scrollTop = 0; b.classList.add('off');
  const h = document.createElement('h2'); h.textContent = `For you, ${D.name} ❤️`; L.append(h);
  if (D.birthdayDate) { const s = document.createElement('small'); s.textContent = D.birthdayDate; L.append(s); }
  const els = D.letter.map(t => { const p = document.createElement('p'); p.className = 'pm'; p.textContent = t; L.append(p); return p; });
  const sg = document.createElement('p'); sg.className = 'pm sig'; sg.textContent = 'With love, ' + D.sender; L.append(sg); els.push(sg);
  await sleep(1100);
  for (const p of els) { p.classList.add('in'); p.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); await sleep(900); }
  b.classList.remove('off');
};

/* 8 — celebration */
S.s8 = () => {
  $('#fTitle').textContent = `${D.greeting}, ${D.name} ❤️`; sfx('celebrate'); const sky = $('#sky'); sky.innerHTML = '';
  burst(W / 2, H / 2, 140, 'mix'); rain(70);
  const rise = () => {
    const b = document.createElement('div'); b.className = 'balloon rise'; b.style.cssText = `--c:${['#ff8fb8', '#c9a7ff', '#ffd76b', '#9ad0ff'][Math.random() * 4 | 0]};--l:${rnd(4, 90)}%;width:${rnd(44, 70)}px`;
    sky.append(b); setTimeout(() => b.remove(), 7200);
  };
  for (let i = 0; i < 5; i++) setTimeout(rise, i * 400);
  celeb = setInterval(() => { rain(6); if (Math.random() < .5) burst(rnd(W * .2, W * .8), rnd(H * .15, H * .5), 22, 'mix'); if (Math.random() < .4) rise(); }, 700);
};
$('#s8').addEventListener('pointerdown', e => { if (!e.target.closest('.btn')) burst(e.clientX, e.clientY, 30, 'mix'); });

S.s1();
