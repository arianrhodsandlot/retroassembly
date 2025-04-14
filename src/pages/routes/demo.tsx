import { defaultPreference } from '@/constants/preference.ts'
import { getDemoRoms } from '@/controllers/get-demo-roms.ts'
import LibraryPage from '../library/page.tsx'
import type { Route } from './+types/library.ts'

export function loader() {
  const preference = structuredClone(defaultPreference)
  preference.ui.platforms = ['nes', 'genesis', 'gba']
  return {
    count: 0,
    page: 1,
    pagination: { current: 1, pages: 1, size: 0, total: 0 },
    platformCount: 0,
    preference,
    roms: getDemoRoms(),
  }
}

export default function LibraryRoute({ loaderData }: Route.ComponentProps) {
  return <LibraryPage pageData={loaderData} />
}
