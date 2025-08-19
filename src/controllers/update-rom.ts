import { UTCDateMini } from '@date-fns/utc'
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
  gameReleaseDate?: number
  gameThumbnailFileIds?: string
  id: string
}) {
  const { currentUser, db } = getContext().var
  const { library } = db

  if (!currentUser) {
    throw new Error('User not authenticated')
  }

  const { id, ...updateData } = rom
  const existingRom = await getRom({ id: rom.id })

  if (!existingRom) {
    throw new Error('ROM not found or access denied')
  }

  const fieldMap = {
    gameDescription: 'overview',
    gameDeveloper: 'developer',
    gameGenres: 'genres',
    gamePlayers: 'maxPlayers',
    gamePublisher: 'publisher',
    gameReleaseDate: 'releaseDate',
  }
  for (const [key, value] of Object.entries(fieldMap)) {
    if (['', existingRom.launchboxGame?.[value]].includes(updateData[key])) {
      updateData[key] = null
    }
  }
  if (updateData.gameReleaseDate) {
    const date = new UTCDateMini(updateData.gameReleaseDate)
    // @ts-expect-error update gameReleaseDate to date
    updateData.gameReleaseDate = date.getTime() ? date : null
  }

  const [updatedRom] = await library
    .update(romTable)
    .set(updateData)
    .where(and(eq(romTable.id, id), eq(romTable.userId, currentUser.id)))
    .returning()

  return updatedRom
}
