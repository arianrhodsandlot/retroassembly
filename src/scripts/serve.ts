import { serve } from '@hono/node-server'
import { exec, getTargetRuntime, logServerInfo } from './utils.ts'

const port = process.env.PORT ? Number.parseInt(process.env.RETROASSEMBLY_PORT || process.env.PORT, 10) || 8000 : 8000

async function serveWorkerd() {
  await exec`wrangler dev --port=${port}`
}

async function serveNode() {
  const { default: app } = await import('../server/node.ts')
  serve({ ...app, port }, async (info) => {
    await logServerInfo(info.port)
  })
}

async function main() {
  await (getTargetRuntime() === 'workerd' ? serveWorkerd() : serveNode())
}

await main()
