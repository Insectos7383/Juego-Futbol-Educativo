const CACHE_NAME = 'bairoa-futbol-v25-84';
const APP_ASSETS = [
  "./",
  "./index.html",
  "./s1_aprobado_v23.html",
  "./manifest.webmanifest",
  "./bairoa_logo.jpg",
  "./campo_aprobado.png",
  "./campo_lecciones_limpio.png",
  "./campo_saques_sin_balon.jpg",
  "./defensa.png",
  "./delantero.png",
  "./mediocampista.png",
  "./portero.png",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match('./index.html')))
  );
});
