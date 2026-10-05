(()=>{
  const root=document.documentElement,current=root.lang;
  const paths=JSON.parse(root.dataset.languagePaths);
  const key='turbo-range-language';
  const supported=['en','it'];
  const requested=new URLSearchParams(location.search).get('lang');
  let saved=null;
  try{saved=localStorage.getItem(key)}catch{}
  const browserLanguages=navigator.languages?.length?navigator.languages:[navigator.language||'en'];
  const detected=browserLanguages.map(value=>value.toLowerCase().split(/[-_]/)[0]).find(value=>supported.includes(value))||'en';
  const preferred=supported.includes(requested)?requested:supported.includes(saved)?saved:detected;
  if(supported.includes(requested)){try{localStorage.setItem(key,requested)}catch{}}
  function destination(language,explicit=true){const url=new URL(paths[language],location.href);url.search=location.search;if(explicit)url.searchParams.set('lang',language);else url.searchParams.delete('lang');url.hash=location.hash;return url.href}
  if(preferred!==current){location.replace(destination(preferred,supported.includes(requested)));return}
  document.addEventListener('DOMContentLoaded',()=>{
    const select=document.getElementById('languageSelect');select.value=current;
    select.addEventListener('change',()=>{const language=select.value;try{localStorage.setItem(key,language)}catch{}location.assign(destination(language))});
  });
})();
