const CACHE_NAME = 'bairoa-futbol-v25-84-r18';

const APP_ASSETS = [
  "./",
  "./index.html",
  "./s1_aprobado_v23.html",
  "./actualizador.js",
  "./version.json",
  "./manifest.webmanifest",
  "./mi_futbol_club_logo.png",
  "./bairoa_logo.jpg",
  "./balon_seccion4.png",
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
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const isFreshCritical =
    url.pathname.endsWith('/index.html') ||
    url.pathname.endsWith('/actualizador.js') ||
    url.pathname.endsWith('/version.json') ||
    url.pathname.endsWith('/service-worker.js') ||
    url.pathname.endsWith('/s1_aprobado_v23.html');

  if (isFreshCritical) {
    event.respondWith(
      fetch(event.request, {cache:'no-store'})
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request).then(r => r || caches.match('./index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached =>
      cached ||
      fetch(event.request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return response;
      }).catch(() => caches.match('./index.html'))
    )
  );
});
