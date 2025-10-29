import { isBrowser } from 'es-toolkit'

if (isBrowser()) {
  try {
    if (import.meta.env.RETROASSEMBLY_BUILD_TIME_VITE_DISABLE_FS_ACCESS_API === 'true') {
      delete globalThis.showOpenFilePicker
    }
  } catch {}

  if ('serviceWorker' in navigator) {
    // Unregister Service Workers
    // eslint-disable-next-line promise/catch-or-return, promise/prefer-await-to-then
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister()
      }
    })

    // Clear all caches in Cache Storage
    if (globalThis.caches) {
      // eslint-disable-next-line promise/catch-or-return, promise/prefer-await-to-then
      caches.keys().then((cacheNames) => {
        for (const cacheName of cacheNames) {
          caches.delete(cacheName)
        }
      })
    }
  }
}
