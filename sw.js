const CACHE_NAME = 'vocabulary-cache-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icon-192.png',
    '/icon-512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .catch((error) => {
                console.error('Failed to cache assets during install:', error);
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                // Возвращаем данные из кэша, если они есть, иначе делаем сетевой запрос
                return cachedResponse || fetch(event.request);
            })
            .catch((error) => {
                console.error('Fetch handler failed:', error);
                // Здесь можно добавить fallback-логику, если нет ни кэша, ни сети
            })
    );
});

self.addEventListener('activate', (event) => {
    // Очистка старых версий кэша при обновлении Service Worker-а
    const cacheAllowlist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheAllowlist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});