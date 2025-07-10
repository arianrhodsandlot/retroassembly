import { serve } from '@hono/node-server'
import app from '../server/node.ts'
import { exec, getMode } from './utils.ts'

const port = process.env.PORT ? Number.parseInt(process.env.PORT, 10) || 8000 : 8000
const mode = getMode()
if (mode === 'workerd') {
  exec`wrangler dev --port=${port}`
} else {
  serve({ ...app, port }, (info) => {
    console.info(`RetroAssembly server is running at http://localhost:${info.port}`)
  })
}
