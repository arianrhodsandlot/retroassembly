import { asc, eq } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { HTTPException } from 'hono/http-exception'
import { sessionTable, statusEnum, userTable } from '#@/databases/schema.ts'

export async function getAllUsers() {
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

  // Get all users with their most recent activity
  const users = await db.library
    .select({
      createdAt: userTable.createdAt,
      id: userTable.id,
      lastActivityAt: sessionTable.lastActivityAt,
      username: userTable.username,
    })
    .from(userTable)
    .leftJoin(sessionTable, eq(sessionTable.userId, userTable.id))
    .where(eq(userTable.status, statusEnum.normal))
    .orderBy(asc(userTable.createdAt))

  // Group by user and get the most recent activity
  const userMap = new Map<string, (typeof users)[0]>()
  for (const user of users) {
    const existing = userMap.get(user.id)
    if (
      !existing ||
      (user.lastActivityAt && (!existing.lastActivityAt || user.lastActivityAt > existing.lastActivityAt))
    ) {
      userMap.set(user.id, user)
    }
  }

  const groupedUsers = [...userMap.values()].map((user) => ({
    createdAt: user.createdAt,
    id: user.id,
    isSuper: user.id === superUser.id,
    lastActivityAt: user.lastActivityAt,
    username: user.username,
  }))

  return groupedUsers
}
