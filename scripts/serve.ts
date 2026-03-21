import { serve } from '@hono/node-server'
import app from '#@/server/node.ts'
import { exec, getTargetRuntime, logServerInfo } from './utils.ts'

const envPort = process.env.RETROASSEMBLY_RUN_TIME_PORT || process.env.PORT
const port = envPort ? Number.parseInt(envPort, 10) || 8000 : 8000

async function serveWorkerd() {
  await exec`wrangler dev --port=${port}`
}

function serveNode() {
  const hostname = '0.0.0.0'
  serve({ ...app, hostname, port }, (info) => {
    logServerInfo(hostname, info.port)
  })
}

async function main() {
  if (getTargetRuntime() === 'workerd') {
    await serveWorkerd()
  } else {
    serveNode()
  }
}

await main()
