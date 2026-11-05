const CACHE_NAME = 'cultivation-rpg-v2-3';
const ASSETS = [
  './',
  './index.html?v=2.3',
  './styles.css?v=2.3',
  './manifest.json',
  './js/data.js?v=2.3',
  './js/audio.js?v=2.3',
  './js/game.js?v=2.3',
  './js/ui.js?v=2.3'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Network-First стратегия
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((networkRes) => {
        if (networkRes && networkRes.status === 200) {
          const resClone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, resClone));
        }
        return networkRes;
      })
      .catch(() => caches.match(e.request))
  );
});
