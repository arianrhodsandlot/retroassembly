import { defineConfig } from '@playwright/test'
import { isCI } from 'ci-info'
import { attempt, once } from 'es-toolkit'
import fs from 'fs-extra'
import { temporaryDirectory } from 'tempy'

const envPort = process.env.RETROASSEMBLY_RUN_TIME_PORT || process.env.PORT
const port = envPort ? Number.parseInt(envPort, 10) || 8000 : 8000
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
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.05 } },
  fullyParallel: true,
  reporter: 'html',
  retries: 5,
  snapshotPathTemplate: '{testDir}/snapshots/{testFilePath}/{testName}/{arg}{ext}',
  timeout: isCI ? 10_000 : 0,
  use: {
    baseURL: `http://localhost:${port}/`,
    channel: 'chrome',
  },
  webServer: {
    command: process.env.PLAYWRIGHT_WEB_SERVER_COMMAND || 'pnpm dev',
    env: {
      RETROASSEMBLY_RUN_TIME_DATA_DIRECTORY: tmp,
      ...process.env,
    },
    port,
    reuseExistingServer: true,
  },
})
