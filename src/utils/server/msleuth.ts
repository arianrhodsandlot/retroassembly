import { env } from 'hono/adapter'
import { getContext } from 'hono/context-storage'
import QuickLRU from 'quick-lru'
import { getRunTimeEnv } from '#@/constants/env.ts'

function getApiURL(endpoint: string): URL {
  return new URL(`api/v1/${endpoint}`, getRunTimeEnv().RETROASSEMBLY_RUN_TIME_MSLEUTH_HOST)
}

function getFallbackApiURL(endpoint: string): URL {
  return new URL(`api/v1/${endpoint}`, getRunTimeEnv().RETROASSEMBLY_RUN_TIME_MSLEUTH_FALLBACK_HOST)
}

function createRequest({
  endpoint,
  fallback = false,
  json,
  method = json ? 'POST' : 'GET',
}: {
  endpoint: string
  fallback?: boolean
  json?: unknown
  method?: string
}) {
  const input = fallback ? getFallbackApiURL(endpoint) : getApiURL(endpoint)
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

async function requestFallback(options: { endpoint: string; json?: unknown }) {
  const input = createRequest({ ...options, fallback: true })
  return await fetch(input)
}

async function request(options: { endpoint: string; json?: unknown }) {
  const input = createRequest(options)
  const cfFetch = getCFServiceBinding()
  try {
    const fetchFunction = cfFetch || fetch
    const result = await fetchFunction(input)
    if (result.ok) {
      return result
    }
    return await requestFallback(options)
  } catch {
    return await requestFallback(options)
  }
}

const queryCache = new QuickLRU<string, unknown>({ maxSize: 100 })
async function query(json: unknown) {
  const cacheKey = JSON.stringify(json)
  if (queryCache.has(cacheKey)) {
    return queryCache.get(cacheKey)
  }

  const response = await request({ endpoint: 'metadata/query', json })
  if (response.ok) {
    const result = await response.json()
    queryCache.set(cacheKey, result)
    return result
  }
}

async function identify(json: unknown) {
  const response = await request({ endpoint: 'metadata/identify', json })
  const result = await response.json()
  return result
}

const platformCache = new Map<string, unknown>()
async function getPlatform(name: string) {
  const cacheKey = name
  if (platformCache.has(cacheKey)) {
    return platformCache.get(cacheKey)
  }

  const response = await request({ endpoint: `platform/${encodeURIComponent(name)}` })
  if (response.ok) {
    const result = await response.json()
    platformCache.set(cacheKey, result)
    return result
  }
}

export const msleuth = { getPlatform, identify, query }
