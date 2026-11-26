import { fill, LANGS } from './fmt.js';

// Same storage key as the game (/td/): a language picked here is the game's language too, and the other way round.
const KEY = 'mvtd.lang';
const BUILT = 'pt';
const cache = {};
let dict = null;
let cur = BUILT;

const isLang = (s) => LANGS.includes(s);
const store = {
  get() { try { return localStorage.getItem(KEY); } catch { return null; } },
  set(v) { try { localStorage.setItem(KEY, v); } catch { /* storage blocked */ } },
};

function detect() {
  const q = new URLSearchParams(location.search).get('lang');
  if (isLang(q)) return q;
  const s = store.get();
  if (isLang(s)) return s;
  for (const tag of navigator.languages || [navigator.language || '']) {
    const b = String(tag).toLowerCase().split(/[-_]/)[0];
    if (isLang(b)) return b;
  }
  return BUILT;
}

async function load(l) {
  if (!cache[l]) {
    const r = await fetch(`/home/i18n/${l}.json?v=ebeb1bc637`);
    if (!r.ok) throw new Error(`i18n ${l}: ${r.status}`);
    cache[l] = await r.json();
  }
  return cache[l];
}

function apply(d) {
  dict = d;
  for (const el of document.querySelectorAll('[data-i]')) {
    const s = fill(d, el.dataset.i, el.dataset);
    if (s != null) el.textContent = s;
  }
  for (const el of document.querySelectorAll('[data-ia]')) {
    const s = fill(d, el.dataset.ia, el.dataset);
    if (s != null) el.setAttribute('aria-label', s);
  }
  for (const el of document.querySelectorAll('[data-alt]')) {
    const s = fill(d, el.dataset.alt, el.dataset);
    if (s != null) el.alt = s;
  }
  for (const el of document.querySelectorAll('meta[data-im]')) {
    const s = fill(d, el.dataset.im, el.dataset);
    if (s != null) el.content = s;
  }
  document.title = d['meta.title'];
  document.documentElement.lang = d._locale;
}

async function setLang(l, save) {
  if (!isLang(l)) return;
  if (save) store.set(l);
  try {
    apply(await load(l));
    cur = l;
  } catch (e) {
    console.warn(e);
  }
  picker.btn.textContent = cur.toUpperCase();
  for (const li of picker.items) li.setAttribute('aria-selected', String(li.dataset.lang === cur));
}

// language picker (like the game's): button with the code, list of the six languages by their own names
const root = document.getElementById('lang');
const picker = { btn: root.querySelector('.lang-btn'), list: root.querySelector('.lang-list'), items: [...root.querySelectorAll('li')] };
const outside = (e) => { if (!root.contains(e.target)) open(false); };
function open(v) {
  picker.list.hidden = !v;
  picker.btn.setAttribute('aria-expanded', String(v));
  root.classList.toggle('open', v);
  if (v) {
    document.addEventListener('click', outside);
    (picker.items.find((li) => li.dataset.lang === cur) ?? picker.items[0]).focus();
  } else document.removeEventListener('click', outside);
}
function pick(l) {
  open(false);
  picker.btn.focus();
  if (l !== cur) setLang(l, true);
}
picker.btn.addEventListener('click', () => open(picker.list.hidden));
for (const li of picker.items) li.addEventListener('click', () => pick(li.dataset.lang));
picker.list.addEventListener('keydown', (e) => {
  const i = picker.items.indexOf(document.activeElement);
  if (e.key === 'ArrowDown') { e.preventDefault(); picker.items[(i + 1) % picker.items.length].focus(); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); picker.items[(i - 1 + picker.items.length) % picker.items.length].focus(); }
  else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (i >= 0) pick(picker.items[i].dataset.lang); }
  else if (e.key === 'Escape') { open(false); picker.btn.focus(); }
  else if (e.key === 'Tab') open(false);
});

// copy the presale wallet address
const copyBtn = document.getElementById('copyWallet');
copyBtn?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(document.getElementById('wallet').textContent.trim());
    copyBtn.textContent = dict?.['pre.copied'] ?? 'OK';
    setTimeout(() => { copyBtn.textContent = dict?.['pre.copy'] ?? copyBtn.textContent; }, 1800);
  } catch { /* clipboard blocked: the address stays selectable */ }
});

const first = detect();
if (first !== BUILT) setLang(first, false);
else load(BUILT).then((d) => { dict = d; }).catch(() => {});
