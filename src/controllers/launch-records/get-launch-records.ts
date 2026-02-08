import { and, count, countDistinct, desc, eq, inArray, max } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { favoriteTable, launchRecordTable, romTable, statusEnum } from '#@/databases/schema.ts'

export async function getLaunchRecords({ page = 1, pageSize = 100 }: { page?: number; pageSize?: number }) {
  const c = getContext()
  const { currentUser, db, preference } = c.var
  const { library } = db

  const offset = (page - 1) * pageSize

  const where = and(
    eq(launchRecordTable.userId, currentUser.id),
    eq(launchRecordTable.status, 1),
    inArray(launchRecordTable.platform, preference.ui.platforms),
  )

  const romsRaw = await library
    .select({
      core: launchRecordTable.core,
      count: count(launchRecordTable.id),
      id: launchRecordTable.romId,
      isFavorite: favoriteTable.id,
      lastLaunched: max(launchRecordTable.createdAt),
      platform: launchRecordTable.platform,

      fileId: romTable.fileId,
      fileName: romTable.fileName,
      gameBoxartFileIds: romTable.gameBoxartFileIds,
      gameName: romTable.gameName,
      launchboxGameId: romTable.launchboxGameId,
      libretroGameId: romTable.libretroGameId,
      rawGameMetadata: romTable.rawGameMetadata,
    })
    .from(launchRecordTable)
    .where(where)
    .leftJoin(romTable, eq(launchRecordTable.romId, romTable.id))
    .leftJoin(
      favoriteTable,
      and(
        eq(favoriteTable.romId, romTable.id),
        eq(favoriteTable.userId, currentUser.id),
        eq(favoriteTable.status, statusEnum.normal),
      ),
    )
    .groupBy(launchRecordTable.romId, romTable.fileName, romTable.launchboxGameId, romTable.libretroGameId)
    .orderBy(desc(max(launchRecordTable.createdAt)))
    .offset(offset)
    .limit(pageSize)

  const roms = romsRaw.map(({ isFavorite, ...rom }) => Object.assign(rom, { isFavorite: Boolean(isFavorite) }))

  const [{ total }] = await library
    .select({ total: countDistinct(launchRecordTable.romId) })
    .from(launchRecordTable)
    .where(where)
  const pagination = { current: page, pages: Math.ceil(total / pageSize), size: pageSize, total }
  return {
    pagination,
    roms,
  }
}
