import { and, count, countDistinct, desc, eq, gte, inArray, max } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { romTable, stateTable, statusEnum } from '#@/databases/schema.ts'
import { getRomsMetadata } from '../../utils/server/misc.ts'

export async function getRomsWithStates({ page = 1, pageSize = 20 } = {}) {
  const { currentUser, db, preference } = getContext().var
  const { library } = db

  const offset = (page - 1) * pageSize

  const results = await library
    .select({
      createdAt: romTable.createdAt,
      fileId: romTable.fileId,
      fileName: romTable.fileName,
      gameName: romTable.gameName,
      id: romTable.id,
      launchboxGameId: romTable.launchboxGameId,
      libretroGameId: romTable.libretroGameId,
      platform: romTable.platform,
    })
    .from(romTable)
    .leftJoin(stateTable, and(eq(stateTable.romId, romTable.id), eq(stateTable.status, statusEnum.normal)))
    .where(
      and(
        eq(romTable.userId, currentUser.id),
        eq(romTable.status, statusEnum.normal),
        inArray(romTable.platform, preference.ui.platforms),
      ),
    )
    .groupBy(
      romTable.id,
      romTable.fileName,
      romTable.gameBoxartFileIds,
      romTable.gameName,
      romTable.launchboxGameId,
      romTable.libretroGameId,
      romTable.platform,
    )
    .having(gte(count(stateTable.id), 1))
    .orderBy(desc(max(stateTable.createdAt)))
    .offset(offset)
    .limit(pageSize)

  const metaQueries = results.map(({ launchboxGameId, libretroGameId }) => ({
    launchboxGameId,
    libretroGameId,
  }))
  const metadata = await getRomsMetadata(metaQueries)
  const roms = results.map((r, i) => Object.assign(r, metadata[i]))

  const where = and(
    eq(romTable.userId, currentUser.id),
    eq(romTable.status, statusEnum.normal),
    inArray(romTable.platform, preference.ui.platforms),
  )
  const res = await library
    .select({ total: countDistinct(romTable.id) })
    .from(romTable)
    .leftJoin(stateTable, and(eq(stateTable.romId, romTable.id), eq(stateTable.status, statusEnum.normal)))
    .where(where)
    .groupBy(romTable.id)
    .having(gte(count(stateTable.id), 1))
  const total = res[0]?.total || 0
  const pagination = { current: page, pages: Math.ceil(total / pageSize), size: pageSize, total }
  return { pagination, roms }
}
