'use client'
import { Skeleton } from '@radix-ui/themes'
import clsx from 'clsx'
import { Link } from 'waku'
import { platformMap } from '@/constants/platform.ts'
import { getPlatformIcon, getRomGoodcodes } from '@/utils/library.ts'
import { usePlatform } from '../../atoms.ts'
import { useRomCover } from '../../hooks/use-rom-cover.ts'
import { GameEntryContextMenu } from './game-entry-context-menu.tsx'
import { GameTitle } from './game-title.tsx'

export function GameEntry({ rom }) {
  const goodcodes = getRomGoodcodes(rom)
  const [platform] = usePlatform()
  const { data: cover, isLoading } = useRomCover(rom)

  return (
    <GameEntryContextMenu rom={rom}>
      <div className='relative'>
        <Link
          className='game-entry block'
          data-sn-enabled
          title={rom.fileName}
          to={`/library/rom/${encodeURIComponent(rom.id)}`}
          unstable_pending={
            <div className='z-1 absolute inset-0'>
              <div className='grid h-4/5 w-full place-items-center'>
                <div className='backdrop-blur-xs rounded-full bg-white/40 p-1.5'>
                  <span className='icon-[svg-spinners--180-ring] block size-6 text-[var(--accent-9)]' />
                </div>
              </div>
            </div>
          }
        >
          <div className='flex aspect-square size-full items-center justify-center'>
            {isLoading ? <Skeleton className='!size-4/5' loading /> : null}
            {cover?.src ? (
              <img
                alt={goodcodes.rom}
                className={clsx('max-w-4/5 max-h-full  rounded object-contain drop-shadow-lg', {
                  'bg-[var(--gray-a3)]': cover.type === 'rom',
                })}
                loading='lazy'
                src={cover.src}
              />
            ) : null}
          </div>

          <GameTitle rom={rom} />

          {platform ? null : (
            <div className='mt-1 flex items-center justify-center gap-2 text-xs text-black/40'>
              <img
                alt={platformMap[rom.platform].displayName}
                className={clsx('size-4', { invert: ['ngp', 'wonderswan'].includes(platformMap[rom.platform].name) })}
                src={getPlatformIcon(platformMap[rom.platform].name)}
              />
              {platformMap[rom.platform].displayName}
            </div>
          )}
        </Link>
      </div>
    </GameEntryContextMenu>
  )
}
