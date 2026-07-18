const CACHE_NAME = 'mcq-hero-v3'; // Bumped version
const ASSETS_TO_PRECACHE = [
  '/',
  '/index.html',
];

// Install event - Pre-cache core files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching static app shell');
      return cache.addAll(ASSETS_TO_PRECACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate event - Clean up stale caches and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Removing stale cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - Caching strategy
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // 1. Only handle GET requests
  if (request.method !== 'GET') {
    return;
  }

  // 2. Do NOT intercept/cache Firestore, Firebase auth, FCM, database, or API proxy requests
  if (
    url.hostname.includes('firebase') || 
    url.hostname.includes('googleapis') || 
    url.hostname.includes('firestore') ||
    url.pathname.startsWith('/api/') ||
    url.pathname.includes('socket.io') ||
    url.pathname.includes('hot-update')
  ) {
    // Let the network handle it directly
    return;
  }

  // 3. For the HTML app shell (index.html or root), use a Network-First strategy
  // This ensures users always get the latest version if online, but fall back to the cached copy offline.
  if (url.origin === self.location.origin && (url.pathname === '/' || url.pathname === '/index.html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful response
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // If network fails (offline), fallback to cached shell
          return caches.match(request);
        })
    );
    return;
  }

  // 4. For other static assets (JS, CSS, images, local files, CDNs), use a Cache-First / Stale-While-Revalidate strategy
  // This loads things lightning-fast, and caches newly loaded resources on the fly.
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch in background to update cache (Stale-While-Revalidate)
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, networkResponse);
              });
            }
          })
          .catch(() => {/* Ignore network errors during background fetch */});
        
        return cachedResponse;
      }

      // If not in cache, fetch from network and cache
      return fetch(request).then((networkResponse) => {
        // Only cache valid successful GET requests
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      }).catch((err) => {
        console.warn('[Service Worker] Fetch failed for:', request.url, err);
      });
    })
  );
});
