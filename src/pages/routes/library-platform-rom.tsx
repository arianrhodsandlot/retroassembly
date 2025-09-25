import assert from 'node:assert'
import { getContext } from 'hono/context-storage'
import type { PlatformName } from '@/constants/platform.ts'
import { getRom } from '@/controllers/roms/get-rom.ts'
import { getStates } from '@/controllers/states/get-states.ts'
import { getRomGoodcodes } from '@/utils/client/library.ts'
import { getLoaderData } from '@/utils/server/loader-data.ts'
import RomPage from '../library/platform/rom/page.tsx'
import type { Route } from './+types/library-platform-rom.ts'

export async function loader({ params }: Route.LoaderArgs) {
  assert.ok(params.fileName)
  assert.ok(params.platform)
  const platform = params.platform as PlatformName
  const rom = await getRom({ fileName: params.fileName, platform })
  if (!rom) {
    throw new Response('Not Found', { status: 404 })
  }
  const { preference } = getContext().var
  const core = preference.emulator.platform[rom.platform]?.core
  const [state] = await getStates({ core, limit: 1, rom: rom?.id, type: 'manual' })
  return getLoaderData({ rom, state, title: getRomGoodcodes(rom).rom })
}

export default function LibraryPlatformRomRoute() {
  return <RomPage />
}
