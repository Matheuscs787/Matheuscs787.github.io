'use strict';

const root = document.documentElement;

const store = {
  get(key) { try { return localStorage.getItem(key); } catch (e) { return null; } },
  set(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* storage unavailable */ } }
};



/*-----------------------------------*\
  #THEME
\*-----------------------------------*/

const themeToggles = document.querySelectorAll('[data-theme-toggle]');

const applyTheme = function (theme) {
  root.setAttribute('data-theme', theme);
  themeToggles.forEach(btn => btn.setAttribute('aria-pressed', String(theme === 'dark')));
};

themeToggles.forEach(btn => btn.addEventListener('click', function () {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  store.set('theme', next);
  applyTheme(next);
}));

// follow system changes while the visitor hasn't picked a theme
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
  if (!store.get('theme')) applyTheme(e.matches ? 'dark' : 'light');
});

applyTheme(root.getAttribute('data-theme') || 'light');



/*-----------------------------------*\
  #LANGUAGE
\*-----------------------------------*/

const langToggles = document.querySelectorAll('[data-lang-toggle]');

const applyLang = function (lang) {
  root.setAttribute('data-lang', lang);
  root.setAttribute('lang', lang === 'pt' ? 'pt-BR' : 'en');

  const title = root.getAttribute('data-title-' + lang);
  if (title) document.title = title;

  // attributes that can't hold bilingual child elements (alt, aria-label...)
  document.querySelectorAll('[data-i18n-attr]').forEach(el => {
    el.dataset.i18nAttr.split(',').forEach(attr => {
      const value = el.getAttribute('data-' + attr + '-' + lang);
      if (value !== null) el.setAttribute(attr, value);
    });
  });
};

langToggles.forEach(btn => btn.addEventListener('click', function () {
  const next = root.getAttribute('data-lang') === 'pt' ? 'en' : 'pt';
  store.set('lang', next);
  applyLang(next);
}));

// a ?lang= link choice is remembered for the next pages
const urlLang = new URLSearchParams(window.location.search).get('lang');
if (urlLang === 'pt' || urlLang === 'en') store.set('lang', urlLang);

applyLang(root.getAttribute('data-lang') || 'pt');



/*-----------------------------------*\
  #EXPERIENCE DURATION
\*-----------------------------------*/

// data-from / data-to as "YYYY-MM"; empty data-to means current job.
// Months are counted inclusively, like LinkedIn does.
const formatDuration = function (months, lang) {
  const y = Math.floor(months / 12);
  const m = months % 12;
  const words = lang === 'pt'
    ? { y: ['ano', 'anos'], m: ['mês', 'meses'], and: ' e ' }
    : { y: ['yr', 'yrs'], m: ['mo', 'mos'], and: ' ' };
  const parts = [];
  if (y) parts.push(y + ' ' + words.y[y > 1 ? 1 : 0]);
  if (m) parts.push(m + ' ' + words.m[m > 1 ? 1 : 0]);
  return parts.join(words.and);
};

document.querySelectorAll('.dur[data-from]').forEach(el => {
  const [fy, fm] = el.dataset.from.split('-').map(Number);
  const now = new Date();
  const [ty, tm] = el.dataset.to ? el.dataset.to.split('-').map(Number) : [now.getFullYear(), now.getMonth() + 1];
  const months = (ty - fy) * 12 + (tm - fm) + 1;
  if (months < 1) return;

  el.innerHTML = '<span lang="pt-BR">' + formatDuration(months, 'pt') + '</span>' +
                 '<span lang="en">' + formatDuration(months, 'en') + '</span>';
});



/*-----------------------------------*\
  #FOOTER YEAR
\*-----------------------------------*/

document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
