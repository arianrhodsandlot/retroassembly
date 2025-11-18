import { getContext } from 'hono/context-storage'
import { defaultPreference } from '#@/constants/preference.ts'
import { getDemoRoms } from '#@/controllers/roms/get-demo-roms.ts'
import { getLoaderData } from '#@/utils/server/loader-data.ts'
import LibraryPage from '../library/page.tsx'

export function loader() {
  const { t } = getContext().var
  const preference = structuredClone(defaultPreference)
  preference.ui.platforms = ['gba', 'gbc', 'genesis', 'nes', 'snes']
  return getLoaderData({
    count: 0,
    pagination: { current: 1, pages: 1, size: 0, total: 0 },
    platformCount: 0,
    preference,
    roms: getDemoRoms(),
    title: t('Live demo'),
  })
}

export default function LibraryRoute() {
  return <LibraryPage />
}
