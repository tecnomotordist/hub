const CACHE_NAME = 'tm-hub-v5.0';

// Ficheiros a serem guardados em cache para funcionar offline e carregar a nova fonte
const urlsToCache = [
  './',
  './index.html',
  './index2.html',
  './index3.html',
  './pirulen.ttf',
  './manifest.json?v=5.0'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('A apagar cache antiga:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Estratégia Network First: Tenta a internet primeiro. Se falhar, usa o cache.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
