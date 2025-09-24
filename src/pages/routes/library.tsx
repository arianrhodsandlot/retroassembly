import { getRomPlatformCount } from '@/controllers/roms/get-rom-platform-count.ts'
import { getRoms } from '@/controllers/roms/get-roms.ts'
import { getLoaderData } from '@/utils/server/loader-data.ts'
import LibraryPage from '../library/page.tsx'
import type { Route } from './+types/library.ts'

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url)
  const query = url.searchParams
  const page = Number.parseInt(new URLSearchParams(query).get('page') || '', 10) || 1
  const [{ pagination, roms }, platformCount] = await Promise.all([getRoms({ page }), getRomPlatformCount()])
  return getLoaderData({ page, pagination, platformCount, roms, title: 'Library' })
}

export default function LibraryRoute() {
  return <LibraryPage />
}
