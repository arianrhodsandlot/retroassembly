import { asc, eq } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { HTTPException } from 'hono/http-exception'
import { statusEnum, userTable } from '#@/databases/schema.ts'

export async function updateUser({ id, libraryMode }: { id: string; libraryMode: number }) {
  const c = getContext()
  const { currentUser, db } = c.var

  // Get first user (super user) by createdAt timestamp
  const [superUser] = await db.library
    .select()
    .from(userTable)
    .where(eq(userTable.status, statusEnum.normal))
    .orderBy(asc(userTable.createdAt))
    .limit(1)

  // Verify current user is super user
  if (!superUser || superUser.id !== currentUser.id) {
    throw new HTTPException(403, { message: 'Forbidden' })
  }

  // Prevent modifying super user's own libraryMode
  if (id === superUser.id) {
    throw new HTTPException(400, { message: 'Cannot modify super user' })
  }

  const [updatedUser] = await db.library.update(userTable).set({ libraryMode }).where(eq(userTable.id, id)).returning()

  if (!updatedUser) {
    throw new HTTPException(404, { message: 'User not found' })
  }

  return {
    id: updatedUser.id,
    libraryMode: updatedUser.libraryMode,
    username: updatedUser.username,
  }
}
