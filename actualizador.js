/* Actualizador V25.100: corrige instalaciones móviles retenidas en versiones anteriores. */
(function(){
  const TARGET='25.100';
  const CURRENT=String(window.APP_VERSION||'');
  const key='miFutbolUpdateReloadTarget';

  async function clearOldStateAndReload(){
    try{
      if('serviceWorker' in navigator){
        const regs=await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(r=>r.unregister().catch(()=>false)));
      }
      if('caches' in window){
        const keys=await caches.keys();
        await Promise.all(keys.map(k=>caches.delete(k)));
      }
    }catch(e){}
    try{sessionStorage.setItem(key,TARGET)}catch(e){}
    const u=new URL(location.href);
    u.searchParams.set('v',TARGET);
    u.searchParams.set('refresh',Date.now().toString());
    location.replace(u.toString());
  }

  async function check(){
    try{
      const r=await fetch('./version.json?ts='+Date.now(),{cache:'no-store'});
      if(!r.ok) return;
      const j=await r.json();
      const latest=String(j.version||'');
      if(!latest) return;
      if(CURRENT && CURRENT!==latest){
        const already=sessionStorage.getItem(key);
        if(already!==latest) await clearOldStateAndReload();
        return;
      }
      try{sessionStorage.removeItem(key)}catch(e){}
      if('serviceWorker' in navigator){
        const reg=await navigator.serviceWorker.getRegistration();
        if(reg){ try{await reg.update()}catch(e){} }
      }
    }catch(e){}
  }
  window.addEventListener('load',()=>setTimeout(check,700),{once:true});
})();
