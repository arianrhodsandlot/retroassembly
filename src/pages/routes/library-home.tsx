import { getContext } from 'hono/context-storage'
import { getLaunchRecords } from '@/controllers/launch-records/get-launch-records.ts'
import { getRoms } from '@/controllers/roms/get-roms.ts'
import { getLoaderData } from '@/utils/server/loader-data.ts'
import { LibraryHomePage } from '../library/home/page.tsx'

export async function loader() {
  const { t } = getContext().var

  const { roms: recentlySavedRoms } = await getRoms({ direction: 'desc', orderBy: 'released', pageSize: 20 })
  const { roms: newAddedRoms } = await getRoms({ direction: 'desc', orderBy: 'added', pageSize: 20 })
  const { roms: recentlyLaunchedRoms } = await getLaunchRecords({ pageSize: 20 })
  return getLoaderData({
    newAddedRoms,
    recentlyLaunchedRoms,
    recentlySavedRoms,
    title: t('Library'),
  })
}

export default function LibraryRoute() {
  return <LibraryHomePage />
}
