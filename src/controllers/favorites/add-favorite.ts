import { and, eq } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { favoriteTable, statusEnum } from '#@/databases/schema.ts'

export async function addFavorite(romId: string) {
  const { currentUser, db } = getContext().var
  const { library } = db

  const [existing] = await library
    .select()
    .from(favoriteTable)
    .where(and(eq(favoriteTable.userId, currentUser.id), eq(favoriteTable.romId, romId)))

  if (existing && existing.status === statusEnum.normal) {
    return existing
  }

  if (existing) {
    const [result] = await library
      .update(favoriteTable)
      .set({ status: statusEnum.normal })
      .where(eq(favoriteTable.id, existing.id))
      .returning()
    return result
  }

  const [result] = await library
    .insert(favoriteTable)
    .values({
      romId,
      userId: currentUser.id,
    })
    .returning()

  return result
}
