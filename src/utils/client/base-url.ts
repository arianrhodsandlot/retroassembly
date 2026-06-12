/**
 * Client-side base URL helper for RAW browser navigations (location.replace/assign, manual URL
 * building, non-router asset links) where React Router is not involved and therefore does not apply
 * its basename.
 *
 * React Router links/navigations and loader redirects already get the basename automatically, so
 * only reach for this when bypassing the router. The base is carried to the browser by a
 * `<meta name="ra-base-url">` tag rendered into <head> (CSP-safe — no inline script). On the server
 * it is read from `globalThis.RETROASSEMBLY_BASE_URL`, stamped at startup. The value mirrors
 * RETROASSEMBLY_RUN_TIME_BASE_URL; see utils/server/base-url.ts for the full picture.
 */

/** Resolve the runtime base path (subpath) on either the server or the client. */
export function getClientBase() {
  // Client: read the base from the meta tag rendered into <head>. No inline script, so it is never
  // subject to a script-src Content-Security-Policy.
  if (typeof document !== 'undefined') {
    return document.querySelector('meta[name="ra-base-url"]')?.getAttribute('content') ?? ''
  }
  // Server (SSR): the resolved, normalized base is stamped on the global at startup (server/node.ts).
  return (globalThis as { RETROASSEMBLY_BASE_URL?: string }).RETROASSEMBLY_BASE_URL ?? ''
}

export function withClientBase(pathname: string) {
  const base = getClientBase().replace(/\/$/u, '')
  if (!pathname.startsWith('/')) {
    return pathname
  }
  return `${base}${pathname}`
}
