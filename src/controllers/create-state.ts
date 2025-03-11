import { and, eq } from 'drizzle-orm'
import { getContextData } from 'waku/middleware/context'
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
  const { currentUser, db, storage } = getContextData()

  const [romResult] = await db.library
    .select()
    .from(romTable)
    .where(and(eq(romTable.id, rom), eq(romTable.user_id, currentUser.id)))
    .limit(1)

  const stateFileId = nanoid()
  await storage.put(stateFileId, state)
  const thumbnailFileId = nanoid()
  await storage.put(thumbnailFileId, thumbnail)
  const [stateResult] = await db.library
    .insert(stateTable)
    .values({
      core,
      file_id: stateFileId,
      platform: romResult.platform,
      rom_id: romResult.id,
      thumbnail_file_id: thumbnailFileId,
      type,
      user_id: currentUser.id,
    })
    .returning()
  return stateResult
}
