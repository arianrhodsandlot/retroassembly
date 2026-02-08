import { and, count, desc, eq, inArray, isNotNull, sql } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import type { PlatformName } from '#@/constants/platform.ts'
import { favoriteTable, romTable, statusEnum } from '#@/databases/schema.ts'

type GetRomsReturning = Awaited<ReturnType<typeof getRoms>>
export type Roms = GetRomsReturning['roms']
export type Rom = Roms[number]
export type RomsPagination = GetRomsReturning['pagination']

interface GetRomsParams {
  direction?: 'asc' | 'desc'
  favorite?: boolean
  id?: string
  orderBy?: 'added' | 'name' | 'released'
  page?: number
  pageSize?: number
  platform?: PlatformName
}

export async function getRoms({
  direction = 'asc',
  favorite = false,
  id,
  orderBy = 'name',
  page = 1,
  pageSize = 100,
  platform,
}: GetRomsParams = {}) {
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
  const columnMap = {
    added: romTable.createdAt,
    name: sql`LOWER(${romTable.fileName})`,
    released: romTable.gameReleaseDate,
  }
  const column = columnMap[orderBy]
  const columns = [sql`${column} IS NULL`, direction === 'desc' ? desc(column) : column]
  if (orderBy !== 'name') {
    columns.push(columnMap.name)
  }
  const favoriteJoinCondition = and(
    eq(favoriteTable.romId, romTable.id),
    eq(favoriteTable.userId, currentUser.id),
    eq(favoriteTable.status, statusEnum.normal),
  )

  const baseQuery = library
    .select({
      isFavorite: sql<boolean>`CASE WHEN ${favoriteTable.id} IS NOT NULL THEN 1 ELSE 0 END`,
      rom: romTable,
    })
    .from(romTable)
    .leftJoin(favoriteTable, favoriteJoinCondition)

  const favoriteWhere = favorite ? and(where, isNotNull(favoriteTable.id)) : where

  const romsRaw = await baseQuery
    .orderBy(...columns)
    .where(favoriteWhere)
    .offset(offset)
    .limit(pageSize)

  const roms = romsRaw.map(({ isFavorite, rom }) => Object.assign(rom, { isFavorite: Boolean(isFavorite) }))

  const [{ total }] = await library
    .select({ total: count() })
    .from(romTable)
    .leftJoin(favoriteTable, favoriteJoinCondition)
    .where(favoriteWhere)

  return { pagination: { current: page, pages: Math.ceil(total / pageSize), size: pageSize, total }, roms }
}
