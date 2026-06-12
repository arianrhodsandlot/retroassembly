import path from 'node:path'
import type { Config } from '@react-router/dev/config'
import fs from 'fs-extra'
import { build } from 'tsdown'
import { getTargetRuntime } from './scripts/utils.ts'

export default {
  appDirectory: 'src/pages',
  // Built with a root basename; subpath hosting (e.g. /retro) is applied at runtime by patching the
  // server build's basename from RETROASSEMBLY_RUN_TIME_BASE_URL. See utils/server/runtime-base-build.ts.
  basename: '/',
  buildDirectory: 'dist',
  async buildEnd() {
    if (getTargetRuntime() === 'node') {
      const entries = [
        { entry: 'src/server/node.ts', outDir: 'dist/server' },
        { entry: 'scripts/serve.ts', outDir: 'dist/scripts' },
      ]
      for (const { entry, outDir } of entries) {
        await build({
          alias: { '#@': path.resolve('src') },
          clean: false,
          entry,
          fixedExtension: false,
          logLevel: 'warn',
          outDir,
        })
      }
      await fs.move('dist/scripts', 'dist/server', { overwrite: true })
    }
  },
  future: {
    unstable_optimizeDeps: true,
    v8_middleware: true,
    v8_passThroughRequests: true,
    v8_splitRouteModules: true,
    v8_trailingSlashAwareDataRequests: true,
    v8_viteEnvironmentApi: true,
  },
} satisfies Config
