import { getContext } from 'hono/context-storage'
import { getRom } from '@/controllers/get-rom.ts'
import { getStates } from '@/controllers/get-states.ts'
import RomPage from '../library/platform/rom/page.tsx'
import type { Route } from './+types/library-platform-rom.ts'

export async function loader({ params }: Route.LoaderArgs) {
  const rom = await getRom({ fileName: params.fileName, platform: params.platform })
  if (!rom) {
    throw new Response('Not Found', { status: 404 })
  }
  const [state] = await getStates({ limit: 1, rom: rom?.id, type: 'manual' })
  const { preference } = getContext().var
  return { preference, rom, state }
}

export default function LibraryPlatformRomRoute({ loaderData }: Route.ComponentProps) {
  return <RomPage pageData={loaderData} />
}
