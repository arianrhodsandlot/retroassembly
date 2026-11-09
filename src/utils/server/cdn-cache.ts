import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { attemptAsync } from 'es-toolkit'
import { getDirectories } from '#@/constants/env.ts'
import { cdnCacheHosts, repositoryVersions } from '#@/utils/isomorphic/cdn.ts'
import { fonts } from '#@/utils/isomorphic/fonts.ts'
import { nanoid } from './nanoid.ts'

const fetchTimeout = 120_000
const notFoundTtl = 24 * 60 * 60 * 1000

// Pinned repositories, plus the ones whose URLs are built elsewhere (emulator cores and shaders)
const pinnedRepositories: Record<string, string> = {
  ...repositoryVersions,
  'arianrhodsandlot/retroarch-emscripten-build': 'v1.22.2-1',
  'libretro/glsl-shaders': '468f67b6f6788e2719d1dd28dfb2c9b7c3db3cc7',
}
const pinnedPackages: Record<string, string> = { 'retroassembly-custom-cores': '1.22.2-20260719172358' }
const fontPaths = new Set(fonts.map(({ path }) => `/${path}`))

export interface CDNCacheTarget {
  /** Box art and screenshots are open-ended, so only logged-in users may add them to the cache */
  requiresLogin: boolean
  url: string
}

/**
 * Maps a path under `/cdn/` back to its upstream URL, or returns `undefined` if it is not something RetroAssembly
 * loads. This keeps the route from being used as an open proxy.
 */
export function resolveCDNCacheTarget(cachePath: string): CDNCacheTarget | undefined {
  const [name, ...rest] = cachePath.replace(/^\/+/u, '').split('/')
  const host = cdnCacheHosts[name as keyof typeof cdnCacheHosts]
  if (!host || rest.length === 0) {
    return
  }
  const url = new URL(rest.join('/'), host)
  if (url.origin !== new URL(host).origin) {
    return
  }

  if (name === 'libretro-thumbnails') {
    return { requiresLogin: true, url: url.href }
  }

  if (fontPaths.has(url.pathname)) {
    return { requiresLogin: false, url: url.href }
  }

  const [type, scope, ...segments] = url.pathname.slice(1).split('/')
  if (type === 'gh') {
    const [repository, version] = decodeURIComponent(segments[0] || '').split('@')
    const fullName = `${decodeURIComponent(scope || '')}/${repository}`
    if (decodeURIComponent(scope || '') === 'libretro-thumbnails') {
      return { requiresLogin: true, url: url.href }
    }
    if (pinnedRepositories[fullName] && pinnedRepositories[fullName] === version) {
      return { requiresLogin: false, url: url.href }
    }
  }
  if (type === 'npm') {
    const [packageName, version] = decodeURIComponent(scope || '').split('@')
    if (pinnedPackages[packageName] && pinnedPackages[packageName] === version) {
      return { requiresLogin: false, url: url.href }
    }
  }
}

interface CacheEntry {
  contentType: string
  status: number
  time: number
}

function getCacheDirectory() {
  return path.join(getDirectories().dataDirectory, 'cache', 'cdn')
}

function getCachePaths(url: string) {
  const key = createHash('sha256').update(url).digest('hex')
  const directory = getCacheDirectory()
  return { file: path.join(directory, key), meta: path.join(directory, `${key}.json`) }
}

async function readCacheEntry(url: string) {
  const paths = getCachePaths(url)
  const [, text] = await attemptAsync(() => fs.promises.readFile(paths.meta, 'utf8'))
  if (!text) {
    return
  }
  const entry: CacheEntry = JSON.parse(text)
  if (entry.status === 404) {
    return Date.now() - entry.time < notFoundTtl ? { ...entry, path: paths.file, size: 0 } : undefined
  }
  const [, stats] = await attemptAsync(() => fs.promises.stat(paths.file))
  return stats?.isFile() ? { ...entry, path: paths.file, size: stats.size } : undefined
}

async function download(url: string) {
  const paths = getCachePaths(url)
  await fs.promises.mkdir(path.dirname(paths.file), { recursive: true })
  const response = await fetch(url, { signal: AbortSignal.timeout(fetchTimeout) })
  if (response.status >= 400 && response.status < 500) {
    const entry: CacheEntry = { contentType: '', status: 404, time: Date.now() }
    await fs.promises.writeFile(paths.meta, JSON.stringify(entry))
    return
  }
  if (!response.ok || !response.body) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`)
  }
  const partialFile = `${paths.file}.${nanoid()}.partial`
  try {
    // @ts-expect-error -- the DOM ReadableStream type differs from Node's, but they are the same at runtime
    await pipeline(Readable.fromWeb(response.body), fs.createWriteStream(partialFile))
    await fs.promises.rename(partialFile, paths.file)
  } finally {
    await fs.promises.rm(partialFile, { force: true })
  }
  const contentType = response.headers.get('Content-Type') || 'application/octet-stream'
  const entry: CacheEntry = { contentType, status: 200, time: Date.now() }
  await fs.promises.writeFile(paths.meta, JSON.stringify(entry))
}

const downloads = new Map<string, Promise<void>>()

/** Returns the cached file for `url`, downloading it first if needed. Concurrent requests share one download. */
export async function getCachedFile(url: string) {
  const cached = await readCacheEntry(url)
  if (cached) {
    return cached
  }
  let pending = downloads.get(url)
  if (!pending) {
    pending = download(url)
    downloads.set(url, pending)
  }
  try {
    await pending
  } finally {
    downloads.delete(url)
  }
  return await readCacheEntry(url)
}

export function createCachedFileStream(filePath: string) {
  // @ts-expect-error -- Node's web ReadableStream type differs from the DOM one, but they are the same at runtime
  const stream: ReadableStream = Readable.toWeb(fs.createReadStream(filePath))
  return stream
}
