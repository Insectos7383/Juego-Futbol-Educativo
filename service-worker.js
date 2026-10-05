const CACHE='bairoa-futbol-v25-69';
const ASSETS=['./','./index.html','./manifest.webmanifest','./actualizador.js','./version.json','./bairoa_logo.jpg','./campo_aprobado.png','./campo_lecciones_limpio.png','./campo_saques_sin_balon.jpg','./defensa.png','./delantero.png','./mediocampista.png','./portero.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  const u=new URL(e.request.url);
  if(u.origin!==location.origin) return;
  if(u.pathname.endsWith('/version.json')||u.pathname.endsWith('/index.html')||u.pathname.endsWith('/Bairoa-Futbol-Club/')){
    e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r;}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));
  }else{
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(n=>{const copy=n.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return n;})));
  }
});
