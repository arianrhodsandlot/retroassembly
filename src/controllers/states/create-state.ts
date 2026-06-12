import path from 'node:path'
import { and, desc, eq } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { getRunTimeEnv } from '#@/constants/env.ts'
import { romTable, stateTable } from '#@/databases/schema.ts'
import { nanoid } from '#@/utils/server/nanoid.ts'
import { romOwnershipCondition } from '#@/utils/server/shared-rom.ts'
import { deleteStates } from './delete-states.ts'

interface CreateStateParams {
  core: string
  rom: string
  state: Blob
  thumbnail: Blob
  type: 'auto' | 'manual'
}

export async function createState({ core, rom, state, thumbnail, type }: CreateStateParams) {
  const { currentUser, db, storage } = getContext().var
  if (!currentUser) {
    throw new Error('Unauthorized')
  }

  // Resolve the rom across the user's own uploads and the shared library so save states work for
  // shared ROMs too. The state row itself stays owned by the current user.
  const [romResult] = await db.library
    .select()
    .from(romTable)
    .where(and(eq(romTable.id, rom), romOwnershipCondition(currentUser.id)))
    .limit(1)
  if (!romResult) {
    throw new Error('ROM not found or access denied')
  }

  const id = nanoid()
  const stateFileId = path.join('states', currentUser.id, romResult.platform, rom, `${id}.state`)
  await storage.put(stateFileId, state)
  const thumbnailFileId = path.join('states', currentUser.id, romResult.platform, rom, `${id}.png`)
  await storage.put(thumbnailFileId, thumbnail)

  const [stateResult] = await db.library
    .insert(stateTable)
    .values({
      core,
      fileId: stateFileId,
      platform: romResult.platform,
      romId: romResult.id,
      thumbnailFileId,
      type,
      userId: currentUser.id,
    })
    .returning()

  if (type === 'auto') {
    const existingAutoStates = await db.library
      .select()
      .from(stateTable)
      .where(
        and(
          eq(stateTable.userId, currentUser.id),
          eq(stateTable.romId, romResult.id),
          eq(stateTable.status, 1),
          eq(stateTable.type, 'auto'),
        ),
      )
      .orderBy(desc(stateTable.createdAt))
    const maxAutoStates = Number.parseInt(getRunTimeEnv().RETROASSEMBLY_RUN_TIME_MAX_AUTO_STATES_PER_ROM, 10) || 20
    if (existingAutoStates.length > maxAutoStates) {
      const idsToDelete = existingAutoStates.slice(maxAutoStates).map((s) => s.id)
      await deleteStates(idsToDelete)
    }
  }

  return stateResult
}
