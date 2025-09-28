self.addEventListener('install', () => {
  globalThis.skipWaiting()
})

self.addEventListener('activate', (event) => {
  async function deleteCaches() {
    const keys = await caches.keys()
    await Promise.all(keys.map((key) => caches.delete(key)))
  }

  event.waitUntil(Promise.all([deleteCaches(), globalThis.registration.unregister()]))
})
