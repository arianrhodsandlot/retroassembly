import { createMiddleware } from 'hono/factory'
import { getConnInfo } from '../../controllers/utils.server.ts'

export function logger() {
  return createMiddleware(async function middleware(c, next) {
    await next()

    const { method, url } = c.req
    const { status } = c.res
    const remoteAddr =
      c.req.header('X-Forwarded-For') ||
      c.req.header('X-Real-IP') ||
      c.env?.CF_CONNECTING_IP ||
      getConnInfo()?.remote.address ||
      '?'
    const contentLength = c.res.headers.get('Content-Length') || '-'
    const httpVersion = c.req.header('HTTP-Version') || c.env?.HTTP_VERSION || 'HTTP/1.1'
    const timestamp = new Date().toISOString()

    const logMessage = `${remoteAddr} - - [${timestamp}] "${method} ${url} ${httpVersion}" ${status} ${contentLength}`

    if (c.res.ok) {
      console.info(logMessage)
    } else {
      console.warn(logMessage)
    }
  })
}
