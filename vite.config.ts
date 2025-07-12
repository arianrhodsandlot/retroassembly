import path from 'node:path'
import { cloudflare } from '@cloudflare/vite-plugin'
import { defaultOptions } from '@hono/vite-dev-server'
import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { formatISO } from 'date-fns'
import { $ } from 'execa'
import fs from 'fs-extra'
import serverAdapter from 'hono-react-router-adapter/vite'
import { defineConfig, type UserConfig } from 'vite'
import devtoolsJson from 'vite-plugin-devtools-json'
import tsconfigPaths from 'vite-tsconfig-paths'
import { storageDirectory } from './src/constants/env.ts'

const {
  stdout: [revision],
} = await $({ lines: true })`git rev-parse HEAD`
const shortVersion = revision.slice(0, 7)
const define = {
  BUILD_TIME: JSON.stringify(formatISO(new Date())),
  GIT_VERSION: JSON.stringify(shortVersion),
}

await fs.ensureDir(storageDirectory)

export default defineConfig((env) => {
  console.info('Vite config environment:')
  console.table(env)

  const config = {
    define,
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths(), devtoolsJson()],
    resolve: { alias: {} },
    server: { hmr: { overlay: false } },
  } satisfies UserConfig

  if (['w', 'workerd'].includes(env.mode)) {
    config.plugins.push(cloudflare({ viteEnvironment: { name: 'ssr' } }))
    const serverEntry = path.resolve('node_modules', 'react-router-templates', 'cloudflare', 'app', 'entry.server.tsx')
    config.resolve.alias['@entry.server.tsx'] = serverEntry
  } else {
    config.plugins.push(
      serverAdapter({
        entry: path.resolve('src', 'server', 'app.ts'),
        exclude: [
          ...defaultOptions.exclude,
          '/src/**',
          /\?(inline|url|no-inline|raw|import(?:&(inline|url|no-inline|raw))*)$/,
        ],
        getLoadContext({ request }: { request: Request }) {
          return { extra: 'stuff', url: request.url }
        },
      }),
    )
    const serverEntry = path.resolve(
      'node_modules',
      '@react-router',
      'dev',
      'dist',
      'config',
      'defaults',
      'entry.server.node.tsx',
    )
    config.resolve.alias['@entry.server.tsx'] = serverEntry
  }

  return config
})
