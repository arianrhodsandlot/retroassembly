import { styleText } from 'node:util'
import { serve } from '@hono/node-server'
import isDocker from 'is-docker'
import terminalImage from 'terminal-image'
import app from '../server/node.ts'
import { exec, getMode } from './utils.ts'

const port = process.env.PORT ? Number.parseInt(process.env.PORT, 10) || 8000 : 8000
const mode = getMode()
if (mode === 'workerd') {
  exec`wrangler dev --port=${port}`
} else {
  serve({ ...app, port }, async (info) => {
    const logoPath = 'public/assets/logo/logo-64x64.png'
    const banner = await terminalImage.file(logoPath, { height: 36, preserveAspectRatio: true, width: 36 })
    console.info(banner)

    const title = styleText(['white', 'bgRed', 'bold'], 'RetroAssembly')
    const link = styleText(['green', 'underline'], `http://localhost:${info.port}`)
    const messages = [title, `is running at ${link}`]
    if (isDocker()) {
      messages.push(styleText('blue', 'inside a Docker container'))
    }
    console.info(`${messages.join(' ')}.`)
  })
}
