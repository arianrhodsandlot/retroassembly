import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import { cloudflare } from '@cloudflare/vite-plugin'
import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { formatISO } from 'date-fns'
import { defineConfig } from 'vite'
import devtoolsJson from 'vite-plugin-devtools-json'
import tsconfigPaths from 'vite-tsconfig-paths'

const { stdout: revision } = await promisify(exec)('git rev-parse HEAD')
const shortVersion = revision.trim().slice(0, 7)
const define = {
  BUILD_TIME: JSON.stringify(formatISO(new Date())),
  GIT_VERSION: JSON.stringify(shortVersion),
}

export default defineConfig({
  build: {
    assetsInlineLimit: 10_240,
  },
  define,
  plugins: [
    cloudflare({
      viteEnvironment: { name: 'ssr' },
    }),
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    devtoolsJson(),
  ],
  server: {
    hmr: {
      overlay: false,
    },
  },
})
