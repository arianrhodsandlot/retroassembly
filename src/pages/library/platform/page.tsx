import { platformMap } from '@/constants/platform.ts'
import { getRoms } from '@/controllers/get-roms.ts'
import AppLayout from '../components/app-layout.tsx'
import { DeviceInfo } from '../components/device-info.tsx'
import { GameList } from '../components/game-list.tsx'
import { SidebarLinks } from '../components/sidebar-links.tsx'
import { PlatformBackground } from './components/platform-background.tsx'
import { UploadButton } from './components/upload-button.tsx'

interface PlatformPageProps {
  platform: string
  query: string
}

export async function PlatformPage({ platform, query }: PlatformPageProps) {
  if (!platformMap[platform]) {
    return '404 not found'
  }

  const page = Number.parseInt(new URLSearchParams(query).get('page') || '', 10) || 1
  const { pagination, roms } = await getRoms({ page, platform })

  if (page > 1 && roms.length === 0) {
    return '404'
  }

  return (
    <AppLayout append={<PlatformBackground platform={platform} />} sidebar={<SidebarLinks platform={platform} />}>
      <title>{`${platformMap[platform].displayName} - RetroAssembly`}</title>

      <div className='flex flex-col gap-5'>
        <DeviceInfo platform={platform} />
        <hr className='border-t-1 border-t-black/20' />
        <GameList pagination={pagination} roms={roms} />
        <UploadButton platform={platform} />
      </div>
    </AppLayout>
  )
}
