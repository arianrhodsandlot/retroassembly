import { getContext } from 'hono/context-storage'

function getFirstForwardedValue(value: string | undefined) {
  return value?.split(',')[0]?.trim()
}

export function resolveRequestUrl({
  forwardedHost,
  forwardedProtocol,
  requestUrl,
}: {
  forwardedHost?: string
  forwardedProtocol?: string
  requestUrl: string
}) {
  const url = new URL(requestUrl)
  const protocol = getFirstForwardedValue(forwardedProtocol)
  const host = getFirstForwardedValue(forwardedHost)

  if (protocol === 'http' || protocol === 'https') {
    url.protocol = `${protocol}:`
  }
  if (host) {
    const forwardedUrl = new URL(`${url.protocol}//${host}`)
    url.hostname = forwardedUrl.hostname
    url.port = forwardedUrl.port
  }

  return url
}

export function getRequestUrl() {
  const c = getContext()
  return resolveRequestUrl({
    forwardedHost: c.req.header('X-Forwarded-Host'),
    forwardedProtocol: c.req.header('X-Forwarded-Proto'),
    requestUrl: c.req.url,
  })
}
