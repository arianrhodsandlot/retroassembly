import { styleText } from 'node:util'
import ciInfo from 'ci-info'
import { template } from 'es-toolkit/compat'
import { $ } from 'execa'
import fs from 'fs-extra'
import isDocker from 'is-docker'
import { links } from '../src/constants/links.ts'
import { metadata } from '../src/constants/metadata.ts'

const { env } = process
export const exec = $({ env: { FORCE_COLOR: 'true' }, verbose: 'short' })

export function getTargetRuntime() {
  const isWorkerd =
    env.RETROASSEMBLY_BUILDTIME_TARGET_RUNTIME === 'workerd' ||
    env.npm_lifecycle_event?.endsWith(':workerd') ||
    ciInfo.CLOUDFLARE_WORKERS
  return isWorkerd ? 'workerd' : 'node'
}

export async function prepareWranglerConfig({ force = false } = {}) {
  if (getTargetRuntime() === 'workerd' || force) {
    const wranglerTemplate = await fs.readFile('wrangler.template.json', 'utf8')
    const compiled = template(`${wranglerTemplate}`)
    const wranglerConfig = compiled(env)
    await fs.writeFile('wrangler.json', wranglerConfig, 'utf8')
  }
}

export function logServerInfo(hostname: string, port: number | string, isDev = false) {
  const banner = styleText(
    'red',
    String.raw`
╔═════════════════════════════════════════════════════════╗
║ ___     _             _                     _    _      ║
║| _ \___| |_ _ _ ___  /_\   ______ ___ _ __ | |__| |_  _ ║
║|   / -_)  _| '_/ _ \/ _ \ (_-<_-</ -_) '  \| '_ \ | || |║
║|_|_\___|\__|_| \___/_/ \_\/__/__/\___|_|_|_|_.__/_|\_, |║
║                                                    |__/ ║
╚═════════════════════════════════════════════════════════╝`,
  )
  const title = `${styleText('bold', metadata.title)}${isDev ? ' dev server' : ''}`
  const url = new URL('', `http://${hostname}`)
  url.port = port.toString()
  const link = styleText(['green', 'underline'], url.href)
  const messages = [title, `is running at ${link}`]
  if (isDocker()) {
    messages.push(styleText('blue', 'inside a Docker container'))
  }
  console.info(banner)
  console.info('Get involved in our community:')
  for (const link of links) {
    console.info('•', link.text, styleText(['blue', 'underline'], link.url))
  }
  console.info('\n', `${messages.join(' ')}`, '\n')
}
