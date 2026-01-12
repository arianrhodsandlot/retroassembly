import { defaultPreference } from '#@/constants/preference.ts'
import { getDemoRoms } from '#@/controllers/roms/get-demo-roms.ts'
import { getLoaderData } from '#@/utils/server/loader-data.ts'
import RomPage from '../library/platform/rom/page.tsx'
import type { Route } from './+types/library-platform-rom.ts'

export async function loader({ params }: Route.LoaderArgs) {
  const { platform } = params

  const preference = structuredClone(defaultPreference)
  preference.ui.platforms = ['gba', 'gbc', 'genesis', 'nes', 'snes']
  const roms = getDemoRoms({ platform })
  const rom = roms.find((rom) => rom.fileName === params.fileName)
  return await getLoaderData({ preference, rom, title: `${rom?.fileName} (Demo)` })
}

export default function LibraryPlatformRomRoute() {
  return <RomPage />
}
