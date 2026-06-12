import { and, eq } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { getRunTimeEnv } from '#@/constants/env.ts'
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

  const preference = resolveUserPreference(userPreference)
  // An instance-wide RETROASSEMBLY_RUN_TIME_SHARED_LIBRARY_ONLY forces the mode on for every user,
  // overriding their per-user toggle, so the client and server both read a single resolved flag.
  if (getRunTimeEnv().RETROASSEMBLY_RUN_TIME_SHARED_LIBRARY_ONLY === 'true') {
    preference.ui.sharedLibraryOnly = true
  }
  return preference
}
