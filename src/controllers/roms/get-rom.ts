import { and, eq } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import type { PlatformName } from '@/constants/platform.ts'
import { romTable } from '@/databases/schema.ts'
import { getRoms } from './get-roms.ts'

export async function getRom(params: { fileName: string; platform: PlatformName } | { id: string }) {
  if ('id' in params) {
    const {
      roms: [rom],
    } = await getRoms({ id: params.id })
    return rom
  }

  const { fileName, platform } = params
  const { currentUser, db } = getContext().var
  const [result] = await db.library
    .select({ id: romTable.id })
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
    return getRom({ id: result.id })
  }
}
