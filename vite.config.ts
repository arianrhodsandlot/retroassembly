import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { createConfig } from '@arianrhodsandlot/vite-plus-config'
import { defaultOptions } from '@hono/vite-dev-server'
import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defaults, noop } from 'es-toolkit/compat'
import { $, execaNode } from 'execa'
import serverAdapter from 'hono-react-router-adapter/vite'
import { DateTime } from 'luxon'
import devtoolsJson from 'vite-plugin-devtools-json'
import { defineConfig, type Plugin } from 'vite-plus'
import { exec, getTargetRuntime, logServerInfo, prepareWranglerConfig } from './scripts/utils.ts'
import { getDirectories } from './src/constants/env.ts'

defaults(process.env, {
  RETROASSEMBLY_BUILD_TIME_VITE_BUILD_TIME: DateTime.now().setZone('utc').toISO(),
  RETROASSEMBLY_BUILD_TIME_VITE_VERSION: await getVersion(),
  RETROASSEMBLY_RUN_TIME_PORT: '8000',
})

async function getVersion() {
  return getEnvVersion() ?? (await getGitDescription()) ?? ''
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
      server.config.logger.info = noop
      httpServer?.on('listening', () => {
        const address = httpServer?.address()
        if (address && typeof address === 'object') {
          logServerInfo('localhost', address.port, true)
        }
      })
    },
    name: 'log-server-info',
  }
  return plugin
}

const viteConfigForReactRouter = defineConfig(async (env) => {
  const envPort = process.env.RETROASSEMBLY_RUN_TIME_PORT || process.env.PORT
  const port = envPort ? Number.parseInt(envPort, 10) || 8000 : 8000
  const plugins = [tailwindcss({ optimize: false }), reactRouter(), [devtoolsJson()], serverInfo()]
  const config = defineConfig({
    build: { chunkSizeWarningLimit: 1024 },
    clearScreen: false,
    envPrefix: 'RETROASSEMBLY_BUILD_TIME_VITE_',
    plugins,
    server: {
      allowedHosts: true,
      hmr: { overlay: true },
      host: true,
      open: true,
      port,
    },
  })

  if (getTargetRuntime() === 'workerd') {
    if (env.command === 'serve') {
      await $`wrangler d1 migrations apply retroassembly_library`
    }
    await prepareWranglerConfig()
    const { cloudflare } = await import('@cloudflare/vite-plugin')
    plugins.push(cloudflare({ viteEnvironment: { name: 'ssr' } }))
    config.resolve = {
      alias: {
        '@entry.server.tsx': path.resolve(
          'node_modules',
          'react-router-templates',
          'cloudflare',
          'app',
          'entry.server.tsx',
        ),
      },
    }
  } else {
    if (env.command === 'serve') {
      const { storageDirectory } = getDirectories()
      await mkdir(storageDirectory, { recursive: true })
      await execaNode`./src/utils/server/migration/initalization.ts`
    }
    const serverAdapterPlugin = serverAdapter({
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
    })
    const vpPackPlugin: Plugin = {
      apply: 'build',
      async closeBundle() {
        if (this.environment.name === 'ssr') {
          await exec`vp pack`
        }
      },
      name: 'vp-pack-plugin',
    }
    plugins.push([serverAdapterPlugin], vpPackPlugin)
    config.resolve = {
      alias: {
        '@entry.server.tsx': path.resolve(
          'node_modules',
          '@react-router',
          'dev',
          'dist',
          'config',
          'defaults',
          'entry.server.node.tsx',
        ),
      },
    }
  }

  return config
})

const viteConfigForVP = createConfig({
  pack: {
    clean: false,
    deps: { onlyBundle: false },
    entry: { 'server/index': 'scripts/serve.ts' },
    fixedExtension: false,
    minify: true,
  },
  staged: {
    'pnpm-lock.yaml': 'node --run=check-lockfile',
  },
})

const [_bin, script, arg] = process.argv
const viteConfig =
  script.includes('react-router') || ['dev', 'build'].includes(arg) ? viteConfigForReactRouter : viteConfigForVP

export default viteConfig
