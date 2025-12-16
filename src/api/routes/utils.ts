export function createFileResponse(
  object: { body: Buffer<ArrayBuffer>; httpEtag: string; size: number } | R2ObjectBody,
) {
  const headers = new Headers()
  // this may fail when using miniflare
  if ('writeHttpMetadata' in object) {
    try {
      object.writeHttpMetadata(headers)
    } catch {}
  }
  headers.set('ETag', object.httpEtag)
  if ('range' in object && object.range && 'offset' in object.range && 'end' in object.range) {
    const contentRange = `bytes ${object.range.offset}-${object.range.end ?? object.size - 1}/${object.size}`
    headers.set('Content-Range', contentRange)
  }
  let status = 304
  if (object.body) {
    status = headers.get('Range') ? 206 : 200
  }
  return new Response(object.body, { headers, status })
}
