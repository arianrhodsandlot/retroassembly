import { eq, type InferInsertModel } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { platforms } from '#@/constants/platform.ts'
import { type PreferenceSnippet, resolveUserPreference } from '#@/constants/preference.ts'
import { userPreferenceTable } from '#@/databases/schema.ts'
import { mergePreference } from '#@/utils/isomorphic/preference.ts'

function normalize(preference: any) {
  // sort platforms and remove invalid platforms
  if (preference.ui?.platforms) {
    preference.ui.platforms = platforms.map(({ name }) => name).filter((name) => preference.ui.platforms.includes(name))
  }
  if (preference.ui?.platforms === null) {
    preference.ui.platforms = undefined
  }
}

export async function updatePreference(preference: PreferenceSnippet) {
  const { currentUser, db } = getContext().var

  const where = eq(userPreferenceTable.userId, currentUser.id)
  const returning = {
    emulator: userPreferenceTable.emulator,
    input: userPreferenceTable.input,
    ui: userPreferenceTable.ui,
  }

  const results = await db.library.select().from(userPreferenceTable).where(where)

  let newPreferenceResults: Pick<InferInsertModel<typeof userPreferenceTable>, keyof typeof returning>[]
  if (results.length > 0) {
    const [{ emulator, input, ui }] = results
    const newPreference: any = {}
    if (preference.emulator) {
      newPreference.emulator = mergePreference(emulator || {}, preference.emulator)
    }
    if (preference.input) {
      newPreference.input = mergePreference(input || {}, preference.input)
    }
    if (preference.ui) {
      newPreference.ui = mergePreference(ui || {}, preference.ui)
    }
    normalize(newPreference)

    newPreferenceResults = await db.library
      .update(userPreferenceTable)
      .set({ ...newPreference, userId: currentUser.id })
      .where(where)
      .returning(returning)
  } else {
    const newPreference = { ...preference }

    normalize(newPreference)

    newPreferenceResults = await db.library
      .insert(userPreferenceTable)
      .values({ ...preference, userId: currentUser.id })
      .returning(returning)
  }

  return resolveUserPreference(newPreferenceResults[0])
}
