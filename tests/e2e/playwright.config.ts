import { defineConfig } from '@playwright/test'
import { once } from 'es-toolkit'
import fs from 'fs-extra'
import { temporaryDirectory } from 'tempy'

const port = 5173
const tmp = temporaryDirectory({ prefix: 'retroassembly-test-' })

const cleanup = once(() => {
  fs.removeSync(tmp)
})

process.on('SIGINT', (e) => {
  cleanup()
  throw new Error(e)
})
process.on('exit', cleanup)

export default defineConfig({
  use: {
    baseURL: `http://localhost:${port}/`,
    channel: 'chrome',
  },
  webServer: {
    command: 'pnpm dev',
    env: {
      RETROASSEMBLY_RUN_TIME_DATA_DIRECTORY: tmp,
      RETROASSEMBLY_RUN_TIME_MSLEUTH_HOST: 'http://localhost:3000',
      RETROASSEMBLY_RUN_TIME_PORT: `${port}`,
    },
    port,
    reuseExistingServer: true,
  },
})
