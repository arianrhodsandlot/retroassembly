import { getConnInfo as getNodeConnInfo } from '@hono/node-server/conninfo'
import type { Context } from 'hono'
import { getRuntimeKey } from 'hono/adapter'
import { getConnInfo as getCloudflareWorkersConnInfo } from 'hono/cloudflare-workers'
import { getContext } from 'hono/context-storage'
import { z } from 'zod'

export function getConnInfo(context?: Context) {
  const c = context || getContext()
  const runtimeKey = getRuntimeKey()
  try {
    if (runtimeKey === 'node') {
      return getNodeConnInfo(c)
    }
    if (runtimeKey === 'workerd') {
      return getCloudflareWorkersConnInfo(c)
    }
  } catch {}
}

export async function getFileContent(id: string) {
  const { storage } = getContext().var

  const object = await storage.get(id)
  return object
}

export function getRomsQuery() {
  const c = getContext()
  const { searchParams } = new URL(c.req.url)
  const orderBy = searchParams.get('sort')
  const direction = searchParams.get('direction')

  const favorite = searchParams.get('favorite')

  return {
    /* eslint-disable promise/prefer-await-to-then */
    direction: z.enum(['asc', 'desc']).catch('asc').parse(direction),
    favorite: favorite === '1',
    orderBy: z.enum(['added', 'name', 'released']).catch('name').parse(orderBy),
    page: z.coerce.number().min(1).catch(1).parse(searchParams.get('page')),
    /* eslint-enable promise/prefer-await-to-then */
  }
}
