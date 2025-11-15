import { getContext } from 'hono/context-storage'
import { getLaunchRecords } from '@/controllers/launch-records/get-launch-records.ts'
import { getRomsWithStates } from '@/controllers/roms/get-roms-with-states.ts'
import { getRoms } from '@/controllers/roms/get-roms.ts'
import { getStates } from '@/controllers/states/get-states.ts'
import { getLoaderData } from '@/utils/server/loader-data.ts'
import { LibraryHomePage } from '../library/home/page.tsx'

export async function loader() {
  const { preference, t } = getContext().var

  const [{ roms: recentlySavedRoms }, { roms: newAddedRoms }, { roms: recentlyLaunchedRoms }] = await Promise.all([
    getRomsWithStates({ pageSize: 1 }),
    getRoms({ direction: 'desc', orderBy: 'added', pageSize: 20 }),
    getLaunchRecords({ pageSize: 20 }),
  ])

  const [rom] = recentlySavedRoms
  const [state] = await getStates({ core: preference.emulator.platform[rom.platform].core, limit: 1, rom: rom?.id })
  if (!state) {
    recentlySavedRoms.pop()
  }

  return getLoaderData({ newAddedRoms, recentlyLaunchedRoms, recentlySavedRoms, rom, state, title: t('Home') })
}

export default function LibraryRoute() {
  return <LibraryHomePage />
}
