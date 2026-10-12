import { attemptAsync, compact } from 'es-toolkit'
import { env } from 'hono/adapter'
import { type ClientRequestOptions, hc, parseResponse } from 'hono/client'
import { getContext } from 'hono/context-storage'
import QuickLRU from 'quick-lru'
import { getRunTimeEnv } from '#@/constants/env.ts'

function getCFServiceBinding() {
  const { RETROASSEMBLY_RUN_TIME_MSLEUTH_HOST } = getRunTimeEnv()
  if (RETROASSEMBLY_RUN_TIME_MSLEUTH_HOST) {
    return
  }
  const c = getContext()
  const { MSLEUTH } = env<Env>(c)
  return MSLEUTH.fetch.bind(MSLEUTH)
}

type IdentifyParameter = any
type QueryParameter = any

function createClient(host = 'https://msleuth.arianrhodsandlot.workers.dev', options?: ClientRequestOptions) {
  const client = hc(new URL('api/v1', host).href, options)

  return {
    async identify(json: IdentifyParameter) {
      // @ts-expect-error suppress hono client type error
      return await parseResponse(client.metadata.identify.$post({ json }))
    },

    async query(json: QueryParameter) {
      // @ts-expect-error suppress hono client type error
      return await parseResponse(client.metadata.query.$post({ json }))
    },
  }
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

const queryCache = new QuickLRU<string, any>({ maxSize: 100 })
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
