const CACHE_NAME = 'cultivation-rpg-v2-4';
const ASSETS = [
  './',
  './index.html?v=2.4',
  './styles.css?v=2.4',
  './manifest.json',
  './js/data.js?v=2.4',
  './js/audio.js?v=2.4',
  './js/game.js?v=2.4',
  './js/ui.js?v=2.4'
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
