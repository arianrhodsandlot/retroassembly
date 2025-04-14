import type { Config } from '@react-router/dev/config'

export default {
  appDirectory: 'src/pages',
  buildDirectory: 'dist',
  future: {
    unstable_optimizeDeps: true,
    unstable_viteEnvironmentApi: true,
  },
} satisfies Config
