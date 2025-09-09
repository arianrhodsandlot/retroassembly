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
        { node: 'false', workerd: new URL(metadata.link).origin === c?.req.header('origin') }[runtimeKey] || 'false',
      RETROASSEMBLY_RUN_TIME_DATA_DIRECTORY: path.resolve('data'),
      RETROASSEMBLY_RUN_TIME_MAX_UPLOAD_AT_ONCE: { node: '1000', workerd: '100' }[runtimeKey] || '100',
      RETROASSEMBLY_RUN_TIME_MSLEUTH_HOST: 'https://msleuth.arianrhodsandlot.workers.dev/',
      RETROASSEMBLY_RUN_TIME_SKIP_HOME_IF_LOGGED_IN: { node: 'true', workerd: 'false' }[runtimeKey] || 'false',
      RETROASSEMBLY_RUN_TIME_STORAGE_DIRECTORY: path.resolve('data', 'storage'),
      RETROASSEMBLY_RUN_TIME_STORAGE_HOST: '',
      RETROASSEMBLY_RUN_TIME_SUPABASE_ANON_KEY: '',
      RETROASSEMBLY_RUN_TIME_SUPABASE_URL: '',
    },
  )
}

export function getDirectories() {
  const runTimeEnv = getRunTimeEnv()
  const dataDirectory = runTimeEnv.RETROASSEMBLY_RUN_TIME_DATA_DIRECTORY
  const storageDirectory = runTimeEnv.RETROASSEMBLY_RUN_TIME_STORAGE_DIRECTORY
  return { dataDirectory, storageDirectory }
}

export function getDatabasePath() {
  const { dataDirectory } = getDirectories()
  return path.join(dataDirectory, 'retroassembly.sqlite')
}
