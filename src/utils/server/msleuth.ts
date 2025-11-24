import { attemptAsync, compact } from 'es-toolkit'
import { env } from 'hono/adapter'
import { getContext } from 'hono/context-storage'
import { type msleuth as client, createClient, type IdentifyParameter, type QueryParameter } from 'msleuth/client'
import QuickLRU from 'quick-lru'
import { getRunTimeEnv } from '#@/constants/env.ts'

function getCFServiceBinding() {
  const { RETROASSEMBLY_RUN_TIME_MSLEUTH_HOST } = getRunTimeEnv()
  if (RETROASSEMBLY_RUN_TIME_MSLEUTH_HOST) {
    return
  }
  const c = getContext()
  const { MSLEUTH } = env<Env>(c)
  return MSLEUTH.fetch
}

function createClients() {
  const runTimeEnv = getRunTimeEnv()
  const hosts = compact([
    runTimeEnv.RETROASSEMBLY_RUN_TIME_MSLEUTH_HOST,
    ...runTimeEnv.RETROASSEMBLY_RUN_TIME_MSLEUTH_FALLBACK_HOST.split(','),
  ])
  const clients = hosts.map((host) => createClient(host))

  const cfServiceFetch = getCFServiceBinding()
  if (cfServiceFetch) {
    const cfServiceClient = createClient(runTimeEnv.RETROASSEMBLY_RUN_TIME_MSLEUTH_HOST, { fetch: cfServiceFetch })
    clients.unshift(cfServiceClient)
  }

  return clients
}

const queryCache = new QuickLRU<string, Awaited<ReturnType<typeof client.query>>>({ maxSize: 100 })
async function query(json: QueryParameter) {
  const cacheKey = JSON.stringify(json)
  if (queryCache.has(cacheKey)) {
    return queryCache.get(cacheKey)
  }

  for (const client of createClients()) {
    const [, result] = await attemptAsync(() => client.query(json))
    if (result) {
      return result
    }
  }
}

async function identify(json: IdentifyParameter) {
  for (const client of createClients()) {
    const [, result] = await attemptAsync(() => client.identify(json))
    if (result) {
      return result
    }
  }
}

export const msleuth = { identify, query }
