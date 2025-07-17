import path from 'node:path'
import { defaultOptions } from '@hono/vite-dev-server'
import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { formatISO } from 'date-fns'
import { noop } from 'es-toolkit/compat'
import { $ } from 'execa'
import fs from 'fs-extra'
import serverAdapter from 'hono-react-router-adapter/vite'
import { defineConfig, type Plugin, type UserConfig } from 'vite'
import devtoolsJson from 'vite-plugin-devtools-json'
import tsconfigPaths from 'vite-tsconfig-paths'
import { getTargetRuntime, logServerInfo, prepareWranglerConfig } from './scripts/utils.ts'
import { storageDirectory } from './src/constants/env.ts'

const define = {
  BUILD_TIME: JSON.stringify(formatISO(new Date())),
  GIT_VERSION: JSON.stringify(await getGitVersion()),
}

async function getGitVersion() {
  try {
    const {
      stdout: [revision],
    } = await $({ lines: true })`git rev-parse HEAD`
    const shortVersion = revision.slice(0, 7)
    return shortVersion
  } catch {
    return ''
  }
}

function serverInfo() {
  const plugin: Plugin = {
    configureServer(server) {
      const { httpServer } = server
      server.printUrls = noop
      server.bindCLIShortcuts = noop
      httpServer?.on('listening', () => {
        const address = httpServer?.address()
        if (address && typeof address === 'object') {
          logServerInfo(address.port, true)
        }
      })
    },
    name: 'log-server-info',
  }
  return plugin
}

export default defineConfig(async (env) => {
  const config = {
    define,
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths(), devtoolsJson(), serverInfo()],
    resolve: { alias: {} },
    server: {
      hmr: { overlay: false },
      host: true,
      open: true,
    },
  } satisfies UserConfig

  if (getTargetRuntime() === 'workerd') {
    if (env.command === 'serve') {
      await $`wrangler d1 migrations apply retroassembly_library`
    }
    await prepareWranglerConfig()
    const { cloudflare } = await import('@cloudflare/vite-plugin')
    config.plugins.push(cloudflare({ viteEnvironment: { name: 'ssr' } }))
    const serverEntry = path.resolve('node_modules', 'react-router-templates', 'cloudflare', 'app', 'entry.server.tsx')
    config.resolve.alias['@entry.server.tsx'] = serverEntry
  } else {
    if (env.command === 'serve') {
      await fs.ensureDir(storageDirectory)
      await import('./src/utils/migrate.ts')
    }
    config.plugins.push(
      serverAdapter({
        entry: path.resolve('src', 'server', 'app.ts'),
        exclude: [
          ...defaultOptions.exclude,
          '/.well-known/appspecific/com.chrome.devtools.json',
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
