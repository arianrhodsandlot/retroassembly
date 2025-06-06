import { getContext } from 'hono/context-storage'
import { getRomPlatformCount } from '@/controllers/get-rom-platform-count.ts'
import { getRoms } from '@/controllers/get-roms.ts'
import LibraryPage from '../library/page.tsx'
import type { Route } from './+types/library.ts'

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url)
  const query = url.searchParams
  const page = Number.parseInt(new URLSearchParams(query).get('page') || '', 10) || 1
  const [{ pagination, roms }, platformCount] = await Promise.all([getRoms({ page }), getRomPlatformCount()])
  const { preference } = getContext().var
  return { page, pagination, platformCount, preference, roms }
}

export default function LibraryRoute({ loaderData }: Route.ComponentProps) {
  return <LibraryPage pageData={loaderData} />
}
