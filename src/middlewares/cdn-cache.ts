import { attemptAsync } from 'es-toolkit'
import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'
import { isCDNCacheEnabled } from '#@/utils/isomorphic/cdn.ts'

/** Serves `/cdn/*` from the server's cache of CDN files when `RETROASSEMBLY_RUN_TIME_CDN_CACHE` is enabled. */
export function cdnCache() {
  return createMiddleware(async (c, next) => {
    if (!isCDNCacheEnabled()) {
      await next()
      return
    }

    const { createCachedFileStream, getCachedFile, resolveCDNCacheTarget } =
      await import('#@/utils/server/cdn-cache.ts')
    const cachePath = new URL(c.req.url).pathname.slice('/cdn/'.length)
    const target = resolveCDNCacheTarget(cachePath)
    if (!target) {
      throw new HTTPException(404, { message: 'Not found' })
    }
    if (target.requiresLogin && !c.var.currentUser) {
      throw new HTTPException(401, { message: 'Unauthorized' })
    }

    const [error, cached] = await attemptAsync(() => getCachedFile(target.url))
    if (error) {
      throw new HTTPException(502, { cause: error, message: 'Failed to fetch the file from the CDN.' })
    }
    if (!cached || cached.status === 404) {
      throw new HTTPException(404, { message: 'Not found' })
    }

    c.header('Cache-Control', 'public, max-age=31536000, immutable')
    c.header('Content-Type', cached.contentType)
    c.header('Content-Length', String(cached.size))
    return c.body(createCachedFileStream(cached.path))
  })
}
