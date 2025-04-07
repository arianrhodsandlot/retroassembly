import { and, eq } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { romTable } from '@/databases/library/schema.ts'
import { getRoms } from './get-roms.ts'

export async function getRom({ fileName, id, platform }: { fileName: string; id: string; platform: string }) {
  let romId = id

  if (!romId) {
    const { currentUser, db } = getContext().var
    const [result] = await db.library
      .select()
      .from(romTable)
      .orderBy(romTable.fileName)
      .where(
        and(
          eq(romTable.fileName, fileName),
          eq(romTable.platform, platform),
          eq(romTable.userId, currentUser.id),
          eq(romTable.status, 1),
        ),
      )
    if (result) {
      romId = result.id
    }
  }

  if (romId) {
    const {
      roms: [rom],
    } = await getRoms({ id: romId })
    return rom
  }
}
