import { getRomPlatformCount } from '@/controllers/get-rom-platform-count.ts'
import { getRoms } from '@/controllers/get-roms.ts'
import { getLoaderData } from '@/utils/loader-data.ts'
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
