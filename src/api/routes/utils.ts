const mimeTypes: Record<string, string> = {
  '.avi': 'video/x-msvideo',
  '.gif': 'image/gif',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.mkv': 'video/x-matroska',
  '.mov': 'video/quicktime',
  '.mp4': 'video/mp4',
  '.ogv': 'video/ogg',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webm': 'video/webm',
  '.webp': 'image/webp',
}

function getContentType(fileId: string) {
  const dotIndex = fileId.lastIndexOf('.')
  if (dotIndex !== -1) {
    return mimeTypes[fileId.slice(dotIndex).toLowerCase()]
  }
}

export function createFileResponse(
  object: { body: Buffer<ArrayBuffer>; httpEtag: string; size: number } | R2ObjectBody,
  fileId?: string,
) {
  const headers = new Headers()
  // this may fail when using miniflare
  if ('writeHttpMetadata' in object) {
    try {
      object.writeHttpMetadata(headers)
    } catch {}
  }
  if (!headers.get('Content-Type') && fileId) {
    const contentType = getContentType(fileId)
    if (contentType) {
      headers.set('Content-Type', contentType)
    }
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
