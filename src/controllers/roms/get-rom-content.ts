import { and, eq } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { romTable } from '@/databases/schema.ts'
import { getFileContent } from '@/utils/server/misc.ts'

export async function getRomContent(id: string) {
  const { currentUser, db } = getContext().var

  const [result] = await db.library
    .select()
    .from(romTable)
    .orderBy(romTable.fileName)
    .where(and(eq(romTable.id, id), eq(romTable.userId, currentUser.id), eq(romTable.status, 1)))

  return getFileContent(result.fileId)
}
