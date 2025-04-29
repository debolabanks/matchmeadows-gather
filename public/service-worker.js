// Service Worker for MatchMeadows PWA

const CACHE_NAME = 'matchmeadows-cache-v1';
const OFFLINE_PAGE = '/offline.html';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/assets/new-message.mp3',
  '/assets/incoming-call.mp3',
  '/assets/correct.mp3',
  '/assets/wrong.mp3',
  '/assets/win.mp3',
  '/assets/lose.mp3',
  '/assets/draw.mp3',
  '/assets/start.mp3',
  '/assets/click.mp3',
  '/manifest.json',
  '/favicon.ico',
  '/icon-192.png',
  '/icon-512.png',
  '/lovable-uploads/8749e6f1-e275-4fb8-9f22-46fed6f0643f.png'
];

// Install event - cache core assets
self.addEventListener('install', event => {
  console.log('Service Worker: Installing');
  
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching core assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .catch(error => {
        console.error('Service Worker: Caching failed', error);
        // Continue installation even if caching fails
        return Promise.resolve();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating');
  
  // Take control of all clients as soon as it's activated
  event.waitUntil(clients.claim());
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
  // Special handling for asset files or uploaded images
  if (event.request.url.includes('/assets/') || event.request.url.includes('/lovable-uploads/')) {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(event.request)
            .then(networkResponse => {
              // Clone the response before using it
              let responseToCache = networkResponse.clone();
              
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
                
              return networkResponse;
            })
            .catch(() => {
              console.error('Failed to fetch asset:', event.request.url);
              // If it's an audio file we might return a silent audio file as fallback
              if (event.request.url.match(/\.(mp3|wav|ogg)$/)) {
                return new Response(null, { status: 404 });
              }
            });
        })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // If found in cache, return the cached response
        if (cachedResponse) {
          return cachedResponse;
        }

        // Otherwise, fetch from network
        return fetch(event.request)
          .then(networkResponse => {
            // Don't cache API calls or external resources
            if (!event.request.url.match(/^(http|https):\/\/(yxdxwfzkqyovznqjffcm\.supabase\.co|fonts\.googleapis\.com)/i) &&
                event.request.method === 'GET') {
              
              // Clone the response before using it
              const responseToCache = networkResponse.clone();
              
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            }
            
            return networkResponse;
          })
          .catch(error => {
            // Network failed, check if it's a page navigation
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_PAGE);
            }
            
            // For images, return a fallback
            if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
              return caches.match('/placeholder.svg');
            }
            
            return new Response('Network error happened', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// Background sync for offline data
self.addEventListener('sync', event => {
  if (event.tag === 'sync-messages') {
    event.waitUntil(syncMessages());
  } else if (event.tag === 'sync-profile-updates') {
    event.waitUntil(syncProfileUpdates());
  } else if (event.tag === 'sync-reports') {
    event.waitUntil(syncReports());
  }
});

// Push notification event
self.addEventListener('push', event => {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({type: 'window'})
      .then(clientList => {
        // If a window is already open, focus it
        for (const client of clientList) {
          if (client.url === event.notification.data.url && 'focus' in client) {
            return client.focus();
          }
        }
        // Otherwise, open a new window
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data.url);
        }
      })
  );
});
