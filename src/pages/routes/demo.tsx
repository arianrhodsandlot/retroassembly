import { uniqueId } from 'es-toolkit/compat'
import { defaultPreference } from '@/constants/preference.ts'
import type { Roms } from '@/controllers/get-roms.ts'
import LibraryPage from '../library/page.tsx'
import type { Route } from './+types/library.ts'

export function loader({ request }: Route.LoaderArgs) {
  const preference = structuredClone(defaultPreference)
  preference.ui.platforms = ['nes', 'genesis', 'gba']
  return {
    count: 0,
    page: 1,
    pagination: { current: 1, pages: 1, size: 0, total: 0 },
    platformCount: 0,
    preference,
    roms: [
      {
        fileName: 'flappybird.nes',
        id: uniqueId(),
        launchboxGame: null,
        platform: 'nes',
      },
    ] as Roms,
  }
}

export default function LibraryRoute({ loaderData }: Route.ComponentProps) {
  return <LibraryPage pageData={loaderData} />
}
