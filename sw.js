const CACHE = 'torque-v1';
const OFFLINE_ASSETS = [
  'https://tofuplane.github.io/Torque-converter/',
  'https://tofuplane.github.io/Torque-converter/index.html',
  'https://tofuplane.github.io/Torque-converter/manifest.json',
  'https://tofuplane.github.io/Torque-converter/icons/icon-192.png',
  'https://tofuplane.github.io/Torque-converter/icons/icon-512.png'
];

// Pre-cache assets on install
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(OFFLINE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Network-first: always try to fetch fresh, update cache, fall back to cache if offline
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(response => {
        // Update cache with fresh response
        const copy = response.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return response;
      })
      .catch(() => caches.match(e.request))
  );
});
