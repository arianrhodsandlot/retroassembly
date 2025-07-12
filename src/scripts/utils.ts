import { styleText } from 'node:util'
import ciInfo from 'ci-info'
import { template } from 'es-toolkit/compat'
import { $ } from 'execa'
import fs from 'fs-extra'
import isDocker from 'is-docker'
import terminalImage from 'terminal-image'
import { loadEnv } from 'vite'

const env = loadEnv('', process.cwd(), '')
export const exec = $({ env: { FORCE_COLOR: 'true' }, verbose: 'full' })

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

export async function logServerInfo(port: number | string, isDev = false) {
  const logoPath = 'public/assets/logo/logo-64x64.png'
  const banner = await terminalImage.file(logoPath, { height: 36, preserveAspectRatio: true, width: 36 })
  console.info(banner)

  const title = `${styleText(['white', 'bgRed', 'bold'], 'RetroAssembly')}${isDev ? ' dev server' : ''}`
  const url = new URL('', 'http://localhost')
  url.port = port.toString()
  const link = styleText(['green', 'underline'], url.href)
  const messages = [title, `is running at ${link}`]
  if (isDocker()) {
    messages.push(styleText('blue', 'inside a Docker container'))
  }
  console.info(`${messages.join(' ')}.`)
}
