import ciInfo from 'ci-info'
import { template } from 'es-toolkit/compat'
import { $ } from 'execa'
import fs from 'fs-extra'
import { loadEnv } from 'vite'

const env = loadEnv('', process.cwd(), '')
export const exec = $({ env: { FORCE_COLOR: 'true' }, verbose: 'short' })

export function getTargetRuntime() {
  const isWorkerd =
    env.TARGET_RUNTIME === 'workerd' || env.npm_lifecycle_event?.endsWith(':workerd') || ciInfo.CLOUDFLARE_WORKERS
  return isWorkerd ? 'workerd' : 'node'
}

export async function prepareWranglerConfig({ force = false } = {}) {
  if (getTargetRuntime() === 'workerd' || force) {
    const wranglerTemplate = await fs.readFile('wrangler.template.json', 'utf8')
    const compiled = template(wranglerTemplate)
    const wranglerConfig = compiled(env)
    await fs.writeFile('wrangler.json', wranglerConfig, 'utf8')
  }
}
