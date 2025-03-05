import { memoize } from 'es-toolkit'
import { env } from 'hono/adapter'
import { getHonoContext } from 'waku/unstable_hono'

export const createStorage = memoize(function createStorage() {
  const { BUCKET } = env<{ BUCKET: Env['BUCKET'] }>(getHonoContext(), 'workerd')
  if (BUCKET) {
    return BUCKET
  }
  throw new Error('Could not initialize storage')
})
