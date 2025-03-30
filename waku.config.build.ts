import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import { cjsInterop } from 'vite-plugin-cjs-interop'
import { defineConfig } from 'waku/config'

const { middleware } = await import('./src/middlewares/waku/middleware.ts')

export default defineConfig({
  middleware,
  unstable_viteConfigs: {
    common() {
      return {
        plugins: [tailwindcss(), cjsInterop({ dependencies: ['goodcodes-parser'] })],
        resolve: { alias: { '@': path.join(import.meta.dirname, 'src') } },
      }
    },
  },
})
