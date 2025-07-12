import * as argon2 from 'argon2'
import { addDays } from 'date-fns'
import { and, eq } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { HTTPException } from 'hono/http-exception'
import { nanoid } from 'nanoid'
import { getConnInfo } from '@/api/utils.ts'
import { sessionTable, statusEnum, userTable } from '../databases/schema.ts'

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

  // Verify password
  const isValidPassword = await argon2.verify(user.passwordHash, password)
  if (!isValidPassword) {
    throw invalidException
  }

  // Create session in database
  const [session] = await db.library
    .insert(sessionTable)
    .values({
      expiresAt: addDays(new Date(), 30),
      ip: getConnInfo()?.remote.address,
      token: nanoid(),
      userAgent: c.req.header('User-Agent'),
      userId: user.id,
    })
    .returning()

  return { session, user }
}
