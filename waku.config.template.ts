import { exec } from 'node:child_process'
import path from 'node:path'
import { promisify } from 'node:util'
import tailwindcss from '@tailwindcss/vite'
import { formatISO } from 'date-fns'
import { cjsInterop } from 'vite-plugin-cjs-interop'
import { defineConfig } from 'waku/config'

const { middleware } = await import('./src/middlewares/waku/middleware.ts')

const { enhance } = await import('./src/middlewares/hono/enhance.ts') // dev-only-line

const { stdout: revision } = await promisify(exec)('git rev-parse HEAD')
const shortVersion = revision.trim().slice(0, 7)
const define = {
  BUILD_TIME: JSON.stringify(formatISO(new Date())),
  GIT_VERSION: JSON.stringify(shortVersion),
}

export default defineConfig({
  middleware,
  unstable_honoEnhancer: enhance, // dev-only-line
  unstable_viteConfigs: {
    common() {
      return {
        define,
        plugins: [tailwindcss(), cjsInterop({ dependencies: ['goodcodes-parser'] })],
        resolve: { alias: { '@': path.join(import.meta.dirname, 'src') } },
      }
    },
  },
})
