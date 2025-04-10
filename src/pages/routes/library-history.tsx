import { getContext } from 'hono/context-storage'
import { getLaunchRecords } from '@/controllers/get-launch-records.ts'
import HistoryPage from '../library/history/page.tsx'
import type { Route } from './+types/library-history.ts'

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url)
  const query = url.searchParams
  const page = Number.parseInt(new URLSearchParams(query).get('page') || '', 10) || 1
  const { pagination, roms } = await getLaunchRecords({ page })
  const { preference } = getContext().var
  return { page, pagination, preference, roms }
}

export function LibraryHistoryRoute({ loaderData }: Route.ComponentProps) {
  return <HistoryPage pageData={loaderData} />
}
