import type { Config } from '@react-router/dev/config'
import { build } from 'tsdown'
import { getTargetRuntime } from './scripts/utils.ts'

export default {
  appDirectory: 'src/pages',
  buildDirectory: 'dist',
  async buildEnd() {
    if (getTargetRuntime() === 'node') {
      const entries = [
        { entry: 'src/server/node.ts', outDir: 'dist/server' },
        { entry: 'scripts/serve.ts', outDir: 'dist/scripts' },
      ]
      for (const { entry, outDir } of entries) {
        await build({ clean: false, entry, logLevel: 'warn', outDir, unbundle: true })
      }
    }
  },
  future: {
    unstable_optimizeDeps: true,
    unstable_viteEnvironmentApi: true,
  },
} satisfies Config
