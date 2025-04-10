import { getContext } from 'hono/context-storage'
import { getPlatformInfo } from '@/controllers/get-platform-info.ts'
import { getRoms } from '@/controllers/get-roms.ts'
import PlatformPage from '../library/platform/page.tsx'
import type { Route } from './+types/library-platform.ts'

export async function loader({ params, request }: Route.LoaderArgs) {
  const url = new URL(request.url)
  const page = Number.parseInt(url.searchParams.get('page') || '1', 10) || 1
  const { platform } = params
  const { pagination, roms } = await getRoms({ page, platform })
  const { preference } = getContext().var
  const platformInfo = await getPlatformInfo(platform)

  return { page, pagination, platform, platformInfo, preference, roms }
}

export default function LibraryPlatformRoute({ loaderData }: Route.ComponentProps) {
  return <PlatformPage pageData={loaderData} />
}
