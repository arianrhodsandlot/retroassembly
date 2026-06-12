import { and, eq, sql } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import type { PlatformName } from '#@/constants/platform.ts'
import { romTable } from '#@/databases/schema.ts'
import { romOwnershipCondition } from '#@/utils/server/shared-rom.ts'
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
    // Prefer the user's own upload over a shared ROM with the same file name and platform.
    .orderBy(sql`CASE WHEN ${romTable.userId} = ${currentUser.id} THEN 0 ELSE 1 END`, romTable.fileName)
    .where(
      and(
        eq(romTable.fileName, fileName),
        eq(romTable.platform, platform),
        romOwnershipCondition(currentUser.id),
        eq(romTable.status, 1),
      ),
    )
    .limit(1)
  if (result) {
    return getRom({ id: result.id })
  }
}
