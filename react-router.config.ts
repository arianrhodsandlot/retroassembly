import type { Config } from '@react-router/dev/config'
import { $ } from 'execa'
import fs from 'fs-extra'
import { getTargetRuntime } from './scripts/utils.ts'

export default {
  appDirectory: 'src/pages',
  buildDirectory: 'dist',
  async buildEnd() {
    if (getTargetRuntime() === 'node') {
      await $({ stderr: 'inherit', stdout: 'inherit' })`vp pack`
      await fs.move('dist/scripts', 'dist/server', { overwrite: true })
    }
  },
} satisfies Config
