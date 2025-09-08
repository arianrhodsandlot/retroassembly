import { serve } from '@hono/node-server'
import { exec, getTargetRuntime, logServerInfo } from './utils.ts'

const envPort = process.env.RETROASSEMBLY_RUN_TIME_PORT || process.env.PORT
const port = envPort ? Number.parseInt(envPort, 10) || 8000 : 8000

async function serveWorkerd() {
  await exec`wrangler dev --port=${port}`
}

async function serveNode() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore we can not guarantee that this file exists
  const { default: app } = await import('../dist/server/node.js')
  serve({ ...app, port }, (info) => {
    logServerInfo(info.port)
  })
}

async function main() {
  await (getTargetRuntime() === 'workerd' ? serveWorkerd() : serveNode())
}

await main()
