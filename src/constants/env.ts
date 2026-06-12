import assert from 'node:assert'
import path from 'node:path'
import { attempt } from 'es-toolkit'
import { defaults } from 'es-toolkit/compat'
import { env, getRuntimeKey } from 'hono/adapter'
import { getContext } from 'hono/context-storage'
import { metadata } from './metadata.ts'

export function getRunTimeEnv() {
  const [, c] = attempt(getContext)
  const runTimeEnv = c ? env<Env>(c) : process.env
  const runtimeKey = getRuntimeKey()
  assert.ok(runtimeKey === 'node' || runtimeKey === 'workerd', 'Unsupported runtime')

  return defaults(
    { ...runTimeEnv },
    {
      RETROASSEMBLY_RUN_TIME_ALLOW_CRAWLER:
        {
          node: 'false',
          workerd: `${Boolean(c?.req.url && new URL(metadata.link).origin === new URL(c.req.url).origin)}`,
        }[runtimeKey] || 'false',
      RETROASSEMBLY_RUN_TIME_BASE_URL: '',
      RETROASSEMBLY_RUN_TIME_DATA_DIRECTORY: path.resolve('data'),
      RETROASSEMBLY_RUN_TIME_ENABLE_SHARED_ROM_LIBRARY: 'false',
      RETROASSEMBLY_RUN_TIME_MAX_AUTO_STATES_PER_ROM: '20',
      RETROASSEMBLY_RUN_TIME_MAX_ROM_COUNT: { node: '', workerd: '1000' }[runtimeKey] || '',
      RETROASSEMBLY_RUN_TIME_MAX_ROM_COUNT_2026: { node: '', workerd: '200' }[runtimeKey] || '',
      RETROASSEMBLY_RUN_TIME_MAX_UPLOAD_AT_ONCE: { node: '1000', workerd: '100' }[runtimeKey] || '100',
      RETROASSEMBLY_RUN_TIME_MSLEUTH_FALLBACK_HOST: 'https://msleuth.fly.dev/',
      RETROASSEMBLY_RUN_TIME_MSLEUTH_HOST: 'https://msleuth.arianrhodsandlot.workers.dev/',
      RETROASSEMBLY_RUN_TIME_SHARED_LIBRARY_ONLY: 'false',
      RETROASSEMBLY_RUN_TIME_SHARED_ROM_DIRECTORY: path.resolve('roms'),
      RETROASSEMBLY_RUN_TIME_SHARED_ROM_SCAN_INTERVAL: '300',
      RETROASSEMBLY_RUN_TIME_SKIP_HOME:
        { node: `${runTimeEnv.NODE_ENV !== 'development'}`, workerd: 'false' }[runtimeKey] || 'false',
      RETROASSEMBLY_RUN_TIME_SKIP_HOME_IF_LOGGED_IN: { node: 'true', workerd: 'false' }[runtimeKey] || 'false',
      RETROASSEMBLY_RUN_TIME_STORAGE_DIRECTORY: path.resolve('data', 'storage'),
      RETROASSEMBLY_RUN_TIME_STORAGE_HOST: '',
      RETROASSEMBLY_RUN_TIME_SUPABASE_ANON_KEY: '',
      RETROASSEMBLY_RUN_TIME_SUPABASE_URL: '',
      RETROASSEMBLY_RUN_TIME_SUPERVISER_USER_IDS: '',
    },
  )
}

export function getDirectories() {
  const runTimeEnv = getRunTimeEnv()
  const dataDirectory = runTimeEnv.RETROASSEMBLY_RUN_TIME_DATA_DIRECTORY
  const storageDirectory = runTimeEnv.RETROASSEMBLY_RUN_TIME_STORAGE_DIRECTORY
  const sharedRomDirectory = runTimeEnv.RETROASSEMBLY_RUN_TIME_SHARED_ROM_DIRECTORY
  return { dataDirectory, sharedRomDirectory, storageDirectory }
}

export function getDatabasePath() {
  const { dataDirectory } = getDirectories()
  return path.join(dataDirectory, 'retroassembly.sqlite')
}

/**
 * Normalize a configured base URL to a leading-slash, no-trailing-slash path segment, or '' for the
 * site root. Examples: 'retro' -> '/retro', '/retro/' -> '/retro', '' or '/' -> ''.
 * The higher-level base-URL helpers live in utils/server/base-url.ts; this pure function lives here
 * because it is also consumed by vite.config.ts at build time.
 */
export function normalizeBaseUrl(rawBaseUrl: string | undefined) {
  let baseUrl = (rawBaseUrl || '').trim()
  if (!baseUrl || baseUrl === '/') {
    return ''
  }
  if (!baseUrl.startsWith('/')) {
    baseUrl = `/${baseUrl}`
  }
  return baseUrl.replace(/\/+$/u, '')
}
