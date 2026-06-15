import { and, eq } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { romTable, statusEnum } from '#@/databases/schema.ts'
import { getFileContent } from '#@/utils/server/misc.ts'

export async function getRomContent(id: string) {
  const { db, effectiveLibraryUserId } = getContext().var

  const [result] = await db.library
    .select()
    .from(romTable)
    .orderBy(romTable.fileName)
    .where(
      and(eq(romTable.id, id), eq(romTable.userId, effectiveLibraryUserId), eq(romTable.status, statusEnum.normal)),
    )

  return getFileContent(result.fileId)
}
