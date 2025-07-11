import { addDays, differenceInHours, differenceInMilliseconds } from 'date-fns'
import { and, eq, gt } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { getCookie } from 'hono/cookie'
import { sessionTable, userTable } from '../databases/schema.ts'
import { createSupabase } from '../utils/supabase.ts'

export async function getCurrentUser() {
  const supabase = createSupabase()
  if (supabase) {
    const { data } = await supabase.auth.getUser()
    return data?.user
  }

  const c = getContext()
  const { db } = c.var
  const token = c.req.header('Authorization')?.replace('Bearer ', '') || getCookie(c, 'session_token')

  if (!token) {
    return
  }

  // Find active session
  const [result] = await db.library
    .select()
    .from(sessionTable)
    .innerJoin(userTable, eq(sessionTable.userId, userTable.id))
    .where(
      and(
        eq(sessionTable.token, token),
        eq(sessionTable.status, 1), // Active session
        eq(userTable.status, 1), // Active user
        gt(sessionTable.expiresAt, new Date()), // Not expired
      ),
    )
    .limit(1)

  if (!result) {
    return
  }

  const { sessions: session, users: user } = result

  // Auto-renewal logic with date-fns
  const now = new Date()
  const lastActivity = new Date(session.lastActivityAt)
  const expiresAt = new Date(session.expiresAt)

  const timeSinceActivity = differenceInMilliseconds(now, lastActivity)
  const hoursUntilExpiry = differenceInHours(expiresAt, now)

  // Session renewal threshold (renew if expires within 24 hours)
  const RENEWAL_THRESHOLD_HOURS = 24
  const ACTIVITY_UPDATE_INTERVAL = 5 * 60 * 1000 // 5 minutes in milliseconds

  let shouldUpdate = false
  let newExpiresAt = expiresAt
  let newLastActivityAt = lastActivity

  // Renew session if close to expiry
  if (hoursUntilExpiry <= RENEWAL_THRESHOLD_HOURS) {
    newExpiresAt = addDays(now, 30) // Extend by 30 days
    shouldUpdate = true
  }

  // Update activity if enough time has passed
  if (timeSinceActivity >= ACTIVITY_UPDATE_INTERVAL) {
    newLastActivityAt = now
    shouldUpdate = true
  }

  if (shouldUpdate) {
    await db.library
      .update(sessionTable)
      .set({
        expiresAt: newExpiresAt,
        lastActivityAt: newLastActivityAt,
      })
      .where(eq(sessionTable.id, session.id))
  }

  return {
    id: user.id,
    username: user.username,
  }
}
