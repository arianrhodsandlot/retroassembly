import assert from 'node:assert'
import { and, eq, inArray, sql } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { romTable } from '../databases/schema.ts'

export async function getRomPlatformCount() {
  const { currentUser, db, preference } = getContext().var
  assert.ok(currentUser)
  const { library } = db

  const [{ count }] = await library
    .select({ count: sql`COUNT(DISTINCT ${romTable.platform})` })
    .from(romTable)
    .where(
      and(
        eq(romTable.userId, currentUser.id),
        eq(romTable.status, 1),
        inArray(romTable.platform, preference.ui.platforms),
      ),
    )

  return count
}
