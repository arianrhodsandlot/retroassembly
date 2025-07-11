import * as argon2 from 'argon2'
import { addDays } from 'date-fns'
import { and, eq } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { HTTPException } from 'hono/http-exception'
import { nanoid } from 'nanoid'
import { getConnInfo } from '@/api/utils.ts'
import { sessionTable, userTable } from '../databases/schema.ts'

/**
 * Create a new user session after authentication
 *
 * Usage with cookies:
 * ```typescript
 * const session = await createSession({ username, password, userAgent, ip })
 *
 * // Set secure HTTP-only cookie
 * setCookie(c, 'session_token', session.token, {
 *   expires: new Date(session.expiresAt),
 *   httpOnly: true,
 *   secure: true,
 *   sameSite: 'Strict',
 *   path: '/'
 * })
 *
 * // Or set in Authorization header
 * c.header('Authorization', `Bearer ${session.token}`)
 * ```
 */
export async function createSession({ password, username }: { password: string; username: string }) {
  const c = getContext()
  const { db } = c.var

  // Find user by username (only active users with status !== 0)
  const [user] = await db.library
    .select()
    .from(userTable)
    .where(and(eq(userTable.username, username.trim()), eq(userTable.status, 1)))
    .limit(1)

  if (!user) {
    throw new HTTPException(401, { message: 'Invalid username or password' })
  }

  // Verify password
  const isValidPassword = await argon2.verify(user.passwordHash, password)
  if (!isValidPassword) {
    throw new HTTPException(401, { message: 'Invalid username or password' })
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

  return {
    expiresAt: session.expiresAt.getTime(),
    token: session.token,
    user: {
      id: user.id,
      username: user.username,
    },
    userId: session.userId,
  }
}
