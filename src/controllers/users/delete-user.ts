import { and, asc, eq } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { HTTPException } from 'hono/http-exception'
import { sessionTable, statusEnum, userTable } from '#@/databases/schema.ts'

export async function deleteUser(userIdToDelete: string) {
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

  // Prevent self-deletion
  if (userIdToDelete === currentUser.id) {
    throw new HTTPException(400, { message: 'Cannot delete yourself' })
  }

  // Prevent deleting super user
  if (userIdToDelete === superUser.id) {
    throw new HTTPException(400, { message: 'Cannot delete super user' })
  }

  // Soft delete user (set status to deleted)
  await db.library.update(userTable).set({ status: statusEnum.deleted }).where(eq(userTable.id, userIdToDelete))

  // Invalidate all sessions for this user
  await db.library
    .update(sessionTable)
    .set({ status: statusEnum.deleted })
    .where(and(eq(sessionTable.userId, userIdToDelete), eq(sessionTable.status, statusEnum.normal)))
}
