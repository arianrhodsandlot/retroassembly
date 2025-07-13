import { env } from 'hono/adapter'
import { getContext } from 'hono/context-storage'
import ky, { type Options } from 'ky'

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
  const { MSLEUTH } = env(c)
  const option: Options = { retry: 3 }
  if (MSLEUTH?.fetch) {
    option.fetch = MSLEUTH.fetch.bind(MSLEUTH)
  }
  const client = ky.create(option)
  return client
}

export const msleuth = {
  async query(json: unknown) {
    const client = getClient()
    return await client(createRequest({ endpoint: 'metadata/query', json })).json()
  },

  async identify(json: unknown) {
    const client = getClient()
    return await client(createRequest({ endpoint: 'metadata/identify', json })).json()
  },

  async getPlatform(name: string) {
    const client = getClient()
    return await client(createRequest({ endpoint: `platform/${encodeURIComponent(name)}` })).json()
  },
}
