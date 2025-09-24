import { createMiddleware } from 'hono/factory'
import { DateTime } from 'luxon'
import { getConnInfo } from '@/controllers/utils.server.ts'

export function logger() {
  return createMiddleware(async function middleware(c, next) {
    await next()

    const remoteAddr =
      c.req.header('X-Forwarded-For') ||
      c.req.header('X-Real-IP') ||
      c.env?.CF_CONNECTING_IP ||
      getConnInfo()?.remote.address ||
      '-'
    const timestamp = DateTime.now().setZone('utc').toISO()
    const { method, url } = c.req
    const httpVersion = c.req.header('HTTP-Version') || c.env?.HTTP_VERSION || 'HTTP/1.1'
    const { status } = c.res
    const contentLength = c.res.headers.get('Content-Length') || '-'
    const referer = c.req.header('Referer') || '-'
    const userAgent = c.req.header('User-Agent') || '-'

    // We use Combined Log Format here. See https://httpd.apache.org/docs/2.4/logs.html#combined
    const logMessage = [
      remoteAddr,
      '-',
      c.var.currentUser?.id || '-',
      `[${timestamp}]`,
      JSON.stringify([method, url, httpVersion].join(' ')),
      status,
      contentLength,
      JSON.stringify(referer),
      JSON.stringify(userAgent),
    ].join(' ')

    if (c.res.ok) {
      console.info(logMessage)
    } else {
      console.warn(logMessage)
    }
  })
}
