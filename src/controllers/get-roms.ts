import { and, count, eq } from 'drizzle-orm'
import { getContextData } from 'waku/middleware/context'
import { romTable } from '../databases/library/schema.ts'
import { getRomsMetadata } from './utils.ts'

type GetRomsReturning = Awaited<ReturnType<typeof getRoms>>
export type Roms = GetRomsReturning['roms']
export type Rom = Roms[number]
export type RomsPagination = GetRomsReturning['pagination']

export async function getRoms({
  id,
  page = 1,
  pageSize = 50,
  platform,
}: { id?: string; page?: number; pageSize?: number; platform?: string } = {}) {
  const { currentUser, db } = getContextData()
  const { library } = db

  const conditions = [eq(romTable.userId, currentUser.id), eq(romTable.status, 1)]
  if (id) {
    conditions.push(eq(romTable.id, id))
  }
  if (platform) {
    conditions.push(eq(romTable.platform, platform))
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

  const [{ total }] = await library.select({ total: count() }).from(romTable).orderBy(romTable.fileName).where(where)

  const results = await getRomsMetadata(romResults)

  return { pagination: { current: page, pages: Math.ceil(total / pageSize), size: pageSize, total }, roms: results }
}
