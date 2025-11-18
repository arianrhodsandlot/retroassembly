import { and, eq } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { HTTPException } from 'hono/http-exception'
import { DateTime } from 'luxon'
import { sessionTable, statusEnum, userTable } from '#@/databases/schema.ts'
import { getConnInfo } from '#@/utils/server/misc.ts'
import { nanoid } from '#@/utils/server/nanoid.ts'

const invalidException = new HTTPException(401, { message: 'Invalid username or password' })

export async function createSession({ password, username }: { password: string; username: string }) {
  const c = getContext()
  const { db } = c.var

  const [user] = await db.library
    .select()
    .from(userTable)
    .where(and(eq(userTable.username, username.trim()), eq(userTable.status, statusEnum.normal)))
    .limit(1)

  if (!user) {
    throw invalidException
  }

  const { verify } = await import('argon2')
  const isValidPassword = await verify(user.passwordHash, password)
  if (!isValidPassword) {
    throw invalidException
  }

  const [session] = await db.library
    .insert(sessionTable)
    .values({
      expiresAt: DateTime.now().plus({ days: 30 }).toJSDate(),
      ip: getConnInfo()?.remote.address,
      token: nanoid(),
      userAgent: c.req.header('User-Agent'),
      userId: user.id,
    })
    .returning()

  return { session, user }
}
