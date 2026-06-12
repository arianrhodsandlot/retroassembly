import { and, eq, inArray, sql } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { romTable, statusEnum } from '#@/databases/schema.ts'
import { romOwnershipCondition } from '#@/utils/server/shared-rom.ts'

export async function getRomPlatformCount() {
  const { currentUser, db, preference } = getContext().var
  const { library } = db

  const [{ count }] = await library
    .select({ count: sql<number>`COUNT(DISTINCT ${romTable.platform})` })
    .from(romTable)
    .where(
      and(
        romOwnershipCondition(currentUser.id),
        eq(romTable.status, statusEnum.normal),
        inArray(romTable.platform, preference.ui.platforms),
      ),
    )

  return count
}
