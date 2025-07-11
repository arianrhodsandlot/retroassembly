import * as argon2 from 'argon2'
import { eq } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { HTTPException } from 'hono/http-exception'
import { getConnInfo } from '@/api/utils.ts'
import { userTable } from '../databases/schema.ts'

interface CreateUserOptions {
  password: string
  username: string
}

/**
 * Create a new user account
 */
export async function createUser(options: CreateUserOptions) {
  const { password, username } = options
  const c = getContext()
  const { db } = c.var

  // Check if username already exists
  const existingUser = await db.library.select().from(userTable).where(eq(userTable.username, username.trim())).limit(1)

  if (existingUser.length > 0) {
    throw new HTTPException(409, { message: 'Username already exists' })
  }

  // Hash the password
  const passwordHash = await argon2.hash(password)

  // Create the user
  const [newUser] = await db.library
    .insert(userTable)
    .values({
      passwordHash,
      registrationIp: getConnInfo()?.remote.address,
      registrationUserAgent: c.req.header('User-Agent'),
      username: username.trim(),
    })
    .returning()

  return {
    createdAt: newUser.createdAt,
    id: newUser.id,
    username: newUser.username,
  }
}
