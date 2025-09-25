import { attemptAsync } from 'es-toolkit'
import { platformMap, type PlatformName } from '@/constants/platform.ts'
import { getPlatformInfo } from '@/controllers/roms/get-platform-info.ts'
import { getRoms } from '@/controllers/roms/get-roms.ts'
import { getLoaderData } from '@/utils/server/loader-data.ts'
import PlatformPage from '../library/platform/page.tsx'
import type { Route } from './+types/library-platform.ts'

export async function loader({ params, request }: Route.LoaderArgs) {
  const platform = params.platform as PlatformName
  const url = new URL(request.url)
  const page = Number.parseInt(url.searchParams.get('page') || '1', 10) || 1
  const { pagination, roms } = await getRoms({ page, platform })
  const [, platformInfo] = await attemptAsync(() => getPlatformInfo(platform))

  return getLoaderData({ page, pagination, platform, platformInfo, roms, title: platformMap[platform].displayName })
}

export default function LibraryPlatformRoute() {
  return <PlatformPage />
}
