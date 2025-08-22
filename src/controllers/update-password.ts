import assert from 'node:assert'
import { and, eq } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { HTTPException } from 'hono/http-exception'
import { sessionTable, statusEnum, userTable } from '../databases/schema.ts'

export async function updatePassword(currentPassword: string, newPassword: string) {
  const c = getContext()
  const { currentUser, db, token } = c.var
  assert.ok(currentUser)
  const userId = currentUser?.id

  const [user] = await db.library.select().from(userTable).where(eq(userTable.id, userId)).limit(1)
  if (!user) {
    throw new HTTPException(404, { message: 'User not found' })
  }

  const { hash, verify } = await import('argon2')
  const isValid = await verify(user.passwordHash, currentPassword)
  if (!isValid) {
    throw new HTTPException(401, { message: 'Invalid current password' })
  }

  const newHash = await hash(newPassword)

  await db.library.update(userTable).set({ passwordHash: newHash }).where(eq(userTable.id, userId))
  await db.library.update(sessionTable).set({ status: statusEnum.deleted }).where(eq(sessionTable.userId, userId))
  if (token) {
    await db.library
      .update(sessionTable)
      .set({ status: statusEnum.normal })
      .where(and(eq(sessionTable.token, token), eq(sessionTable.userId, userId)))
  }

  return true
}
