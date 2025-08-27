import { isBrowser } from 'es-toolkit'

if (isBrowser()) {
  try {
    if (import.meta.env.RETROASSEMBLY_BUILD_TIME_VITE_DISABLE_FS_ACCESS_API === 'true') {
      delete globalThis.showOpenFilePicker
    }
  } catch {}

  const projectId = import.meta.env.RETROASSEMBLY_BUILD_TIME_VITE_CLARITY_PROJECT_ID
  if (projectId) {
    /* eslint-disable max-params,sonarjs/no-nested-assignment,prefer-rest-params,unicorn/prefer-query-selector */
    ;(function (c, l, a, r, i, _t, _y) {
      c[a] =
        c[a] ||
        function () {
          ;(c[a].q = c[a].q || []).push(arguments)
        }
      const t = l.createElement(r as 'script')
      t.async = true
      t.src = `https://www.clarity.ms/tag/${i}`
      const y = l.getElementsByTagName(r)[0]
      y.parentNode?.insertBefore(t, y)
    })(globalThis, document, 'clarity', 'script', import.meta.env.RETROASSEMBLY_BUILD_TIME_VITE_CLARITY_PROJECT_ID)
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
