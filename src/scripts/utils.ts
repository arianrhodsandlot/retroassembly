import ciInfo from 'ci-info'
import { template } from 'es-toolkit/compat'
import { $ } from 'execa'
import fs from 'fs-extra'
import mri from 'mri'
import { loadEnv } from 'vite'

const argv = mri(process.argv.slice(2))

export const exec = $({ env: { FORCE_COLOR: 'true' }, verbose: 'short' })

export function getMode() {
  if (argv.w || argv.workerd || ciInfo.CLOUDFLARE_WORKERS) {
    return 'workerd'
  }
  let mode = argv.mode || argv.m
  mode = ['w', 'workerd'].includes(mode) ? 'workerd' : 'node'
  return mode
}

export async function prepareWranglerConfig({ force = false } = {}) {
  const mode = getMode()
  if (mode === 'workerd' || force) {
    const wranglerTemplate = await fs.readFile('wrangler.template.json', 'utf8')
    const compiled = template(wranglerTemplate)
    const env = loadEnv(mode, process.cwd(), '')
    const wranglerConfig = compiled(env)
    await fs.writeFile('wrangler.json', wranglerConfig, 'utf8')
  }
}
