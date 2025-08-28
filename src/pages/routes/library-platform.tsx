import assert from 'node:assert'
import { getPlatformInfo } from '@/controllers/get-platform-info.ts'
import { getRoms } from '@/controllers/get-roms.ts'
import { getLoaderData } from '@/utils/loader-data.ts'
import PlatformPage from '../library/platform/page.tsx'
import type { Route } from './+types/library-platform.ts'

export async function loader({ params, request }: Route.LoaderArgs) {
  const { platform } = params
  assert.ok(platform)
  const url = new URL(request.url)
  const page = Number.parseInt(url.searchParams.get('page') || '1', 10) || 1
  const { pagination, roms } = await getRoms({ page, platform })
  const platformInfo = await getPlatformInfo(platform)

  return getLoaderData({ page, pagination, platform, platformInfo, roms })
}

export default function LibraryPlatformRoute({ loaderData }: Readonly<Route.ComponentProps>) {
  return <PlatformPage pageData={loaderData} />
}
