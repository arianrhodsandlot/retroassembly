import { env } from 'hono/adapter'
import { getContext } from 'hono/context-storage'
import ky from 'ky'

function getClient() {
  const c = getContext()
  const { MSLEUTH_HOST } = env(c)
  const client = ky.create({
    prefixUrl: new URL('api/v1', MSLEUTH_HOST as string),
    retry: 3,
  })
  return client
}

export const msleuth = {
  async query(json) {
    const client = getClient()
    return await client.post('metadata/identify', { json }).json()
  },

  async sleuth(json) {
    const client = getClient()
    return await client.post('metadata/query', { json }).json()
  },

  async getPlatform(name) {
    const client = getClient()
    return await client(`platform/${encodeURIComponent(name)}`).json()
  },
}
