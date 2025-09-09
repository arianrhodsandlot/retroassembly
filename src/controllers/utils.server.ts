import { getConnInfo as getNodeConnInfo } from '@hono/node-server/conninfo'
import { attemptAsync } from 'es-toolkit'
import type { Context } from 'hono'
import { getRuntimeKey } from 'hono/adapter'
import { getConnInfo as getCloudflareWorkersConnInfo } from 'hono/cloudflare-workers'
import { getContext } from 'hono/context-storage'
import { msleuth } from '../utils/msleuth.ts'

interface RomMetadataQuery {
  launchboxGameId?: null | number
  libretroGameId?: null | string
}

export async function getRomsMetadata<T extends RomMetadataQuery[]>(roms: T) {
  if (roms.length === 0) {
    return []
  }
  const conditions = roms.map(({ launchboxGameId: launchboxId, libretroGameId: libretroId }) => ({
    launchboxId,
    libretroId,
  }))
  const [error, metadataList] = await attemptAsync(() => msleuth.query({ conditions }))
  if (error) {
    console.warn(error)
  }

  return roms.map<{ launchboxGame?: Record<string, any>; libretroGame?: Record<string, any> } & T[number]>(
    (romResult, index) => ({
      ...romResult,
      launchboxGame: metadataList?.[index]?.launchbox,
      libretroGame: metadataList?.[index]?.libretro,
    }),
  )
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
