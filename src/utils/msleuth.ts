import { env } from 'hono/adapter'
import { getContext } from 'hono/context-storage'
import ky, { type Options } from 'ky'
import QuickLRU from 'quick-lru'

function getApiURL(endpoint: string): URL {
  const c = getContext()
  const { MSLEUTH_HOST = 'https://msleuth.arianrhodsandlot.workers.dev/' } = env(c)
  return new URL(`api/v1/${endpoint}`, MSLEUTH_HOST as string)
}

function createRequest({
  endpoint,
  json,
  method = json ? 'POST' : 'GET',
}: { endpoint: string; json?: unknown; method?: string }) {
  const input = getApiURL(endpoint)
  const init: RequestInit = { method }
  if (method === 'POST' && json) {
    init.body = JSON.stringify(json)
    init.headers = { 'Content-Type': 'application/json' }
  }
  return new Request(input, init)
}

function getClient() {
  const c = getContext()
  const { MSLEUTH, MSLEUTH_HOST } = env(c)
  const option: Options = { retry: 3, timeout: 30_000 }
  if (MSLEUTH?.fetch && !MSLEUTH_HOST) {
    option.fetch = MSLEUTH.fetch.bind(MSLEUTH)
  }
  const client = ky.create(option)
  return client
}

const queryCache = new QuickLRU<string, unknown>({ maxSize: 100 })
async function query(json: unknown) {
  const cacheKey = JSON.stringify(json)
  if (queryCache.has(cacheKey)) {
    return queryCache.get(cacheKey)
  }

  const client = getClient()
  const result = await client(createRequest({ endpoint: 'metadata/query', json })).json()

  queryCache.set(cacheKey, result)
  return result
}

async function identify(json: unknown) {
  const client = getClient()
  return await client(createRequest({ endpoint: 'metadata/identify', json })).json()
}

const platformCache = new Map<string, unknown>()
async function getPlatform(name: string) {
  const cacheKey = name
  if (platformCache.has(cacheKey)) {
    return platformCache.get(cacheKey)
  }

  const client = getClient()
  const result = await client(createRequest({ endpoint: `platform/${encodeURIComponent(name)}` })).json()

  platformCache.set(cacheKey, result)
  return result
}

export const msleuth = { getPlatform, identify, query }
