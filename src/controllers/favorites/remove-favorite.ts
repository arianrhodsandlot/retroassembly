import { and, eq } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { favoriteTable, statusEnum } from '#@/databases/schema.ts'

export async function removeFavorite(romId: string) {
  const { currentUser, db } = getContext().var
  const { library } = db

  const result = await library
    .update(favoriteTable)
    .set({ status: statusEnum.deleted })
    .where(
      and(
        eq(favoriteTable.romId, romId),
        eq(favoriteTable.userId, currentUser.id),
        eq(favoriteTable.status, statusEnum.normal),
      ),
    )
    .returning()

  return result
}
