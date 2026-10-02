const CACHE = 'kc-tuition-v1';
const ASSETS = [
  '/manifest.webmanifest',
  '/css/style.css',
  '/js/dashboard.js',
  '/js/exam.js',
  '/js/homework-viewer.js',
  '/js/protect.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || !request.url.startsWith(self.location.origin)) return;

  const url = new URL(request.url);
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/exam/') || url.pathname.startsWith('/login') || url.pathname.startsWith('/teacher/login')) return;

  if (['style.css'].some(x => url.pathname.endsWith(x)) || url.pathname.startsWith('/js/') || url.pathname.startsWith('/icons/') || url.pathname.endsWith('manifest.webmanifest')) {
    event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(request, copy));
      return response;
    })));
  }
});
