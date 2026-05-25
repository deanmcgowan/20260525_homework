const CACHE_NAME = 'stormaktstiden-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/styles/main.css',
  '/js/app.js',
  '/js/data.js',
  '/js/storage.js',
  '/js/utils.js',
  '/js/modes/quiz.js',
  '/js/modes/timeline.js',
  '/js/modes/cards.js',
  '/js/modes/story.js',
  '/js/modes/match.js',
  '/js/modes/draw.js',
  '/js/modes/audio.js',
  '/js/modes/test.js',
  '/js/progress.js',
  '/assets/audio/gustaf_ii_adolf.mp3',
  '/assets/audio/kristina.mp3',
  '/assets/audio/karl_x_gustav.mp3',
  '/assets/audio/karl_xi.mp3',
  '/assets/audio/karl_xii.mp3'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
