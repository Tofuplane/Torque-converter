const CACHE = 'torque-v2';
const ASSETS = [
  'https://tofuplane.github.io/Torque-converter/',
  'https://tofuplane.github.io/Torque-converter/index.html',
  'https://tofuplane.github.io/Torque-converter/manifest.json',
  'https://tofuplane.github.io/Torque-converter/icons/icon-192.png',
  'https://tofuplane.github.io/Torque-converter/icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
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
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
