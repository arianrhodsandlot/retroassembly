import fs from 'node:fs'
import { Readable } from 'node:stream'
import { attemptAsync } from 'es-toolkit'

/**
 * A File whose contents are read from disk on demand, used for uploads too large to hold in memory.
 * `fs.openAsBlob()` is not used because Node reports a wrong `size` for files of 4 GiB or more.
 */
export class DiskFile extends File {
  // Shared with slices, so they keep working after the file is moved
  readonly #source: { path: string }
  readonly #start: number
  readonly #end: number

  override get size() {
    return this.#end - this.#start
  }

  constructor({
    end,
    name,
    path,
    source = { path },
    start = 0,
    type,
  }: {
    end: number
    name: string
    path: string
    source?: { path: string }
    start?: number
    type?: string
  }) {
    super([], name, { type })
    this.#source = source
    this.#start = start
    this.#end = end
  }

  override async arrayBuffer() {
    const handle = await fs.promises.open(this.#source.path)
    try {
      const buffer = new Uint8Array(this.size)
      let offset = 0
      while (offset < buffer.byteLength) {
        const { bytesRead } = await handle.read(buffer, offset, buffer.byteLength - offset, this.#start + offset)
        if (bytesRead === 0) {
          throw new Error(`Unexpected end of file: ${this.#source.path}`)
        }
        offset += bytesRead
      }
      return buffer.buffer
    } finally {
      await handle.close()
    }
  }

  override async bytes() {
    return new Uint8Array(await this.arrayBuffer())
  }

  /** Move the whole file to `destination` if it is on the same filesystem. Returns whether it was moved. */
  async moveTo(destination: string) {
    if (this.#start !== 0) {
      return false
    }
    const [error] = await attemptAsync(() => fs.promises.rename(this.#source.path, destination))
    if (error) {
      if (error instanceof Error && 'code' in error && error.code === 'EXDEV') {
        return false
      }
      throw error
    }
    this.#source.path = destination
    return true
  }

  override slice(start = 0, end = this.size, contentType = '') {
    const relativeStart = this.#clamp(start)
    const relativeEnd = Math.max(this.#clamp(end), relativeStart)
    return new DiskFile({
      end: this.#start + relativeEnd,
      name: this.name,
      path: this.#source.path,
      source: this.#source,
      start: this.#start + relativeStart,
      type: contentType,
    })
  }

  override stream(): ReadableStream<Uint8Array<ArrayBuffer>> {
    if (this.size === 0) {
      return new ReadableStream({ start: (controller) => controller.close() })
    }
    const readable = fs.createReadStream(this.#source.path, { end: this.#end - 1, start: this.#start })
    // @ts-expect-error -- Node's web ReadableStream type differs from the DOM one, but they are the same at runtime
    return Readable.toWeb(readable)
  }

  override async text() {
    return new TextDecoder().decode(await this.arrayBuffer())
  }

  #clamp(index: number) {
    return index < 0 ? Math.max(this.size + index, 0) : Math.min(index, this.size)
  }
}
