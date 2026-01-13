import { getContext } from 'hono/context-storage'
import { getRomsWithStates } from '#@/controllers/roms/get-roms-with-states.ts'
import { getRoms } from '#@/controllers/roms/get-roms.ts'
import { getStates } from '#@/controllers/states/get-states.ts'
import { getLibraryLoaderData } from '#@/utils/server/loader-data.ts'
import { LibraryHomePage } from '../library/home/page.tsx'

export async function loader() {
  const { preference } = getContext().var

  const [{ roms: recentlySavedRoms }, { roms: newAddedRoms }, libraryLoaderData] = await Promise.all([
    getRomsWithStates({ pageSize: 1 }),
    getRoms({ direction: 'desc', orderBy: 'added', pageSize: 20 }),
    getLibraryLoaderData(),
  ])

  const data: {
    rom: (typeof recentlySavedRoms)[number] | null
    state: any
  } = { rom: null, state: null }

  const { recentlyLaunchedRoms } = libraryLoaderData
  const rom = recentlySavedRoms[0] || recentlyLaunchedRoms[0] || newAddedRoms[0]
  if (rom) {
    const [state] = await getStates({ core: preference.emulator.platform[rom.platform].core, limit: 1, rom: rom?.id })
    data.rom = rom
    if (state) {
      data.state = state
    }
  }

  return { ...libraryLoaderData, newAddedRoms, recentlySavedRoms, rom: data.rom, state: data.state }
}

export default function LibraryRoute() {
  return <LibraryHomePage />
}
