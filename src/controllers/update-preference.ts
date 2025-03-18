import { eq, type InferInsertModel } from 'drizzle-orm'
import { getContextData } from 'waku/middleware/context'
import { platforms } from '@/constants/platform.ts'
import { userPreferenceTable } from '@/databases/library/schema.ts'
import { mergePreference } from './utils.ts'

function normalize(preference) {
  preference.ui.platforms = platforms.map(({ name }) => name).filter((name) => preference.ui.platforms.includes(name))
}

export async function updatePreference(preference) {
  const { currentUser, db } = getContextData()

  const where = eq(userPreferenceTable.user_id, currentUser.id)
  const returning = { emulator: userPreferenceTable.emulator, ui: userPreferenceTable.ui }

  const results = await db.library.select().from(userPreferenceTable).where(where)

  let newPreferenceResults: Pick<InferInsertModel<typeof userPreferenceTable>, keyof typeof returning>[]
  if (results.length > 0) {
    const [{ emulator, ui }] = results
    const newPreference: any = {}
    if (emulator) {
      mergePreference(emulator, preference.emulator)
      newPreference.emulator = emulator
    }
    if (ui) {
      mergePreference(ui, preference.ui)
      newPreference.ui = ui
    }

    normalize(newPreference)

    newPreferenceResults = await db.library
      .update(userPreferenceTable)
      .set({ ...newPreference, user_id: currentUser.id })
      .where(where)
      .returning(returning)
  } else {
    const newPreference = { ...preference }

    normalize(newPreference)

    newPreferenceResults = await db.library
      .insert(userPreferenceTable)
      .values({ ...preference, user_id: currentUser.id })
      .returning(returning)
  }

  return newPreferenceResults[0]
}
