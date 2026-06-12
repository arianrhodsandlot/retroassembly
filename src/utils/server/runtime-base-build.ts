import type { ServerBuild } from 'react-router'

/**
 * Apply a runtime base URL (subpath) to a React Router server build.
 *
 * The image is built base-agnostic: every asset URL in the build's manifest is root-relative
 * (`/assets/...`) and `basename`/`publicPath` are `/`. To host the app under a subpath we patch a
 * shallow copy of the build at server startup — no rebuild required:
 *
 *  - `basename` drives route matching on the server and is streamed to the client router.
 *  - `publicPath` is where the client resolves lazily-loaded chunks from.
 *  - every URL in the assets manifest is prefixed so `<Scripts>`/`<Links>` and client chunk loading
 *    point at `${baseUrl}/assets/...`. `serveStatic`'s `rewriteRequestPath: stripBase` then maps those
 *    requests back to the on-disk `dist/client/assets/...` files.
 *
 * Only the documented, stable RR7 `AssetsManifest` fields are touched (`url`, `entry`, `routes`).
 * When `baseUrl` is empty (root hosting) the build is returned unchanged.
 */
export function applyRuntimeBaseUrl(build: ServerBuild, baseUrl: string): ServerBuild {
  if (!baseUrl) {
    return build
  }

  function prefix(url: string) {
    return url.startsWith('/') ? `${baseUrl}${url}` : url
  }
  function prefixList(urls: string[] | undefined) {
    return urls?.map((url) => prefix(url))
  }

  const { assets } = build
  const routes: typeof assets.routes = {}
  for (const [id, route] of Object.entries(assets.routes)) {
    if (!route) {
      continue
    }
    routes[id] = {
      ...route,
      css: prefixList(route.css),
      imports: prefixList(route.imports),
      module: prefix(route.module),
    }
  }

  return {
    ...build,
    assets: {
      ...assets,
      entry: {
        ...assets.entry,
        imports: assets.entry.imports.map(prefix),
        module: prefix(assets.entry.module),
      },
      routes,
      url: prefix(assets.url),
    },
    basename: baseUrl,
    publicPath: `${baseUrl}/`,
  }
}
