import { getContext } from 'hono/context-storage'
import { getRom } from '@/controllers/get-rom.ts'
import RomPage from '../library/platform/rom/page.tsx'
import type { Route } from './+types/library-platform-rom.ts'

export async function loader({ params }: Route.LoaderArgs) {
  const rom = await getRom({ fileName: params.fileName, platform: params.platform })
  const { preference } = getContext().var
  return { preference, rom }
}

export default function LibraryPlatformRomRoute({ loaderData }: Route.ComponentProps) {
  return <RomPage pageData={loaderData} />
}
