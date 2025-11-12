import { getContext } from 'hono/context-storage'
import { platformMap, type PlatformName } from '@/constants/platform.ts'
import { getPlatformInfo } from '@/controllers/roms/get-platform-info.ts'
import { getRoms } from '@/controllers/roms/get-roms.ts'
import { getLoaderData } from '@/utils/server/loader-data.ts'
import { getRomsQuery } from '@/utils/server/misc.ts'
import PlatformPage from '../library/platform/page.tsx'
import type { Route } from './+types/library-platform.ts'

export async function loader({ params }: Route.LoaderArgs) {
  const { t } = getContext().var
  const platform = params.platform as PlatformName
  const romsQuery = getRomsQuery()
  const { pagination, roms } = await getRoms({ ...romsQuery, platform })
  const platformInfo = getPlatformInfo(platform)
  return getLoaderData({ pagination, platform, platformInfo, roms, title: t(platformMap[platform].displayName) })
}

export default function LibraryPlatformRoute() {
  return <PlatformPage />
}
