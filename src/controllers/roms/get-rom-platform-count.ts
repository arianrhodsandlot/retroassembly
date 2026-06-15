import { and, eq, inArray, sql } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { romTable, statusEnum } from '#@/databases/schema.ts'

export async function getRomPlatformCount() {
  const { db, effectiveLibraryUserId, preference } = getContext().var
  const { library } = db

  const [{ count }] = await library
    .select({ count: sql<number>`COUNT(DISTINCT ${romTable.platform})` })
    .from(romTable)
    .where(
      and(
        eq(romTable.userId, effectiveLibraryUserId),
        eq(romTable.status, statusEnum.normal),
        inArray(romTable.platform, preference.ui.platforms),
      ),
    )

  return count
}
