import type { Config } from '@react-router/dev/config'
import { exec, getTargetRuntime } from './src/scripts/utils.ts'

export default {
  appDirectory: 'src/pages',
  buildDirectory: 'dist',
  async buildEnd(...args) {
    if (getTargetRuntime() === 'node') {
      await exec`tsdown src/server/node.ts -d dist/server --no-clean --unbundle`
    }
  },
  future: {
    unstable_optimizeDeps: true,
    unstable_viteEnvironmentApi: true,
  },
} satisfies Config
