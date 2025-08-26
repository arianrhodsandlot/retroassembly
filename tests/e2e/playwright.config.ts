import { defineConfig } from '@playwright/test'
import { attempt, once } from 'es-toolkit'
import fs from 'fs-extra'
import { temporaryDirectory } from 'tempy'

const port = 5173
const tmp = temporaryDirectory({ prefix: 'retroassembly-test-' })

const cleanup = once(() => {
  attempt(() => fs.removeSync(tmp))
})

process.env.RETROASSEMBLY_BUILD_TIME_VITE_DISABLE_FS_ACCESS_API = 'true'

process.on('SIGINT', (e) => {
  cleanup()
  throw new Error(e)
})

process.on('exit', cleanup)

export default defineConfig({
  fullyParallel: true,
  use: {
    baseURL: `http://localhost:${port}/`,
    channel: 'chrome',
  },
  webServer: {
    command: process.env.PLAYWRIGHT_WEB_SERVER_COMMAND || 'pnpm dev',
    env: {
      RETROASSEMBLY_RUN_TIME_DATA_DIRECTORY: tmp,
      RETROASSEMBLY_RUN_TIME_PORT: `${port}`,
      ...process.env,
    },
    port,
    reuseExistingServer: true,
  },
})
