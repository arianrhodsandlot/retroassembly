import { defaultPreference } from '@/constants/preference.ts'
import { getDemoRoms } from '@/controllers/get-demo-roms.ts'
import { getPlatformInfo } from '@/controllers/get-platform-info.ts'
import PlatformPage from '../library/platform/page.tsx'
import type { Route } from './+types/library-platform.ts'

export async function loader({ params }: Route.LoaderArgs) {
  const { platform = '' } = params

  const preference = structuredClone(defaultPreference)
  preference.ui.platforms = ['gba', 'gbc', 'genesis', 'nes', 'snes']
  const platformInfo = await getPlatformInfo(platform)

  return {
    count: 0,
    page: 1,
    pagination: { current: 1, pages: 1, size: 0, total: 0 },
    platform,
    platformCount: 0,
    platformInfo,
    preference,
    roms: getDemoRoms({ platform }),
  }
}

export default function DemoPlatformRoute({ loaderData }: Readonly<Route.ComponentProps>) {
  return <PlatformPage pageData={loaderData} />
}
