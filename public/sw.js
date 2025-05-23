self.addEventListener('install', (event) => {
  globalThis.skipWaiting() // Activate the new Service Worker immediately
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Clear all caches
      caches
        .keys()
        .then((cacheNames) => {
          return Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)))
        }),
      // Unregister the Service Worker
      globalThis.registration
        .unregister()
        .then(() => {
          console.info('Service Worker unregistered')
        }),
    ]),
  )
})
