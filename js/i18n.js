(function(){
  const available = ['es','en','ko'];
  const defaultLang = (localStorage.getItem('site_lang') || (navigator.language||'es').split('-')[0]).toLowerCase();
  let current = available.includes(defaultLang) ? defaultLang : 'es';

  function fetchJSON(lang){
    return fetch(`./i18n/${lang}.json`, {cache: 'no-store'}).then(r => {
      if(!r.ok) throw new Error('No language file');
      return r.json();
    });
  }

  function getByKey(obj, key){
    if(!key) return null;
    return key.split('.').reduce((acc, part) => acc && acc[part], obj);
  }

  function applyTranslations(dict){
    const missing = [];

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const value = getByKey(dict, key);
      if(value !== undefined && value !== null){
        if(el.tagName.toLowerCase() === 'input' || el.tagName.toLowerCase() === 'textarea'){
          el.placeholder = value;
        } else {
          el.innerHTML = value;
        }
      } else {
        missing.push(key);
      }
    });

    // placeholders using data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      const value = getByKey(dict, key);
      if(value !== undefined && value !== null){
        el.placeholder = value;
      } else {
        missing.push(key);
      }
    });

    // if any missing keys, warn once with a unique list
    if(missing.length){
      const uniq = Array.from(new Set(missing));
      console.warn('i18n: missing translation keys for', uniq.slice(0,50));
      // expose last missing keys for debugging
      window.__i18n = Object.assign(window.__i18n || {}, { missingKeys: uniq });
    }

    // update language selector value if present
    const sel = document.getElementById('lang-select');
    if(sel) sel.value = current;

    // update html lang attr for accessibility/SEO
    document.documentElement.lang = current;

    // persist
    localStorage.setItem('site_lang', current);

    // refresh AOS if present
    if(window.AOS && typeof AOS.refresh === 'function'){
      AOS.refresh();
    }
  }

  function setLang(lang){
    if(!available.includes(lang)) return;
    current = lang;
    fetchJSON(lang).then(dict => applyTranslations(dict)).catch(err => console.error('i18n load failed', err));
  }

  // Init on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    // add listener to selector
    const sel = document.getElementById('lang-select');
    if(sel){
      sel.addEventListener('change', (e) => setLang(e.target.value));
    }

    setLang(current);
  });

  // expose for debugging
  window.__i18n = {setLang, current, available};
})();
