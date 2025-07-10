import { template } from 'es-toolkit/compat'
import { $ } from 'execa'
import fs from 'fs-extra'
import { argv, dotenv } from 'zx'

export const exec = $({ env: { FORCE_COLOR: 'true' }, verbose: 'full' })

export function getMode() {
  if (argv.w || argv.workerd) {
    return 'workerd'
  }
  let mode = argv.mode || argv.m || process.env.WORKERS_CI === '1' ? 'workerd' : 'node'
  mode = ['w', 'workerd'].includes(mode) ? 'workerd' : 'node'
  return mode
}

export async function prepareWranglerConfig({ force = false } = {}) {
  const mode = getMode()
  if (mode === 'workerd' || force) {
    const wranglerTemplate = await fs.readFile('wrangler.template.json', 'utf8')
    const compiled = template(wranglerTemplate)
    const env = { ...process.env, ...dotenv.loadSafe('.env') }
    const wranglerConfig = compiled(env)
    await fs.writeFile('wrangler.json', wranglerConfig, 'utf8')
  }
}
