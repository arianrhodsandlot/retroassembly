import { defaultPreference } from '@/constants/preference.ts'
import { getDemoRoms } from '@/controllers/roms/get-demo-roms.ts'
import LibraryPage from '../library/page.tsx'

export function loader() {
  const preference = structuredClone(defaultPreference)
  preference.ui.platforms = ['gba', 'gbc', 'genesis', 'nes', 'snes']
  return {
    count: 0,
    page: 1,
    pagination: { current: 1, pages: 1, size: 0, total: 0 },
    platformCount: 0,
    preference,
    roms: getDemoRoms(),
    title: 'Library',
  }
}

export default function LibraryRoute() {
  return <LibraryPage />
}
