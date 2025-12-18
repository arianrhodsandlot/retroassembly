import { eq } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { HTTPException } from 'hono/http-exception'
import { userTable } from '#@/databases/schema.ts'
import { hash } from '#@/utils/server/argon2.ts'
import { getConnInfo } from '#@/utils/server/misc.ts'

export async function createUser({ password, username }: { password: string; username: string }) {
  const c = getContext()
  const { db } = c.var

  const [existing] = await db.library.select().from(userTable).where(eq(userTable.username, username.trim())).limit(1)
  if (existing) {
    throw new HTTPException(409, { message: 'Username already exists' })
  }

  const passwordHash = await hash(password)

  const [user] = await db.library
    .insert(userTable)
    .values({
      passwordHash,
      registrationIp: getConnInfo()?.remote.address,
      registrationUserAgent: c.req.header('User-Agent'),
      username: username.trim(),
    })
    .returning()

  return {
    id: user.id,
    username: user.username,
  }
}
