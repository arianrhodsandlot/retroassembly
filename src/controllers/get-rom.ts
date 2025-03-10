import { and, eq } from 'drizzle-orm'
import { getContextData } from 'waku/middleware/context'
import { rom } from '@/databases/library/schema.ts'
import { getRoms } from './get-roms.ts'

export async function getRom({ fileName, id, platform }: { fileName: string; id: string; platform: string }) {
  let romId = id

  if (!romId) {
    const { currentUser, db } = getContextData()
    const [result] = await db.library
      .select()
      .from(rom)
      .orderBy(rom.file_name)
      .where(and(eq(rom.file_name, fileName), eq(rom.platform, platform), eq(rom.user_id, currentUser.id)))
    if (result) {
      romId = result.id
    }
  }

  if (romId) {
    const [r] = await getRoms({ id: romId })
    return r
  }
}
