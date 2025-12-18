import crypto from 'node:crypto'
import { promisify } from 'node:util'

const DEFAULT_OPTIONS = {
  memory: 65_536, // 64 MiB (argon2 library default)
  parallelism: 4, // argon2 library default
  passes: 3, // argon2 library default
  tagLength: 32, // 32 bytes output
}

function toBase64(bytes: Uint8Array) {
  return btoa(String.fromCodePoint(...bytes))
}

function fromBase64(base64: string) {
  return Uint8Array.from(atob(base64), (c) => c.codePointAt(0) ?? 0)
}

function encodeHash(salt: Uint8Array, hash: Uint8Array, options: typeof DEFAULT_OPTIONS) {
  const { memory, parallelism, passes } = options
  const saltB64 = toBase64(salt).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
  const hashB64 = toBase64(hash).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
  return `$argon2id$v=19$m=${memory},t=${passes},p=${parallelism}$${saltB64}$${hashB64}`
}

function decodeHash(encoded: string) {
  const parts = encoded.split('$')
  if (parts.length !== 6 || parts[1] !== 'argon2id' || parts[2] !== 'v=19') {
    throw new Error('Invalid argon2id hash format')
  }

  const params = parts[3].split(',')
  const memory = Number.parseInt(params[0].split('=')[1], 10)
  const passes = Number.parseInt(params[1].split('=')[1], 10)
  const parallelism = Number.parseInt(params[2].split('=')[1], 10)

  const salt = fromBase64(parts[4].replaceAll('-', '+').replaceAll('_', '/'))
  const hash = fromBase64(parts[5].replaceAll('-', '+').replaceAll('_', '/'))

  return { hash, memory, parallelism, passes, salt }
}

export async function hash(password: string) {
  const salt = new Uint8Array(crypto.randomBytes(16))
  const message = new TextEncoder().encode(password)

  const hash = new Uint8Array(await promisify(crypto.argon2)('argon2id', { ...DEFAULT_OPTIONS, message, nonce: salt }))

  return encodeHash(salt, hash, DEFAULT_OPTIONS)
}

export async function verify(hashedPassword: string, password: string) {
  const { hash: expectedHash, memory, parallelism, passes, salt } = decodeHash(hashedPassword)
  const message = new TextEncoder().encode(password)

  const actualHash = new Uint8Array(
    await promisify(crypto.argon2)('argon2id', {
      memory,
      message,
      nonce: salt,
      parallelism,
      passes,
      tagLength: expectedHash.length,
    }),
  )

  return actualHash.length === expectedHash.length && actualHash.every((byte, i) => byte === expectedHash[i])
}
