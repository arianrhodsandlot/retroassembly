import { isBrowser } from 'es-toolkit'

if (isBrowser()) {
  const projectId = import.meta.env.VITE_APP_CLARITY_PROJECT_ID
  if (projectId) {
    /* eslint-disable biome-x/lint,max-params,sonarjs/no-nested-assignment,prefer-rest-params,unicorn/prefer-query-selector */
    ;(function (c, l, a, r, i, t, y) {
      c[a] =
        c[a] ||
        function () {
          ;(c[a].q = c[a].q || []).push(arguments)
        }
      t = l.createElement(r)
      t.async = 1
      t.src = `https://www.clarity.ms/tag/${i}`
      y = l.getElementsByTagName(r)[0]
      y.parentNode.insertBefore(t, y)
    })(globalThis, document, 'clarity', 'script', import.meta.env.VITE_APP_CLARITY_PROJECT_ID)
    /* eslint-enable */

    if (globalThis.CURRENT_USER?.id) {
      globalThis.Clarity?.identify(globalThis.CURRENT_USER?.id, undefined, undefined, globalThis.CURRENT_USER?.email)
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
