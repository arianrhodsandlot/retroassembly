import { memoize } from 'es-toolkit'
import { env } from 'hono/adapter'
import { getContext } from 'hono/context-storage'

export const createStorage = memoize(function createStorage() {
  const { BUCKET } = env<{ BUCKET: Env['BUCKET'] }>(getContext(), 'workerd')
  if (BUCKET) {
    return BUCKET
  }
  throw new Error('Could not initialize storage')
})
