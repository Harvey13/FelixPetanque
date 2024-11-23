const CACHE_NAME = 'tirage-equipes-v6';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/petanque.svg',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Dynamically cache CSS and JS files
const dynamicUrlsToCache = [
  // Will be populated during install
];

// Install event - cache all initial resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async (cache) => {
        console.log('Opening cache');
        
        // Cache static files
        await cache.addAll(urlsToCache);

        // Find and cache main CSS and JS files
        try {
          const mainPage = await fetch('/index.html');
          const text = await mainPage.text();
          const matches = text.match(/\/assets\/[^"]+\.(js|css)/g) || [];
          
          // Add found assets to dynamic cache list
          matches.forEach(match => {
            if (!dynamicUrlsToCache.includes(match)) {
              dynamicUrlsToCache.push(match);
            }
          });

          // Cache dynamic files
          await cache.addAll(dynamicUrlsToCache);
        } catch (error) {
          console.error('Error caching dynamic assets:', error);
        }
      })
      .catch(error => {
        console.error('Cache installation failed:', error);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      clients.claim()
    ])
  );
});

// Helper function to normalize URLs
const normalizeUrl = (url) => {
  const urlObj = new URL(url, self.location.origin);
  // Remove query parameters and hash
  return urlObj.origin + urlObj.pathname;
};

// Fetch event - serve from cache first, then network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  const normalizedUrl = normalizeUrl(event.request.url);

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request because it's a one-time use stream
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then((response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200) {
              return response;
            }

            // Clone the response because it's a one-time use stream
            const responseToCache = response.clone();

            // Cache the new response
            caches.open(CACHE_NAME)
              .then((cache) => {
                const url = new URL(event.request.url);
                // Only cache same-origin requests
                if (url.origin === self.location.origin) {
                  cache.put(event.request, responseToCache);
                }
              });

            return response;
          })
          .catch(() => {
            // If both network and cache fail for navigation, return cached index.html
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            return new Response('Network error happened', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' },
            });
          });
      })
  );
});
