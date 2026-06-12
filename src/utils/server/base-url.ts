import { getRunTimeEnv, normalizeBaseUrl } from '#@/constants/env.ts'

/**
 * Base URL (subpath) support — single source of truth.
 *
 * The whole app is written as if it were served from the site root ("/"). To host it under a
 * subpath (e.g. https://example.com/retro), set RETROASSEMBLY_RUN_TIME_BASE_URL=/retro. This is a
 * pure RUN-TIME concern — the image is built base-agnostic (assets emitted at `/assets/...`), and a
 * single env var read at server start applies the prefix. No rebuild is needed to change it.
 *
 * At run time, three things use the base, all reading this one env var:
 *
 *  1. The React Router server build is patched per-process so its `basename`/`publicPath` and the
 *     emitted asset-manifest URLs carry the prefix (utils/server/runtime-base-build.ts). The router
 *     then matches base-prefixed pages natively and the streamed client router inherits the basename.
 *
 *  2. The non-RR Hono pieces (API, robots) are mounted under the base, static assets are looked up
 *     with {@link stripBase}, the bare origin "/" redirects to the base, and any server that emits a
 *     browser-facing URL (auth/login/logout/OAuth redirects) wraps it with {@link withBase}.
 *
 *  3. Raw (non-router) browser navigations use the client-side `withClientBase`, which reads the base
 *     from a `<meta name="ra-base-url">` tag (CSP-safe) on the client and from a startup-set global on
 *     the server.
 *
 * Future maintainers: routes stay root-relative; reach for `withBase` only when producing a URL the
 * browser will navigate to, and `stripBase` when matching an incoming request path against an
 * app-relative route. The base is intentionally Node-only; workerd/Cloudflare deploys at the root.
 */

/** The base path the app is served under (e.g. '/retro'), or '' when served at the root. */
export function getBaseUrl() {
  return normalizeBaseUrl(getRunTimeEnv().RETROASSEMBLY_RUN_TIME_BASE_URL)
}

/** Prefix an app-absolute path (e.g. '/library') with the base URL for a browser-facing URL. */
export function withBase(pathname: string) {
  const baseUrl = getBaseUrl()
  if (!baseUrl) {
    return pathname
  }
  return `${baseUrl}${pathname.startsWith('/') ? '' : '/'}${pathname}`
}

/** Strip the base URL prefix from a request pathname, yielding the app-relative path. */
export function stripBase(pathname: string) {
  const baseUrl = getBaseUrl()
  if (baseUrl && (pathname === baseUrl || pathname.startsWith(`${baseUrl}/`))) {
    return pathname.slice(baseUrl.length) || '/'
  }
  return pathname
}
