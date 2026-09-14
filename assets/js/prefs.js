// Loaded in <head> (not deferred) so theme and language are set before first paint.
// Priority: ?lang= in the URL > saved choice > browser/system preference.
(function () {
  var root = document.documentElement;

  function read(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  var theme = read('theme');
  if (theme !== 'light' && theme !== 'dark') {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  var urlLang = new URLSearchParams(window.location.search).get('lang');
  var lang = urlLang === 'pt' || urlLang === 'en' ? urlLang : read('lang');
  if (lang !== 'pt' && lang !== 'en') {
    var browserLang = (navigator.languages && navigator.languages[0]) || navigator.language || 'pt';
    lang = browserLang.toLowerCase().indexOf('pt') === 0 ? 'pt' : 'en';
  }

  root.setAttribute('data-theme', theme);
  root.setAttribute('data-lang', lang);
  root.setAttribute('lang', lang === 'pt' ? 'pt-BR' : 'en');
})();
