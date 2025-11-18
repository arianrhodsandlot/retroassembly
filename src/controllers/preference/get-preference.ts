import { and, eq } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { platformMap } from '#@/constants/platform.ts'
import { resolveUserPreference } from '#@/constants/preference.ts'
import { userPreferenceTable } from '#@/databases/schema.ts'

export async function getPreference() {
  const { currentUser, db } = getContext().var

  const results = await db.library
    .select({ emulator: userPreferenceTable.emulator, input: userPreferenceTable.input, ui: userPreferenceTable.ui })
    .from(userPreferenceTable)
    .where(and(eq(userPreferenceTable.userId, currentUser.id), eq(userPreferenceTable.status, 1)))

  const [userPreference] = results
  if (userPreference?.ui?.platforms) {
    userPreference.ui.platforms = userPreference.ui.platforms.filter((platform) => platform in platformMap)
  }

  return resolveUserPreference(userPreference)
}
