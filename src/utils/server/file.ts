import { subtle } from 'node:crypto'

export async function getFilePartialDigest(file: File) {
  const header = await file.slice(0, 1024).arrayBuffer()
  const footer = await file.slice(-1024).arrayBuffer()
  const data = new Uint8Array(header.byteLength + footer.byteLength + 8)
  data.set(new Uint8Array(header), 0)
  data.set(new Uint8Array(footer), header.byteLength)
  new DataView(data.buffer).setBigUint64(header.byteLength + footer.byteLength, BigInt(file.size), true)
  const hash = await subtle.digest('SHA-256', data)
  return [...new Uint8Array(hash)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 16)
}
