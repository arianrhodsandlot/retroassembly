import Clarity from '@microsoft/clarity'
import { isBrowser } from 'es-toolkit'

if (isBrowser()) {
  const projectId = import.meta.env.VITE_APP_CLARITY_PROJECT_ID
  if (projectId) {
    Clarity.init(import.meta.env.VITE_APP_CLARITY_PROJECT_ID)
    if (globalThis.CURRENT_USER?.id) {
      Clarity.identify(globalThis.CURRENT_USER?.id, undefined, undefined, globalThis.CURRENT_USER?.email)
    }
  }

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
