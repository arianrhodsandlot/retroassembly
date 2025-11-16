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

  const data: {
    rom: (typeof recentlySavedRoms)[number] | null
    state: any | null
  } = { rom: null, state: null }

  const rom = recentlySavedRoms[0] || recentlyLaunchedRoms[0] || newAddedRoms[0]
  if (rom) {
    const [state] = await getStates({ core: preference.emulator.platform[rom.platform].core, limit: 1, rom: rom?.id })
    data.rom = rom
    if (state) {
      data.state = state
    }
  }

  return getLoaderData({
    newAddedRoms,
    recentlyLaunchedRoms,
    recentlySavedRoms,
    rom: data.rom,
    state: data.state,
    title: t('Home'),
  })
}

export default function LibraryRoute() {
  return <LibraryHomePage />
}
