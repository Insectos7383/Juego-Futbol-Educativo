/* MI FUTBOL CLUB - Service Worker V25.100 */
const APP_VERSION = '25.100';
const CACHE_NAME = 'mi-futbol-club-v' + APP_VERSION;
const CORE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './version.json',
  './actualizador.js',
  './balon_seccion4.png',
  './campo_aprobado.png',
  './campo_lecciones_limpio.png',
  './campo_saques_sin_balon.jpg',
  './defensa.png',
  './delantero.png',
  './mediocampista.png',
  './portero.png',
  './mi_futbol_club_logo.png',
  './mi-futbol-club-icon-192.png',
  './mi-futbol-club-icon-512.png',
  './s1_aprobado_v49.html',
  './partido_final_v12.html'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE)).catch(()=>{}));
});

self.addEventListener('activate', event => {
  event.waitUntil((async()=>{
    const keys = await caches.keys();
    await Promise.all(keys.map(k => k === CACHE_NAME ? Promise.resolve() : caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if(event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  if(event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if(url.origin !== self.location.origin) return;

  const isNavigation = event.request.mode === 'navigate';
  const alwaysFresh = isNavigation || /(?:index\.html|version\.json|actualizador\.js|manifest\.webmanifest)$/i.test(url.pathname);

  if(alwaysFresh){
    event.respondWith((async()=>{
      try{
        const fresh = await fetch(event.request, {cache:'no-store'});
        if(fresh && fresh.ok){
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, fresh.clone()).catch(()=>{});
        }
        return fresh;
      }catch(e){
        return (await caches.match(event.request)) || (await caches.match('./index.html'));
      }
    })());
    return;
  }

  event.respondWith((async()=>{
    const cached = await caches.match(event.request);
    const network = fetch(event.request, {cache:'no-cache'}).then(async fresh=>{
      if(fresh && fresh.ok){
        const cache = await caches.open(CACHE_NAME);
        cache.put(event.request, fresh.clone()).catch(()=>{});
      }
      return fresh;
    }).catch(()=>null);
    return cached || (await network) || Response.error();
  })());
});
