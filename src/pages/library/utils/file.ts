import { BlobReader, BlobWriter, ZipReader } from '@zip.js/zip.js'
import { ArrayBuffer as SpartMd5ArrayBuffer } from 'spark-md5'

function isTinyFile(file: File) {
  if (!file) {
    return false
  }
  return file.size <= 100 * 1024 * 1024
}

function isZip(file: File) {
  return file.type === 'application/zip' || file.name.toLowerCase().endsWith('.zip')
}

async function getExtractedROM(file: Blob) {
  const zipFileReader = new BlobReader(file)
  const zipReader = new ZipReader(zipFileReader)
  const entries = await zipReader.getEntries()
  for (const entry of entries) {
    if (entry && !entry.directory) {
      const file = await entry.getData?.(new BlobWriter('application/octet-stream'))
      if (file) {
        return file
      }
    }
  }
}

async function getFileMd5(file: Blob) {
  const buffer = await file.arrayBuffer()
  return SpartMd5ArrayBuffer.hash(buffer)
}

export async function getROMMd5(file: File, platform: string) {
  if (!isTinyFile(file)) {
    return
  }

  if (platform === 'arcade') {
    return getFileMd5(file)
  }

  if (isZip(file)) {
    const extracted = await getExtractedROM(file)
    if (extracted) {
      return getFileMd5(extracted)
    }
  }

  return getFileMd5(file)
}
