import { and, eq } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { romTable } from '../databases/schema.ts'

export async function updateRom({
  id,
  ...romData
}: {
  gameBoxartFileIds?: string
  gameDescription?: string
  gameDeveloper?: string
  gameGenres?: string
  gameName?: string
  gamePlayers?: number
  gamePublisher?: string
  gameRating?: number
  gameReleaseDate?: number
  gameReleaseYear?: number
  gameThumbnailFileIds?: string
  id: string
}) {
  const { currentUser, db } = getContext().var
  const { library } = db

  if (!currentUser) {
    throw new Error('User not authenticated')
  }

  // First, verify that the ROM exists and belongs to the current user
  const existingRom = await library
    .select({ id: romTable.id })
    .from(romTable)
    .where(and(eq(romTable.id, id), eq(romTable.userId, currentUser.id), eq(romTable.status, 1)))
    .limit(1)

  if (existingRom.length === 0) {
    throw new Error('ROM not found or access denied')
  }

  const updateData = Object.fromEntries(Object.entries(romData).filter(([, value]) => value !== undefined))

  if (Object.keys(updateData).length === 0) {
    return
  }

  const [updatedRom] = await library
    .update(romTable)
    .set(updateData)
    .where(and(eq(romTable.id, id), eq(romTable.userId, currentUser.id)))
    .returning()

  return updatedRom
}
