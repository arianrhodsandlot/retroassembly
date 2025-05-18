import { and, eq, inArray } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { romTable } from '../databases/library/schema.ts'

export async function getRomPlatformCount() {
  const { currentUser, db, preference } = getContext().var
  const { library } = db

  const results = await library
    .selectDistinct({ platform: romTable.platform })
    .from(romTable)
    .orderBy(romTable.fileName)
    .where(
      and(
        eq(romTable.userId, currentUser.id),
        eq(romTable.status, 1),
        inArray(romTable.platform, preference.ui.platforms),
      ),
    )

  return results.length
}
