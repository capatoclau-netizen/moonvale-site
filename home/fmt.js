/** Shared by the page (home.js) and the build (scripts/build-site.ts): one text of the landing in one language.
 * Placeholders read the element's data-* values: {n} number, {d} decimal (locale), {r} rarity, {f} frame, {t} time. */
export function fill(dict, key, data) {
  const s = dict[key];
  if (typeof s !== 'string') return null;
  return s.replace(/\{([a-z])\}/g, (m, k) => {
    const v = data[k];
    if (v == null) return m;
    if (k === 'r') return dict['rar.' + v] ?? v;
    if (k === 'f') return dict['frame.' + v] ?? v;
    if (k === 't') return dict['t.' + v] ?? v;
    if (k === 'd') return Number(v).toLocaleString(dict._locale || 'pt-BR');
    if (k === 'n') return Number(v).toLocaleString(dict._locale || 'pt-BR');
    return v;
  });
}
export const LANGS = ['pt', 'en', 'es', 'th', 'ja', 'zh'];
