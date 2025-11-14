const CACHE_NAME = 'euromillions-v1';
const RUNTIME_CACHE = 'runtime-cache';

// Файлы для кэширования при установке
const PRECACHE_URLS = [
  '/',
  '/manifest.json',
  '/euromillions-logo.png'
];

// Установка service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Активация и очистка старых кэшей
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Стратегия Network First с fallback на кэш для всех ресурсов
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Пропускаем не-GET запросы
  if (request.method !== 'GET') {
    return;
  }

  console.log('[SW] Fetching:', request.url);

  event.respondWith(
    fetch(request, {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache'
      }
    })
      .then(async (response) => {
        // Кэшируем только успешные ответы
        if (response.ok) {
          console.log('[SW] Caching response for:', request.url);
          
          // Логируем данные для API джекпота
          if (request.url.includes('/api/jackpot')) {
            const cloneForLog = response.clone();
            const data = await cloneForLog.json();
            console.log('[SW] Jackpot data:', data);
          }
          
          const responseToCache = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            // Удаляем старый кеш перед добавлением нового
            cache.delete(request).then(() => {
              cache.put(request, responseToCache);
              console.log('[SW] Cached:', request.url);
            });
          });
        }
        return response;
      })
      .catch(() => {
        console.log('[SW] Network failed, trying cache for:', request.url);
        // Офлайн - берём из кэша
        return caches.match(request).then(async (cachedResponse) => {
          if (cachedResponse) {
            console.log('[SW] Serving from cache:', request.url);
            
            // Логируем данные из кеша для API джекпота
            if (request.url.includes('/api/jackpot')) {
              const cloneForLog = cachedResponse.clone();
              const data = await cloneForLog.json();
              console.log('[SW] Cached jackpot data:', data);
            }
            
            return cachedResponse;
          }
          
          console.log('[SW] No cache found for:', request.url);
          
          // Если в кэше нет, возвращаем базовую страницу для документов
          if (request.destination === 'document') {
            return caches.match('/');
          }
          
          return new Response('Offline', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        });
      })
  );
});

// Fetch с таймаутом
function fetchWithTimeout(request, timeout) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  return fetch(request, { signal: controller.signal })
    .finally(() => clearTimeout(timeoutId));
}
