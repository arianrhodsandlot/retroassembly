import { exec } from 'node:child_process'
import path from 'node:path'
import { promisify } from 'node:util'
import { cloudflare } from '@cloudflare/vite-plugin'
import { defaultOptions } from '@hono/vite-dev-server'
import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { formatISO } from 'date-fns'
import serverAdapter from 'hono-react-router-adapter/vite'
import { defineConfig, type UserConfig } from 'vite'
import devtoolsJson from 'vite-plugin-devtools-json'
import tsconfigPaths from 'vite-tsconfig-paths'

const { stdout: revision } = await promisify(exec)('git rev-parse HEAD')
const shortVersion = revision.trim().slice(0, 7)
const define = {
  BUILD_TIME: JSON.stringify(formatISO(new Date())),
  GIT_VERSION: JSON.stringify(shortVersion),
}

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
    config.plugins.push(
      cloudflare({
        persistState: { path: 'data/wrangler' },
        viteEnvironment: { name: 'ssr' },
      }),
    )
    config.resolve.alias['@entry.server.tsx'] = path.resolve(
      'node_modules/react-router-templates/cloudflare/app/entry.server.tsx',
    )
  } else {
    config.plugins.push(
      serverAdapter({
        entry: './src/server/server.ts',
        exclude: [
          ...defaultOptions.exclude,
          '/src/**',
          /\?(inline|url|no-inline|raw|import(?:&(inline|url|no-inline|raw))*)$/,
        ],
      }),
    )
    config.resolve.alias['@entry.server.tsx'] = path.resolve(
      'node_modules/@react-router/dev/dist/config/defaults/entry.server.node.tsx',
    )
  }

  return config
})
