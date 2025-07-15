import { getConnInfo as getNodeConnInfo } from '@hono/node-server/conninfo'
import type { InferSelectModel } from 'drizzle-orm'
import type { Context } from 'hono'
import { getRuntimeKey } from 'hono/adapter'
import { getConnInfo as getCloudflareWorkersConnInfo } from 'hono/cloudflare-workers'
import { getContext } from 'hono/context-storage'
import type { romTable } from '../databases/schema'
import { msleuth } from '../utils/msleuth.ts'

export async function getRomsMetadata<T extends InferSelectModel<typeof romTable>[]>(romResults: T) {
  if (romResults.length === 0) {
    return []
  }
  const conditions = romResults.map(({ launchboxGameId: launchboxId, libretroGameId: libretroId }) => ({
    launchboxId,
    libretroId,
  }))
  let metadataList
  try {
    metadataList = await msleuth.query({ conditions })
  } catch (error) {
    console.warn(error)
  }

  return romResults.map((romResult, index) => ({
    ...romResult,
    launchboxGame: metadataList?.[index]?.launchbox,
    libretroGame: metadataList?.[index]?.libretro,
  }))
}

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
