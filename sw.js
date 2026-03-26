const CACHE = 'map-quest-v25';
const PRECACHE = [
  './', './index.html', './manifest.json', './icon.svg',
  './oreo-logo.png', './oreo-hint.png', './d3.min.js', './topojson.min.js', './states-10m.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network-first for HTML so updates are always picked up immediately
self.addEventListener('fetch', e => {
  if (e.request.url.endsWith('.html') || e.request.url.endsWith('/')) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request))
    );
  }
});
