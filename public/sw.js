const CACHE_NAME = 'mcq-hero-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching static app shell & external libraries');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache bundle:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event (Caching Strategy)
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip POST, PUT, DELETE or Firebase/Cloud DB request streams 
  if (request.method !== 'GET' || url.href.includes('firestore.googleapis.com') || url.href.includes('google-analytics')) {
    return;
  }

  // Caching Strategy: Stale-While-Revalidate for local assets & external cdn libs
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch fresh copy in background to update the cache
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const cacheCopy = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, cacheCopy);
              });
            }
            return networkResponse;
          })
          .catch((err) => {
            console.warn('[Service Worker] Background fetch failed for cached asset (User is likely offline):', url.pathname, err);
          });

        return cachedResponse;
      }

      // If not cached, fetch from network and store in cache
      return fetch(request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'error') {
            return networkResponse;
          }

          // Dynamic caching of assets, script files, css files, layout icons & images
          const isStaticAsset = url.origin === self.location.origin && 
            (url.pathname.endsWith('.js') || 
             url.pathname.endsWith('.css') || 
             url.pathname.endsWith('.svg') || 
             url.pathname.endsWith('.png') || 
             url.pathname.endsWith('.jpg') || 
             url.pathname.endsWith('.woff') || 
             url.pathname.endsWith('.woff2') || 
             url.pathname.includes('/assets/'));

          const isCdnLib = url.hostname.includes('cdnjs.cloudflare.com');

          if (isStaticAsset || isCdnLib) {
            const cacheCopy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, cacheCopy);
            });
          }

          return networkResponse;
        })
        .catch((error) => {
          // Offline fallback
          console.warn('[Service Worker] Fetch failed (Offline mode active):', url.href, error);
          
          // Fallback to cached index.html for SPA page navigations
          if (request.mode === 'navigate') {
            return caches.match('/');
          }
          throw error;
        });
    })
  );
});
