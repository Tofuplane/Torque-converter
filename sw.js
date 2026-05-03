const CACHE = 'torque-v3';
const BASE = 'https://tofuplane.github.io/Torque-converter';

const OFFLINE_ASSETS = [
  BASE + '/',
  BASE + '/index.html',
  BASE + '/manifest.json',
  BASE + '/icons/icon-192.png',
  BASE + '/icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.allSettled(OFFLINE_ASSETS.map(url => c.add(url))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  // Navigation requests → serve index.html from cache, fall back to network
  if (req.mode === 'navigate') {
    e.respondWith(
      caches.match(BASE + '/index.html').then(cached => cached || fetch(req))
    );
    return;
  }

  // All other assets → network-first, update cache, fall back to cache
  e.respondWith(
    fetch(req)
      .then(res => {
        if (req.url.startsWith(BASE)) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req))
  );
});
