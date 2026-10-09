(function(){
  'use strict';
  const CURRENT='25.89';
  const VERSION_URL='./version.json';
  function newer(a,b){
    const A=String(a).split('.').map(Number), B=String(b).split('.').map(Number);
    for(let i=0;i<Math.max(A.length,B.length);i++){const x=A[i]||0,y=B[i]||0;if(x!==y)return x>y;}
    return false;
  }
  function remember(v){try{localStorage.setItem('miFutbolClubLatestKnownVersion',v)}catch(e){}}
  function known(){try{return localStorage.getItem('miFutbolClubLatestKnownVersion')||CURRENT}catch(e){return CURRENT}}
  function banner(text,buttonText,onClick){
    let b=document.getElementById('updateBanner');
    if(!b){b=document.createElement('div');b.id='updateBanner';b.style.cssText='position:fixed;top:8px;left:50%;transform:translateX(-50%);z-index:100000;max-width:92%;background:#fff7cc;border:2px solid #d39b00;border-radius:12px;padding:10px 14px;font:700 14px Arial;color:#1b2a3a;box-shadow:0 4px 14px #0004;text-align:center';document.body.appendChild(b)}
    b.textContent=text;
    if(buttonText){const bt=document.createElement('button');bt.textContent=buttonText;bt.style.cssText='margin-left:10px;padding:6px 10px;font-weight:800;cursor:pointer';bt.onclick=onClick;b.appendChild(bt)}
  }
  async function check(){
    if(location.protocol==='file:'){console.info('Mi Fútbol Club updater: prueba local; la actualización en línea se activa al publicar por HTTPS.');return;}
    if(!navigator.onLine){
      if(newer(known(),CURRENT)) banner('Hay una actualización disponible. Activa Internet para actualizar. Puedes continuar usando esta versión.');
      else banner('Sin conexión a Internet. Puedes continuar usando esta versión; al conectarte se comprobarán actualizaciones.');
      return;
    }
    try{
      const r=await fetch(VERSION_URL+'?t='+Date.now(),{cache:'no-store'}); if(!r.ok) throw new Error('HTTP '+r.status);
      const info=await r.json(); remember(info.version||CURRENT);
      if(newer(info.version,CURRENT)){
        banner('Nueva versión '+info.version+' disponible.', 'ACTUALIZAR', async function(){
          try{
            if('serviceWorker' in navigator){
              const reg=await navigator.serviceWorker.getRegistration();
              if(reg){
                await reg.update();
                if(reg.waiting) reg.waiting.postMessage({type:'SKIP_WAITING'});
              }
            }
          }catch(e){}
          try{
            const keys=await caches.keys();
            await Promise.all(keys.filter(k=>k.startsWith('mi-futbol-club-') || k.startsWith('bairoa-futbol-')).map(k=>caches.delete(k)));
          }catch(e){}
          location.replace((info.url||'./')+'?actualizado='+Date.now());
        });
      }
    }catch(e){ banner('No se pudo comprobar la actualización. Puedes continuar usando esta versión.'); }
  }
  window.addEventListener('load',check);
  window.addEventListener('online',check);
})();
