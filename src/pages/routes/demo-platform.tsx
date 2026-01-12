import { getContext } from 'hono/context-storage'
import { platformMap } from '#@/constants/platform.ts'
import { defaultPreference } from '#@/constants/preference.ts'
import { getDemoRoms } from '#@/controllers/roms/get-demo-roms.ts'
import { getPlatformInfo } from '#@/controllers/roms/get-platform-info.ts'
import { getLoaderData } from '#@/utils/server/loader-data.ts'
import PlatformPage from '../library/platform/page.tsx'
import type { Route } from './+types/library-platform.ts'

export async function loader({ params }: Route.LoaderArgs) {
  const { t } = getContext().var
  const { platform = '' } = params

  const preference = structuredClone(defaultPreference)
  preference.ui.platforms = ['gba', 'gbc', 'genesis', 'nes', 'snes']
  const platformInfo = getPlatformInfo(platform)

  return await getLoaderData({
    count: 0,
    pagination: { current: 1, pages: 1, size: 0, total: 0 },
    platform,
    platformCount: 0,
    platformInfo,
    preference,
    roms: getDemoRoms({ platform }),
    title: `${t(platformMap[platform].displayName)} (Demo)`,
  })
}

export default function DemoPlatformRoute() {
  return <PlatformPage />
}
