import { and, eq } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { romTable, stateTable } from '../databases/library/schema.ts'
import { nanoid } from '../utils/misc.ts'

interface CreateStateParams {
  core: string
  rom: string
  state: File
  thumbnail: File
  type: 'auto' | 'manual'
}

export async function createState({ core, rom, state, thumbnail, type }: CreateStateParams) {
  const { currentUser, db, storage } = getContext().var

  const [romResult] = await db.library
    .select()
    .from(romTable)
    .where(and(eq(romTable.id, rom), eq(romTable.userId, currentUser.id)))
    .limit(1)

  const stateFileId = nanoid()
  await storage.put(stateFileId, state)
  const thumbnailFileId = nanoid()
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
  return stateResult
}
