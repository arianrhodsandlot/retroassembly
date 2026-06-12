import { and, eq } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { romTable } from '#@/databases/schema.ts'
import { getFileContent } from '#@/utils/server/misc.ts'
import { romOwnershipCondition } from '#@/utils/server/shared-rom.ts'

export async function getRomContent(id: string) {
  const { currentUser, db } = getContext().var

  const [result] = await db.library
    .select()
    .from(romTable)
    .orderBy(romTable.fileName)
    .where(and(eq(romTable.id, id), romOwnershipCondition(currentUser.id), eq(romTable.status, 1)))

  if (!result) {
    return
  }

  return getFileContent(result.fileId)
}
