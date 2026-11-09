import fs from 'node:fs'
import path from 'node:path'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { attempt, attemptAsync } from 'es-toolkit'
import { getRuntimeKey } from 'hono/adapter'
import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'
import { getDirectories } from '#@/constants/env.ts'
import { DiskFile } from './disk-file.ts'
import { nanoid } from './nanoid.ts'

const multipartRegex = /^multipart\/form-data/iu
const limits = { fields: 16, fieldSize: 64 * 1024, files: 1 }
const staleFileAge = 24 * 60 * 60 * 1000

let staleFilesRemoved: Promise<void> | undefined

// Browsers escape these characters in quoted names, and `Request.formData()` unescapes them
function decodeName(name: string) {
  return name.replaceAll(/%0A/giu, '\n').replaceAll(/%0D/giu, '\r').replaceAll('%22', '"')
}

function getMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}

// Removes files left behind by a process that stopped mid-upload. Only old files are removed, so uploads in
// progress in another process sharing the directory are not affected.
async function removeStaleFiles(directory: string) {
  const now = Date.now()
  const [, names] = await attemptAsync(() => fs.promises.readdir(directory))
  for (const name of names ?? []) {
    const filePath = path.join(directory, name)
    const [, stats] = await attemptAsync(() => fs.promises.stat(filePath))
    if (stats?.isFile() && now - stats.mtimeMs > staleFileAge) {
      await attemptAsync(() => fs.promises.rm(filePath, { force: true }))
    }
  }
}

/**
 * Streams uploaded files to disk on Node, instead of letting `zValidator('form')` buffer the whole body in memory.
 * The files are passed on as `DiskFile`s via `bodyCache`, and removed after the request unless storage moved them.
 */
export function streamFormData() {
  return createMiddleware(async (c, next) => {
    const contentType = c.req.header('Content-Type')
    const { body } = c.req.raw
    if (getRuntimeKey() !== 'node' || !contentType || !multipartRegex.test(contentType) || !body) {
      await next()
      return
    }

    const { default: busboy } = await import('busboy')
    const directory = path.join(getDirectories().storageDirectory, 'tmp', 'uploads')
    await fs.promises.mkdir(directory, { recursive: true })
    staleFilesRemoved ??= removeStaleFiles(directory)

    const [parserError, parser] = attempt(() =>
      busboy({ defParamCharset: 'utf8', headers: { 'content-type': contentType }, limits, preservePath: true }),
    )
    if (!parser) {
      throw new HTTPException(400, { message: `Malformed FormData request. ${getMessage(parserError)}` })
    }

    const fields: [string, string][] = []
    const files: { fileName: string; filePath: string; mimeType: string; name: string; size: number }[] = []
    const writes: Promise<void>[] = []
    let diskError: unknown
    let limitError: string | undefined
    let uploadError: unknown

    function reject(message: string) {
      limitError ??= message
      parser?.destroy(new Error(message))
    }

    async function write(stream: Readable, file: (typeof files)[number]) {
      const writeStream = fs.createWriteStream(file.filePath)
      const [error] = await attemptAsync(() => pipeline(stream, writeStream))
      file.size = writeStream.bytesWritten
      if (error instanceof Error && 'syscall' in error) {
        // Stop parsing, otherwise the parser waits forever for this file stream to be drained
        diskError ??= error
        parser?.destroy(error)
      } else if (error) {
        uploadError ??= error
      }
    }

    parser.on('filesLimit', () => reject('Too many files.'))
    parser.on('fieldsLimit', () => reject('Too many fields.'))
    parser.on('field', (name, value, { valueTruncated }) => {
      if (valueTruncated) {
        reject('Field value too large.')
      } else {
        fields.push([decodeName(name), value])
      }
    })
    parser.on('file', (name, stream, { filename, mimeType }) => {
      // busboy can still emit a file after being destroyed, but never ends it
      if (limitError) {
        stream.resume()
        return
      }
      const file = {
        fileName: decodeName(filename ?? ''),
        filePath: path.join(directory, nanoid()),
        mimeType,
        name: decodeName(name),
        size: 0,
      }
      files.push(file)
      writes.push(write(stream, file))
    })

    try {
      // @ts-expect-error -- the DOM ReadableStream type differs from Node's, but they are the same at runtime
      const [pipelineError] = await attemptAsync(() => pipeline(Readable.fromWeb(body), parser))
      uploadError ??= pipelineError
      await Promise.all(writes)
      if (diskError) {
        throw new HTTPException(500, { cause: diskError, message: 'Failed to store the uploaded file.' })
      }
      if (limitError) {
        throw new HTTPException(413, { message: limitError })
      }
      if (uploadError) {
        throw new HTTPException(400, { message: `Malformed FormData request. ${getMessage(uploadError)}` })
      }

      const formData = new FormData()
      for (const [name, value] of fields) {
        formData.append(name, value)
      }
      for (const { fileName, filePath, mimeType, name, size } of files) {
        formData.append(name, new DiskFile({ end: size, name: fileName, path: filePath, type: mimeType }))
      }
      c.req.bodyCache.formData = formData

      await next()
    } finally {
      await Promise.all(files.map(({ filePath }) => fs.promises.rm(filePath, { force: true })))
    }
  })
}
