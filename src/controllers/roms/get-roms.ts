import { and, count, eq, inArray } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import type { PlatformName } from '@/constants/platform.ts'
import { romTable } from '@/databases/schema.ts'
import { getRomsMetadata } from '../../utils/server/misc.ts'

type GetRomsReturning = Awaited<ReturnType<typeof getRoms>>
export type Roms = GetRomsReturning['roms']
export type Rom = Roms[number]
export type RomsPagination = GetRomsReturning['pagination']

export async function getRoms({
  id,
  page = 1,
  pageSize = 100,
  platform,
}: { id?: string; page?: number; pageSize?: number; platform?: PlatformName } = {}) {
  const { currentUser, db, preference } = getContext().var

  const { library } = db

  const conditions = [eq(romTable.userId, currentUser.id), eq(romTable.status, 1)]
  if (id) {
    conditions.push(eq(romTable.id, id))
  }
  if (platform) {
    conditions.push(eq(romTable.platform, platform))
  } else {
    conditions.push(inArray(romTable.platform, preference.ui.platforms))
  }
  const where = and(...conditions)

  const offset = (page - 1) * pageSize
  const romResults = await library
    .select()
    .from(romTable)
    .orderBy(romTable.fileName)
    .where(where)
    .offset(offset)
    .limit(pageSize)

  const [{ total }] = await library.select({ total: count() }).from(romTable).where(where)

  const results = await getRomsMetadata(romResults)

  return { pagination: { current: page, pages: Math.ceil(total / pageSize), size: pageSize, total }, roms: results }
}
