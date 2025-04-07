import { and, count, eq } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { romTable } from '../databases/library/schema.ts'

export async function countRoms({ platform }: { platform?: string } = {}) {
  const { currentUser, db } = getContext().var
  const { library } = db

  const conditions = [eq(romTable.userId, currentUser.id), eq(romTable.status, 1)]
  if (platform) {
    conditions.push(eq(romTable.platform, platform))
  }
  const where = and(...conditions)

  const [result] = await library.select({ count: count() }).from(romTable).orderBy(romTable.fileName).where(where)

  return result.count
}
