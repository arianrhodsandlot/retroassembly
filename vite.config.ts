import path from 'node:path'
import { defaultOptions } from '@hono/vite-dev-server'
import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defaults, noop } from 'es-toolkit/compat'
import { $ } from 'execa'
import fs from 'fs-extra'
import serverAdapter from 'hono-react-router-adapter/vite'
import { DateTime } from 'luxon'
import { defineConfig, type Plugin, type UserConfig } from 'vite'
import devtoolsJson from 'vite-plugin-devtools-json'
import tsconfigPaths from 'vite-tsconfig-paths'
import { getTargetRuntime, logServerInfo, prepareWranglerConfig } from './scripts/utils.ts'
import { getDirectories } from './src/constants/env.ts'

defaults(process.env, {
  RETROASSEMBLY_BUILD_TIME_VITE_BUILD_TIME: DateTime.now().setZone('utc').toISO(),
  RETROASSEMBLY_BUILD_TIME_VITE_VERSION: await getVersion(),
  RETROASSEMBLY_RUN_TIME_PORT: '8000',
})

async function getVersion() {
  return getEnvVersion() || (await getGitDescription()) || ''
}

function getEnvVersion() {
  const envNames = ['WORKERS_CI_COMMIT_SHA']
  for (const envName of envNames) {
    if (process.env[envName]) {
      return process.env[envName].slice(0, 7)
    }
  }
}

async function getGitDescription() {
  try {
    const {
      stdout: [revision],
    } = await $({ lines: true })`git describe --tags`
    return revision
  } catch {}
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
  const envPort = process.env.RETROASSEMBLY_RUN_TIME_PORT || process.env.PORT
  const port = envPort ? Number.parseInt(envPort, 10) || 8000 : 8000
  const config: UserConfig = {
    envPrefix: 'RETROASSEMBLY_BUILD_TIME_VITE_',
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths(), devtoolsJson(), serverInfo()],
    server: {
      allowedHosts: true,
      hmr: { overlay: false },
      host: true,
      open: true,
      port,
    },
  }

  if (getTargetRuntime() === 'workerd') {
    if (env.command === 'serve') {
      await $`wrangler d1 migrations apply retroassembly_library`
    }
    await prepareWranglerConfig()
    const { cloudflare } = await import('@cloudflare/vite-plugin')
    config.plugins?.push(cloudflare({ viteEnvironment: { name: 'ssr' } }))
    const serverEntry = path.resolve('node_modules', 'react-router-templates', 'cloudflare', 'app', 'entry.server.tsx')
    config.resolve = { alias: { '@entry.server.tsx': serverEntry } }
  } else {
    if (env.command === 'serve') {
      const { storageDirectory } = getDirectories()
      await fs.ensureDir(storageDirectory)
      await import('./src/utils/server/self-test.ts')
    }
    config.plugins?.push(
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
    config.resolve = { alias: { '@entry.server.tsx': serverEntry } }
  }

  return config
})
