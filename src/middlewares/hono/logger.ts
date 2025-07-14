import { createMiddleware } from 'hono/factory'
import { Signale } from 'signale'
import { getConnInfo } from '../../controllers/utils.server.ts'

// eslint-disable-next-line sonarjs/confidential-information-logging
const signale = new Signale({ logLevel: 'info', stream: process.stdout })

export function logger() {
  return createMiddleware(async function middleware(c, next) {
    const start = Date.now()
    await next()
    const end = Date.now()

    // Extract HTTP information for Apache-style logging
    const { method, url } = c.req
    const { status } = c.res
    const userAgent = c.req.header('User-Agent') || '-'
    const referer = c.req.header('Referer') || '-'
    const remoteAddr =
      c.req.header('X-Forwarded-For') ||
      c.req.header('X-Real-IP') ||
      c.env?.CF_CONNECTING_IP ||
      getConnInfo()?.remote.address ||
      '?'
    const contentLength = c.res.headers.get('Content-Length') || '-'
    const httpVersion = c.req.header('HTTP-Version') || c.env?.HTTP_VERSION || 'HTTP/1.1'
    const responseTime = end - start
    const timestamp = new Date().toISOString()

    // Apache Common Log Format + Custom additions
    // Format: IP - - [timestamp] "METHOD /path HTTP/version" status size "referer" "user-agent" response_time_ms
    const logMessage = `${c.var.requestId} ${remoteAddr} - - [${timestamp}] "${method} ${url} ${httpVersion}" ${status} ${contentLength} "${referer}" "${userAgent}" ${responseTime}ms`

    if (c.res.ok) {
      signale.success(logMessage)
    } else {
      signale.warn(logMessage)
    }
  })
}
