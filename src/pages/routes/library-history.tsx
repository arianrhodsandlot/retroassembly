import { getContext } from 'hono/context-storage'
import { getLaunchRecords } from '@/controllers/launch-records/get-launch-records.ts'
import { getLoaderData } from '@/utils/server/loader-data.ts'
import HistoryPage from '../library/history/page.tsx'
import type { Route } from './+types/library-history.ts'

export async function loader({ request }: Route.LoaderArgs) {
  const { t } = getContext().var
  const url = new URL(request.url)
  const query = url.searchParams
  const page = Number.parseInt(new URLSearchParams(query).get('page') || '', 10) || 1
  const { pagination, roms } = await getLaunchRecords({ page })
  return getLoaderData({ page, pagination, roms, title: t('History') })
}

export default function LibraryHistoryRoute() {
  return <HistoryPage />
}
