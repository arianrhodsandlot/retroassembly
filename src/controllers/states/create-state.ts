import path from 'node:path'
import { and, desc, eq } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { romTable, stateTable } from '#@/databases/schema.ts'
import { nanoid } from '#@/utils/server/nanoid.ts'
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

  const [romResult] = await db.library
    .select()
    .from(romTable)
    .where(and(eq(romTable.id, rom), eq(romTable.userId, currentUser.id)))
    .limit(1)

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
    if (existingAutoStates.length > 10) {
      const idsToDelete = existingAutoStates.slice(10).map((s) => s.id)
      await deleteStates(idsToDelete)
    }
  }

  return stateResult
}
