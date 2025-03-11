'use client'
import clsx from 'clsx'
import { useState } from 'react'
import { Link } from 'waku'
import { getPlatformGameIcon, getRomGoodcodes, getRomLibretroThumbnail } from '@/utils/rom.ts'
import { GameEntryContextMenu } from './game-entry-context-menu.tsx'
import { GameTitle } from './game-title.tsx'

export function GameEntry({ rom }) {
  const goodcodes = getRomGoodcodes(rom)
  const [cover, setCover] = useState(() => getRomLibretroThumbnail(rom))

  function handleError() {
    const platformCover = getPlatformGameIcon(rom.platform)
    if (cover !== platformCover) {
      setCover(getPlatformGameIcon(rom.platform))
    }
  }

  return (
    <GameEntryContextMenu rom={rom}>
      <div className='relative'>
        <Link
          className='block'
          title={rom.file_name}
          to={`/library/rom/${encodeURIComponent(rom.id)}`}
          unstable_pending={
            <div className='z-1 absolute inset-0'>
              <div className='grid h-4/5 w-full place-items-center'>
                <div className='backdrop-blur-xs rounded-full bg-white/40 p-1.5'>
                  <span className='icon-[svg-spinners--180-ring] block size-6 text-[var(--theme)]' />
                </div>
              </div>
            </div>
          }
        >
          <div className='flex aspect-square size-full items-center justify-center'>
            <img
              alt={goodcodes.rom}
              className={clsx('max-w-4/5 max-h-full rounded object-contain drop-shadow-lg')}
              loading='lazy'
              onError={handleError}
              src={cover}
            />
          </div>

          <GameTitle rom={rom} />
        </Link>
      </div>
    </GameEntryContextMenu>
  )
}
