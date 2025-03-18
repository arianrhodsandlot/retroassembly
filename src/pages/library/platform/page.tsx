import { platformMap } from '@/constants/platform.ts'
import { getRoms } from '@/controllers/get-roms.ts'
import { ScrollArea } from '../../components/radix-themes.ts'
import AppLayout from '../components/app-layout.tsx'
import { DeviceInfo } from '../components/device-info.tsx'
import { GameList } from '../components/game-list.tsx'
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
    <AppLayout title={platformMap[platform].displayName}>
      <ScrollArea className='z-1 relative flex flex-1' size='2'>
        <main className='flex min-h-full w-full flex-col gap-5 p-4'>
          <DeviceInfo platform={platform} />
          <hr className='border-t-1 border-t-black/20' />
          <GameList pagination={pagination} roms={roms} />
          <UploadButton platform={platform} />
        </main>
      </ScrollArea>
      <PlatformBackground platform={platform} />
    </AppLayout>
  )
}
