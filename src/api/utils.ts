import { getConnInfo as getNodeConnInfo } from '@hono/node-server/conninfo'
import { getRuntimeKey } from 'hono/adapter'
import { getConnInfo as getCloudflareWorkersConnInfo } from 'hono/cloudflare-workers'
import { getContext } from 'hono/context-storage'

export function createFileResponse(object: R2ObjectBody) {
  const headers = new Headers()
  // this may fail when using miniflare
  try {
    object.writeHttpMetadata(headers)
  } catch {}
  headers.set('ETag', object.httpEtag)
  if (object.range && 'offset' in object.range && 'end' in object.range) {
    const contentRange = `bytes ${object.range.offset}-${object.range.end ?? object.size - 1}/${object.size}`
    headers.set('Content-Range', contentRange)
  }
  let status = 304
  if (object.body) {
    status = headers.get('Range') ? 206 : 200
  }
  return new Response(object.body, { headers, status })
}

export function getConnInfo() {
  const c = getContext()
  const runtimeKey = getRuntimeKey()
  try {
    if (runtimeKey === 'node') {
      return getNodeConnInfo(c)
    }
    if (runtimeKey === 'workerd') {
      return getCloudflareWorkersConnInfo(c)
    }
  } catch {}
}
