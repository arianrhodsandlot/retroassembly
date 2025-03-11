import { and, eq } from 'drizzle-orm'
import { getContextData } from 'waku/middleware/context'
import { romTable } from '@/databases/library/schema.ts'
import { getRoms } from './get-roms.ts'

export async function getRom({ fileName, id, platform }: { fileName: string; id: string; platform: string }) {
  let romId = id

  if (!romId) {
    const { currentUser, db } = getContextData()
    const [result] = await db.library
      .select()
      .from(romTable)
      .orderBy(romTable.file_name)
      .where(
        and(
          eq(romTable.file_name, fileName),
          eq(romTable.platform, platform),
          eq(romTable.user_id, currentUser.id),
          eq(romTable.status, 1),
        ),
      )
    if (result) {
      romId = result.id
    }
  }

  if (romId) {
    const [r] = await getRoms({ id: romId })
    return r
  }
}
