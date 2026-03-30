import { defineConfig } from '@playwright/test'
import { attempt, once } from 'es-toolkit'
import fs from 'fs-extra'
import { temporaryDirectory } from 'tempy'

const envPort = process.env.RETROASSEMBLY_RUN_TIME_PORT || process.env.PORT
const port = envPort ? Number.parseInt(envPort, 10) || 8000 : 8000
const tmp = temporaryDirectory({ prefix: 'retroassembly-test-' })

const cleanup = once(() => {
  attempt(() => fs.removeSync(tmp))
})

process.on('SIGINT', (e) => {
  cleanup()
  throw new Error(e)
})

process.on('exit', cleanup)

export default defineConfig({
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.05 } },
  fullyParallel: true,
  reporter: 'html',
  retries: 3,
  snapshotPathTemplate: '{testDir}/snapshots/{testFilePath}/{testName}/{arg}{ext}',
  use: {
    baseURL: `http://localhost:${port}/`,
    channel: 'chrome',
  },
  webServer: {
    command: 'node --run=build && node --run=start',
    env: {
      RETROASSEMBLY_RUN_TIME_DATA_DIRECTORY: tmp,
      RETROASSEMBLY_RUN_TIME_SKIP_HOME: 'true',
      ...process.env,
    },
    port,
    reuseExistingServer: true,
  },
})
