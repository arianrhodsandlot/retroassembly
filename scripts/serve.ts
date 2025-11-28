import { watch } from 'node:fs/promises'
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
  const hostname = '0.0.0.0'
  serve({ ...app, hostname, port }, (info) => {
    logServerInfo(hostname, info.port)
  })
}

async function runServeTask() {
  const targetRuntime = getTargetRuntime()
  const serve = {
    node: serveNode,
    workerd: serveWorkerd,
  }[targetRuntime]
  return await serve()
}

async function runWatchTask() {
  const targetRuntime = getTargetRuntime()
  if (targetRuntime === 'node') {
    const dir = 'data'
    const events = watch(dir, { recursive: true })
    for await (const event of events) {
      console.log(event.eventType)
    }
  }
}

async function main() {
  const tasks = [runServeTask(), runWatchTask()]
  await Promise.all(tasks)
}

await main()
