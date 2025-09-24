import { env } from 'hono/adapter'
import { getContext } from 'hono/context-storage'
import QuickLRU from 'quick-lru'
import { getRunTimeEnv } from '@/constants/env.ts'

function getApiURL(endpoint: string): URL {
  return new URL(`api/v1/${endpoint}`, getRunTimeEnv().RETROASSEMBLY_RUN_TIME_MSLEUTH_HOST)
}

function createRequest({
  endpoint,
  json,
  method = json ? 'POST' : 'GET',
}: {
  endpoint: string
  json?: unknown
  method?: string
}) {
  const input = getApiURL(endpoint)
  const init: RequestInit = { method }
  if (method === 'POST' && json) {
    init.body = JSON.stringify(json)
    init.headers = { 'Content-Type': 'application/json' }
  }
  return new Request(input, init)
}

function getCFServiceBinding() {
  const { RETROASSEMBLY_RUN_TIME_MSLEUTH_HOST } = getRunTimeEnv()
  if (RETROASSEMBLY_RUN_TIME_MSLEUTH_HOST) {
    return
  }
  const c = getContext()
  const { MSLEUTH } = env<Env>(c)
  return MSLEUTH.fetch
}

function request(...args: Parameters<typeof fetch>) {
  return (getCFServiceBinding() || fetch)(...args)
}

const queryCache = new QuickLRU<string, unknown>({ maxSize: 100 })
async function query(json: unknown) {
  const cacheKey = JSON.stringify(json)
  if (queryCache.has(cacheKey)) {
    return queryCache.get(cacheKey)
  }

  const response = await request(createRequest({ endpoint: 'metadata/query', json }))
  if (response.ok) {
    const result = await response.json()

    queryCache.set(cacheKey, result)
    return result
  }
}

async function identify(json: unknown) {
  const response = await request(createRequest({ endpoint: 'metadata/identify', json }))
  const result = await response.json()
  return result
}

const platformCache = new Map<string, unknown>()
async function getPlatform(name: string) {
  const cacheKey = name
  if (platformCache.has(cacheKey)) {
    return platformCache.get(cacheKey)
  }

  const response = await request(createRequest({ endpoint: `platform/${encodeURIComponent(name)}` }))
  const result = await response.json()

  platformCache.set(cacheKey, result)
  return result
}

export const msleuth = { getPlatform, identify, query }
