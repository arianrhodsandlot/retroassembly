import type { Config } from '@react-router/dev/config'
import { exec, getTargetRuntime } from './src/scripts/utils.ts'

export default {
  appDirectory: 'src/pages',
  buildDirectory: 'dist',
  async buildEnd() {
    if (getTargetRuntime() === 'node') {
      await exec`tsdown src/server/node.ts -d dist/server --no-clean --unbundle`
      await exec`tsdown src/scripts/serve.ts -d dist/scripts --no-clean --unbundle`
    }
  },
  future: {
    unstable_optimizeDeps: true,
    unstable_viteEnvironmentApi: true,
  },
} satisfies Config
