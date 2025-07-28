import path from 'node:path'
import { attempt } from 'es-toolkit'
import { defaults } from 'es-toolkit/compat'
import { env } from 'hono/adapter'
import { getContext } from 'hono/context-storage'

export function getRunTimeEnv() {
  const [, c] = attempt(getContext)
  const runTimeEnv = c ? env(c) : process.env
  return defaults(
    { ...runTimeEnv },
    {
      RETROASSEMBLY_RUN_TIME_DATA_DIRECTORY: path.resolve('data'),
      RETROASSEMBLY_RUN_TIME_MSLEUTH_HOST: 'https://msleuth.arianrhodsandlot.workers.dev/',
      RETROASSEMBLY_RUN_TIME_STORAGE_HOST: '',
      RETROASSEMBLY_RUN_TIME_SUPABASE_ANON_KEY: '',
      RETROASSEMBLY_RUN_TIME_SUPABASE_URL: '',
    },
  )
}

export function getDirectories() {
  const runTimeEnv = getRunTimeEnv()
  const dataDirectory = runTimeEnv.RETROASSEMBLY_RUN_TIME_DATA_DIRECTORY
  const storageDirectory = path.join(dataDirectory, 'storage')
  return {
    dataDirectory,
    romsDirectory: path.join(storageDirectory, 'roms'),
    statesDirectory: path.join(storageDirectory, 'states'),
    storageDirectory,
  }
}

export function getDatabasePath() {
  const runTimeEnv = getRunTimeEnv()
  const dataDirectory = runTimeEnv.RETROASSEMBLY_RUN_TIME_DATA_DIRECTORY
  return path.join(dataDirectory, 'retroassembly.sqlite')
}
