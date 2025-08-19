import assert from 'node:assert'
import { and, eq } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { romTable } from '../databases/schema.ts'
import { getRom } from './get-rom.ts'

export async function updateRom(rom: {
  gameBoxartFileIds?: string
  gameDescription?: string
  gameDeveloper?: string
  gameGenres?: string
  gameName?: string
  gamePlayers?: number
  gamePublisher?: string
  gameReleaseDate?: Date
  gameThumbnailFileIds?: string
  id: string
}) {
  const { currentUser, db } = getContext().var
  assert.ok(currentUser)

  const { library } = db

  const { id } = rom
  const existingRom = await getRom({ id })
  if (!existingRom) {
    throw new Error('ROM not found or access denied')
  }

  const [updatedRom] = await library
    .update(romTable)
    .set(rom)
    .where(and(eq(romTable.id, id), eq(romTable.userId, currentUser.id)))
    .returning()

  return updatedRom
}
