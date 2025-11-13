import { getContext } from 'hono/context-storage'
import { getLaunchRecords } from '@/controllers/launch-records/get-launch-records.ts'
import { getRomsWithStates } from '@/controllers/roms/get-roms-with-states.ts'
import { getRoms } from '@/controllers/roms/get-roms.ts'
import { getLoaderData } from '@/utils/server/loader-data.ts'
import { LibraryHomePage } from '../library/home/page.tsx'

export async function loader() {
  const { t } = getContext().var

  const [{ roms: recentlySavedRoms }, { roms: newAddedRoms }, { roms: recentlyLaunchedRoms }] = await Promise.all([
    getRomsWithStates({ pageSize: 20 }),
    getRoms({ direction: 'desc', orderBy: 'added', pageSize: 20 }),
    getLaunchRecords({ pageSize: 20 }),
  ])

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
