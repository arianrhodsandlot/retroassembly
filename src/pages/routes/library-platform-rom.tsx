import assert from 'node:assert'
import { getContext } from 'hono/context-storage'
import { getRom } from '@/controllers/get-rom.ts'
import { getStates } from '@/controllers/get-states.ts'
import { getLoaderData } from '@/utils/loader-data.ts'
import RomPage from '../library/platform/rom/page.tsx'
import type { Route } from './+types/library-platform-rom.ts'

export async function loader({ params }: Route.LoaderArgs) {
  assert.ok(params.fileName)
  assert.ok(params.platform)
  const rom = await getRom({ fileName: params.fileName, platform: params.platform })
  if (!rom) {
    throw new Response('Not Found', { status: 404 })
  }
  const { preference } = getContext().var
  const core = preference.emulator.platform[rom.platform]?.core
  const [state] = await getStates({ core, limit: 1, rom: rom?.id, type: 'manual' })
  return getLoaderData({ rom, state })
}

export default function LibraryPlatformRomRoute({ loaderData }: Readonly<Route.ComponentProps>) {
  return <RomPage pageData={loaderData} />
}
