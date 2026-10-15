const CACHE='mi-futbol-club-v25.101';
const CORE=["./","./index.html","./manifest.webmanifest","./actualizador.js","./version.json","./balon_seccion4.png","./campo_aprobado.png","./campo_lecciones_limpio.png","./campo_saques_sin_balon.jpg","./defensa.png","./delantero.png","./mediocampista.png","./portero.png","./mi_futbol_club_logo.png","./mi-futbol-club-icon-192.png","./mi-futbol-club-icon-512.png","./s1_aprobado_v49.html","./partido_final_v12.html"];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).catch(()=>{}));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('message',e=>{if(e.data&&e.data.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('fetch',e=>{
 const req=e.request; if(req.method!=='GET')return; const u=new URL(req.url);
 if(u.origin!==location.origin)return;
 const dynamic=/\.(?:html|js|json|webmanifest)$/i.test(u.pathname)||u.pathname.endsWith('/');
 if(dynamic){
  e.respondWith(fetch(req,{cache:'no-store'}).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(req,copy));return r;}).catch(()=>caches.match(req).then(x=>x||caches.match('./index.html'))));
 }else{
  e.respondWith(caches.match(req).then(x=>x||fetch(req).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(req,copy));return r;})));
 }
});
